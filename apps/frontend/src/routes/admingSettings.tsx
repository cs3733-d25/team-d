
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
type Panel = "profile" | "algorithms" | "directory";
import AlgorithmSettings from "@/components/AlgorithmSettings.tsx";
import { Textarea } from "@/components/ui/Textarea"
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

// const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     dob: "",
//     username: "",
//     email: "",
//     phone: "",
//     address: ""
// });
//
// const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//         ...prev,
//         [field]: value
//     }));
// };
//

const AdminSettings: React.FC = () => {
    const [activePanel, setActivePanel] = useState<Panel>("profile");
    const [algorithm, setAlgorithm] = useState<string>("BFS");


    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-3/12 min-w-[220px] border-r border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        className={`justify-start ${
                            activePanel === "profile"
                                ? "bg-blue-900 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("profile")}
                    >
                        Edit Profile
                    </Button>

                    <Button
                        variant="ghost"
                        className={`justify-start ${
                            activePanel === "algorithms"
                                ? "bg-blue-900 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("algorithms")}
                    >
                        Change Pathfinding Algorithm
                    </Button>

                    <Button
                        variant="ghost"
                        className={`justify-start ${
                            activePanel === "directory"
                                ? "bg-blue-900 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("directory")}
                    >
                        Edit Directory
                    </Button>
                </div>
            </aside>

            {/* Main pane */}
            <main className="w-9/12 p-10">
                {activePanel === "profile" && (
                    <p className="flex flex-col text-xl text-black gap-y-4">
                        Personal Information
                        <div className="flex flex-col gap-y-4">
                            First Name
                            <Textarea
                                placeholder="First Name..."
                                // value={formData.firstName}
                                // onChange={(e) => handleChange("firstName", e.target.value)}
                            />

                            Last Name
                            <Textarea
                                placeholder="Last Name..."
                                // value={formData.firstName}
                                // onChange={(e) => handleChange("lastName", e.target.value)}
                            />

                            Date of Birth
                           <input
                               type="date"
                               className="border rounded p-2"
                               placeholder="Date of Birth"
                              // value={formData.dob}
                              // onChange={(e) => handleChange("dob", e.target.value)}
                           />

                            Username
                            <Textarea
                                placeholder="Username..."
                               // value={formData.firstName}
                               // onChange={(e) => handleChange("userName", e.target.value)}
                            />

                            Email
                            <Textarea
                                placeholder="Email..."
                               // value={formData.firstName}
                               // onChange={(e) => handleChange("email", e.target.value)}
                            />

                            Phone Number
                            <Textarea
                                placeholder="Phone Number..."
                               // value={formData.firstName}
                               // onChange={(e) => handleChange("phone", e.target.value)}
                            />

                            Address
                            <Textarea
                                placeholder="Address..."
                              //  value={formData.firstName}
                              //  onChange={(e) => handleChange("address", e.target.value)}
                            />

                            <Button
                                className="bg-blue-700 text-white hover:bg-blue-900 mt-6"
                               // onClick={() => console.log("Submitted form data:", formData)}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </p>
                )}

                {activePanel === "algorithms" && (
                    // <div>
                    //     <h1 className="text-2xl font-bold mb-6">
                    //         Select Pathfinding Algorithm
                    //     </h1>
                    //     <div className="flex gap-4">
                    //         {(["BFS", "DFS"] as Algo[]).map((algo) => (
                    //             <div>
                    //                 <Button
                    //                     key={algo}
                    //                     variant="ghost"
                    //                     className={
                    //                         algorithm === algo
                    //                             ? "bg-blue-900 text-white"
                    //                             : "bg-gray-200"
                    //                     }
                    //                     onClick={() => setAlgorithm(algo)}
                    //                 >
                    //                     {algo}
                    //                 </Button>
                    //
                    //
                    //             </div>
                    //
                    //         ))}
                    //     </div>
                    //     <Button onClick={async () => {
                    //         try {
                    //             const res = await axios.put(`/algorithm/${algorithm}`);
                    //             console.log("Algorithm updated:", res.data.message);
                    //         } catch (error) {
                    //             console.error("Failed to update algorithm:", error);
                    //             alert("Something went wrong while updating the algorithm");
                    //         }
                    //     }}>
                    //         Save Changes
                    //     </Button>
                    // </div>
                    <AlgorithmSettings />
                )}

                {activePanel === "directory" && (
                    <p className="text-xl text-gray-700">
                        Edit directory functionality coming soon…
                    </p>
                )}
            </main>
        </div>
    );
};

export default AdminSettings;
