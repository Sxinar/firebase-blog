import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCWr0zm5e_XCINabRUp5_u8OaHyK04Dlqs",
    authDomain: "semik-gunce.firebaseapp.com",
    projectId: "semik-gunce",
    storageBucket: "semik-gunce.firebasestorage.app",
    messagingSenderId: "327349299120",
    appId: "1:327349299120:web:e2e900af89014645129875"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
