import React, { FormEvent, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReturnRequest from "@/components/ReturnRequest";

type TranslatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNumber: string;
    startDateTime: string;
    endDateTime: string;
};

export default function ServiceRequest() {
    const [form, setForm] = useState<TranslatorRequestForm>({
        languageFrom: "",
        languageTo: "",
        roomNumber: "",
        startDateTime: "",
        endDateTime: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
        setSubmitted(true);
    };

    return (
        <>
            {!submitted ? (
                <div className="grid place-items-center h-full items-center">
                    <Card className="w-1/3">
                        <CardHeader>
                            <CardTitle className="text-3xl text-center">
                                Request a Translator
                            </CardTitle>
                        </CardHeader>

                        <form onSubmit={onSubmit}>
                            <CardContent>
                                {/* Language From */}
                                <div className="mb-4">
                                    <Label htmlFor="languageFrom" className="mb-1">
                                        Language From
                                    </Label>
                                    <Input
                                        type="text"
                                        id="languageFrom"
                                        value={form.languageFrom}
                                        onChange={(e) =>
                                            setForm({ ...form, languageFrom: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Language To */}
                                <div className="mb-4">
                                    <Label htmlFor="languageTo" className="mb-1">
                                        Language To
                                    </Label>
                                    <Input
                                        type="text"
                                        id="languageTo"
                                        value={form.languageTo}
                                        onChange={(e) =>
                                            setForm({ ...form, languageTo: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Room Number */}
                                <div className="mb-4">
                                    <Label htmlFor="roomNumber" className="mb-1">
                                        Room Number
                                    </Label>
                                    <Input
                                        type="text"
                                        id="roomNumber"
                                        value={form.roomNumber}
                                        onChange={(e) =>
                                            setForm({ ...form, roomNumber: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Start Date & Time */}
                                <div className="mb-4">
                                    <Label htmlFor="startDateTime" className="mb-1">
                                        Start Date and Time
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        id="startDateTime"
                                        value={form.startDateTime}
                                        onChange={(e) =>
                                            setForm({ ...form, startDateTime: e.target.value })
                                        }
                                    />
                                </div>

                                {/* End Date & Time */}
                                <div className="mb-4">
                                    <Label htmlFor="endDateTime" className="mb-1">
                                        End Date and Time
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        id="endDateTime" // fixed ID here
                                        value={form.endDateTime}
                                        onChange={(e) =>
                                            setForm({ ...form, endDateTime: e.target.value })
                                        }
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            ) : (
                <ReturnRequest
                    languageFrom={form.languageFrom}
                    languageTo={form.languageTo}
                    roomNumber={form.roomNumber}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}
                />
            )}
        </>
    );
}


