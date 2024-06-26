import React from "react";
import { Link } from "react-router-dom";

// Assets
import { Logo } from "../assets";

const Footer = () => {
    return (
        <div className="w-full flex items-center justify-between border-t border-gray-300">
            {/* Left Section: website logo and brand name */}
            <div className="flex items-center justify-center gap-3 py-3">
                <img src={Logo} alt="" className="w-8 h-auto object-contain" />
                <p>CraftResume</p>
            </div>

            {/* Right Section: footer nav links */}
            <div className="flex items-center justify-center gap-6 py-3">
                <Link to={"/"} className="text-blue-700 text-sm">
                    Home
                </Link>
                <Link to={"/"} className="text-blue-700 text-sm">
                    Contact
                </Link>
                <Link
                    to={"/"}
                    className="text-blue-700 text-sm whitespace-nowrap"
                >
                    Privacy Policy
                </Link>
            </div>
        </div>
    );
};

export default Footer;
