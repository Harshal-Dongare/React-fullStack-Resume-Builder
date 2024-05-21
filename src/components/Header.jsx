// Dependencies
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { useQueryClient } from "react-query";

// Custom hooks
import useUser from "../hooks/useUser";

// Utility functions and configuration
import { fadeInOutWithOpacity, slideUpDownMenuAnimation } from "../animations";

import { auth } from "../config/firebase.config";

// Assets
import { Logo } from "../assets";
import { HiLogout } from "react-icons/hi";
import { adminIds } from "../utils/helpers";

const Header = () => {
    const { data, isLoading, isError } = useUser();
    const [isMenu, setIsMenu] = useState(false);

    const queryClient = useQueryClient();

    // Sign out user handler
    const signOutUser = async () => {
        await auth.signOut().then(() => {
            // if successfully logged out, update the query client state
            queryClient.setQueryData("user", null);
        });
    };

    return (
        <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky">
            {/* logo */}
            <Link to={"/"}>
                <img src={Logo} alt="" className="w-8 h-auto object-contain" />
            </Link>

            {/* Input field for search option */}
            <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
                />
            </div>

            {/* User Profile section */}
            <AnimatePresence>
                {isLoading ? (
                    // Show loading animation while data is being fetched
                    <PuffLoader color="#498FCD" size={40} />
                ) : (
                    // Once data is fetched Show user profile section
                    <React.Fragment>
                        {/* If data is present show userInfo */}
                        {data ? (
                            <motion.div
                                {...fadeInOutWithOpacity}
                                className="relative"
                                onClick={() => setIsMenu(!isMenu)}
                            >
                                {/* Show user profile-image */}
                                {data?.photoURL ? (
                                    <div className="w-12 h-12 rounded-md relative flex items-center justify-center">
                                        <img
                                            src={data?.photoURL}
                                            className="w-full h-full object-cover rounded-md cursor-pointer"
                                            referrerPolicy="no-referrer"
                                            alt=""
                                        />
                                    </div>
                                ) : (
                                    // If user profile-image is not present show first letter of username
                                    <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                                        <p className="text-lg text-white">
                                            {data?.displayName[0].toUpperCase()}
                                        </p>
                                    </div>
                                )}

                                {/* Drop down menu for user profile */}
                                <AnimatePresence>
                                    {isMenu && (
                                        <motion.div
                                            // When mouse leaves the menu, menu will be closed
                                            onMouseLeave={() =>
                                                setIsMenu(false)
                                            }
                                            // Animations
                                            {...slideUpDownMenuAnimation}
                                            className="absolute px-4 py-3 rounded-md bg-white shadow-md right-0 top-12 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                                        >
                                            {/* Image */}
                                            {/* Show user profile-image if it is present */}
                                            {data?.photoURL ? (
                                                <div className=" w-20 h-20 rounded-full relative flex flex-col items-center justify-center">
                                                    <img
                                                        src={data?.photoURL}
                                                        className="w-full h-full object-cover rounded-full cursor-pointer"
                                                        referrerPolicy="no-referrer"
                                                        alt=""
                                                    />
                                                </div>
                                            ) : (
                                                // If user profile-image is not present show first letter of username
                                                <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                                                    <p className="text-3xl text-white">
                                                        {data?.displayName[0]}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Username */}
                                            {data?.displayName && (
                                                <p className="text-lg text-txtDark">
                                                    {data?.displayName}
                                                </p>
                                            )}

                                            {/* Menu Section */}
                                            <div className="w-full flex flex-col items-start gap-8 pt-6">
                                                <Link
                                                    className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                                                    to={"/profile"}
                                                >
                                                    My Account
                                                </Link>

                                                {/* Below option is for ADMIN ONLY whose Id matches with the Id of the user who logged in. */}
                                                {adminIds.includes(
                                                    data?.uid
                                                ) && (
                                                    <Link
                                                        className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                                                        to={"/template/create"}
                                                    >
                                                        Add New Template
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Sign out option */}
                                            <div
                                                className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between cursor-pointer group"
                                                onClick={signOutUser}
                                            >
                                                <p className="group-hover:text-txtDark text-txtLight">
                                                    Sign out
                                                </p>
                                                <HiLogout className="group-hover:text-txtDark text-txtLight" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            // If data is not present show `login` button which will redirect to Authentication page
                            <Link to={"/auth"}>
                                <motion.button
                                    className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                                    type="button"
                                    {...fadeInOutWithOpacity}
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

/*
 * Inside Header component, firstly we need to fetch the registered user data and show it in the Header.
 * With the help of `useUser()` custom hook, we can fetch the user data and display it in the Header.

 * We need to show animation loader on the right side while user data is being fetched in the header.
 * When you add or remove components from the DOM, <AnimatePresence/> makes sure the animations for entering and exiting are smooth and visually appealing.

 * AnimatePresence: It watches for components being added or removed from the DOM.
 * motion.div: Defines how each component should animate when it enters or exits the DOM.
 * motion.button: Works similarly to motion.div, but it applies animation capabilities specifically to a <button> element.
 */
