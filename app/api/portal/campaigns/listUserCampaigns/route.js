import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
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
  
  const campaigns = await Campaign.find({ createdBy: user.id, isDeleted: false });
  if (campaigns.length === 0) {
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(campaigns);
}