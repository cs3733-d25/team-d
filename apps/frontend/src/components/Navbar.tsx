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
import Auth0LogoutButton from "@/components/Auth0LogoutButton.tsx";
export default function Navbar({isLoggedIn}: {isLoggedIn: boolean})  { // Accept
    return (
        <>
            <Banner />
            {/*is logged in*/}
            {isLoggedIn && (
               <div className="bg-blue-900 text-white flex justify-between items-center h-10">

                <div className={"ml-auto"}>
                    <NavigationMenu className={'ml-auto p-4'}>
                        <NavigationMenuList className={'flex flex-row space-x-5'}>l

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/loggedIn/directory`}>
                                        {' '}
                                        <b>Directions</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/loggedIn/servicerequesthub`}>
                                        {' '}
                                        <b>Request Service</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/loggedIn/all-service-requests`}>
                                        {' '}
                                        <b>All Requests</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                >
                                    <Link to={`/loggedIn/admin-database`}>
                                        {' '}
                                        <b>Directory Management</b>{' '}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Auth0LogoutButton />
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                    </div>
                </div>
            )}

            {/*is not logged in*/}
            {!isLoggedIn && (
                <div className="bg-blue-900 text-white flex justify-between items-center h-10">

                    <div className={"ml-auto"}>
                        <NavigationMenu className={'ml-auto p-4'}>
                            <NavigationMenuList className={'flex flex-row space-x-5'}>l

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}
                                    >
                                        <Link to={`/directory`}>
                                            {' '}
                                            <b>Directions</b>{' '}
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



