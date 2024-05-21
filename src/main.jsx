import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "./containers";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>
);

/*
 * `BrowserRouter` is a component that enables client-side routing functionality. It listen for changes in the Browser's URL and renders the appropriate components based on the URL.
 */
