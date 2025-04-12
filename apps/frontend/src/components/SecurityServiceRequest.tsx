import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import ReturnSecurityRequest from "@/components/ReturnSecurityRequest.tsx";

type securityRequestForm = {
    roomNum: string;
    numOfGuards: number;
    securityType: string;
    additionalComments: string;
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
}

export default function SecurityServiceRequest() {

    const [form, setForm] = useState<securityRequestForm>({
        roomNum: '',
        numOfGuards: 0,
        securityType: '',
        additionalComments: '',
        requestStatus: '',
        priority: '',
        employeeRequestedById: 0,
        departmentUnderId: 0,
    });

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);
        setSubmitted(false);
        axios.post(API_ROUTES.SERVICEREQS+'/security', form).then(() => {
            alert("Service request submitted!");
            setSubmitted(true);
        });
    }

    return (
        <>
            {!submitted ?
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl fontbold pb-3" >Request Security</h2>
                    <form onSubmit={onSubmit}>
                        <div>
                            <Label className="pt-3 pb-2" htmlFor="employeeId">Employee ID</Label>
                            <Input
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
                            <Label className="pt-3 pb-2" htmlFor="languageFrom">Number of Guards needed:</Label>
                            <Input
                                type="number"
                                id="languageFrom"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        numOfGuards: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-3 pb-2" htmlFor="languageTo">Security Type: </Label>
                            <Input
                                type="text"
                                id="languageTo"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        securityType: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
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
                        </div>
                        <div>
                            <Label className="pt-3 pb-2" htmlFor="priority">Priority</Label>
                            <select
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
                        <div>
                            <Label className="pt-3 pb-2" htmlFor="additionalComments">Additional Comments: </Label>
                            <Input
                                type="textarea"
                                id="additionalComments"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        additionalComments: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <Button type="submit" className="mt-5">Submit</Button>
                        </div>
                    </form>
                </div>
                :
                <ReturnSecurityRequest
                    roomNum={form.roomNum}
                    numOfGuards={form.numOfGuards}
                    securityType={form.securityType}
                    additionalComments={form.additionalComments}
                    requestStatus={form.requestStatus}
                    priority={form.priority}
                    employeeRequestedById={form.employeeRequestedById}
                    departmentUnderId={form.departmentUnderId}
                />
            }
        </>
    );
}

