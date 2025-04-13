import React from "react";
import {useNavigate} from "react-router-dom";

const MapButton: React.FC = () => {
    const navigate = useNavigate();

    const redirectToMaps = () => {
        navigate("/map");
    };

    return (
        <div className="border-4 border-white rounded-full text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-800 p-4">
            <button onClick={redirectToMaps} className="font-nunito text-xl">MAPS</button>
        </div>
    )
};

export default MapButton;