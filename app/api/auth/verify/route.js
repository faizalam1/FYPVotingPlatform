import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";
import User from "@/models/user";
import UserVerification from "@/models/userVerification";

export async function GET(req) {
  try {
    await connectToDatabase();
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  
  if (!email || !token) {
    return NextResponse.json(
      { error: "Email or token missing!" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found!" }, { status: 404 });
  }

  const userVerification = await UserVerification.findOne({
    _userId: user._id,
  });
  if (!userVerification) {
    if (userVerification.token !== token) {
      userVerification.attempts += 1;
      if (userVerification.attempts >= 5) {
        await User.updateOne({ _id: user._id }, { isLocked: true });
      }
      await userVerification.save();
      return NextResponse.json({ error: "Invalid token!" }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid token!" }, { status: 400 });
  }

  await UserVerification.deleteOne({ _userId: user._id, token });
  await User.updateOne({ _id: user._id }, { isVerified: true });

  return NextResponse.json({ message: "User verified!" }, { status: 200 });
}
