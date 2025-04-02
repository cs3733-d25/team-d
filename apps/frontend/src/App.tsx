import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EmailInputPage from './routes/EmailInputPage';
import Login from './routes/Login';
import ServiceRequest from './routes/ServiceRequest';
import Map from './routes/Map';



function App() {
    const router = createBrowserRouter([
        // Route for the Email Input Page (first page)
        {
            path: '/emailinputpage',
            errorElement: <div />,
            element: <EmailInputPage />,  // Email input page where the user enters the email
        },
        // Route for the Login Page (second page for password input)
        {
            path: '/login',
            errorElement: <div />,
            element: <Login />,  // Login page where the user enters the password
        },
        // Route for ServiceRequest (employees)
        {
            path: '/service-request',
            errorElement: <div />,
            element: <ServiceRequest />,  // Employee page after successful login
        },
        // Route for Map (patients)
        {
            path: '/map',
            errorElement: <div />,
            element: <Map />,  // Patient page after successful login
        },
    ]);

    return (
        <>
            {/* Temporary placeholder for navbar (can be updated later) */}
            <p>(replace with navbar)</p>

            {/* This will render the corresponding page based on the current path */}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
