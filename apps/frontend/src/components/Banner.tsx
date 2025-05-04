import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from "@/components/ui/navigation-menu.tsx";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@radix-ui/react-hover-card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import hospitalLogo from "@/public/hospital2.png";
import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

export type Employee = {
    employeeId: number;
    email: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    occupation: string;
    userType: string;
}



export default function Banner({isLoggedIn}: {isLoggedIn: boolean})  {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [isFadingOut, setFadingOut] = useState(false);
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    // const [hasShownBanner, setHasShownBanner] = useState(false);

    {/*Timer for the message of logging in*/}
    useEffect(() => {
        if (isLoggedIn) {
            setShowLoginMessage(true);


            const fadeTimer = setTimeout(() => {
                setFadingOut(true);
            }, 2500); //fade out when its about to disappear

            const hideTimer = setTimeout(() => {
                setFadingOut(false);
                setShowLoginMessage(false);
            }, 3000); //set timer for 3 seconds

            return() => {
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isLoggedIn]);

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


    return (
        <>
            <div className={'flex flex-row bg-[#DFE3F0]'}>
                <div
                    className={
                        'basis-1/3 className=transition duration-500 ease-in-out hover:scale-102'
                    }
                >
                    {!isAuthenticated && (
                        <Link to="/">
                            <img
                                src={hospitalLogo}
                                alt="Brigham and Women’s Hospital (Founding Member, Mass General Brigham)"
                                style={{ height: '40px' }}
                                className={'mx-4 my-4'}
                            />
                        </Link>
                    )}

                    {isAuthenticated && (
                        <Link to="/">
                            <img
                                src={hospitalLogo}
                                alt="Brigham and Women’s Hospital (Founding Member, Mass General Brigham)"
                                style={{ height: '40px' }}
                                className={'mx-4 my-4'}
                            />
                        </Link>
                    )}
                </div>

                <div className={'basis-2/3'}>
                    <NavigationMenu className={'ml-auto p-4'}>
                        <NavigationMenuList className={'flex flex-row space-x-5'}>
                            <NavigationMenuItem></NavigationMenuItem>

                            {/*Shows which kind of account the user has logged into*/}
                            {isLoggedIn && showLoginMessage && (
                                <div
                                    className={`flex items-center border-4 h-4 rounded-full bg-blue-900 text-white
                                                 animate-in fade-in zoom-in transition-opacity duration-500 p-4 font-nunito
                                                 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
                                >
                                    You are logged in as an {employeeData?.userType}.
                                </div>
                            )}

                            {isLoggedIn && (
                                <NavigationMenuItem>
                                    <Link to="/profile" className="inline-block">
                                        <img
                                            src={user?.picture}
                                            alt={user?.name}
                                            className="w-10 h-10 rounded-full border-2 border-gray-300 hover:opacity-80 transition duration-200"
                                        />
                                    </Link>
                                </NavigationMenuItem>
                            )}

                            {!isLoggedIn && (
                                <>
                                    <NavigationMenuItem>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className=" className=transition duration-300 ease-in-out hover:scale-115">
                                                    <button onClick={() => loginWithRedirect()}>
                                                        <FontAwesomeIcon
                                                            icon={faCircleUser}
                                                            size="2x"
                                                            color="black"
                                                        />
                                                        <HoverCardContent className="w-20 bg-white rounded animate-in fade-in duration-200">
                                                            Profile
                                                        </HoverCardContent>
                                                    </button>
                                                </div>
                                            </HoverCardTrigger>
                                        </HoverCard>
                                    </NavigationMenuItem>
                                </>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </>
    );
};