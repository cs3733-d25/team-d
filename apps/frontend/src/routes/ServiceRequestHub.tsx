import {FormEvent} from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";

const ServiceRequestHub = () => {
    return (
        <div className="grid grid-rows-1 grid-cols-3">
            <div>
                <Card>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request a Translator</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request a Translator</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request a Translator</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request a Translator</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">Request a Translator</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default ServiceRequestHub;