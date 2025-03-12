import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAB3QY1QBZA9YL0NuSt_CwNaJ-r1chP-oM",
  authDomain: "crud-firebasereact-de99f.firebaseapp.com",
  projectId: "crud-firebasereact-de99f",
  storageBucket: "crud-firebasereact-de99f.firebasestorage.app",
  messagingSenderId: "5767388757",
  appId: "1:5767388757:web:6a0e9f2996223bcbd3bedc"
};

const app = initializeApp(firebaseConfig);

 const db = getFirestore(app)

 export default db;
