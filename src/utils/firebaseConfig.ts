// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

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

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Realtime Database
const database = getDatabase(app);

export { app, database, firestore };
