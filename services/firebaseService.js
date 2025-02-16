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