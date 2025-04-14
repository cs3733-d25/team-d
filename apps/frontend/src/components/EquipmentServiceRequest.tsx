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
                    <h6 className="pb-3 font-light">Christine Ngo & Keethu Jayamoorthy</h6>
                    <form onSubmit={onSubmit}>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="employeeId">Employee ID</Label>
                            <Input
                                required
                                type="number"
                                id="employeeId"
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
                                className='border border-gray-300 rounded-md p-2'
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
                                className='border border-gray-300 rounded-md p-2'
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        departmentUnderId: Number(e.target.value),
                                    })
                                }>
                                <option value="">-- Select Department --</option>
                                <option value="1">Allergy and Clinical Immunology Floor 3</option>
                                <option value="2">Allergy and Clinical Immunology Floor 5</option>
                                <option value="3">Backup Child Care Center</option>
                                <option value="4">Brigham Dermatology Associates (BDA)</option>
                                <option value="5">Brigham Obstetrics and Gynecology Group (BOGG)	</option>
                                <option value="6">Brigham Physicians Group (BPG) Floor 4</option>
                                <option value="7">Brigham Physicians Group (BPG) Floor 5</option>
                                <option value="8">Brigham Psychiatric Specialities</option>
                                <option value="9">Center for Pain Medicine	</option>
                                <option value="10">Crohn's and Colitis Center</option>
                                <option value="11">Endoscopy Center</option>
                                <option value="12">Gretchen S. and Edward A. Fish Center for Women's Health</option>
                                <option value="13">Laboratory</option>
                                <option value="14">Multi-Specialty Clinic</option>
                                <option value="15">Osher Clinical Center for Integrative Health</option>
                                <option value="16">Patient Financial Services	</option>
                                <option value="17">Pharmacy</option>
                                <option value="18">Radiology</option>
                                <option value="19">Radiology, MRI/CT Scan</option>
                                <option value="20">Rehabilitation Services</option>
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="roomNumber">Room Number</Label>
                            <Input
                                required
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
                                className='pb-2'
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
                            <Label className="pt-4 pb-2" htmlFor="requestStatus">Request Status</Label>
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

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="comments">Comments</Label>
                            <textarea
                                id="comments"
                                className="border border-gray-300 rounded-md p-2 w-90"
                                onChange={(e) =>
                                    setForm({ ...form, comments: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex flex-row justify-center items-center">
                            <Button type="submit" className="mt-5">Submit</Button>
                        </div>
                    </form>
                </div>
                :
                <ReturnEquipmentRequest
                    employeeRequestedById={form.employeeRequestedById}
                    departmentUnderId={form.departmentUnderId}
                    medicalDevice={form.medicalDevice}
                    quantity={form.quantity}
                    signature={form.signature}
                    roomNum={form.roomNum}
                    startDateTime={form.startDateTime}
                    endDateTime={form.endDateTime}
                    comments={form.comments}
                    requestStatus={form.requestStatus}
                    employeeName={form.employeeName}
                    priority={form.priority}
                />
            }
        </>
    );
}

