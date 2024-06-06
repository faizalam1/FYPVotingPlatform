'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [secret, setSecret] = useState("");

  const nameRegex = new RegExp(/^[a-zA-Z ]+$/);
  const emailRegex = new RegExp(/^[\w\\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/);
  const usernameRegex = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]*$/);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        username: username,
        secret: secret
      }),
    });

    if (response.status == 201) {
      signIn('credentials', {
        email: email,
        password: password,
        redirect: false
      });
      router.push("/app/auth/verify?email="+email);
      router.refresh();
    } else if (response.status == 409) {
      const data = await response.json();
      if (data.error == "Username already exists!")
        alert("Username already exists!");
      else if (data.error == "Email already exists!")
        alert("Email already exists!");
    } else if (response.status == 400) {
      const data = await response.json();
      alert("Invalid input!");
      alert(data.error)
    } else {
      alert("Sign Up Failed!")
      window.location.reload();
    }
  }

  return (
    <>
      <h2 className="font-semibold text-center text-2xl">
        Sign Up 
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {!nameRegex.test(firstName) && firstName && (
            <p className="text-red-500 text-sm">Please enter a valid first name. It should contain only letters.</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {!nameRegex.test(lastName) && lastName && (
            <p className="text-red-500 text-sm">Please enter a valid last name. It should contain only letters.</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {!emailRegex.test(email) && email && (
            <p className="text-red-500 text-sm">Please enter a valid email.</p>
          )}
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {!usernameRegex.test(username) && username && (
            <p className="text-red-500 text-sm">Please enter a valid username. It should start with letters and contain only letters, numbers, and underscores.</p>
          )}
        </div>
        <div>
          <label htmlFor="secret">Secret For Vote Anonymity</label>
          <input
            type="password"
            name="secret"
            placeholder="Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {!passwordRegex.test(secret) && secret && (
            <p className="text-red-500 text-sm">Secret invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long.</p>
          )}
          <p className="text-sm text-gray-500">
            Please remember this, as it will be used to verify your vote.
          </p>
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
          {!passwordRegex.test(password) && password && (
            <p className="text-red-500 text-sm">Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long.</p>
          )}
        </div>
        <div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="p-2 border rounded-lg border-gray-300 w-full"
          />
          {password !== password2 && password2 && (
            <p className="text-red-500 text-sm">Passwords do not match!</p>
          )}
        </div>
        <div className="bg-green-500 rounded-md text-white text-center font-medium">
          <button 
            type="submit"
            disabled={
              !nameRegex.test(firstName) ||
              !nameRegex.test(lastName) ||
              !emailRegex.test(email) ||
              !usernameRegex.test(username) ||
              !passwordRegex.test(password) ||
              !passwordRegex.test(secret) ||
              password !== password2
            } 
            className="p-2 bg-green-500 rounded-xl text-white hover:bg-green-700 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}

export default Signup;
