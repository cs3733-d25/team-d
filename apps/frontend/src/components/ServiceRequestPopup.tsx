import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import {FormEvent} from 'react';

import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import ReturnRequest from "@/components/ReturnRequest.tsx";
import {useState} from "react";


type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNumber: string;
    startDateTime: string;
    endDateTime: string;
}


export function ServiceRequestPopup() {
    const [form, setForm] = useState<translatorRequestForm>({
        languageFrom: '',
        languageTo: '',
        roomNumber: '',
        startDateTime: '',
        endDateTime: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
        setSubmitted(true);
    }

    return (
        <>
            {!submitted ?
                    <Dialog>
                        <DialogTrigger asChild className="animate-in fade-in zoom-in duration-500">
                            <Button variant="outline">Service Request</Button>
                        </DialogTrigger>
                        <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500">
                            <DialogHeader className="sm:justify-start">
                                <DialogTitle className="text-3xl">
                                    Request a Translator
                                </DialogTitle>
                            </DialogHeader>
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
                                            startDateTime: e.target.value,
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
                                            endDateTime: e.target.value,
                                        })
                                    }
                                />
                            </form>
                            <DialogFooter className="place-content-start">
                                    <Button type="submit">Submit</Button>
                            </DialogFooter>
                            <DialogFooter className="place-content-start">
                                    <DialogClose asChild>
                                        <Button type="button">Cancel</Button>
                                    </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                :
                <ReturnRequest
                    languageFrom={form.languageFrom}
                    languageTo={form.languageTo}
                    roomNumber={form.roomNumber}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}/>
            }
        </>
    );
}
