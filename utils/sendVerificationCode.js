import { connectToDatabase } from "./database";
import { randomBytes } from "crypto";
import UserVerification from "@/models/userVerification";

export async function sendVerificationCode(email, user, forgotPassword = false) {
  try {
    await connectToDatabase();
  } catch (err) {
    
    return { message: "Error: Cannot Connect to Database!" };
  }

  const verificationCode = randomBytes(4).toString("hex");
  
  const userVerificationExists = await UserVerification.findOne({ _userId: user._id });
  if (userVerificationExists) {
    await UserVerification.deleteOne({ _userId: user._id });
  }

  const userVerification = await UserVerification.create({
    _userId: user._id,
    token: verificationCode,
  });
  if (!userVerification) {
    return { message: "Error: User Verification not created!" };
  }

  let text, html, subject;
  if (!forgotPassword){
  subject = "Email Verification";
  text = `Here is your verification code:\n${verificationCode}\nOr click on the following link to verify your email:\n${process.env.NEXT_PUBLIC_URL}/api/auth/verify?email=${email}&token=${verificationCode}`;
  html = `<p>Here is your verification code:</p><p><strong>${verificationCode}</strong></p><p>Or click on the following link to verify your email:</p><a href="${process.env.NEXT_PUBLIC_URL}/api/auth/verify?email=${email}&token=${verificationCode}">Verify Email</a>`;
}
else{
    subject = "Password Reset Verification";
    text = `Here is your verification code for password reset:\n${verificationCode}`;
    html = `<p>Here is your verification code for password reset:</p><p><strong>${verificationCode}</strong></p>`;
}

  const message = new FormData();
  message.append("from", `SV Validation <noreply@${process.env.MAILGUN_DOMAIN}>`);
  message.append("to", email);
  message.append("subject", subject);
  message.append("text", text);
  message.append("html", html);

  const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`,
    },
    body: message,
  }
);

  if (!mailgunResponse.ok) {
    console.error(mailgunResponse);
    return { message: "Error: Mailgun Error!" };
  }
    
  return { message: "Verification code sent!" };
}
