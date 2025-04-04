import React from 'react';
import { Link } from "react-router-dom";
import {
    Card,
    CardTitle,
} from "@/components/ui/card"



export default function Home() {
    return (
        <>
            <div className="bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen p-20 ">
                <Card className="bg-blue-700/70 m-20 ">
                    <CardTitle className="text-6xl text-center text-white ">Welcome!</CardTitle>
                </Card>

                <div className="justify-center flex flex-row">
                    <div className="w-1/3 p-20">
                        <Link to={`/login`} className="text-3xl text-center">
                            <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white ">Login</Card>
                        </Link>
                    </div>

                    <div className="w-1/3 p-20">
                        <Link to={`/map`} className="text-3xl text-center">
                            <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white ">Visitor Map</Card>
                        </Link>
                    </div>

                    <div className="w-1/3 p-20">
                        <Link to={`/directory`} className="text-3xl text-center">
                            <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white ">Directory</Card>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    );
}
