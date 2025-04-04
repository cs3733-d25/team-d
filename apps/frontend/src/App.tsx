import React from 'react';
import Navbar from "@/components/Navbar.tsx";
import Map from "@/routes/Map.tsx";
import Login from "@/routes/Login.tsx";
import Directory from "@/routes/Directory.tsx";
import ServiceRequest from "@/routes/ServiceRequest.tsx";
import Home from "@/routes/Home.tsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route
                            index={true}
                            element={<Home />} />

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
    );
}

export default App;
