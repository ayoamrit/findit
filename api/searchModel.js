import {getModel} from "../firebase.js";

export default async function handler(req, res){

    //Get the model number from the search query 
    const {modelNumber} = req.query;

    if(!modelNumber){
        return res.status(400).json({error: "Model number is required"});
    }

    try{
        const result = await getModel(modelNumber);  //Fetch the specific model's data

        if(result.error){

            //Return 404 if model not found
            return res.status(404).json({error: result.error});
        }

        return res.status(200).json(result);
    }catch(error){
        console.error("Error in handler: ", error);
        return res.status(500).json({error: "An unexpected error occurred."});
    }
}