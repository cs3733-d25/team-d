import React, { FormEvent, useState, useEffect} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { API_ROUTES } from "common/src/constants.ts";

import ReturnSanitationRequest from "@/components/ServiceRequest/SanitationRequest/ReturnSanitationRequest.tsx";
import SubmissionReqPopup from "@/components/SubmissionReqPopup.tsx";
import {Department} from "@/routes/Directions.tsx";
import {Employee} from "@/routes/AllServiceRequests.tsx";

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

export default function SanitationServiceRequest() {
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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        axios.get(API_ROUTES.DEPARTMENT + "/all").then((response) => {
            setDepartments(response.data)
        });
        axios.get(API_ROUTES.EMPLOYEE + "/names").then((response) => {
            setEmployees(response.data)
        });
    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);
        setSubmitted(false);

        axios
            .post(API_ROUTES.SERVICEREQS + "/sanitation", form)
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
                <ScrollArea className="max-h-[95vh] w-115 overflow-y-auto">
                <div className="flex flex-col items-center gap-4 bg-white">
                    <div className="bg-blue-900 rounded-md px-6 py-4 max-w-5xl w-full mx-auto">
                        <h2 className="text-4xl font-bold text-center text-white">Request Sanitation</h2>
                    </div>
                    <h6 className="pb-3 font-light">Stuvat Dash & Brandon Small</h6>
                    <form onSubmit={onSubmit} className="flex flex-col">
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="employeeName">
                                Employee Name
                            </Label>
                            <select
                                required
                                id="department"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) => {
                                    const selectedEmployee = employees.find(emp => emp.employeeId === Number(e.target.value));
                                    setForm({
                                        ...form,
                                        employeeRequestedById: Number(e.target.value),
                                        employeeName: selectedEmployee
                                            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                                            : ''
                                    })
                                }
                                }
                            >
                                <option value="">-- Select Employee --</option>
                                {employees.map((e: Employee) => (
                                    <option key={e.employeeId} value={e.employeeId}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="department">Department</Label>
                            <select
                                required
                                id="department"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
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
                            <Label className="pt-4 pb-2" htmlFor="roomNum">Room Number</Label>
                            <Input
                                required
                                type="text"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                id="roomNum"
                                onChange={(e) =>
                                    setForm({...form, roomNum: e.target.value})
                                }
                            />
                        </div>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="type">Sanitation Type</Label>
                            <select
                                required
                                id="type"
                                // className="border border-gray-300 rounded-md p-2"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({...form, type: e.target.value})
                                }
                            >
                                <option value="">-- Select Type --</option>
                                <option value="GENERAL">General</option>
                                <option value="DISINFECT">Disinfect</option>
                                <option value="DEEP_CLEANING">Deep Cleaning</option>
                                <option value="WASTE_REMOVAL">Waste Removal</option>
                                <option value="PEST_CONTROL">Pest Control</option>
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="status">Room Status</Label>
                            <select
                                required
                                id="status"
                                // className="border border-gray-300 rounded-md p-2"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({...form, status: e.target.value})
                                }
                            >
                                <option value="">-- Select Room Status --</option>
                                <option value="VACANT">Vacant</option>
                                <option value="IN_USE">In Use</option>
                            </select>
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="priority">Priority</Label>
                            <select
                                required
                                id="priority"
                                // className='border border-gray-300 rounded-md p-2'
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
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
                                // className='border border-gray-300 rounded-md p-2'
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
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
                            <Label className="pt-4 pb-2" htmlFor="comments">
                                Comments
                            </Label>
                            <textarea
                                id="comments"
                                // className="border border-gray-300 rounded-md p-2 w-90"
                                className="w-80 h-8 rounded-md border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({...form, comments: e.target.value})
                                }
                            />
                        </div>


                        <Button type="submit" className="mt-6 w-full rounded-2xl border">
                            Submit
                        </Button>
                    </form>
                </div>
                </ScrollArea>
                :
                <SubmissionReqPopup>
                    <ReturnSanitationRequest {...form} />
                </SubmissionReqPopup>
            }
        </>
    );
}
