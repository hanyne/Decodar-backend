// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCmAFIDoYbuCC5ndHWcsFPcSdnmubBUIg",
  authDomain: "decodar-55d7e.firebaseapp.com",
  projectId: "decodar-55d7e",
  storageBucket: "decodar-55d7e.appspot.com",
  messagingSenderId: "701345245494",
  appId: "1:701345245494:web:5e3acba78f815cfca6eb97",
  measurementId: "G-VZLPTBR8MJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const storage = getStorage(app)