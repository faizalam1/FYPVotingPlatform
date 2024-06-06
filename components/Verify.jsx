'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";



const Verify = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    const router = useRouter();

    const searchParams = useSearchParams();

    const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
    const tokenRegex = new RegExp(/^[0-9A-Fa-f]{8}$/);

    useEffect(() => {
        setEmail(searchParams.get('email'));
    },[searchParams])

    const handleVerify = async (e) => {
        e.preventDefault()

        if (!email || !token) {
            alert("Email and Token are required!");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("Invalid email!");
            return;
        }
        if (!tokenRegex.test(token)) {
            alert("Invalid token!");
            return;
        }
        const response = await fetch("/api/auth/verify",{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                token: token
            })
        }
        );
        if (response.status == 200) {
            alert("Account verified! Login to continue")
            router.push("/app/auth?signInEmail="+email);
            router.refresh();
        }
        else if (response.status == 400) {
            alert("Invalid token or email!")
        }
        else if (response.status == 404) {
            alert("Invalid token or email!")
        }
        else {
            alert("Verification Failed!")
            window.location.reload();
        }
    }

    const resendCode = () => {
        if (!email) {
            alert("Email is required!");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("Invalid email!");
            return;
        }
        fetch("/api/auth/requestToken",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        
        })
            .then((response) => {
                
                if (response.status == 200) {
                    alert("Verification code sent!")
                }
                else if (response.status == 404) {
                    alert("Email not found!")
                }
                else {
                    alert("Failed to send verification code!")
                }
            })
    }
    return (
        <main className="  text-2x1 bg-white text-black">
            <h2 className="font-semibold text-center text-2xl ">
                Verify your account
            </h2>
            <form className="space-y-7">
                <div>
                    <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    {email && !emailRegex.test(email) && (
                        <p className='text-red-500 text-sm'>Please enter a valid email.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="token">Verification Code</label>
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Verification Code"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    {token && !tokenRegex.test(token) && (
                        <p className='text-red-500 text-sm'>Please enter a valid verification code.</p>
                    )}
                </div>
               
                    <button
                        onClick={handleVerify}
                        disabled={!email || !token || !emailRegex.test(email) || !tokenRegex.test(token)}
                        className="p-2 bg-indigo-700 rounded-xl text-white hover:bg-indigo-900 font-medium w-full"
                    >
                        Verify
                    </button>
                
            
                    <button
                        onClick={resendCode}
                        disabled={!email || !emailRegex.test(email)}
                        className="text-gray-900 bg-[#f3f4f6] border border-gray-300  font-medium rounded-xl text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200"
                    >
                        Resend Verification Code
                    </button>

               
            </form>
         
        </main>
    )
}

export default Verify