'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip } from "react-tooltip";


const Verify = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    const router = useRouter();

    const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
    const tokenRegex = new RegExp(/^[0-9A-Fa-f]{8}$/);

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
        const response = await fetch("/api/auth/verify?email=" + encodeURI(email) + "&token=" + encodeURI(token));
        if (response.status == 200) {
            alert("Account verified! Login to continue")
            router.push("/app/auth");
            router.refresh();
        }
        else if (response.status == 400) {
            alert("Invalid input!")
        }
        else if (response.status == 404) {
            alert("Invalid token!")
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
        fetch("/api/auth/requestToken?email=" + encodeURI(email))
            .then((response) => {
                console.log(response)
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
        <main  className="flex flex-row justify-center w-full h-screen space-x-16 bg-[#f3f4f6] text-black p-8 font-sans">
            <section className="bg-white p-4 rounded-2xl space-y-7 w-96">
            <h2 className="font-semibold text-center text-2xl ">
                Verify your account
            </h2>
            <form className="space-y-7">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                    <label htmlFor="token">Verification Code</label>
                    <a
                        data-tooltip-id="tokenError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid verification code."
                    ><br />
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Verification Code"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    </a>
                    <Tooltip
                        id="tokenError"
                        place="bottom"
                        effect="solid"
                        hidden={!token || tokenRegex.test(token)}
                    />
                </div>
                <div>
                    <button
                        onClick={handleVerify}
                        disabled={!email || !token || !emailRegex.test(email) || !tokenRegex.test(token)}
                        className="p-2 bg-indigo-700 rounded-xl text-white hover:bg-indigo-900 font-medium w-full"
                    >
                        Verify
                    </button>
                </div>
                <div>
                    <button
                        onClick={resendCode}
                        disabled={!email || !emailRegex.test(email)}
                        className="text-gray-900 bg-[#f3f4f6] border border-gray-300  hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 hover:bg-gray-200"
                    >
                        Resend Verification Code
                    </button>

                </div>
            </form>
            </section>
        </main>
    )
}

export default Verify