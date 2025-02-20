const { getModel, getAllModels, addModel, removeModel } = require('../services/firebaseService');

export default function handler(req, res) {
    if (req.method === 'GET') {
        const modelNumber = req.query.model;

        if (!modelNumber) {
            return res.status(400).json({ error: "Model number is required" });
        }

        const searchedData = getModel(modelNumber);
        if (searchedData) {

            const accessories = searchedData.accessories?searchedData.accessories.split(", ").map(item => item.trim()) : [];
            res.json({
                accessories,
                sku: searchedData.sku,
                modelName: searchedData.modelName,
                url: searchedData.url
            });
        } else {
            res.status(404).json({ error: "Model not found" });
        }
    }
}