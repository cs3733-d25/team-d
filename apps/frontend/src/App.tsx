import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Home from "@/routes/Home";
import Map from "@/routes/Map";
import Directory from "@/routes/Directory";
import KioskDirections from "@/routes/KioskDirections";
import ServiceRequest from "@/routes/ServiceRequest";
import WithinHospital from "@/routes/WithinHospital";
import ToHospital from "@/routes/ToHospital";
import AdminDatabase from "@/routes/AdminDatabase";
import ServiceRequestHub from "@/routes/ServiceRequestHub.tsx";
import AllServiceRequests from "@/routes/AllServiceRequests.tsx";
import GoogleMap from "@/components/map/GoogleMap.tsx";
import GGMap from "@/GoogleMap/GoogleMap.tsx";
import Directions from "@/routes/Directions.tsx";

function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="gmap" element={<Directions />} />
                    <Route path="/" element={<Navbar isLoggedIn={false} />}>
                        <Route index element={<Home />} />
                        <Route path="map" element={<Map />} />
                        <Route path="directory" element={<Directory />} />
                        <Route path="within-hospital" element={<WithinHospital />} />
                        <Route path="to-hospital" element={<ToHospital />} />
                        <Route path="servicerequesthub" element={<ServiceRequestHub />} />


                    </Route>

                    <Route path="/loggedIn" element={<Navbar isLoggedIn={true} />}>
                        <Route index element={<Home />} />

                        <Route path="map" element={<Map />} />
                        <Route path="directory" element={<Directory />} />
                        <Route path="servicerequest" element={<ServiceRequest />} />
                        <Route path="servicerequesthub" element={<ServiceRequestHub />} />
                        <Route path="kiosk" element={<KioskDirections />} />
                        <Route path="within-hospital" element={<WithinHospital />} />
                        <Route path="to-hospital" element={<ToHospital />} />
                        <Route path="admin-database" element={<AdminDatabase />} />
                        <Route path="all-service-requests" element={<AllServiceRequests />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;


