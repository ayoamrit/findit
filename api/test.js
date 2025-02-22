import {firebaseDatabase} from "../firebase.js"

export default async function handler (req, res){
    try{
        const ref = firebaseDatabase.ref("/");
        const snapshot = await ref.once("value");
        const data = snapshot.val();
        res.status(200).json({
            message: "Database has been loaded successfully",
            data: data || "No data found at the specified path.",
        });
    }catch(error){
        console.error("Database connection error: ", error);
        res.status(500).json({message: "Failed to connect to the database", error: error.message});
    }
}