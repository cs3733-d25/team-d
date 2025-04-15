import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { API_ROUTES } from "common/src/constants.ts";

import ReturnSanitationRequest from "@/components/ReturnSanitationRequest.tsx";
import SubmissionReqPopup from "@/components/SubmissionReqPopup.tsx";

type SanitationRequestForm = {
    roomNum: string;
    priority: string;
    type: string;
    status: string;
    comments: string;
    requestStatus: string;
    employeeRequestedById: number;
    departmentUnderId: number;
    employeeName: string;
};

export default function SanitationRequest() {
    const [form, setForm] = useState<SanitationRequestForm>({
        roomNum: '',
        priority: '',
        type: '',
        status: '',
        comments: '',
        requestStatus: '',
        employeeRequestedById: 0,
        departmentUnderId: 0,
        employeeName: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(false);
        axios
            .post(API_ROUTES.SERVICEREQS + "/sanitation", form)
            .then(() => {
                setSubmitted(true);
                setShowPopup(true);
            })
            .catch((err) => {
                console.error("Error submitting sanitation request:", err);
            });
    };

    return (
        <>
            <SubmissionReqPopup open={showPopup} onOpenChange={setShowPopup} />
            {!submitted ?
            <ScrollArea className="max-h-[100vh] overflow-y-auto pr-4">
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl font-bold pb-3">Request Sanitation</h2>
                    <form onSubmit={onSubmit} className="flex flex-col">

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

                        <Label className="pt-4 pb-2" htmlFor="roomNum">Room Number</Label>
                        <Input
                            required
                            type="text"
                            id="roomNum"
                            onChange={(e) =>
                                setForm({ ...form, roomNum: e.target.value })
                            }
                        />

                        <Label className="pt-4 pb-2" htmlFor="type">Sanitation Type</Label>
                        <select
                            required
                            id="type"
                            className="border border-gray-300 rounded-md p-2"
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }
                        >
                            <option value="">-- Select Type --</option>
                            <option value="GENERAL">General</option>
                            <option value="DISINFECT">Disinfect</option>
                            <option value="DEEP_CLEANING">Deep Cleaning</option>
                            <option value="WASTE_REMOVAL">Waste Removal</option>
                            <option value="PEST_CONTROL">Pest Control</option>
                        </select>

                        <Label className="pt-4 pb-2" htmlFor="status">Room Status</Label>
                        <select
                            required
                            id="status"
                            className="border border-gray-300 rounded-md p-2"
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value })
                            }
                        >
                            <option value="">-- Select Room Status --</option>
                            <option value="VACANT">Vacant</option>
                            <option value="IN_USE">In Use</option>
                        </select>

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

                        <Label className="pt-4 pb-2" htmlFor="comments">
                            Comments
                        </Label>
                        <textarea
                            id="comments"
                            className="border border-gray-300 rounded-md p-2 w-60"
                            onChange={(e) =>
                                setForm({ ...form, comments: e.target.value })
                            }
                        />

                        <Button type="submit" className="mt-6">
                            Submit
                        </Button>
                    </form>
                </div>
            </ScrollArea>
            :
            <ReturnSanitationRequest
                roomNum={form.roomNum}
                type={form.type}
                status={form.status}
                comments={form.comments}
                requestStatus={form.requestStatus}
                priority={form.priority}
                employeeRequestedById={form.employeeRequestedById}
                departmentUnderId={form.departmentUnderId}
                employeeName={form.employeeName}
            />
            }
        </>
    );
}
