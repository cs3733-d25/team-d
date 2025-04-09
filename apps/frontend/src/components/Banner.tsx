import React from 'react';
import { Outlet, Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import hospitalLogo from "@/public/hospital2.png";

export default function Banner()  {
    return (
        <>
            <div className={"flex flex-row bg-[#Addde5] sticky top-0"} >
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
                            </NavigationMenuItem>



                            <NavigationMenuItem>
                                <Link to={`/`}> <FontAwesomeIcon icon={faCircleUser} size="2x" color="black"/> </Link>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </>
    );
};