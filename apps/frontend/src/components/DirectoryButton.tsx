import React from "react";
import {useNavigate} from "react-router-dom";

const DirectoryButton: React.FC = () => {
    const navigate = useNavigate();

    const redirectToDirectory = () => {
        navigate("/servicerequesthub");
    };

    return (
        <div className="">
            <button onClick={() => redirectToDirectory()}
                    className=" w-full border-4 border-white text-center bg-black/30 hover:bg-black/60 text-white
                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer"
            >
                REQUEST SERVICE
            </button>
        </div>
    )
};

export default DirectoryButton;