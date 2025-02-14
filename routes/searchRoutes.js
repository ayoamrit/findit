const express = require("express");
const {getModel, getAllModels} = require('../services/firebaseService');

const router = express.Router();


//Route to search a specific model
router.get("/", (req, res) => {
    const modelNumber = req.query.model;

    if(!modelNumber){
        return res.status(400).json({error: "Model number is required"});
    }

    const searchedData = getModel(modelNumber);
    if(searchedData){
        res.json({
            accessories: searchedData.accessories.split(", ").map(item => item.trim()),
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

module.exports = router;