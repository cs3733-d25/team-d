import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { API_ROUTES } from "common/src/constants.ts";

import ReturnSanitationRequest from "@/components/ReturnSanitationRequest.tsx";
import SubmissionReqPopup from "@/components/SubmissionReqPopup.tsx";

type SanitationRequestForm = {
    roomNumber: string;
    priority: string;
    type: string;
    status: string;
    comments: string;
    requestStatus: string;
    employeeRequestedById: number;
    departmentUnderId: number;
};

export default function SanitationRequest() {
    const [form, setForm] = useState<SanitationRequestForm>({
        roomNumber: "",
        priority: "",
        type: "",
        status: "",
        comments: "",
        requestStatus: '',
        employeeRequestedById: 0,
        departmentUnderId: 0,
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
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl font-bold pb-3">Request Sanitation</h2>
                    <form onSubmit={onSubmit} className="flex flex-col">

                        {/* Room Number */}
                        <Label className="pb-2" htmlFor="roomNumber">
                            Room Number
                        </Label>
                        <Input
                            required
                            type="text"
                            id="roomNumber"
                            onChange={(e) =>
                                setForm({ ...form, roomNumber: e.target.value })
                            }
                        />

                        <div>
                            <Label className="pt-3 pb-2" htmlFor="employeeId">Employee ID</Label>
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
                            <Label className="pt-3 pb-2" htmlFor="departmentId">Department ID</Label>
                            <Input
                                required
                                type="number"
                                id="departmentId"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        departmentUnderId: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-3 pb-2" htmlFor="priority">Priority</Label>
                            <select
                                required
                                id="priority"
                                className='pb-2 border rounded-md'
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
                        </div>
                        <div>
                            <Label className="pt-3 pb-2" htmlFor="requestStatus">Request Status</Label>
                            <select
                                required
                                id="requestStatus"
                                className='pb-2 border mb-4 rounded-md'
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
                        </div>

                        <Label className="pt-4 pb-2" htmlFor="type">
                            Type
                        </Label>
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

                        <Label className="pt-4 pb-2" htmlFor="status">
                            Room Status
                        </Label>
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

                        <Label className="pt-4 pb-2" htmlFor="comments">
                            Comments
                        </Label>
                        <textarea
                            required
                            id="comments"
                            className="border border-gray-300 rounded-md p-2"
                            onChange={(e) =>
                                setForm({ ...form, comments: e.target.value })
                            }
                        />

                        <Button type="submit" className="mt-6">
                            Submit
                        </Button>
                    </form>
                </div>
                :
                <ReturnSanitationRequest
                    roomNumber={form.roomNumber}
                    type={form.type}
                    status={form.status}
                    comments={form.comments}
                    requestStatus={form.requestStatus}
                    priority={form.priority}
                    employeeRequestedById={form.employeeRequestedById}
                    departmentUnderId={form.departmentUnderId}
                />
            }
        </>
    );
}
