import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        //* After successful login using google or Github, we get user credentials
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            //* if we get user credentials
            if (userCred) {
                const userData = userCred.providerData[0];

                //* onSnapshot() is a listener constantly listening to the specific collection whether data is modified or deleted or data is being inserted
                //* Once data is fetched, make sure that that user is register in our website(firestore) or not
                const unsubscribe = onSnapshot(
                    //* Get a reference to the document with the user ID in the 'users' collection
                    doc(db, "users", userData?.uid),

                    //* Callback function triggered when the document changes
                    (_doc) => {
                        //* If the document(user) exists in the collection, return the data
                        if (_doc.exists()) {
                            resolve(_doc.data());
                        } else {
                            //* if user/document doesn't exists, push new one
                            //* Create a new user/document with the user ID and userData
                            setDoc(
                                doc(db, "users", userData?.uid),
                                userData
                            ).then(() => {
                                resolve(userData);
                            });
                        }
                    }
                );

                return unsubscribe;
            } else {
                reject(new Error("User is not authenticated"));
            }

            // Make sure to unsubscribe from the listener to prevent memory leaks
            unsubscribe();
        });
    });
};
