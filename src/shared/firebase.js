import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr6Z7By3Y-aiK32NHvj5uG5_bkK3DCnw4",
  authDomain: "image-community-1b295.firebaseapp.com",
  projectId: "image-community-1b295",
  storageBucket: "image-community-1b295.appspot.com",
  messagingSenderId: "1055506770124",
  appId: "1:1055506770124:web:31b39cd29066baf86dba69",
  measurementId: "G-G3K4RWE3LN",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;

const auth = firebase.auth();

export { auth, apiKey };
