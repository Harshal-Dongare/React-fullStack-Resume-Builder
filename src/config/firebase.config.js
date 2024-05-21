import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.VITE_APP_ID,
};

// Initialize Firebase App
const app =
    getApps.length > 0
        ? getApp() // if there is an app, return it
        : initializeApp(firebaseConfig); // if not, create a new one and return it

/*
 * Initializes the `Firebase Authentication Service` using the getAuth function with the Firebase app instance app.
 * It allows you to use `Firebase Authentication features` such as Email/Password authentication, Social Authentication in your application.
 */
const auth = getAuth(app);

/*
 * Initialize the `Firebase Firestore Database Service` which allows you to interact with the Firestore database in your application.
 */
const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
