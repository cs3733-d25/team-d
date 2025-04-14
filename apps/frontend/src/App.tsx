import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Home from "@/routes/Home";
import Map from "@/routes/Map";
import Directory from "@/routes/Directory";
import KioskDirections from "@/routes/KioskDirections";
import WithinHospital from "@/routes/WithinHospital";
import ToHospital from "@/routes/ToHospital";
import AdminDatabase from "@/routes/AdminDatabase";
import ServiceRequestHub from "@/routes/ServiceRequestHub.tsx";
import AllServiceRequests from "@/routes/AllServiceRequests.tsx";
import GoogleMap from "@/components/map/GoogleMap.tsx";
import GGMap from "@/GoogleMap/GoogleMap.tsx";
import Directions from "@/routes/Directions.tsx";
import Auth0Profile from "@/components/Auth0Profile.tsx";

import { ProtectedRoute } from "./components/ProtectedRoute";
import SanitationRequest from "@/components/SanitationRequest.tsx";

function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Home />} />
                        <Route path="map" element={<Map />} />
                        <Route path="directory" element={<Directory />} />
                        <Route path="within-hospital" element={<WithinHospital />} />
                        <Route path="to-hospital" element={<ToHospital />} />
                        <Route path="servicerequesthub" element={<ServiceRequestHub />} />

                        {/* Protected routes wrapped in ProtectedRoute */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="admin-database" element={<AdminDatabase />} />
                            <Route path="all-service-requests" element={<AllServiceRequests />} />
                            <Route path="profile" element={<Auth0Profile />} />

                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;


