import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

type Algo = {
    algorithmId: number;
    name: string;
    isActive: boolean;
};

const AlgorithmSettings = () => {
    const [algorithms, setAlgorithms] = useState<Algo[]>([]);
    const [selectedName, setSelectedName] = useState<string>("");
    const [activeName, setActiveName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlgorithms = async () => {
            try {
                const res = await axios.get("/api/pathfind/algorithm");
                const data: Algo[] = res.data;
                setAlgorithms(data);
                const activeAlgo = data.find((a) => a.isActive);
                if (activeAlgo) {
                    setSelectedName(activeAlgo.name);
                    setActiveName(activeAlgo.name);
                }
            } catch (err) {
                console.error("Failed to fetch algorithms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlgorithms();
    }, []);

    const saveAlgorithm = async () => {
        try {
            const res = await axios.put(`/api/pathfind/algorithm/${selectedName}`);
            console.log("Algorithm updated:", res.data.message);
            setActiveName(selectedName);
        } catch (error) {
            console.error("Failed to update algorithm:", error);
            alert("Something went wrong while updating the algorithm");
        }
    };

    if (loading) return <p className="text-gray-500">Loading algorithm...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Select Pathfinding Algorithm</h1>
            <div className="flex gap-4 mb-6">
                {algorithms.map((algo) => (
                    <Button
                        key={algo.name}
                        variant="ghost"
                        className={`transition-all ${
                            selectedName === algo.name
                                ? "bg-blue-800 text-white shadow-lg"
                                : "bg-blue-100 text-blue-900 hover:bg-blue-300"
                        }`}
                        onClick={() => setSelectedName(algo.name)}
                    >
                        {algo.name}
                    </Button>
                ))}
            </div>
            <Button
                className="bg-blue-900 text-white hover:bg-blue-800"
                onClick={saveAlgorithm}
                disabled={selectedName === activeName}
            >
                Save Changes
            </Button>
        </div>
    );
};

export default AlgorithmSettings;
