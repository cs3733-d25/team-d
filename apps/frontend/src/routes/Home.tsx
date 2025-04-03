import React from 'react';
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

type HomeProps = {
    buildingDirectory: string;
}

export default function Home() {
    return (
        <>
            <div className="bg-[url(/src/public/Hospital.jpg)]..."></div>
            <Card m-header="16px">
                <CardTitle className="text-[#000000]"></CardTitle>
                <h1 className="text-6xl text-black">Building Directory</h1>
            </Card>
            <CardContent>

            </CardContent>

        </>
    );
}
