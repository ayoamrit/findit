const express = require("express");
const { getModel, getAllModels, addModel, removeModel } = require("./firebase");

const app = express();
app.use(express.json());

// Get all models
app.get("/all", (req, res) => {
    res.json(getAllModels());
});

// Get a specific model
app.get("/", (req, res) => {
    const modelNumber = req.query.model;
    if (!modelNumber) {
        return res.status(400).json({ error: "Model number is required" });
    }
    const model = getModel(modelNumber);
    if (model) {
        res.json(model);
    } else {
        res.status(404).json({ error: "Model not found" });
    }
});

// Add a new model
app.post("/add", async (req, res) => {
    const { modelNumber, modelName, sku, accessories, url, type } = req.body;
    const result = await addModel(modelNumber, modelName, sku, accessories, url, type);
    res.status(result.success ? 201 : 500).json(result);
});

// Remove a model
app.delete("/remove", async (req, res) => {
    const modelNumber = req.query.model;
    if (!modelNumber) return res.status(400).json({ error: "Model number is required" });

    const result = await removeModel(modelNumber);
    res.status(result.success ? 200 : 404).json(result);
});

module.exports = app;