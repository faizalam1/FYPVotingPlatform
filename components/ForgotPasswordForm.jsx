'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();

    const emailRegex = new RegExp(/^[\w\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
    const tokenRegex = new RegExp(/^[0-9A-Fa-f]{8}$/);
    const passwordRegex = new RegExp(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/);

    useEffect(() => {
        setEmail(searchParams.get('email'));
    },[searchParams])

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
            method: "PATCH",
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
            router.push("/app/auth?signInEmail="+email);
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
        <main className="flex flex-row justify-center w-full h-fit space-x-16 bg-[#f3f4f6] text-black p-8 font-sans">
           <section className="bg-white p-4 rounded-2xl space-y-7 w-96">
            <h2 className="font-semibold text-center text-2xl ">
                Change your password
            </h2>
            <form className="space-y-7">
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
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
                    <label htmlFor="token">Token</label>
                    <br />
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Token"
                            required
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    {token && !tokenRegex.test(token) && (
                        <p className='text-red-500 text-sm'>Please enter a valid token.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    {password && passwordRegex.test(password) && (
                        <p className='text-red-500 text-sm'>Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password2">Confirm Password</label>
                    <br />
                        <input
                            type="password"
                            name="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="p-2 border rounded-lg border-gray-300 w-full"
                        />
                    {password2 && password !== password2 && (
                        <p className='text-red-500 text-sm'>Passwords do not match.</p>
                    )}
                </div>
                <button
                    onClick={handleForgotPassword}
                    disabled={!email || !token || !password || !password2 || !emailRegex.test(email) || !tokenRegex.test(token) || passwordRegex.test(password) || password !== password2}
                    className="p-2 bg-indigo-700 rounded-xl text-white hover:bg-indigo-900 font-medium w-full"
                >
                    Change Password
                </button>
            </form>
            </section>
        </main>
    )
}
export default ForgotPasswordForm;