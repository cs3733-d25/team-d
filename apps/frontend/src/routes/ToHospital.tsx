import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ToHospital: React.FC = () => {
    const navigate = useNavigate();

    // Start & End inputs
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("Chestnut Hill");

    return (
        <div className="min-h-screen bg-white">
            {/* Top Buttons */}
            <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-center">
                <div className="flex gap-4">
                    <Button onClick={() => navigate("/to-hospital")}>To Hospital</Button>
                    <Button onClick={() => navigate("/within-hospital")}>
                        Within Hospital
                    </Button>
                </div>
            </header>

            <main className="px-6 py-4">
                <div className="grid grid-cols-10 gap-6">
                    <div className="col-span-10 md:col-span-3 border rounded-md p-4 bg-white shadow">
                        {/* Start location input */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Start Location</label>
                            <input
                                type="text"
                                value={startLocation}
                                onChange={(e) => setStartLocation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter your starting address"
                            />
                        </div>

                        {/* End location input (default = "Chestnut Hill") */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Destination</label>
                            <input
                                type="text"
                                value={endLocation}
                                onChange={(e) => setEndLocation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Chestnut Hill"
                            />
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="col-span-10 md:col-span-7 border rounded-md p-4 bg-white shadow flex items-center justify-center">
                        <p className="text-gray-500">(Map goes here)</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ToHospital;
