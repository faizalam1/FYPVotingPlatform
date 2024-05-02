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

  await connectToDatabase();

  const campaigns = await Campaign.find({ createdBy: user.id, isDeleted: false });

  return NextResponse.json(campaigns);
}