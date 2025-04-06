import React from "react";
import Navbar from "@/components/Navbar";
import Map from "@/routes/Map";
import Login from "@/routes/Login";
import Directory from "@/routes/Directory";
import KioskDirections from "@/routes/KioskDirections";
import ServiceRequest from "@/routes/ServiceRequest";
import Home from "@/routes/Home";

import WithinHospital from "@/routes/WithinHospital";
import ToHospital from "@/routes/ToHospital";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Home />} />

                        {/* Existing routes */}
                        <Route path="map" element={<Map />} />
                        <Route path="login" element={<Login />} />
                        <Route path="directory" element={<Directory />} />
                        <Route path="servicerequest" element={<ServiceRequest />} />
                        <Route path="kiosk" element={<KioskDirections />} />
                        <Route path="within-hospital" element={<WithinHospital />} />
                        <Route path="to-hospital" element={<ToHospital />} />

                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

