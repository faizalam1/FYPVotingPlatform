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
            router.push("/auth");
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
        <main className="bg-white text-black">
            <h2>
                Verify your account
            </h2>
            <form>
                <div>
                    <label htmlFor="email">Email:</label>
                    <a
                        data-tooltip-id="emailError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid email."
                    >
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
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
                    <label htmlFor="token">Verification Code:</label>
                    <a
                        data-tooltip-id="tokenError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid verification code."
                    >
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Verification Code"
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
                    >
                        Verify
                    </button>
                </div>
                <div>
                    <button
                        onClick={resendCode}
                        disabled={!email || !emailRegex.test(email)}
                    >
                        Resend Verification Code
                    </button>

                </div>
            </form>
        </main>
    )
}

export default Verify