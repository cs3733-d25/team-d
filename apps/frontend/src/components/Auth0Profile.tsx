import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {useNavigate} from "react-router-dom";



const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    const navigate = useNavigate();

    const redirectToMyRequest = () => {
        navigate("/all-service-requests");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    {/*Only if the user is logged in can they see this profile page with their email and profile pic*/}
    return (
        isAuthenticated && (
            <>
                <div className="flex flex-col items-center bg-gray-50 px-4 py-15">
                    <img
                        src={user?.picture}
                        alt={user?.name}
                        className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
                    />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="mt-1 text-md text-gray-600">{user?.email}</p>
                </div>

                {/*All the buttons for the profile page*/}
                <div className="grid grid-cols-2 items-center justify-items-center bg-gray-50 p-10">

                    <div className="grid grid-cols-2 col-start-1 gap-x-6 gap-y-4 bg-gray-50 p-10">
                        <button onClick={() => redirectToMyRequest()}
                                className="col-start-2 text-2xl w-50 h-50 border-4 border-teal-500 rounded-full text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer">
                            Your Service Requests
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 items-start justify-items-start bg-gray-50 p-10">
                        <button onClick={() => redirectToMyRequest()}
                                className="text-2xl w-50 h-50 border-4 border-teal-500 rounded-full text-center bg-blue-900 hover:bg-blue-900 text-white
                                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer">
                            Calendar
                        </button>
                    </div>

                    <div className="grid grid-cols-2 col-start-1 gap-x-6 gap-y-4 bg-gray-50 p-10">
                        <button onClick={() => redirectToMyRequest()}
                                className="col-start-2 text-2xl w-50 h-50 border-4 border-teal-500 rounded-full text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer">
                            Settings
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 items-start justify-items-start bg-gray-50 p-10">
                        <button onClick={() => window.open("https://www.mychart.org")}
                                className="text-2xl w-50 h-50 border-4 border-teal-500 rounded-full text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer">
                            Make an Appointment
                        </button>
                    </div>
                </div>




            </>
        )
    );
};

export default Profile;
