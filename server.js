const express = require('express');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

const serviceAccount = require(path.join(__dirname, 'firebaseDatabaseAdminFile.json'));
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://findit-database-3526e-default-rtdb.firebaseio.com"
});

const app = express();
// Static files (CSS, JS, Images) will be accessed from public/ folder
app.use(express.static(__dirname + '/public'));

app.get('/data', (req, res) => {
    const firebaseDatabase = firebaseAdmin.database();
    const ref = firebaseDatabase.ref('KA272 G0BI'); //Referencing the model number in the database
    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        if(data){
            res.json(data);
        }
        else{
            res.status(404).send('Model not found');
        }
    });
});

//HTTP GET request for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5500, () => {
    console.log("Server is running");
});



