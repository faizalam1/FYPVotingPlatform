import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import Result from "@/models/result";
import Vote from "@/models/vote";
import { NextResponse } from "next/server";

const calculateDefaultResult = (candidates, votes) => {
  const result = [[]];
  candidates.forEach((candidate) => {
    result[0].push({
      candidateID: candidate._id,
      name: candidate.name,
      votes: 0,
    });
  });
  votes.forEach((vote) => {
    result[0].forEach((candidate) => {
      if (candidate.candidateID == vote.vote[0].candidateID) {
        candidate.votes += 1;
      }
    });
  });
  return result;
};


const calculateRankedResult = (candidatesInput, votesInput) => {
  const results = [];
  let candidates = [...candidatesInput];
  let votes = votesInput.map((vote) => [...vote.vote]);
  console.log(votes)
  let round = 0;

  while (candidates.length > 0) {
    const roundResult = candidates.map((candidate) => (
      {
        candidateID: candidate._id,
        name: candidate.name,
        votes: 0,
      }
    ));

    votes.forEach((vote) => {
      const topCandidate = vote.sort(
        (a, b) => a.rank - b.rank
      )[0];
      const candidateResult = roundResult.find(
        candidate =>
          candidate.candidateID.toString() === topCandidate.candidateID.toString()
      );
      console.log(candidateResult)
      if (candidateResult) {
        candidateResult.votes += 1;
      }
    });
    results[round] = roundResult;

    const minVotes = Math.min(
      ...roundResult.map((candidate) => candidate.votes)
    );
    const eliminatedCandidates = roundResult.filter(
      (candidate) => candidate.votes === minVotes
    );

    candidates = candidates.filter(
      (candidate) =>
        !eliminatedCandidates.find(
          (eliminatedCandidate) =>
            eliminatedCandidate.candidateID === candidate.id
        )
    );

    votes = votes.map((vote) => (
      vote.filter(
        (candidate) =>
          !eliminatedCandidates.find(
            (eliminatedCandidate) =>
              eliminatedCandidate.candidateID === candidate.candidateID
          )
      )
    ));

    const maxVotes = Math.max(...roundResult.map((candidate) => candidate.votes));
    if (maxVotes > votes.length / 2) {
      break;
    }

    round += 1;
  }
  return results;
};

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  const user = session.user;

  const { searchParams } = new URL(req.url);
  const campaignID = searchParams.get("id");

  if (!campaignID) {
    return NextResponse.json(
      { error: "Campaign ID is required!" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    let votes;
    const campaign = await Campaign.findOne({
      _id: campaignID,
      createdBy: user.id,
    });
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found!" },
        { status: 404 }
      );
    }

    const candidates = await Candidate.find({ campaignID });
    if (!candidates.length) {
      return NextResponse.json(
        { error: "No candidates found!" },
        { status: 404 }
      );
    }

    const result = await Result.findOne({ campaignID });
    if (
      !result ||
      new Date(result?.countedAt) < new Date(campaign.endDateTime)
    ) {
      votes = await Vote.find({ campaignID });
      let newResult;
      if (campaign.votingType === "Default") {
        newResult = calculateDefaultResult(candidates, votes);
      } else {
        newResult = calculateRankedResult(candidates, votes);
      }
      if (result) {
        result.result = newResult;
        result.totalVotes = votes.length;
        result.countedAt = new Date();
        await result.save();
      } else {
        await Result.create({
          campaignID,
          type: campaign.votingType,
          totalVotes: votes.length,
          result: newResult,
        });
      }
    }
    else {
      return NextResponse.json(
        { error: "Result already calculated!" },
        { status: 400 }
      );
    }

    return NextResponse.json({ campaign, candidates, result, votes });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
