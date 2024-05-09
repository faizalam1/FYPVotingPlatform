import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import { NextResponse } from "next/server";

export async function DELETE(req){
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url)
    const candidateID = searchParams.get('id');

    if (!candidateID) {
        return NextResponse.json({ error: "Candidate ID not provided!" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found!" }, { status: 404 });
        }
        const campaign = await Campaign.findById(candidate.campaignID);
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        if (campaign.createdBy.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }
        await Candidate.findByIdAndDelete(candidateID);
        return NextResponse.json({ message: "Candidate deleted successfully!" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
}