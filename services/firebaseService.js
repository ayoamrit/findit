const firebaseAdmin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccount = {
    "type": "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
    //databaseURL: "https://findit-database-3526e-default-rtdb.firebaseio.com"
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

const getModel = async (modelNumber) => {
    await loadDatabase();
    if(!localDatabase || typeof localDatabase !== "object") return null;
    return localDatabase[modelNumber];
};

const getAllModels = () => {
    return localDatabase;
}

//Function to add data to the database
const addModel = async (modelNumber, modelName, sku, accessories, url, type) => {

    try{

        //Check whether modelNumber already exist in the database or not
        if(type === "add" && localDatabase[modelNumber]){
            return { success: false, error: "Model already exist in the database"};
        }

        if(type === "modify" && !localDatabase[modelNumber]){
            return {success: false, error: "Model number does not exist in the database"};
        }

        const ref = firebaseDatabase.ref("/"+modelNumber);
        const newData = {modelName, sku, accessories, url}

        //Push data to the firebase database
        await ref.set(newData);
        localDatabase[modelNumber] = newData;  //Update the local cache

        return { success: true, data: newData};

    }catch(error){
        console.error("Error adding model: ", error);
        return { success: false, error: "Failed to add model"};
    }
}


//Function to remove data from the database
const removeModel = async (modelNumber) => {

    try{
        if(!localDatabase[modelNumber]) return {success: false, error: "Model number does not exist in the database"};
        const ref = firebaseDatabase.ref("/"+modelNumber);
        
        //Remove data from Firebase
        await ref.remove();

        //Remove the local cache
        delete localDatabase[modelNumber];

        return {success: true, message: "Model number has been removed successfully"};
    }catch(error){
        console.error("Error deleting model: ", error);
        return {success: false, error: "Failed to delete model"};
    }
    
}

module.exports = {loadDatabase, getModel, getAllModels, addModel, removeModel};