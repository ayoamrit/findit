import admin, { credential } from "firebase-admin";

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

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

const firebaseDatabase = admin.database();

//Function to get all models from the firebase realtime database
async function getAllModels(){
    try{
        const ref = firebaseDatabase.ref("/");  //Reference to the entire database
        const snapshot = await ref.once("value");
        const data = snapshot.val();

        //Throw an error if no data is found in the database
        if(!data){
            throw new Error("No data found in the database");
        } 

        console.log("Database has been loaded successfully");
        return data;  //Return data
    }catch(error){
        console.error("Error occurred while loading the database: ", error);
        return {error: error.message};
    }
}

//Function to get a specific model from the firebase realtime database
async function getModel(modelNumber){
    try{
        const ref = firebaseDatabase.ref("/"+modelNumber);  //Reference to the speicific model number
        const snapshot = await ref.once("value");   //Retrieve the data
        const data = snapshot.val();

        if(!data){
            //Throw an error if the model number does not exist in the database
            throw new Error("Model not found in the database");
        }

        console.log("Model has been loaded successfully");
        return data;  //Return the model data if it exists
    } catch(error){
        console.error("Error occurred while loading the model: ",error);
        return {error: error.message};
    }
}

export {getAllModels, getModel};