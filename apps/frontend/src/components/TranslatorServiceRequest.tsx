import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import ReturnTranslatorRequest from "@/components/ReturnTranslatorRequest.tsx";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";

type translatorRequestForm = {
    languageFrom: string;
    languageTo: string;
    roomNum: string;
    startDateTime: string;
    endDateTime: string;
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
    comments: string;
}

export default function TranslatorServiceRequest() {

    const [form, setForm] = useState<translatorRequestForm>({
        languageFrom: '',
        languageTo: '',
        roomNum: '',
        startDateTime: '',
        endDateTime: '',
        requestStatus: '',
        priority: '',
        employeeRequestedById: 0,
        departmentUnderId: 0,
        comments: '',
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
                <ScrollArea className="max-h-[100vh] overflow-y-auto pr-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl fontbold pb-3" >Request a Translator</h2>
                        <form onSubmit={onSubmit}>
                            <div>
                                <Label className="pt-3 pb-2" htmlFor="employeeId">Employee ID</Label>
                                <Input
                                    required
                                    type="number"
                                    id="employeeId"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            employeeRequestedById: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="departmentId">Department ID</Label>
                                <Input
                                    required
                                    type="number"
                                    id="departmentId"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            departmentUnderId: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="roomNumber">Room Number</Label>
                                <Input
                                    required
                                    type="text"
                                    id="roomNumber"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            roomNum: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="languageFrom">Language From</Label>
                                <Input
                                    required
                                    type="text"
                                    id="languageFrom"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageFrom: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="languageTo">Language To</Label>
                                <Input
                                    required
                                    type="text"
                                    id="languageTo"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageTo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="startDateTime">Start Date and Time</Label>
                                <Input
                                    required
                                    type="datetime-local"
                                    id="startDateTime"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            startDateTime: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="endDateTime">End Date and Time</Label>
                                <Input
                                    required
                                    type="datetime-local"
                                    id="languageFrom"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            endDateTime: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-3 pb-2" htmlFor="priority">Priority</Label>
                                <select
                                    required
                                    id="priority"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            priority: e.target.value,
                                        })
                                    }>
                                    <option value="">-- Select Priority --</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="High">Emergency</option>
                                </select>
                            </div>
                            <div>
                                <Label className="pt-3 pb-2" htmlFor="requestStatus">Request Status</Label>
                                <select
                                    required
                                    id="requestStatus"
                                    className='border border-gray-300 rounded-md p-2'
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            requestStatus: e.target.value,
                                        })
                                    }>
                                    <option value="">-- Select Status --</option>
                                    <option value="Incomplete">Incomplete</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Complete">Complete</option>
                                    <option value="Unassigned">Unassigned</option>
                                </select>
                            </div>

                            <Label className="pt-4 pb-2" htmlFor="comments">Comments</Label>
                            <textarea
                                id="comments"
                                className="border border-gray-300 rounded-md p-2 w-60"
                                onChange={(e) =>
                                    setForm({ ...form, comments: e.target.value })
                                }
                            />

                            <div className="flex flex-row justify-center items-center">
                                <Button type="submit" className="mt-5">Submit</Button>
                            </div>
                        </form>
                </div>
                </ScrollArea>

            :
                <ReturnTranslatorRequest
                    employeeRequestedById={form.employeeRequestedById}
                    departmentUnderId={form.departmentUnderId}
                    languageFrom={form.languageFrom}
                    languageTo={form.languageTo}
                    roomNum={form.roomNum}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}
                    priority={form.priority}
                    comments={form.comments}
                    requestStatus={form.requestStatus}/>
            }
        </>
    );
}

