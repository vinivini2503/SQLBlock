// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlg_zXFlKXm0Lk5_jmhdcLbkkC-oklb9s",
  authDomain: "sqlblock-20e1c.firebaseapp.com",
  projectId: "sqlblock-20e1c",
  storageBucket: "sqlblock-20e1c.firebasestorage.app",
  messagingSenderId: "862499633137",
  appId: "1:862499633137:web:9e96d7be3e6d826110b650",


  measurementId: "G-340T13ZG6V"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Opcional — apenas se quiser usar o Analytics
const analytics = getAnalytics(app);

export { app, analytics };
