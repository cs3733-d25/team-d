import React from "react";
import {useNavigate} from "react-router-dom";

const DirectoryButton: React.FC = () => {
    const navigate = useNavigate();

    const redirectToDirectory = () => {
        navigate("/directory");
    };

    return (
        <div className="">
            <button onClick={() => redirectToDirectory()}
                    className="text-2xl pd-10 border-4 border-white rounded-full text-center bg-black/30 hover:bg-black/60 text-white
                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer"
            >
                DIRECTORY
            </button>
        </div>
    )
};

export default DirectoryButton;