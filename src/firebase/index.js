import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4MOTgsyI2uGi-7fQBUuAujnhvVMRXUuM",
  authDomain: "group-expenses-app.firebaseapp.com",
  projectId: "group-expenses-app",
  storageBucket: "group-expenses-app.appspot.com",
  messagingSenderId: "580960049755",
  appId: "1:580960049755:web:c1fc34d49f16461b0dbd7e"
};


// Initialize Firebase
let app
if (!app) {
  app = initializeApp(firebaseConfig);
}



// // utils
// const db = getFirestore();
const auth = getAuth();

export {
  // db,
  auth,
  // createUserWithEmailAndPassword
}