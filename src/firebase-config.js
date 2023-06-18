// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
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
export const auth = getAuth(app);
export default app;
