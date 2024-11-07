"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Layout from './Layout';
import { RiTeamFill } from 'react-icons/ri';


const TeamForm = () => {

    // State for form input
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    
    // Get user session and router
    const { data: session } = useSession();
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate team name is provided
        if (!teamName) {
            setError("All fields are necessary.");
            return;
        }

        // Check if user is authenticated
        if (!session || !session.user) {
            setError("You need to be logged in to create a team.");
            return;
        }
        
        try {
            // Create new team
            const res = await fetch("/api/teams/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ teamName }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    setError("This team name is already taken. Please choose a different name.");
                    setIsDuplicate(true);
                } else {
                    setError(data.message || "Failed to create team");
                }
                return;
            }
            
            // Redirect to teams page on success
            router.push("/teams");
            router.refresh();
        } catch (error) {
            setError("An error occurred while creating the team");
        } finally {
            setIsLoading(false);
        }
    }

  return (
        <Layout>
            <div className="border-b px-4 sm:px-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-700">
                    Create Team
                </h1>
            </div>

            <div className="p-4 sm:p-6">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 
                        my-2 sm:my-3 space-y-2 flex flex-col bg-white">
                        
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:gap-4'>

                            <div className="relative">
                                <RiTeamFill className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    text-gray-500 text-base sm:text-lg" />
                                <input 
                                    onChange={(e) => {
                                        setTeamName(e.target.value);
                                        setError("");
                                        setIsDuplicate(false);
                                    }}
                                    type='text'
                                    className={`input w-full text-sm sm:text-base py-2 sm:py-3 pl-10`}
                                    placeholder='Team Name' 
                                    required
                                />
                            </div>

                            <button 
                                className='button w-full sm:w-auto mt-2 sm:mt-4 text-sm sm:text-base 
                                py-2 sm:py-3 flex items-center justify-center'
                                disabled={isLoading}>
                                {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    'Create'
                                )}
                            </button>
                            
                            {error && (
                                <div className='error text-sm sm:text-base p-2 sm:p-3'>
                                    {error}
                                </div>
                            )}
                        </form>

                    </div>
                </div>
            </div>

        </Layout>
  )
}

export default TeamForm;