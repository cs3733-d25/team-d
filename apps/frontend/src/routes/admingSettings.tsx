import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Panel = "profile" | "algorithms" | "directory";
type Algo = "BFS" | "DFS";

const AdminSettings: React.FC = () => {
    const [activePanel, setActivePanel] = useState<Panel>("profile");
    const [algorithm, setAlgorithm] = useState<Algo>("BFS");

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
                    <p className="text-xl text-gray-700">
                        Edit profile functionality coming soon…
                    </p>
                )}

                {activePanel === "algorithms" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-6">
                            Select Pathfinding Algorithm
                        </h1>
                        <div className="flex gap-4">
                            {(["BFS", "DFS"] as Algo[]).map((algo) => (
                                <Button
                                    key={algo}
                                    variant="ghost"
                                    className={
                                        algorithm === algo
                                            ? "bg-blue-900 text-white"
                                            : "bg-gray-200"
                                    }
                                    onClick={() => setAlgorithm(algo)}
                                >
                                    {algo}
                                </Button>
                            ))}
                        </div>
                    </div>
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
