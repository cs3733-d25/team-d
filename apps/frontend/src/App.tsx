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
import ServiceRequestHub from "@/routes/ServiceRequestHub";
import AllServiceRequests from "@/routes/AllServiceRequests";
import SanitationRequest from "@/components/SanitationRequest.tsx";

function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
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
                        <Route path="sanitation" element={<SanitationRequest />} />
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


