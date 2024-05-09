import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
    
    const user = session.user;
    
    try {
        await connectToDatabase();
    }
    catch (err) {
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
    
    const {searchParams} = new URL(req.url);
    const campaignID = searchParams.get('campaignID');

    const campaign = await Campaign.findOne({ _id: campaignID, createdBy: user.id, isDeleted: false });
    if (!campaign) {
        return NextResponse.json({ error: "No campaign found!" }, { status: 404 });
    }

    const candidates = await Candidate.find({ campaignID: campaignID });
    if (candidates.length === 0) {
        return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(candidates);
    }