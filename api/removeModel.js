import {deleteModelFromDatabase} from "../firebase.js";

export default async function handler(req, res){
    //Get the model number from the search query
    const {modelNumber} = req.query;

    if(!modelNumber){
        return res.status(400).json({error: "Model number is required"});
    }

    try{
        await deleteModelFromDatabase(modelNumber);
        return res.status(200).json({message: "Model removed successfully from the Firebase database"});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}