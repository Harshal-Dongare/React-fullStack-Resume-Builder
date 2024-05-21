// Dependencies
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Components
import { Header, MainSpinner } from "../components";
import { HomeContainer } from "../containers";
import {
    CreateResume,
    CreateTemplate,
    TemplateDesignPinDetails,
    UserProfile,
} from "../pages";

const HomeScreen = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Header Section of Home Screen */}
            <Header />

            {/* Main section of the Home Screen which contains custom routes */}
            <main className="w-full">
                <Suspense fallback={<MainSpinner />}>
                    <Routes>
                        {/* Default route */}
                        <Route path="/" element={<HomeContainer />} />

                        {/* For ADMIN only route to create Resume Template*/}
                        <Route
                            path="/template/create"
                            element={<CreateTemplate />}
                        />

                        {/* For registered USER only route */}
                        <Route path="/profile/:uid" element={<UserProfile />} />

                        {/* Create Resume Route */}
                        <Route
                            path="/createResume/*"
                            element={<CreateResume />}
                        />

                        {/* Resume Template Details */}
                        <Route
                            path="resumeDetails/:templateID"
                            element={<TemplateDesignPinDetails />}
                        />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
};

export default HomeScreen;
