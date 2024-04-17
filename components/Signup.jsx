'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const nameRegex = new RegExp(/^[a-zA-Z ]+$/);
  const emailRegex = new RegExp(/^[\w\\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
  const passwordRegex = new RegExp(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/);

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
      }),
    });
    console.log(response)
    if (response.status == 201) {
      signIn('credentials', {
        email: email,
        password: password,
        redirect: false
      });
      router.push("/app/auth/verify");
      router.refresh();
    }
    else if(response.status == 409){
      alert("Email already exists!");
    }
    else if(response.status == 400){
      alert("Invalid input!");
    }
    else {
      alert("Sign Up Failed!")
      window.location.reload();
    }
  }

  return (
    <>
      <h2 className="font-semibold text-center text-2xl">
        Sign Up 
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="firstName">First Name</label>
          <a
            data-tooltip-id="firstNameError"
            data-tooltip-variant="error"
            data-tooltip-content="Please enter a valid first name. It should contain only letters."
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="p-2 border rounded-lg border-gray-300 w-full"
            />
          </a>
          <Tooltip
            id="firstNameError"
            place="bottom"
            effect="solid"
            hidden={!firstName || nameRegex.test(firstName)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <a
            data-tooltip-id="lastNameError"
            data-tooltip-variant="error"
            data-tooltip-content="Please enter a valid last name. It should contain only letters."
          >
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="p-2 border rounded-lg border-gray-300 w-full"
            />
          </a>
          <Tooltip
            id="lastNameError"
            place="bottom"
            effect="solid"
            hidden={!lastName || nameRegex.test(lastName)}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <a
            data-tooltip-id="emailError"
            data-tooltip-variant="error"
            data-tooltip-content="Please enter a valid email."
          >
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
          <a
            data-tooltip-id="passwordError"
            data-tooltip-variant="error"
            data-tooltip-content="Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long!"
          >
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded-lg border-gray-300 w-full"
            />
          </a>
          <Tooltip
            id="passwordError"
            place="bottom"
            effect="solid"
            hidden={!password || !passwordRegex.test(password)}
          />
        </div>
        <div>
          <label htmlFor="password2">Confirm Password</label>
          <a
            data-tooltip-id="password2Error"
            data-tooltip-variant="error"
            data-tooltip-content="Passwords do not match!"
          >
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="p-2 border rounded-lg border-gray-300 w-full"
            />
          </a>
          <Tooltip
            id="password2Error"
            place="bottom"
            effect="solid"
            hidden={!password2 || password == password2}
          />
        </div>
        <div className="bg-green-500 rounded-md text-white   text-center  font-medium">
        <button 
          onClick={handleSubmit}
          disabled={
            !nameRegex.test(firstName) ||
            !nameRegex.test(lastName) ||
            !emailRegex.test(email) ||
            passwordRegex.test(password) ||
            password != password2} 
            className="p-2 bg-green-500 rounded-xl text-white hover:bg-green-700 font-medium w-full">
          Sign Up
        </button>
        </div>
      </form>
    </>
  );
}

export default Signup