import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
    const user = session.user;

    const { searchParams } = new URL(req.url)
    const campaignID = searchParams.get('id');

    if (!campaignID) {
        return NextResponse.json({ error: "Campaign ID not provided!" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const campaign = await Campaign.findById(campaignID);
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        if (campaign.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }
        await Campaign.findByIdAndDelete(campaignID);
        return NextResponse.json({ message: "Campaign deleted successfully!" });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
}