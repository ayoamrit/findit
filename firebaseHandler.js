// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0GsNr1Mhk-0yZ7zUl8xXi-kduLgu9ZwA",
    authDomain: "findit-database.firebaseapp.com",
    databaseURL: "https://findit-database-default-rtdb.firebaseio.com",
    projectId: "findit-database",
    storageBucket: "findit-database.firebasestorage.app",
    messagingSenderId: "542541279239",
    appId: "1:542541279239:web:b97b807954363b4eb33aa2",
    measurementId: "G-M4GWDMJNRV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const contactFormDB = firebase.database().ref("ContactForm");

const submit = () =>{
    const name = "Amrit Dhaliwal"
    const email = "Amrit@gmail.com";

    var newContact = contactFormDB.push();
    newContact.set({
        "Name": name,
        "Email": email
    })
}
