import React, { useEffect } from "react";
import { Logo } from "../assets";
import { Footer } from "../containers";
import { AuthButtonWithProvide, MainSpinner } from "../components";

import { FaGoogle, FaGithub } from "react-icons/fa";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
    // Custom hook: useUser()
    const { data, isLoading, isError } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        //* if data is already loaded and user is logged in
        if (!isLoading && data) {
            //* When the replace option is set to true, navigating to a new location won't add a new entry to the browser's history stack. Instead, it replaces the current entry with the new location.
            //* This prevents users from going back to the login page after successful login even though user tries to go back to the login page.
            navigate("/", { replace: true });
        }
    }, [isLoading, data]);


    //* Loader animation
    if( isLoading ) {
        return <MainSpinner />
    }

    return (
        <div className="auth-section">
            {/* Head section of auth */}
            <img src={Logo} alt="" className="w-12 h-auto object-contain" />

            {/* Body section of auth */}
            <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
                <h1 className="text-3xl lg:text-4xl text-blue-700">
                    Welcome to CraftResume
                </h1>
                <p className="text-base text-gray-600">
                    Craft Your Career Story
                </p>
                <h1 className="text-2xl text-gray-600">Authenticate</h1>
                <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-start gap-6">
                    <AuthButtonWithProvide
                        Icon={FaGoogle}
                        label={"Sign in with Google"}
                        provider={"GoogleAuthProvider"}
                    />
                    <AuthButtonWithProvide
                        Icon={FaGithub}
                        label={"Sign in with Github"}
                        provider={"GithubAuthProvider"}
                    />
                </div>
            </div>

            {/* Footer section of auth */}
            <Footer />
        </div>
    );
};

export default Authentication;
