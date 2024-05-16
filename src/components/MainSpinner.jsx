import React from "react";
import { PuffLoader } from "react-spinners";

const MainSpinner = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <PuffLoader color="#498FCD" size={100} />
        </div>
    );
};

export default MainSpinner;
