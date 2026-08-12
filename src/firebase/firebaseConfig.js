import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4qAiURVOX7HABOg7-2hnQcFlx1leYf_k",
  authDomain: "dailystressmonitor.firebaseapp.com",
  projectId: "dailystressmonitor",
  storageBucket: "dailystressmonitor.firebasestorage.app",
  messagingSenderId: "1035175587807",
  appId: "1:1035175587807:web:2c949ae72605b2ada21e6a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;