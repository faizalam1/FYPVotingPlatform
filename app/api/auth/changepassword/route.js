import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/user";
import { UserVerification } from "@/models/userVerification";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PATCH(req) {
  const body = await req.json();
  const { email, token, password } = body;
  if (!email || !token || !password) {
    return NextResponse.json(
      { error: "Email, token or password missing!" },
      { status: 400 }
    );
  }
  try{
    await connectToDatabase();
  }
  catch(err){
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "User not found from Email!" },
      { status: 404 }
    );
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { error: "User not verified!" },
      { status: 403 }
    );
  }

  if (user.isLocked) {
    return NextResponse.json(
      { error: "User is locked!" },
      { status: 403 }
    );
  }

  const userVerification = await UserVerification.findOne({
    _userId: user._id
  });
  if (!userVerification) {
    return NextResponse.json({ error: "Invalid Credentials!" }, { status: 400 });
  }
  if (userVerification.token !== token) {
    userVerification.attempts += 1;
    if (userVerification.attempts >= 5) {
      await User.updateOne({ _id: user._id }, { isLocked: true });
    }
    await userVerification.save();
    return NextResponse.json({ error: "Invalid Token!" }, { status: 400 });
  }

  await UserVerification.deleteOne({ _userId: user._id, token });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { password: hashedPassword});
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Password changed!" });
}
