import { User } from "@/models/user";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { sendVerificationCode } from "@/utils/sendVerificationCode";

export async function GET(req) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
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