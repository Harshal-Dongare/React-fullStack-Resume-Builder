// Import Firebase
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithRedirect,
} from "firebase/auth";

// Firebase config file
import { auth } from "../config/firebase.config";

// Assets
import { FaChevronRight } from "react-icons/fa";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
    // Authentication instances
    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    /**
     * Handles the button click event for each auth provider.
     * Switches on the provider and executes a provided function.
     * @param {string} provider The provider that was clicked. Currently,
     * supported providers are "GoogleAuthProvider" and "GithubAuthProvider".
     */
    const handleClick = async () => {
        switch (provider) {
            //  Redirects users to external sign-in page of Google for authentication.
            case "GoogleAuthProvider":
                await signInWithRedirect(auth, googleAuthProvider)
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((err) => {
                        console.log(`Error: ${err.Message}`);
                    });
                break;

            //  Redirects users to external sign-in page of Google for authentication.
            case "GithubAuthProvider":
                await signInWithRedirect(auth, githubAuthProvider)
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((err) => {
                        console.log(`Error: ${err.Message}`);
                    });
                break;

            default:
                await signInWithRedirect(auth, googleAuthProvider)
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((err) => {
                        console.log(`Error: ${err.Message}`);
                    });
                break;
        }
    };

    return (
        <div
            onClick={handleClick}
            className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
        >
            {/* Icon */}
            <Icon className="text-txtPrimary text-xl group-hover:text-white" />

            {/* Label */}
            <p className="text-txtPrimary text-lg group-hover:text-white">
                {label}
            </p>

            {/* Chevron Icon */}
            <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
        </div>
    );
};

export default AuthButtonWithProvider;
