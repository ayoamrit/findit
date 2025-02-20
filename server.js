const express = require('express');
const path = require('path');
const {loadDatabase} = require("./services/firebaseService");
//const searchRoutes = require("./routes/searchRoutes");
const searchRoutes = require('./api/search');

const app = express();

//Middleware to parse incoming JSON requests
app.use(express.json());
// Static files (CSS, JS, Images) will be accessed from public/ folder
app.use(express.static(__dirname + '/public'));

//Load database at startup
loadDatabase();

//Use the search routes
app.use("/api/search", searchRoutes);

//HTTP GET request for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.port || 5500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



