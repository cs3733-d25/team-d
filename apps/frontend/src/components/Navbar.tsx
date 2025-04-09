import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import hospitalLogo from "@/public/hospital2.png";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import Banner from "@/components/Banner";


export default function Navbar({isLoggedIn})  { // Accept
    return (
        <>
            <Banner />
            {isLoggedIn && (
               <div className="bg-blue-900 text-white flex justify-between items-center h-10">

                <div className={"ml-auto"}>
                    <NavigationMenu className={'ml-auto p-4'}>
                        <NavigationMenuList className={'flex flex-row space-x-5'}>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/`}>
                                        {' '}
                                        <b>Home</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/map`}>
                                        {' '}
                                        <b>Map</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/directory`}>
                                        {' '}
                                        <b>Directory</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/servicerequesthub`}>
                                        {' '}
                                        <b>Request Service</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-scroll">
                <Outlet />
            </div>
        </>
    );
};



