import React, {useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import {useNavigate} from "react-router-dom";

export type Employee = {
    employeeId: number;
    email: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    occupation: string;
    userType: string;
}

const Profile = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

    const [employeeData, setEmployeeData] = useState<Employee | null>(null);

    const navigate = useNavigate();

    const redirectToMyRequest = () => {
        navigate("/employee-all-requests");
    };

    const redirectAdminDatabase = () => {
        navigate("/admin-database");
    };

    const redirectToSettings = () => {
        navigate("/admin-settings");
    }
    const redirectToEmployeePage = () => {
        navigate("/employee-page");
    }
    const redirectToStatistics = () => {
        navigate("/statistics");
    }
    const redirectToGame = () => {
        navigate("/game");
    }
    if (isLoading || !isAuthenticated || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    const fetchData = async () => {
        if(!user?.email) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-lg font-semibold">Loading...</div>
                </div>
            );
        }

        try {
            const employeeDataResponse = await axios.get(`/api/employee/user/${user?.email}`)
            setEmployeeData(employeeDataResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if(!employeeData) {
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
                <div
                    className="w-full border-4 border-white rounded-b-lg text-center bg-black text-white
                    animate-in fade-in zoom-in duration-500 p-4 font-nunito"
                >
                    You are logged in as an {employeeData?.userType}.
                </div>
                <div className="flex flex-col items-center bg-gray-50 px-4 py-15">
                    <img
                        src={user?.picture}
                        alt={user?.name}
                        className="w-32 h-32 rounded-full border-4 bg-blue-900 shadow-md"
                    />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="mt-1 text-md text-gray-600">{user?.email}</p>
                    <p className="mt-1 text-md text-gray-600"> {employeeData?.userType}</p>
                </div>

                {/*All the buttons for the profile page*/}
                <div className="grid grid-cols-3 items-center bg-gray-50 p-10">
                    <div className="col-start-1 bg-gray-50 p-10">
                        <button
                            onClick={() => redirectToMyRequest()}
                            className="col-start-2 text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                            animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Service Icon*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 25 24"
                                strokeWidth={1.3}
                                stroke="currentColor"
                                className="size-35"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                                />
                            </svg>
                            My Service Requests
                        </button>
                    </div>

                    <div className="items-start justify-items-start bg-gray-50 p-10">
                        <button
                            onClick={() => redirectToStatistics()}
                            className="text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Statistics Icon*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-35"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                                />
                            </svg>
                            Statistics
                        </button>
                    </div>

                    <div className="items-start justify-items-start bg-gray-50 p-10">
                        <button
                            onClick={() => redirectToEmployeePage()}
                            className="text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                    animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Employee Icon*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-35"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                            </svg>
                            Employee Directory
                        </button>
                    </div>

                    <div className="col-start-1 bg-gray-50 p-10">
                        <button
                            onClick={() => redirectToSettings()}
                            className="col-start-2 text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Settings Icon*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-35"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                            Settings
                        </button>
                    </div>

                    <div className="items-start justify-items-start bg-gray-50 p-10">
                        <button
                            onClick={() => window.open('https://www.mychart.org')}
                            className="text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Appointment Icon?*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-35"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Make an Appointment
                        </button>
                    </div>

                    <div className="items-start justify-items-start bg-gray-50 p-10">
                        <button
                            onClick={() => redirectAdminDatabase()}
                            className="text-3xl w-100 h-100 border-4 border-[#DFE3F0] shadow-md rounded text-center bg-blue-900 hover:bg-blue-900 text-white
                                        animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2"
                        >
                            {/*Management Icon*/}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-35"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                                />
                            </svg>
                            Directory Management
                        </button>
                    </div>
                    <button onClick={redirectToGame}
                            className="text-3xl w-20 h-20 border-4 shadow-md rounded text-center bg-blue-900 hover:bg-blue-800 text-white
                                animate-in fade-in zoom-in duration-500 p-4 font-nunito hover:scale-110 cursor-pointer flex flex-col items-center justify-center space-y-2">
                        {/*Game Icon?*/}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    </button>
                </div>
            </>
        )
    );
};

export default Profile;
