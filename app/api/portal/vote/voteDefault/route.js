import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import User from "@/models/user";
import Vote from "@/models/vote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createHash } from "crypto";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
    try {
        await connectToDatabase();
    }
    catch (err) {
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        );
    }

    const body = await req.json();
    const { campaignID, candidateID, secret } = body;
    const user = await User.findOne({ email: session.user.email });
    const secretMatch = await bcrypt.compare(secret, user.secret);
    if (!secretMatch) {
        return NextResponse.json(
            { error: "Invalid secret!" },
            { status: 400 }
        );
    }

    const campaign = await Campaign.findOne({ _id: campaignID });
    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
    }
    if (new Date(campaign.startDateTime) > new Date()) {
        return NextResponse.json(
            { error: "Campaign has not started!" },
            { status: 400 }
        );
    }
    if (new Date(campaign.endDateTime) < new Date()) {
        return NextResponse.json(
            { error: "Campaign has ended!" },
            { status: 400 }
        );
    }
    if (campaign.isRestrictedByEmail) {
        if (!user.email) {
            return NextResponse.json(
                { error: "Email is required!" },
                { status: 400 }
            );
        }
        const domain = user.email.split("@")[1];
        if (!campaign.allowedDomains.includes(domain)) {
            return NextResponse.json(
                { error: "User is not allowed to vote in this campaign!" },
                { status: 403 }
            );
        }
    }
    if (campaign.votingType !== "Default") {
        return NextResponse.json(
            { error: "Campaign is not a default voting type!" },
            { status: 400 }
        );
    }
    

    const candidate = await Candidate.findOne({ _id: candidateID, campaignID: campaignID });
    if (!candidate) {
        return NextResponse.json({ error: "Candidate not found!" }, { status: 404 });
    }

    const voterID = `${user._id}-${secret}-${campaignID}`
    const hashedVoterID = createHash("sha512").update(voterID).digest("hex");

    const voteExists = await Vote.findOne({ voterID: hashedVoterID });
    if (voteExists) {
        return NextResponse.json(
            { error: "Vote already exists!" },
            { status: 400 }
        );
    }

    const vote = await Vote.create({
        type: "Default",
        voterID: hashedVoterID,
        campaignID,
        vote: [{
            candidateID: candidateID,
            rank: 1
        }]
    });
    if (!vote) {
        return NextResponse.json(
            { error: "Vote failed!" },
            { status: 500 }
        );
    }
    return NextResponse.json({ success: "Vote successful!" });
}
