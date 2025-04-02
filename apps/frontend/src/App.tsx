import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// This is how we import pages:
import Login from './routes/Login.tsx';
import Map from './routes/Map.tsx';
import Directory from './routes/Directory.tsx';
import ServiceRequest from './routes/ServiceRequest.tsx';

    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <div />,
            element: <Login />,
        },
        // The below is an example
        {
            path: '/map',
            errorElement: <div />,
            element: <Map />,
        },
        {
            path: '/directory',
            errorElement: <div />,
            element: <Directory />,
        },
        {
            path: '/servicerequest',
            errorElement: <div />,
            element: <ServiceRequest />,
        },
    ]);
    function App() {
    return (
        <>
            <nav>
                <a href="/">Login</a>
                <a href="/map">Map</a>
                <a href="/directory">Directory</a>
                <a href="/servicerequest">Service Request</a>
            </nav>


            {/*Pages appear here*/}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
