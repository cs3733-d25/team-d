import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-1000 transition"
            >
                Back to Home
            </Link>
        </main>
    );
};

export default NotFound;
