import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import hospitalLogo from "@/public/hospital2.png";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';



export default function Navbar()  {
    return (
        <div>
            <div className={"flex flex-row bg-blue-100"} >
                <div className={"basis-1/3"}>
                    <img
                        src={hospitalLogo}
                        alt="Brigham and Women’s Hospital (Founding Member, Mass General Brigham)"
                        style={{ height: "40px" }}
                        className={"mx-4 my-4"}
                    />
                </div>

                <div className={"basis-2/3"}>
                    <NavigationMenu className={"ml-auto p-4"}>
                        <NavigationMenuList className={"flex flex-row space-x-5"}>
                            <NavigationMenuItem>
                                <NavigationMenuLink className=  {"text-base hover:bg-blue-900 hover:text-white"}>
                                    <Link to={`/`}> <b>Home</b> </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>


                            <NavigationMenuItem>
                                <NavigationMenuLink className=  {"text-base hover:bg-blue-900 hover:text-white"}>
                                    <Link to={`/map`}> <b>Map</b> </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>


                            <NavigationMenuItem >
                                <NavigationMenuLink className=  {"text-base hover:bg-blue-900 hover:text-white"}>
                                    <Link to={`/directory`}> <b>Directory</b> </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink className=  {"text-base hover:bg-blue-900 hover:text-white"}>
                                    <Link to={`/servicerequest`}> <b>Request Service</b> </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link to={`/login`}> <FontAwesomeIcon icon={faCircleUser} size="2x" color="black"/> </Link>
                            </NavigationMenuItem>

                        </NavigationMenuList>




                    </NavigationMenu>



                </div>

            </div>
            <Outlet />
        </div>


    );
};



