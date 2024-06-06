'use client';
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";



const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);

  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl");

  useEffect(() => {
    setEmail(searchParams.get("signInEmail"));
  },[searchParams])

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
    const response = await fetch("/api/auth/forgotpassword", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      alert("Password reset code sent to your email!")
      router.push("/app/auth/changepassword?email=" + email);
      router.refresh();
    }
    else if (response.status == 404) {
      alert("Email not found!")
    }
    else {
      
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
    
    if (response.status == 200) {
      if (callbackURL) {
        router.push(callbackURL);
        router.refresh();
        return;
      }
      router.push("/portal");
      router.refresh();
    }
    else if(response.error == "User not verified!"){
      alert("User not verified!")
      router.push("/app/auth/verify?email="+email);
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
        Sign In
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
         className="p-2 border rounded-lg border-gray-300 w-full"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          
          />
          { email && !emailRegex.test(email) && (
            <p className="text-red-500 text-sm">Please enter a valid email.</p>
          )}
          
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
        <div className="text-center font-medium  ">
          <button 
            onClick={handleForgotPassword}
            disabled={!email || !emailRegex.test(email)}
            type="button"
            className="cursor-pointer underline underline-offset-4"
          >
           Forgot Password?
          </button>
        </div>
        <div className="bg-indigo-600 rounded-md text-white text-center  font-medium">
          <button
            onClick={handleSignin}
            disabled={!email || !password || !emailRegex.test(email)}
            type="submit"
            className="p-2 bg-indigo-700 rounded-xl text-white hover:bg-indigo-900 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  )
}

export default Signin