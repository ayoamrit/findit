const express = require("express");
const {getModel, getAllModels, addModel, removeModel} = require('../services/firebaseService');

const router = express.Router();


//Route to search a specific model
router.get("/", (req, res) => {
    const modelNumber = req.query.model;

    if(!modelNumber){
        return res.status(400).json({error: "Model number is required in the database"});
    }

    const searchedData = getModel(modelNumber);
    if(searchedData){
        res.json({
            accessories: searchedData.accessories.split(", ").map(item => item.trim()),
            sku: searchedData.sku,
            modelName: searchedData.modelName,
            url: searchedData.url
        });
    }
    else{
        res.status(404).json({ error: "Model number is not available"});
    }
});

//Router to fetch all models
router.get("/all", (req, res) => {
    const database = getAllModels();

    if(!database || typeof database !== "object"){
        return res.status(500).json({message: "Database not loaded"});
    }

    res.json(database);
});

//Router to add data to the firebase database
router.post("/add", async (req, res) => {
    const {modelNumber, modelName, sku, accessories, url, type} = req.body;

    const result = await addModel(modelNumber, modelName, sku, accessories, url, type);

    if(result.success){
        res.status(201).json({message: "Model added successfully", data: result.data});
    }else{
        res.status(500).json({error: result.error});
    }
});

//Router to remove data from the database
router.get("/remove", async (req, res) => {
    const modelNumber = req.query.model;

    if(!modelNumber){
        return res.status(400).json({ error: "Model number is required"});
    } 
    
    const result = await removeModel(modelNumber);
    if(result.success){
        res.status(200).json({message: "Model number has been removed"});
    }
    else{
        res.status(404).json({error: result.error});
    }
});

module.exports = router;