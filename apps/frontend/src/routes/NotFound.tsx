import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main style={{ color: "black", padding: "1rem" }}>
            <h1>404</h1>
            <p>There's nothing here!</p>
            <Link style={{ color: "black" }} to="/">
                Back to Home
            </Link>
        </main>
    );
};

export default NotFound;
