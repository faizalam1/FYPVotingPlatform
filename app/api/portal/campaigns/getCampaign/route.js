import Campaign from "@/models/campaign";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
    
    const user = session.user;
    
    try {
        await connectToDatabase();
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
    const {searchParams} = new URL(req.url);
    const campaignID = searchParams.get('id');

    const campaign = await Campaign.findOne({ _id: campaignID, createdBy: user.id });
    const campaigns = await Campaign.findOne({ createdBy: user.id });
    

    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
    }
    return NextResponse.json(campaign);

    }