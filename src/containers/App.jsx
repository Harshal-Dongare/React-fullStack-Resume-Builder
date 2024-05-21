import React, { Suspense } from "react";

// Import React Router
import { Routes, Route } from "react-router-dom";

// Import React Query
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Import Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Authentication, HomeScreen } from "../pages";

const App = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {/* Suspense component displays a fallback UI until the data is fetched. */}
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/*" element={<HomeScreen />} />
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </Suspense>

            {/* Toast Container for animated notifications */}
            <ToastContainer
                position="top-right"
                theme="dark"
                draggable
                newestOnTop
            />

            {/* React Query Devtools */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;

/*
 * `Suspense` component helps manage the loading states of components that asynchronously fetch data.
 * When components are waiting for data, React will display a fallback UI until the data is fetched and component can be fully rendered.
 * React automatically manages the transition between the fallback UI and the actual component UI based on the state of the asynchronous operation.(loading state, success state and error state)

 * `Routes` used for grouping multiple Route components together.

 * `Route` used for defining different route in your application. Each Route component will be rendered when the URL matches its path.

 * `QueryClientProvider` 

 * `ReactQueryDevtools` used for displaying the React Query state in the browser.
 */
