import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import {useState, useEffect} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import ReturnEquipmentRequest from "@/components/ServiceRequest/EquipmentRequest/ReturnEquipmentRequest.tsx";
import SubmissionReqPopup from "@/components/SubmissionReqPopup.tsx";
import {Department} from "@/routes/Directions.tsx";

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
    employeeRequestedById: number;
    departmentUnderId: number;
    employeeName: string;
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
        employeeRequestedById: 0,
        departmentUnderId: 0,
        employeeName: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        axios.get(API_ROUTES.DEPARTMENT + "/all").then((response) => {
            setDepartments(response.data)
        });
    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(false);

        axios
            .post(API_ROUTES.SERVICEREQS + "/equipment", form)
            .then(() => {
                setSubmitted(true);
            })
            .catch((err) => {
                console.error("Error submitting sanitation request:", err);
            });
    };

    return (
        <>
            {!submitted ?
                <ScrollArea className="max-h-[95vh] overflow-y-auto pr-4 w-full max-w-screen-lg mx-auto bg-zinc-200">
                <div className="grid place-items-center h-full items-center">
                    <div className="bg-blue-200 bg-opacity-60 rounded-3xl px-6 py-4 max-w-5xl w-full mx-auto">
                        <h2 className="text-4xl font-bold text-left">Request a Medical Device</h2>
                    </div>
                    <h6 className="pb-3 font-light">Christine Ngo & Keethu Jayamoorthy</h6>
                    <form onSubmit={onSubmit}>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="employeeId">Employee ID</Label>
                            <Input
                                required
                                type="number"
                                id="employeeId"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        employeeRequestedById: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="employeeName">Employee Name</Label>
                            <Input
                                required
                                type="text"
                                id="employeeName"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        employeeName: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="department">Department</Label>
                            <select
                                required
                                id="department"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        departmentUnderId: Number(e.target.value),
                                    })
                                }>
                                <option value="">-- Select Department --</option>
                                {departments.map((d: Department) => (
                                    <option key={d.departmentId + 1} value={d.departmentId}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="roomNumber">Room Number</Label>
                            <Input
                                required
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                type="text"
                                id="roomNumber"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        roomNum: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="medicalDevice">Medical Device</Label>
                            <Input
                                required
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                type="text"
                                id="medicalDevice"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        medicalDevice: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="quantity">Quantity</Label>
                            <Input
                                required
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                type="number"
                                id="quantity"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        quantity: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="startDateTime">Start Date and Time</Label>
                            <Input
                                required
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                type="datetime-local"
                                id="startDateTime"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        startDateTime: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="endDateTime">End Date and Time</Label>
                            <Input
                                required
                                type="datetime-local"
                                id="languageFrom"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endDateTime: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="signature">Signature</Label>
                            <Input
                                required
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                type="text"
                                id="signature"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        signature: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="priority">Priority</Label>
                            <select
                                required
                                id="priority"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
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
                            <Label className="pt-4 pb-2" htmlFor="requestStatus">Request Status</Label>
                            <select
                                required
                                id="requestStatus"
                                className = "w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        requestStatus: e.target.value,
                                    })
                                }>
                                <option value="">-- Select Status --</option>
                                <option value="Unassigned">Unassigned</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Working">Working</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="comments">Comments</Label>
                            <textarea
                                id="comments"
                                className = "w-80 h-8 rounded-md border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({ ...form, comments: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex flex-row justify-center items-center">
                            <Button type="submit" className="mt-6 w-full">
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
                </ScrollArea>
                :
                <SubmissionReqPopup>
                    <ReturnEquipmentRequest {...form} />
                </SubmissionReqPopup>
            }
        </>
    );
}

