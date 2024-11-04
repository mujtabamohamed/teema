"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if(res?.error){
                setError("Invalid credentials, please try again.");
                return;
            }
            router.replace("teams");
            console.log(error);

        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    }
    

return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#ffffff]'>
        <div className="h-32 lg:h-auto lg:w-2/4 bg-gradient-to-r 
            from-[#405fff] to-[#1d40f1] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-white text-4xl lg:text-7xl 
                    font-extrabold tracking-wider">
                    TEEMA
                </h1>
                <p className="text-gray-200 mt-2 lg:mt-4 text-sm lg:text-2xl">
                    Team and Employee Management Application
                </p>
            </div>
        </div>

        <div className='flex flex-col justify-center items-center 
            p-4 sm:p-6 lg:p-8 w-full lg:w-2/4'>
            <div className="w-full max-w-sm px-4 sm:px-0">
                <h1 className='text-xl lg:text-2xl font-bold 
                    text-center text-gray-700 mb-2 lg:mb-4'>
                    Hello Again!
                </h1>
                <p className="text-gray-500 text-sm lg:text-base text-center mb-4 lg:mb-6">
                    Enter your details to access your account
                </p>  

                <form onSubmit={handleSubmit} className='flex flex-col gap-3 lg:gap-4'>
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
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            type='password' 
                            placeholder='Password'
                            className="input w-full text-sm lg:text-base py-2 lg:py-3"
                        />
                    </div>

                    <button 
                        className='button w-full text-sm lg:text-base 
                            py-2 lg:py-3 flex items-center justify-center'
                        disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full 
                                    h-5 w-5 border-b-2 border-white"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign in'
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
                        <Link className='text-xs lg:text-sm mt-2 
                            lg:mt-3 text-right' href={'/sign-up'}>
                            Don't have an account? 
                            <span className='hover:underline text-[#405fff] font-bold'>
                                Sign Up
                            </span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default LoginForm;