import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';

import { RiTeamFill } from "react-icons/ri";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="w-full lg:w-[320px] border-b lg:border-r flex flex-col bg-white">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-xl sm:text-2xl">
                            WE<span className="text-[#405fff]">C</span>OMMIT</h2>
                    </div>
                </div>
    
                <div className="p-4">
                    <div className="flex items-center justify-between 
                        bg-[#efefef] border border-gray-200 p-2 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-4 w-full">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#232323] 
                                rounded-xl flex items-center justify-center">
                                <span className="text-lg sm:text-xl text-white font-bold">
                                    {session?.user?.name?.[0]}
                                </span>
                            </div>
    
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-700">
                                    {session?.user?.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {session?.user?.email}
                                </p>
                                <button 
                                    onClick={() => signOut()}
                                    className='text-red-500 bg-red-500/20 rounded-full px-2 
                                        sm:px-3 text-xs sm:text-sm font-semibold mt-1'>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    
                <nav className="flex-1 py-2 sm:py-4 space-y-4 sm:space-y-6">
                    <div className="pb-2 sm:pb-3 border-b">
                        <h2 className="mb-2 ml-4 text-xs font-semibold text-gray-500">
                            MAIN MENU
                        </h2>
    
                        <div className="space-y-1">
                            <Link href={"/teams"}>
                                <div className="w-full flex items-center gap-2 text-left 
                                    p-2 py-2 sm:py-3 hover:bg-gray-100">
                                    <RiTeamFill className="ml-3" />
                                    <span className="text-sm sm:text-base">Teams</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
    
            <div className="flex-1 overflow-auto">
                <div className="py-2 sm:py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
