import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import ReturnEquipmentRequest from "@/components/ReturnEquipmentRequest.tsx";

type equipmentRequestForm = {
    medicalDevice: string;
    signature: string;
    quantity: number;
    comments: string;
    roomNum: string;
    startDateTime: string;
    endDateTime: string;
    requestStatus: string;
    priority: string;
}

export default function EquipmentServiceRequest() {

    const [form, setForm] = useState<equipmentRequestForm>({
        medicalDevice: '',
        signature: '',
        quantity: 0,
        comments: '',
        roomNum: '',
        startDateTime: '',
        endDateTime: '',
        requestStatus: '',
        priority: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);
        setSubmitted(false);
        axios.post(API_ROUTES.SERVICEREQS+'/equipment', form).then(() => {
            alert("Service request submitted!");
            setSubmitted(true);
        });
    }

    return (
        <>
            {!submitted ?
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl fontbold pb-3" >Request a Medical Device</h2>
                    <form onSubmit={onSubmit}>
                        <Label className="pb-3" htmlFor="medicalDevice">Medical Device</Label>
                        <Input
                            type="text"
                            id="medicalDevice"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    medicalDevice: e.target.value,
                                })
                            }
                        />
                        <Label className="pt-3 pb-2" htmlFor="quantity">Quantity</Label>
                        <Input
                            type="number"
                            id="quantity"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    quantity: Number(e.target.value),
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
                        <Label className="pt-3 pb-2" htmlFor="priority">Priority</Label>
                        <select
                            id="priority"
                            className='pb-2 border'
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priority: e.target.value,
                                })
                            }>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="High">Emergency</option>
                        </select>
                        <Label className="pt-3 pb-2" htmlFor="requestStatus">Request Status</Label>
                        <select
                            id="requestStatus"
                            className='pb-2 border'
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    requestStatus: e.target.value,
                                })
                            }>
                            <option value="Incomplete">Incomplete</option>
                            <option value="Pending">Pending</option>
                            <option value="Complete">Complete</option>
                            <option value="Unassigned">Unassigned</option>
                        </select>
                        <Label className="pt-3 pb-2" htmlFor="comments">Comments</Label>
                        <Input
                            type="textarea"
                            id="comments"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    comments: e.target.value,
                                })
                            }
                        />
                        <Label className="pt-3 pb-2" htmlFor="signature">Signature</Label>
                        <Input
                            type="text"
                            id="signature"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    signature: e.target.value,
                                })
                            }
                        />

                        <Button type="submit" className="mt-5">Submit</Button>

                    </form>
                </div>
                :
                <ReturnEquipmentRequest
                    medicalDevice={form.medicalDevice}
                    quantity={form.quantity}
                    signature={form.signature}
                    roomNum={form.roomNum}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}
                    comments={form.comments}
                    requestStatus={form.requestStatus}
                    priority={form.priority}/>
            }
        </>
    );
}

