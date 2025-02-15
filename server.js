const express = require('express');
const path = require('path');
const {loadDatabase} = require("./services/firebaseService");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

//Middleware to parse incoming JSON requests
app.use(express.json());
// Static files (CSS, JS, Images) will be accessed from public/ folder
app.use(express.static(__dirname + '/public'));

//Load database at startup
loadDatabase();

//Use the search routes
app.use("/search", searchRoutes);

//HTTP GET request for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5500, () => {
    console.log("Server is running");
});



