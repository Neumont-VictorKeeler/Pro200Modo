"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {signInWithGoogle, signUpWithEmail} from "@/lib/firebase";
import { checkError } from "@/lib/ErrorUtils";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        setError("");
        try {
            await signUpWithEmail(email, password);
            router.push("/"); // Redirect to homepage after successful sign-up
        } catch (error: any) {
            console.error("Error signing in:", error);
            checkError(error.message, setError);
        }
    }

    return (
        <div className="bg-[#202C39] min-h-screen flex flex-col items-center p-6">
            <div className="w-full">
                <Navbar/>
            </div>

            <div className="bg-gray-700 p-8 mt-10 rounded-xl shadow-md w-[400px] text-center">
                <h2 className="text-[#FAFFEB] text-lg mb-4">Sign Up</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="text-left text-[#FAFFEB] mb-2">Email</div>
                <input
                    type="text"
                    className="w-full p-2 rounded-md mb-4 bg-white text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="text-left text-[#FAFFEB] mb-2">Password</div>
                <input
                    type="password"
                    className="w-full p-2 rounded-md mb-4 bg-white text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="text-left text-[#FAFFEB] mb-2">Confirm Password</div>
                <input
                    type="password"
                    className="w-full p-2 rounded-md mb-4 bg-white text-black"
                />

                <Button
                    className="bg-[#ED7E07] text-[#FAFFEB] w-full py-2 rounded-full mb-4"
                    onClick={handleSignUp}
                >
                    Sign Up
                </Button>
                <Button
                    onClick={() => signInWithGoogle()}
                    className="bg-[#FAFFEB] text-[#ED7E07] w-full py-2 rounded-full mb-4 flex items-center justify-center"
                >
                    <img src="/images/google-icon.svg" alt="Google Icon" className="w-4 h-4 mr-2" />
                    Sign Up with Google
                </Button>
                <Link href="/Login">
                    <Button
                        variant="outline"
                        className="border-[#ED7E07] text-ivory w-full mb-4">
                        Already have an account? Log In!
                    </Button>
                </Link>
            </div>
        </div>
    );
}