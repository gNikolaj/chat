import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCc6SqVVwGMvDlLFDRCBIK5sSglJgc1_ew",
    authDomain: "chat-react-2af08.firebaseapp.com",
    projectId: "chat-react-2af08",
    storageBucket: "chat-react-2af08.appspot.com",
    messagingSenderId: "625003476912",
    appId: "1:625003476912:web:68b6b81a3624c5dd310875",
    measurementId: "G-55CKY9JC14"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const firestore = getFirestore(app);

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Context.Provider value={{
        auth,
        firestore
    }}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Context.Provider>

);
