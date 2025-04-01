import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ExamplePage from './routes/ExamplePage.tsx';
// This is how we import pages:
import Login from './routes/Login';

function App() {
    const router = createBrowserRouter([
        // TODO: add paths for files
        {
            path: '/',
            errorElement: <div />,
            element: <ExamplePage />,
        },
        // The below is an example
        {
            path: '/login',
            errorElement: <div />,
            element: <Login />,
        },
    ]);

    return (
        <>
            {/*TODO: make navbar*/}
            {/*This will be on every page; this is probably
            just temporary until we have a more permanent
            solution but is good enough for the prototype*/}
            <p>(replace with navbar)</p>

            {/*Pages appear here*/}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
