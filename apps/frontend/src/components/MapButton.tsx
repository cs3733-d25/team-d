import React from "react";
import AnimatedMap from "@/components/ui/animatedMap.tsx";

const MapButton: React.FC = () => {
    const redirectToMaps = () => {
        window.location.href = "/directory";
    };

    return (
        <div>
            <button onClick={redirectToMaps}
                    className="flex flex-col items-center border-4 w-65 rounded-lg border-white text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-500 font-nunito hover:scale-110 cursor-pointer"
            >
                <div className="bg-white border-white w-full">
                    <AnimatedMap/>
                </div>

                <div className="p-4 w-full">
                    DIRECTIONS
                </div>
            </button>
        </div>
    )
};

export default MapButton;
