import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate  from "@/models/candidate";
import uploadCandidatePicture from "@/utils/uploadCandidatePicture";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  let campaign = {};
  try {
    const formdata = await req.formData();

    campaign["campaignName"] = formdata.get("campaignName");
    campaign["campaignDescription"] = formdata.get("campaignDescription");
    campaign["votingType"] = formdata.get("votingType");
    campaign["campaignStart"] = formdata.get("campaignStart");
    campaign["campaignEnd"] = formdata.get("campaignEnd");
    campaign["isRestrictedByEmail"] =
      formdata.get("isRestrictedByEmail") == "true";
    campaign["domains"] = formdata.get("domains").split(", ");
    campaign["numberOfCandidates"] = parseInt(
      formdata.get("numberOfCandidates")
    );
    campaign["areAdditionalFieldsRequired"] =
      formdata.get("areAdditionalFieldsRequired") == "true";
    campaign["numberOfAdditionalFields"] = parseInt(
      formdata.get("numberOfAdditionalFields")
    );
    campaign["candidates"] = [];
    for (let i = 0; i < campaign.numberOfCandidates; i++) {
      campaign.candidates.push({
        name: formdata.get(`candidate${i}-name`),
        description: formdata.get(`candidate${i}-description`),
        image: formdata.get(`candidate${i}-image`),
        additionalFields: Array.from(
          { length: campaign.numberOfAdditionalFields },
          (_, j) => {
            return {
              name: formdata.get(`candidate${i}-additionalField${j}-name`),
              value: formdata.get(`candidate${i}-additionalField${j}-value`),
            };
          }
        ),
      });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid Campaign Data!" },
      { status: 400 }
    );
  }

  const user = session.user;
  console.log(campaign);
  console.log(campaign.candidates);
  console.log(user);

  const campaignNameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
  const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
  const datetimeISORegex = new RegExp(
    /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/
  );
  const domainsRegex = new RegExp(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  const candidateNameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/;

  if (
    !(
      campaignNameRegex.test(campaign.campaignName) &&
      campaign.campaignDescription.length >= 10 &&
      votingTypeRegex.test(campaign.votingType) &&
      datetimeISORegex.test(campaign.campaignStart) &&
      datetimeISORegex.test(campaign.campaignEnd) &&
      new Date(campaign.campaignEnd) > new Date() &&
      new Date(campaign.campaignStart) < new Date(campaign.campaignEnd) &&
      (campaign.isRestrictedByEmail
        ? campaign.domains.length > 0 &&
          campaign.domains.every((domain) => domainsRegex.test(domain))
        : true) &&
      campaign.numberOfCandidates >= 2 &&
      campaign.numberOfCandidates == campaign.candidates.length &&
      (campaign.areAdditionalFieldsRequired
        ? campaign.numberOfAdditionalFields > 0
        : true) &&
      campaign.candidates.every(
        (candidate) =>
          candidateNameRegex.test(candidate.name) &&
          candidate.description.length >= 10 &&
          candidate.image instanceof File &&
          candidate.additionalFields.length ==
            campaign.numberOfAdditionalFields &&
          candidate.additionalFields.every((field) => field.name && field.value)
      ) &&
      campaign.candidates.every(
        (candidate) =>
          campaign.candidates.filter((c) => c.name == candidate.name).length ==
          1
      ) &&
      campaign.candidates.every(
        (candidate) =>
          candidate.image == null ||
          (candidate.image instanceof File &&
            candidate.image.name.split(".")[1].match(/(jpg|jpeg|png)/) &&
            candidate.image.size <= 1024 * 1024 * 2 &&
            candidate.image.name.split(".").length === 2)
      )
    )
  ) {
    return NextResponse.json(
      { error: "Invalid Campaign Data!" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
  const campaignNameExists = await Campaign.findOne({
    name: campaign.campaignName,
    createdBy: user.id,
  });
  if (campaignNameExists) {
    return NextResponse.json(
      { error: "Campaign name already exists!" },
      { status: 400 }
    );
  }
  const campaignRecord = await Campaign.create({
    name: campaign.campaignName,
    description: campaign.campaignDescription,
    votingType: campaign.votingType,
    startDateTime: new Date(campaign.campaignStart),
    endDateTime: new Date(campaign.campaignEnd),
    isRestrictedByEmail: campaign.isRestrictedByEmail,
    restrictedDomains: campaign.domains,
    numberOfCandidates: campaign.numberOfCandidates,
    createdBy: user.id,
  });

  console.log(campaignRecord)

  for (let i = 0; i < campaign.numberOfCandidates; i++) {
    const candidate = campaign.candidates[i];
    const candidateNameExists = await Candidate.findOne({
      name: candidate.name,
      campaign: campaignRecord.id,
    });
    if (candidateNameExists) {
      return NextResponse.json(
        { error: "Candidate name already exists!" },
        { status: 400 }
      );
    }
    let image = "";
    if (candidate.image) 
      image = await uploadCandidatePicture(candidate.image, `${user.name}/${campaignRecord.name}`);
    const candidateRecord = await Candidate.create({
      name: candidate.name,
      description: candidate.description,
      image: image,
      additionalFields: candidate.additionalFields,
      campaignID: campaignRecord._id,
    });
  }
 


  return NextResponse.json(
    { message: "Campaign created successfully!" },
    { status: 201 }
  );
}
