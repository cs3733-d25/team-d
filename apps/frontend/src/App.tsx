import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
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


            {/*Pages appear here*/}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
