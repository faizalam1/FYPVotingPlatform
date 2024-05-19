import Campaign from "@/models/campaign";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const user = session.user;
    const body = await req.json();
    const {CampaignID, isResultsPublic} = body;

    try {
        await connectToDatabase();
        const campaign = await Campaign.findOne({ _id: CampaignID, createdBy: user.id });
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        campaign.isResultsPublic = isResultsPublic;
        await campaign.save();
        return NextResponse.json({ message: "Campaign Edited" }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        );
    }

}