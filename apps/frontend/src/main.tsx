import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// This is how we import pages:
import Login from './routes/Login.tsx';
import Map from './routes/Map.tsx';
import Directory from './routes/Directory.tsx';
import ServiceRequest from './routes/ServiceRequest.tsx';
import Navbar from "./components/Navbar.tsx";


// Entry point where root component is rendered into the DOM
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index={true} element={<App />} />

                        {/*waiting for login page*/}
                        {/*<Route*/}
                        {/*    index={false}*/}
                        {/*    path="/login"*/}
                        {/*    element={<Login />}*/}
                        {/*/>*/}

                        <Route
                            index={false}
                            path="/map"
                            element={<Map />}
                        />

                        <Route
                            index={false}
                            path="/map"
                            element={<Map />}
                        />

                        <Route
                            index={false}
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            index={false}
                            path="/directory"
                            element={<Directory />}
                        />

                        <Route
                            index={false}
                            path="/servicerequest"
                            element={<ServiceRequest />}
                        />


                        {/*<Route path="*" element={<NotFound />} />*/}

                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    </React.StrictMode>
);
