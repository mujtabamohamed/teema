import { connectMongoDB } from "@/lib/monogodb";
import Team from "@/models/team";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { teamName } = await req.json();
        console.log("Team Name:", teamName);
        console.log("User ID:", session?.user?.id);

        await connectMongoDB();
        const newTeam = await Team.create({ teamName, members: [session?.user?.id] });
        console.log("Team created:", newTeam);

        return NextResponse.json({ message: "Team created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error during team creation:", error);
        return NextResponse.json({ 
            message: "An error occured while creating the team",
        }, {
            status: 500
        });       
    }
}