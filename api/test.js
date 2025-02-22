import {getAllModels} from "../firebase.js"

export default async function handler (req, res){
    try{
        const result = await getAllModels();

        if(result.error){
            return res.status(500).json({error: result.error});
        }

        return res.status(200).json(result);
    }catch(error){
        console.error("Error in handler: ", error);
        return res.status(500).json({error: "An unexpected error occurred."});
    }
}