"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';

import { IoSearchOutline } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

import LoadingSpinner from "./Loader";

import Layout from "./Layout";


interface Team {
    _id: string;
    teamName: string;
    members: { _id: string; name: string }[];
}

const TeamList = () => {
    const { data: session } = useSession();

    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTeams = async () => {
            
            try {
                const response = await fetch("/api/teams");
                const data = await response.json();
                setTeams(data.teams);
                setFilteredTeams(data.teams)

            } catch (error) {
                console.error("Error fetching teams:", error);

            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
        
    }, []);

    useEffect(() => {
        const filtered = teams.filter((team) =>
            team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.members.some((member) =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredTeams(filtered);
    }, [searchQuery, teams]);

    if (loading) { 
        return (
        <Layout>
            <div className="flex items-center justify-center min-h-[50vh]">
                <LoadingSpinner />
            </div>
        </Layout>
        );
    }

    const teamListId = [teams.map((team: any) => (team._id))]
    console.log("Team Id: ", teamListId)

    
    return (
        <Layout>
            <div className="border-b px-4 sm:px-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-700">Teams List</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 m-4 sm:m-6">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        placeholder="Search teams..."
                        className="input w-full focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Create Team Button */}
                <Link href={'/teams/create'}>
                    <button 
                        className="flex w-full sm:w-fit bg-white createButton justify-center">
                        <MdAdd className="w-6 h-6 mr-1"/>New Team
                    </button>
                </Link>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4 sm:m-6">
                {filteredTeams.map((team) => (
                    <Link 
                        href={`/teams/${team._id}`} 
                        key={team._id}>
                        <li className="rounded-lg border-2 border-[#2c4fff] px-4 sm:px-8 py-4 sm:py-6 space-y-2 flex flex-col items-center bg-[#405fff] hover:bg-[#3a58ec]">
                            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#4f6bfb] border border-[#6780ff] rounded-xl flex items-center justify-center">
                                <span className="text-lg sm:text-xl text-white font-bold">{team.teamName?.[0]}</span>
                            </div>
                            <h4 className="font-semibold text-base sm:text-[20px] text-white text-center">{team.teamName}</h4>
                            <hr className="border-t border-white/15 w-full mt-4 sm:mt-6" />
                            <p className="text-xs sm:text-sm text-gray-100">
                                Created by: {team.members && team.members.length > 0 ? 
                                team.members[0].name : "No members available"}
                            </p>
                        </li>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default TeamList;
