import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedMap from "@/components/ui/animatedMap.tsx";

const MapButton: React.FC = () => {
    const navigate = useNavigate();

    const redirectToMaps = () => {
        navigate("/directory");
    };

    return (
        <button
            onClick={() => navigate("/directory")}
            className="w-full border-4 border-white rounded-b-lg text-center bg-black/30 hover:bg-black/60 text-white
            animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer"
        >
            DIRECTIONS
        </button>
    );
};

export default MapButton;
