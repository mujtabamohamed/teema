import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema({

    teamName: {
        type: String,
        required: [true, "Please provide your team name"],
        unique: [true, "Team name should be unique"],
        
    },
    
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
},
{ timestamps: true },
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default Team;