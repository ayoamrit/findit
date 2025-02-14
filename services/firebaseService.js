const firebaseAdmin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, '../firebaseDatabaseAdminFile.json'));
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://findit-database-3526e-default-rtdb.firebaseio.com"
});

const firebaseDatabase = firebaseAdmin.database();
let localDatabase = {} //Store database locally

const loadDatabase = async () => {
    try{
        const ref = firebaseDatabase.ref("/");  //Root reference to fetch everything
        const dataSnapshot = await ref.once("value");
        localDatabase = dataSnapshot.val() || {};
        console.log("Database has been loaded successfully");
    }catch(error){
        console.error("Error occurred while loading the database: ", error);
    }
}

const getModel = (modelNumber) => {
    if(!localDatabase || typeof localDatabase !== "object") return null;
    return localDatabase[modelNumber];
}

const getAllModels = () => {
    return localDatabase;
}

module.exports = {loadDatabase, getModel, getAllModels};