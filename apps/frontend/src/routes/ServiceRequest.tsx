import React, {FormEvent} from 'react';
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

type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNumber: string;
    startDateTime: string;
    endDateTime: string;
}

export default function ServiceRequest() {

    const [form, setForm] = React.useState<translatorRequestForm>({
        languageFrom: '',
        languageTo: '',
        roomNumber: '',
        startDateTime: '',
        endDateTime: '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
    }

    return (
        <div className="grid place-items-center h-full items-center">
            <Card className="w-1/3">
                <CardHeader className="place-content-center">
                    <CardTitle>Request a Translator</CardTitle>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent>
                        <Label htmlFor="languageFrom">Language From</Label>
                        <Input
                            type="text"
                            id="languageFrom"
                            onChange={(e) => setForm({
                                ...form,
                                languageFrom: e.target.value
                            })}/>
                        <Label htmlFor="languageTo">Language To</Label>
                        <Input
                            type="text"
                            id="languageTo"
                            onChange={(e) => setForm({
                                ...form,
                                languageTo: e.target.value
                            })}/>
                        <Label htmlFor="roomNumber">Room Number</Label>
                        <Input
                            type="text"
                            id="roomNumber"
                            onChange={(e) => setForm({
                                ...form,
                                roomNumber: e.target.value
                            })}/>
                        <Label htmlFor="startDateTime">Start Date and Time</Label>
                        <Input
                            type="datetime-local"
                            id="startDateTime"
                            onChange={(e) => setForm({
                                ...form,
                                startDateTime: e.target.value
                            })}/>
                        <Label htmlFor="endDateTime">End Date and Time</Label>
                        <Input
                            type="datetime-local"
                            id="languageFrom"
                            onChange={(e) => setForm({
                                ...form,
                                endDateTime: e.target.value
                            })}/>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

