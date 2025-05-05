import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Home from "@/routes/Home";
import Map from "@/routes/Map";
import AdminDatabase from "@/routes/AdminDatabase";
import ServiceRequestHub from "@/routes/ServiceRequestHub.tsx";
import AllServiceRequests from "@/routes/AllServiceRequests.tsx";
import Directions from "@/routes/Directions.tsx";
import Auth0Profile from "@/components/Auth0Profile.tsx";
import VoiceDirectory from "@/routes/VoiceDirectory.tsx";
import About from "@/routes/About.tsx";
import Citations from "@/routes/Citations.tsx";
import NotFound from "@/routes/NotFound.tsx";

import AdminSettings from "@/routes/admingSettings.tsx";

import { ProtectedRoute } from "./components/ProtectedRoute";
import NewDirections from "@/routes/NewDirections.tsx";
import MapEditor from "@/routes/MapEditor.tsx";
import EmployeeDirectory from "@/routes/EmployeeDirectory.tsx";
import Statistics from "@/routes/Statistics.tsx";

import DetailPost from '@/routes/Forum/DetailPost.tsx';

import AllPost from "@/routes/Forum/AllPost.tsx";
import HospitalDirectory from '@/routes/hospitalDirectory.tsx';
function App() {
    return (
        <div className="h-screen bg-accent flex flex-col parent">
            <BrowserRouter>
                <Routes>
                    <Route path="/gmap" element={<NewDirections />} />
                    <Route path="/emap" element={<MapEditor />} />
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Home />} />
                        {/*<Route path="directory" element={<Directions editor={false} />} />*/}
                        <Route path="directory" element={<NewDirections />} />
                        <Route path="citations" element={<Citations />} />
                        <Route path="servicerequesthub" element={<ServiceRequestHub />} />
                        {/*<Route path="hospital-directory" element={<HospitalDirectory />} />*/}
                        <Route path="admin-settings" element={<AdminSettings />} />
                        <Route path="employee-page" element={<EmployeeDirectory />} />
                        <Route path="about" element={<About />} />
                        <Route path="voice-directory" element={<VoiceDirectory />} />

                        <Route path="all-post" element={<AllPost />} />


                        {/* Protected routes wrapped in ProtectedRoute */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="admin-database" element={<AdminDatabase />} />
                            <Route path="statistics" element={<Statistics />} />
                            {/*<Route path="map-editor" element={<Directions editor={true} />} />*/}
                            <Route path="map-editor" element={<MapEditor />} />
                            <Route path="all-service-requests" element={<AllServiceRequests />} />
                            <Route path="profile" element={<Auth0Profile />} />
                        </Route>

                        <Route path="detailed-post" element={<DetailPost />} />

                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>

            </BrowserRouter>
        </div>
    );
}

export default App;


