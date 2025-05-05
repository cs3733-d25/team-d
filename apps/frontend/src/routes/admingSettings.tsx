
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
type Panel = "profile" | "algorithms" | "directory";
import AlgorithmSettings from "@/components/AlgorithmSettings.tsx";
import { Textarea } from "@/components/ui/Textarea"
import EmployeeInfoSettings from "@/components/EmployeeInfoSettings.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import AdminDatabase from '@/routes/AdminDatabase.tsx';

const AdminSettings: React.FC = () => {
    const [activePanel, setActivePanel] = useState<Panel>("profile");
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

                    {/*<Button*/}
                    {/*    variant="ghost"*/}
                    {/*    className={`justify-start ${*/}
                    {/*        activePanel === "directory"*/}
                    {/*            ? "bg-blue-900 text-white"*/}
                    {/*            : "bg-gray-200"*/}
                    {/*    }`}*/}
                    {/*    onClick={() => setActivePanel("directory")}*/}
                    {/*>*/}
                    {/*    Edit Directory*/}
                    {/*</Button>*/}
                </div>
            </aside>

            {/* Main pane */}
            <main className="w-9/12 p-10">
                {activePanel === "profile" && (
                    <EmployeeInfoSettings />
                )}

                {activePanel === "algorithms" && (
                    <AlgorithmSettings />
                )}

                {/*{activePanel === "directory" && (*/}
                {/*    <AdminDatabase />*/}
                {/*)}*/}
            </main>
        </div>
    );
};

export default AdminSettings;
