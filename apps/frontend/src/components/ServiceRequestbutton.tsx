import React from "react";
import {useNavigate} from "react-router-dom";
import AnimatedService from "@/components/ui/animatedService.tsx";

const serviceRequest: React.FC = () => {
    const navigate = useNavigate();

    const redirectToServiceRequest = () => {
        navigate("/servicerequesthub");
    };
//
    return (
        <div>
            <button onClick={() => redirectToServiceRequest()}
                    className="flex flex-col items-center border-4 w-65 rounded-lg border-white text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-500 font-nunito hover:scale-110 cursor-pointer"
            >
                <div className="bg-white border-white w-full">
                    <AnimatedService/>
                </div>

                <div className="p-4 w-full">
                    REQUEST SERVICE
                </div>
            </button>
        </div>
    )
};


export default serviceRequest;