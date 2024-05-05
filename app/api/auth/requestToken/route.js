import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";
import { sendVerificationCode } from "@/utils/sendVerificationCode";

export async function POST(req) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
  const body = await req.json();
  const { email } = body;
  const user = await User.findOne({ email });

  const sendVerificationEmail = await sendVerificationCode(email, user);
  if (sendVerificationEmail.message == "Verification code sent!") {
    user.resetCodeRequests += 1;
    if (user.resetCodeRequests >= 5) {
      user.isLocked = true;
    }
    await user.save();
    return NextResponse.json(
      { message: "Verification code sent!" },
      { status: 200 }
    );
 } else {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
