import React from 'react';
import { Link } from "react-router-dom";
import {
    Card,
    CardTitle,
} from "@/components/ui/card"

import Login from "@/components/Login.tsx";


export default function Home() {
    return (
        <>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen p-10 overflow-y-hidden flex flex-row ">
                {/*<Card className="bg-blue-700/70 m-20 ">*/}
                {/*    <CardTitle className="text-6xl text-center text-white ">Welcome!</CardTitle>*/}
                {/*</Card>*/}
                <div className="flex-2">
                    {/*Hero message here*/}
                </div>

                {/*This is the call of the component login for the home page*/}
                <div className="flex-1 place-content-center">
                    <Login />
                </div>
            </div>
        </>
    );
}
