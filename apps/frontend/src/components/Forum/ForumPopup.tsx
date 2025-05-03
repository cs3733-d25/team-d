import {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState, useEffect} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import {Department} from "@/routes/Directions.tsx";
import {Employee} from "@/routes/AllServiceRequests.tsx";


type Reply = {
    replyId: number;
    content: string;
    createdAt: Date;
    replierId: number;
    replier: Employee;
    email: string;
    postId: number;
}
type Post = {
    postId: number;
    title: string;
    content: string
    createdAt: Date;
    posterId: number;
    poster: Employee;
    email: string;
    replies: Reply[];
}

export default function ForumPopup() {

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
        employeeName: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
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
            .post(API_ROUTES.SERVICEREQS + "/translator", form)
            .then(() => {
                setSubmitted(true);
                setShowPopup(true);
            })
            .catch((err) => {
                console.error("Error submitting translator request:", err);
            });
    };
    return (
        <>
            {!submitted ? (
                <ScrollArea className="max-h-[95vh] w-115 overflow-y-auto">
                    <div className="flex flex-col items-center gap-4 bg-white">
                        <div className="bg-blue-900 rounded-md px-6 py-4 max-w-5xl w-full mx-auto">
                            <h2 className="text-4xl font-bold text-white text-center">
                                Request a Translator
                            </h2>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div>
                                <Label className="pt-4 pb-2" htmlFor="employeeName">
                                    Employee Name
                                </Label>
                                <select
                                    required
                                    id="employeeName"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>{
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
                                <Label className="pt-4 pb-2" htmlFor="department">
                                    Department
                                </Label>
                                <select
                                    required
                                    id="department"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            departmentUnderId: Number(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">-- Select Department --</option>
                                    {departments.map((d: Department) => (
                                        <option key={d.departmentId + 1} value={d.departmentId}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="roomNumber">
                                    Room Number
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id="roomNumber"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            roomNum: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="languageFrom">
                                    Language From
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id="languageFrom"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageFrom: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="languageTo">
                                    Language To
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id="languageTo"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            languageTo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="startDateTime">
                                    Start Date and Time
                                </Label>
                                <Input
                                    required
                                    type="datetime-local"
                                    id="startDateTime"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            startDateTime: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="endDateTime">
                                    End Date and Time
                                </Label>
                                <Input
                                    required
                                    type="datetime-local"
                                    id="languageFrom"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            endDateTime: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label className="pt-4 pb-2" htmlFor="priority">
                                    Priority
                                </Label>
                                <select
                                    required
                                    id="priority"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            priority: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">-- Select Priority --</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div>
                                <Label className="pt-4 pb-2" htmlFor="requestStatus">
                                    Request Status
                                </Label>
                                <select
                                    required
                                    id="requestStatus"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            requestStatus: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">-- Select Status --</option>
                                    <option value="Unassigned">Unassigned</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Working">Working</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>

                            <Label className="pt-4 pb-2" htmlFor="comments">
                                Comments
                            </Label>
                            <textarea
                                id="comments"
                                className="w-80 h-8 rounded-md border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                            />

                            <div className="flex flex-row justify-center items-center">
                                <Button type="submit" className="mt-6 w-full bg-blue-900">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            ) : (
                <SubmissionReqPopup>
                    <ReturnTranslatorRequest {...form} />
                </SubmissionReqPopup>
            )}
        </>
    );
}

