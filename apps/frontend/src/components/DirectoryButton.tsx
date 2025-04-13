import React from "react";
import {useNavigate} from "react-router-dom";

const DirectoryButton: React.FC = () => {
    const navigate = useNavigate();

    const redirectToDirectory = () => {
        navigate("/directory");
    };

    return (
        <div className="border-4 border-white rounded-full text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-800 p-4">
            <button onClick={redirectToDirectory} className="font-nunito text-xl">DIRECTORY</button>
        </div>
    )
};

export default DirectoryButton;