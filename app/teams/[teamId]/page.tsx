"use client"

import React,{ useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Loader";
import ErrorPopup from "@/components/ErrorPopup";

import { IoSearchOutline, IoWarningOutline } from "react-icons/io5";

interface Team {
    _id: string;
    teamName: string;
    members: { 
        _id: string; 
        name: string; 
        email: string; 
        username: string 
    }[];
}

interface User {
    _id: string;
    name: string;
    username: string;
}

const TeamDetail = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { teamId } = useParams();

    const [team, setTeam] = useState<Team | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [loadingMembers, setLoadingMembers] = useState<{ [key: string]: boolean }>({});
    const [loadingAddMembers, setLoadingAddMembers] = useState<{ [key: string]: boolean }>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/teams/${teamId}`);
                const data = await response.json();

                if (response.status === 403) {
                    setError(data.message);
                    setShowError(true);
                    setIsAuthorized(false);

                } else {
                    setTeam(data.team);
                    setIsAuthorized(true);
                }

            } catch (error) {
                console.error("Error fetching team:", error);
                setError("Failed to fetch team details");
                setShowError(true);
                setIsAuthorized(false);

            } finally {
                setIsLoading(false);
            }
        };

        const fetchUsers = async () => {
            if (!isAuthorized) return;

            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users);

            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users");
                setShowError(true);
            }
        };

        if (teamId) {
            fetchTeam();
            fetchUsers();
        }
    }, [teamId, isAuthorized]);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const addMember = async (userId: string) => {
        try {
            setLoadingAddMembers(prev => ({ ...prev, [userId]: true }));
            const response = await fetch(`/api/teams/${teamId}/addMember`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const teamResponse = await fetch(`/api/teams/${teamId}`);
                const teamData = await teamResponse.json();
                setTeam(teamData.team);

            } else {
                const errorData = await response.json();
                setError(errorData.message);
                setShowError(true);
            }

        } catch (error) {
            console.error("Error adding member:", error);
            setError("Failed to add member");
            setShowError(true);

        } finally {
            setLoadingAddMembers(prev => ({ ...prev, [userId]: false }));
        }
    };

    const removeMember = async (userId: string) => {
        try {
            setLoadingMembers(prev => ({ ...prev, [userId]: true }));
            const response = await fetch(`/api/teams/${teamId}/removeMember`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const teamResponse = await fetch(`/api/teams/${teamId}`);
                const teamData = await teamResponse.json();
                setTeam(teamData.team);

            } else {
                const data = await response.json();
                setError(data.message);
                setShowError(true);
            }

        } catch (error) {
            console.error("Error removing member:", error);
            setError("Failed to remove member");
            setShowError(true);

        } finally {
            setLoadingMembers(prev => ({ ...prev, [userId]: false }));
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (!isAuthorized) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <IoWarningOutline className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Access Denied
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        You do not have permission to view this team's details. 
                                        Only team members can access this page.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
    
    return (
        <Layout>
            <ErrorPopup 
                message={error}
                isVisible={showError}
                onClose={() => setShowError(false)}
            />

            {team ? (
                <div className="border-b px-4 sm:px-6 flex items-start relative">
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#4f6bfb] 
                            border border-[#6780ff] rounded-lg flex items-center justify-center">
                            <div className="text-sm sm:text-lg text-white font-bold">{team.teamName?.[0]}</div>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-700">{team.teamName}</h1>
                    </div>
                </div>
            ) : (
                <h1>Loading team details...</h1>
            )}

            <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
                {team ? (
                    <div className="w-full lg:w-1/2">
                        <h2 className="font-semibold text-lg sm:text-[20px] text-gray-700 mb-4 sm:mb-6">
                            Team Members
                        </h2>

                        <ul className="w-full">
                            {team.members.map((member) => ( 
                                <li className="w-full sm:max-w-[400px] rounded-lg border font-semibold border-gray-200 
                                    px-3 sm:px-4 py-3 sm:py-4 mb-4 flex justify-between items-start bg-gray-100 relative"
                                    key={member._id}>
                                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#232323] rounded-full flex 
                                        items-center justify-center mr-2 text-white text-sm sm:text-base">
                                        {member.name?.[0]}
                                    </div>
                                    
                                    <div className="flex-1 ml-2 text-left">
                                        <p className="text-sm sm:text-base">{member.name}</p>
                                        <p className="font-normal text-xs sm:text-sm text-gray-600">@{member.username}</p>
                                    </div>                            

                                    <button 
                                        className="absolute bottom-2 right-2 mr-2 text-red-500 bg-red-500/20 
                                            rounded-full px-2 sm:px-3 text-xs sm:text-sm"
                                        onClick={() => removeMember(member._id)}
                                        disabled={loadingMembers[member._id]}>
                                        {loadingMembers[member._id] ? (
                                            <div className="flex items-center gap-1">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                                                <span>Removing...</span>
                                            </div>
                                        ) : (
                                            'Remove'
                                        )}
                                    </button>
                                </li>
                            ))}     
                        </ul>
                    </div>
                ) : null}
                
                <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
                    <h2 className="font-semibold text-lg sm:text-[20px] text-gray-700 mb-4 sm:mb-6">
                        All Employees
                    </h2>
                    <div className="relative w-full sm:max-w-[400px] mb-6">
                        <IoSearchOutline 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" 
                        />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full input pl-10 sm:py-2 border border-gray-300 
                                rounded-md focus:outline-none focus:ring-2 focus:ring-[#405fff] 
                                focus:border-transparent"
                        />
                    </div>

                    <ul className="w-full">
                        {filteredUsers.map((user) => (
                            <li className="w-full sm:max-w-[400px] rounded-lg border font-semibold 
                                border-gray-200 px-3 sm:px-4 py-3 sm:py-4 mb-4 flex justify-between 
                                items-start bg-gray-100 relative"
                                key={user._id}>
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[#232323] rounded-full flex 
                                    items-center justify-center mr-2 text-white text-sm sm:text-base">
                                    {user.name?.[0]}
                                </div>

                                <div className="flex-1 ml-2 text-left">
                                    <p className="text-sm sm:text-base">{user.name}</p>
                                    <p className="font-normal text-xs sm:text-sm text-gray-600">@{user.username}</p>
                                </div>

                                <button 
                                    className="absolute bottom-2 right-2 mr-1 text-green-600
                                        bg-green-500/20 rounded-full px-2 sm:px-3 text-xs sm:text-sm"
                                    onClick={() => addMember(user._id)}
                                    disabled={loadingAddMembers[user._id]}>
                                    {loadingAddMembers[user._id] ? (
                                        <div className="flex items-center gap-1">
                                            <div className="animate-spin rounded-full h-3 w-3 
                                                border-b-2 border-green-600"></div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : (
                                        'Add'
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default TeamDetail;