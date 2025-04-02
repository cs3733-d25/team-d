import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// import ExamplePage from './routes/ExamplePage.tsx';
// This is how we import pages:
import Login from './routes/Login';
import Directory from "./routes/Directory.tsx";
function App() {

    return (
        <>
            <Directory />
        </>
    );
}

export default App;
