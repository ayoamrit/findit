import { getAllModels, getModel, addModel, removeModel } from "../services/firebaseService";

export default function handler(req, res) {
    if (req.method === "GET") {
        const { model } = req.query;

        if (model) {
            // Fetch specific model
            const searchedData = getModel(model);
            if (searchedData) {
                res.json({
                    accessories: searchedData.accessories.split(", ").map(item => item.trim()),
                    sku: searchedData.sku,
                    modelName: searchedData.modelName,
                    url: searchedData.url
                });
            } else {
                res.status(404).json({ error: "Model number is not available" });
            }
        } else {
            // Fetch all models
            const database = getAllModels();
            if (!database || typeof database !== "object") {
                return res.status(500).json({ message: "Database not loaded" });
            }
            res.json(database);
        }
    } 
    
    else if (req.method === "POST") {
        // Add a model
        const { modelNumber, modelName, sku, accessories, url, type } = req.body;
        const result = addModel(modelNumber, modelName, sku, accessories, url, type);

        if (result.success) {
            res.status(201).json({ message: "Model added successfully", data: result.data });
        } else {
            res.status(500).json({ error: result.error });
        }
    } 
    
    else if (req.method === "DELETE") {
        // Remove a model
        const { model } = req.query;

        if (!model) {
            return res.status(400).json({ error: "Model number is required" });
        }

        const result = removeModel(model);
        if (result.success) {
            res.status(200).json({ message: "Model number has been removed" });
        } else {
            res.status(404).json({ error: result.error });
        }
    } 
    
    else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
