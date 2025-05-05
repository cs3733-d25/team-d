import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

import Banner from "@/components/Banner";
import Auth0LogoutButton from "@/components/Auth0LogoutButton.tsx";
import {useEffect} from "react";
//

export default function Navbar() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <div>Loading...</div>;
    const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

    useEffect((): void => {
        const fun = async (): Promise<void> => {
            try {
                await getAccessTokenSilently();
            } catch (error) {
                await loginWithRedirect({
                    appState: {
                        returnTo: location.pathname,
                    },
                });
            }
        };

        if (!isLoading && isAuthenticated) {
            fun();
        }
    }, [
        getAccessTokenSilently,
        isAuthenticated,
        isLoading,
        location.pathname,
        loginWithRedirect,
    ]);


    return (
        <>
            <Banner isLoggedIn={isAuthenticated} />

            <div className="bg-blue-900 text-white flex justify-between items-center h-10">
                <div className={"ml-auto"}>
                    <NavigationMenu className={'ml-auto'}>
                        <NavigationMenuList className={'flex flex-row space-x-5'}>



                            {/*<NavigationMenuItem>*/}
                            {/*    <NavigationMenuLink className={'text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white'}>*/}
                            {/*        <Link to={`/directory`}>Directions</Link>*/}
                            {/*    </NavigationMenuLink>*/}
                            {/*</NavigationMenuItem>*/}

                            <NavigationMenuItem>
                                <NavigationMenuLink onClick={() => (window.location.href = '/directory')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                        Directions
                                </NavigationMenuLink>
                            </NavigationMenuItem>



                            <NavigationMenuItem>
                                <NavigationMenuLink onClick={() => (window.location.href = '/voice-directory')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                    Departments
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink onClick={() => (window.location.href = '/servicerequesthub')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                    Request Service
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink onClick={() => (window.location.href = '/all-post')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                    Forum
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {isAuthenticated && (
                                <>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink onClick={() => (window.location.href = '/all-service-requests')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                            All Requests
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink onClick={() => (window.location.href = '/map-editor')} className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                                Map Editor
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink className={'text-base cursor-pointer hover:bg-[rgba(0,31,63,0.8)] border-2 border-transparent hover:border-yellow-400 hover:text-white'}>
                                            <Auth0LogoutButton />
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            <div className="flex-1 overflow-y-scroll">
                <Outlet />
            </div>
        </>
    );
}
