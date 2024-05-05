import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";
import User from "@/models/user";
import UserVerification from "@/models/userVerification";

export async function PATCH(req) {
  try {
    await connectToDatabase();
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { email, token } = body;
  
  if (!email || !token) {
    return NextResponse.json(
      { error: "Email or token missing!" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid token or email!" }, { status: 400 });
  }

  const userVerification = await UserVerification.findOne({
    _userId: user._id,
  });
  if (userVerification) {
    if (userVerification.token !== token) {
      userVerification.attempts += 1;
      if (userVerification.attempts >= 5) {
        await User.updateOne({ _id: user._id }, { isLocked: true });
      }
      await userVerification.save();
      return NextResponse.json({ error: "Invalid token or email!" }, { status: 400 });
    }
  }
  else{
    return NextResponse.json({ error: "Invalid token or email!" }, { status: 400 });
  }

  await UserVerification.deleteOne({ _userId: user._id, token });
  await User.updateOne({ _id: user._id }, { isVerified: true, resetCodeRequests: 0 });
  console.log("User verified!");
  return NextResponse.json({ message: "User verified!" }, { status: 200 });
}
