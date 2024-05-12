import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";
import { NextResponse } from "next/server";
import { sendVerificationCode } from "@/utils/sendVerificationCode";


export async function POST(req) {
  const body = await req.json();
  const { email, password, firstName, lastName, username, secret } = body;

  const emailRegex = new RegExp(/^[\w\\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
  const passwordRegex = new RegExp(
    /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/
  );
  const nameRegex = new RegExp(/^[a-zA-Z ]+$/);
  const usernameRegex = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]*$/);
  const secretRegex = new RegExp(/^[a-zA-Z0-9_]{8,}$/);

  if (!usernameRegex.test(username)) {
    return NextResponse.json(
      {
        error:
          "Username invalid, it should start with letters and contain only letters, numbers and underscores!",
      },
      { status: 400 }
    );
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalid!" }, { status: 400 });
  }
  if (passwordRegex.test(password)) {
    return NextResponse.json(
      {
        error:
          "Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long!",
      },
      { status: 400 }
    );
  }
  if (!secretRegex.test(secret)) {
    return NextResponse.json(
      {
        error:
          "Secret invalid, it should contain only letters, numbers and underscores and be atleast 8 characters long!",
      },
      { status: 400 }
    );
  }
  if (!nameRegex.test(firstName)) {
    return NextResponse.json(
      { error: "First name invalid, it should contain only letters!" },
      { status: 400 }
    );
  }
  if (!nameRegex.test(lastName)) {
    return NextResponse.json(
      { error: "Last name invalid, it should contain only letters!" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return NextResponse.json(
      { error: "Email already exists!" },
      { status: 409 }
    );
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return NextResponse.json(
      { error: "Username already exists!" },
      { status: 409 }
    );
  }

  let hashedPassword = await bcrypt.hash(password, 10);
  let hashedSecret = await bcrypt.hash(secret, 10);

  const user = await User.create({ email, hashedPassword, hashedSecret, firstName, lastName, username });
  console.log(user);
  if (!user) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  try {
    const sendVerificationEmail = await sendVerificationCode(email, user);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error!" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "User registered successfully!" },
    { status: 201 }
  );
}
