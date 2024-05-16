import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.VITE_APP_ID,
};

// Firebase App Initialization Check and Setup
/**
 * Check if there is already an app initialized, if not, then create a new one
 * using the configuration object passed.
 *
 * @param {Object} firebaseConfig - The configuration object for the app
 * @returns {FirebaseApp} - The app instance
 */
const app =
    getApps.length > 0
        ? getApp() // if there is an app, return it
        : initializeApp(firebaseConfig); // if not, create a new one and return it

/**
 * Initializes the Firebase Authentication service using the getAuth function with the Firebase app instance app.
 * It allows you to use Firebase Authentication features in your application.*/
const auth = getAuth(app);

/** Initialize the Firebase Firestore database service which allows you to interact with the Firestore database in your application. */
const db = getFirestore(app);

export { auth, db };
