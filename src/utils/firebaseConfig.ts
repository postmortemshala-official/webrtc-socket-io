// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKspdx9udn446GUAxLt7DSjM52lRJkYuw",
  authDomain: "seekmeet-f13be.firebaseapp.com",
  databaseURL: "https://seekmeet-f13be-default-rtdb.firebaseio.com",
  projectId: "seekmeet-f13be",
  storageBucket: "seekmeet-f13be.appspot.com",
  messagingSenderId: "139120121543",
  appId: "1:139120121543:web:122713b3824ec5260f10e2",
  measurementId: "G-R3DHKDNXSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app