'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);

  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email is required!");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Invalid email!");
      return;
    }
    const response = await fetch("/api/auth/forgotpassword?email=" + encodeURI(email));
    if (response.status == 200) {
      alert("Password reset code sent to your email!")
      router.push("/app/auth/changepassword");
      router.refresh();
    }
    else if (response.status == 404) {
      alert("Email not found!")
    }
    else {
      console.log(response)
      alert("Password Reset Failed!")
      window.location.reload();
    }
  }

  const handleSignin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Invalid email!");
      return;
    }
    const response = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false
    });
    console.log(response);
    if (response.status == 200) {
      router.push("/portal");
      router.refresh();
    }
    else if(response.error == "User not verified!"){
      alert("User not verified!")
      router.push("/app/auth/verify");
      router.refresh();
    }
    else {
      alert("Sign In Failed!")
      window.location.reload();
    }
  }


  return (
    <>
      <h2 className="font-semibold text-center text-2xl">
        Sign in
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <a
            data-tooltip-id="emailError"
            data-tooltip-variant="error"
            data-tooltip-content="Please enter a valid email."
          ><br />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          </a>
          <Tooltip
            id="emailError"
            place="bottom"
            effect="solid"
            hidden={!email || emailRegex.test(email)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
            />
        </div>
        <div>
          <button
            onClick={handleForgotPassword}
          disabled={!email || !emailRegex.test(email)}
          className="cursor-pointer underline underline-offset-4"
          >
           Forgot Password?
          </button>
        </div>
        <div>
          <button
            onClick={handleSignin}
            disabled={!email || !password || !emailRegex.test(email)}
            className="p-2 bg-indigo-700 rounded-xl text-white hover:bg-indigo-900 font-medium w-full"
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  )
}

export default Signin