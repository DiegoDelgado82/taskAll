import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC7mybBEz7O2l_R8NQArvwxeCXmtWSQ9Ig",
    authDomain: "checklistapp-a3b43.firebaseapp.com",
    databaseURL: "https://checklistapp-a3b43-default-rtdb.firebaseio.com",
    projectId: "checklistapp-a3b43",
    storageBucket: "checklistapp-a3b43.firebasestorage.app",
    messagingSenderId: "981613208239",
    appId: "1:981613208239:web:bf201cc99a83a639fb6a5a"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
