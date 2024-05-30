import { User } from "@/models/user";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { sendVerificationCode } from "@/utils/sendVerificationCode";

export async function POST(req) {
  try {
    await connectToDatabase();
  } catch (err) {
    
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
  const body = await req.json();
  const { email } = body;
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found!" }, { status: 404 });
  }

  const sendVerificationEmail = await sendVerificationCode(
    email,
    user,
    {forgotPassword:true}
  );
  if (sendVerificationEmail.message == "Verification code sent!") {
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
