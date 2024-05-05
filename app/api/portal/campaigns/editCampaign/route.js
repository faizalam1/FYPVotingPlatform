import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
    const user = session.user;
    const body = await req.json();
    const { campaignID, name, description, votingType, startDateTime, endDateTime, isRestrictedByEmail, restrictedDomains } = body;
    
    const nameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
    const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
    const datetimeISORegex = new RegExp(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/);
    const domainsRegex = new RegExp(/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(, )?)+$/);

    if (
        !name ||
        !description ||
        !votingType ||
        !startDateTime ||
        !endDateTime ||
        !nameRegex.test(name) ||
        !datetimeISORegex.test(startDateTime) ||
        !datetimeISORegex.test(endDateTime) ||
        !votingTypeRegex.test(votingType) ||
        (isRestrictedByEmail && restrictedDomains.length === 0 && !domainsRegex.test(restrictedDomains.join(", ")))
    ){
        return NextResponse.json({ error: "Invalid Campaign Data!" }, { status: 400 });
    }
    
    
    try {
        await connectToDatabase();
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
    const campaign = await Campaign.findOne({ _id: campaignID, createdBy: user.id });
    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
    }
    campaign.name = name;
    campaign.description = description;
    campaign.votingType = votingType;
    campaign.startDateTime = new Date(startDateTime);
    campaign.endDateTime = new Date(endDateTime);
    campaign.isRestrictedByEmail = isRestrictedByEmail;
    campaign.restrictedDomains = restrictedDomains;
    await campaign.save();
    return NextResponse.json(campaign);
}