import React from 'react';
import { Outlet, Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"


export default function Navbar()  {
    return (
        <div>

            <NavigationMenu>
                <NavigationMenuList>

                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to={`/`}> Home </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to={`/login`}> Login </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to={`/map`}> Map </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>


                    <NavigationMenuItem>
                        <NavigationMenuLink>
                            <Link to={`/directory`}> Directory </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink className={"hover:bg-blue-700"}>
                            <Link to={`/servicerequest`}> Request Service </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                </NavigationMenuList>

            </NavigationMenu>

            <Outlet />
        </div>

    );
};



