import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import ReturnRequest from "@/components/ReturnRequest.tsx";
import {useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";

type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNum: string;
    startDateTime: string;
    endDateTime: string;
}

export default function ServiceRequest() {

    const [form, setForm] = useState<translatorRequestForm>({
        languageFrom: '',
        languageTo: '',
        roomNum: '',
        startDateTime: '',
        endDateTime: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);
        setSubmitted(false);
        axios.post(API_ROUTES.SERVICEREQS+'/translator', form).then(() => {
            alert("Service request submitted!");
            setSubmitted(true);
        });
    }

    return (
        <>
            {!submitted ?
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl fontbold pb-3" >Request a Translator</h2>
                        <form onSubmit={onSubmit}>
                                <Label className="pb-3" htmlFor="languageFrom">Language From</Label>
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
                                <Label className="pt-3 pb-2" htmlFor="languageTo">Language To</Label>
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
                                <Label className="pt-3 pb-2" htmlFor="roomNumber">Room Number</Label>
                                <Input
                                    type="text"
                                    id="roomNumber"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            roomNum: e.target.value,
                                        })
                                    }
                                />
                                <Label className="pt-3 pb-2" htmlFor="startDateTime">Start Date and Time</Label>
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
                                <Label className="pt-3 pb-2" htmlFor="endDateTime">End Date and Time</Label>
                                <Input
                                    type="datetime-local"
                                    id="languageFrom"
                                    className='pb-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            endDateTime: e.target.value,
                                        })
                                    }
                                />

                                <Button type="submit" className="mt-5">Submit</Button>

                        </form>
                </div>
            :
                <ReturnRequest
                    languageFrom={form.languageFrom}
                    languageTo={form.languageTo}
                    roomNumber={form.roomNum}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}/>
            }
        </>
    );
}

