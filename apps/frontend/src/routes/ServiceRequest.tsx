import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import ReturnRequest from "@/components/ReturnRequest.tsx";
import {useState} from "react";
import {SubmitTranslatorRequest} from "@/services/servicerequests.ts";

type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNumber: string;
    startDateTime: Date;
    endDateTime: Date;
}

export default function ServiceRequest() {

    const [form, setForm] = useState<translatorRequestForm>({
        languageFrom: '',
        languageTo: '',
        roomNumber: '',
        startDateTime: new Date,
        endDateTime: new Date,
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        SubmitTranslatorRequest({
            languageFrom: form.languageFrom,
            languageTo: form.languageTo,
            roomNum: form.roomNumber,
            startDateTime: form.startDateTime,
            endDateTime: form.endDateTime
        })
        e.preventDefault();
        alert("Service request successfully created!");
        console.log(form);
        setSubmitted(true);
    }

    return (
        <>
            {!submitted ?
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl fontbold">Request a Translator</h2>
                        <form onSubmit={onSubmit}>
                                <Label htmlFor="languageFrom">Language From</Label>
                                <Input
                                    type="text"
                                    id="languageFrom"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageFrom: e.target.value,
                                        })
                                    }
                                />
                                <Label htmlFor="languageTo">Language To</Label>
                                <Input
                                    type="text"
                                    id="languageTo"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageTo: e.target.value,
                                        })
                                    }
                                />
                                <Label htmlFor="roomNumber">Room Number</Label>
                                <Input
                                    type="text"
                                    id="roomNumber"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            roomNumber: e.target.value,
                                        })
                                    }
                                />
                                <Label htmlFor="startDateTime">Start Date and Time</Label>
                                <Input
                                    type="datetime-local"
                                    id="startDateTime"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            startDateTime: new Date(e.target.value),
                                        })
                                    }
                                />
                                <Label htmlFor="endDateTime">End Date and Time</Label>
                                <Input
                                    type="datetime-local"
                                    id="languageFrom"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            endDateTime: new Date(e.target.value),
                                        })
                                    }
                                />

                                <Button type="submit">Submit</Button>

                        </form>
                </div>
            :
                <ReturnRequest
                    languageFrom={form.languageFrom}
                    languageTo={form.languageTo}
                    roomNumber={form.roomNumber}
                    startDateTime={form.startDateTime.toDateString()}
                    endDateTime={form.endDateTime.toDateString()}/>
            }
        </>
    );
}

