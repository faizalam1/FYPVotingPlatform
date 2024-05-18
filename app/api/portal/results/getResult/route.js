import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Result from "@/models/result";
import Campaign from "@/models/campaign";
import { NextResponse } from "next/server";

export async function GET(req){
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const user = session.user;

    const { searchParams } = new URL(req.url);
    const campaignID = searchParams.get("id");
    
    try{
        await connectToDatabase();
        const campaign = await Campaign.findOne({ _id: campaignID });
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        if (new Date(campaign.endDateTime) > new Date() && campaign.viewResults === "PostVoting") {
            return NextResponse.json({ error: "Campaign is not ended yet!" }, { status: 400 });
        }
        if (campaign.createdBy.toString() !== user.id && !campaign.isResultsPublic) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }
        const result = await Result.findOne({ campaignID });
        if (!result) {
            return NextResponse.json({ error: "Result not found!" }, { status: 404 });
        }
        return NextResponse.json({ result });

    }
    catch(err){
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        );
    }

}