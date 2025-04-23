import React from "react";
import {useNavigate} from "react-router-dom";

const serviceRequest: React.FC = () => {
    const navigate = useNavigate();

    const redirectToServiceRequest = () => {
        navigate("/servicerequesthub");
    };
//
    return (
        <div className="">
            <button onClick={() => redirectToServiceRequest()}
                    className=" border-4 w-full rounded-b-lg border-white text-center bg-black/30 hover:bg-black/60 text-white
                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer"
            >
                REQUEST SERVICE
            </button>
        </div>
    )
};


export default serviceRequest;