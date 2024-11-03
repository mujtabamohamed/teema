"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaAt, FaLock } from 'react-icons/fa';

const SignUpForm = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!name || !email || !username || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {
            const resUserExists = await  fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    username
                }),
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("User with this email or username already exists.");
                return;
            }

            const res = await fetch("api/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, 
                    email, 
                    username, 
                    password
                }),
            });

            if(res.ok) {
                (e.target as HTMLFormElement).reset();
                router.push("/")
                
            } else {
                console.log("User registeration failed.");
            }

        } catch (error) {
            console.log("Error during registeration", error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#ffffff]'>
    {/* Left Section - now shows on mobile as a smaller header */}
        <div className="h-32 lg:h-auto lg:w-2/4 bg-gradient-to-r from-[#405fff] to-[#1d40f1] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-white text-4xl lg:text-7xl font-extrabold tracking-wider">
                    WECOMMIT
                </h1>
                <p className="text-gray-200 mt-2 lg:mt-4 text-sm lg:text-2xl">
                contributes to business growth using AI
                </p>
            </div>
        </div>

        {/* Right Section - adjusted padding and width for mobile */}
        <div className='flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 w-full lg:w-2/4'>
            <div className="w-full max-w-sm px-4 sm:px-0">
                <h1 className='text-xl lg:text-2xl font-bold text-center text-gray-700 mb-2 lg:mb-4'>
                    Hello There!
                </h1>
                <p className="text-gray-500 text-sm lg:text-base text-center mb-4 lg:mb-6">
                    Enter your details to access your account
                </p>   

                <form onSubmit={handleSubmit} className='flex flex-col gap-3 lg:gap-4'>
                    {/* Form inputs - adjusted for better mobile display */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                            onChange={(e) => setName(e.target.value)}
                            type='text' 
                            placeholder='Full Name'
                            className="input w-full text-sm lg:text-base py-2 lg:py-3"
                        />
                    </div>
                    
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            type='text' 
                            placeholder='Email' 
                            className="input w-full text-sm lg:text-base py-2 lg:py-3"
                        />
                    </div>
                    
                    <div className="relative">
                        <FaAt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                            onChange={(e) => setUsername(e.target.value)} 
                            type='text' 
                            placeholder='Username'
                            className="input w-full text-sm lg:text-base py-2 lg:py-3" 
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type='password' 
                            placeholder='Password' 
                            className="input w-full text-sm lg:text-base py-2 lg:py-3"
                        />
                    </div>

                    <button 
                        className='button w-full text-sm lg:text-base py-2 lg:py-3 
                            flex items-center justify-center'
                        disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Signing up...</span>
                            </div>
                        ) : (
                            'Sign up'
                        )}
                    </button>
                    
                    {error && (
                        <div className="flex justify-center">
                            <div className='error text-sm lg:text-base'>
                                {error}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-center">
                        <Link className='text-xs lg:text-sm mt-2 lg:mt-3 text-right' href={'/'}>
                            Already have an account? <span className='hover:underline text-[#405fff] font-bold'>Sign In</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default SignUpForm