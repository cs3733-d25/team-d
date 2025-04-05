import {FormEvent} from 'react';
import {
    Card,
    CardContent, CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import { Link } from "react-router-dom";

const ServiceRequestHub = () => {
    return (
        <div className="grid grid-rows-1 grid-cols-3 gap-4">
            <div>
                <Link to={`/servicerequest`} className="text-3xl text-center">
                    <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
                        <CardHeader className="place-content-center">
                            <CardTitle className="text-3xl">Request Translator</CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
            <div>
                <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request 2</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request 3</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request 4</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request 5</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default ServiceRequestHub;