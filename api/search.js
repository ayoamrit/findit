const { getModel, getAllModels, addModel, removeModel } = require('../services/firebaseService');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        // Example response
        return res.json({ "Name": "Amrit Dhaliwal" });
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};