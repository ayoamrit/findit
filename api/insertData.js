import { addDataToDatabase, modifyDataInDatabase } from "../firebase";

export default async function handler(req, res){
    if(req.method !== "POST"){
        return res.status(405).json({ error: "Method not allowed"});
    }

    const { modelNumber, modelName, sku, accessories, url, type} = req.body;

    try{
        if(type === "add"){
            await addDataToDatabase(modelNumber, modelName, sku, accessories, url);
        } else if(type === "modify"){
            await modifyDataInDatabase(modelNumber, modelName, sku, accessories, url);
        }else{
            return res.status(400).json({ error: "Invalid type. Must be 'add' or 'modify'."});
        }

        return res.status(200).json({message: `Model ${type}ed successfully`});
    }catch(error){
        console.error(`Error ${type}ing data in Firebase`, error);
        return res.status(500).json({error: `Failed to ${type} data in the database: ${error.messsage}`});
    }
}