'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const router = useRouter();

    const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
    const tokenRegex = new RegExp(/^[0-9A-Fa-f]{8}$/);
    const passwordRegex = new RegExp(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email || !token || !password || !password2) {
            alert("Email, Token, Password and Confirm Password are required!");
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
        if (passwordRegex.test(password)) {
            alert("Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long!");
            return;
        }
        if (password !== password2) {
            alert("Passwords do not match!");
            return;
        }
        const response = await fetch("/api/auth/changepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                token: token,
                password: password,
            }),
        });
        if (response.status == 200) {
            alert("Password changed! Login to continue")
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
            alert("Password change Failed!")
            window.location.reload();
        }
    }
    return (
        <main className='bg-white text-black'>
            <h2>
                Change your password
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
                    <label htmlFor="token">Token:</label>
                    <a
                        data-tooltip-id="tokenError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid token."
                    >
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Token"
                            required
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
                    <label htmlFor="password">Password:</label>
                    <a
                        data-tooltip-id="passwordError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long."
                    >
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
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
                    <label htmlFor="password2">Confirm Password:</label>
                    <a
                        data-tooltip-id="password2Error"
                        data-tooltip-variant="error"
                        data-tooltip-content="Passwords do not match!"
                    >
                        <input
                            type="password"
                            name="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirm Password"
                            required
                        />
                    </a>
                    <Tooltip
                        id="password2Error"
                        place="bottom"
                        effect="solid"
                        hidden={!password2 || password == password2}
                    />
                </div>
                <button
                    onClick={handleForgotPassword}
                    disabled={!email || !token || !password || !password2 || !emailRegex.test(email) || !tokenRegex.test(token) || passwordRegex.test(password) || password !== password2}
                >
                    Change Password
                </button>
            </form>
        </main>
    )
}
export default ForgotPasswordForm;