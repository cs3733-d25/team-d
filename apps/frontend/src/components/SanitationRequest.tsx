import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { API_ROUTES } from "common/src/constants.ts";

import ReturnSanitationRequest from "@/components/ReturnSanitationRequest.tsx";

type SanitationRequestForm = {
    roomNum: string;
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
        roomNum: "",
        priority: "",
        type: "",
        status: "",
        comments: "",
        requestStatus: '',
        employeeRequestedById: 0,
        departmentUnderId: 0,
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(false);

        axios
            .post(API_ROUTES.SERVICEREQS + "/sanitation", form)
            .then(() => {
                alert("Sanitation request submitted!");
                setSubmitted(true);
            })
            .catch((err) => {
                console.error("Error submitting sanitation request:", err);
            });
    };

    return (
        <>
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
                            <Label className="pt-4 pb-2" htmlFor="departmentId">Department ID</Label>
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
                />
            }
        </>
    );
}
