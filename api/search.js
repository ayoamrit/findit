const { getModel, getAllModels, addModel, removeModel } = require('../services/firebaseService');

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.json({"Name": "Amrit Dhaliwal"});
    }
}