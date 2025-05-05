import React, {FormEvent, useRef} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState, useEffect} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

import {Employee} from "@/routes/AllServiceRequests.tsx";

type Reply = {
    content: string
    email: string;
    postId: number;
    replierId: number;
}

type ForumReplyPopupProps = {
    ID: string;
    onReplySubmit: () => void;
};

const ForumReplyPopup: React.FC<ForumReplyPopupProps> = ({ID, onReplySubmit}) => {

    const [form, setForm] = useState<Reply>({
        content: '',
        email: '',
        postId: 0,
        replierId: 0,
    });

    const { user } = useAuth0();
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);

    useEffect(() => {
        if (user?.email) {
            axios
                .get(`/api/employee/user/${user.email}`)
                .then((res) => {
                    const emp = res.data;
                    setEmployeeData(emp);
                    setForm((reply) => ({
                        ...reply,
                        email: user.email || "",
                        replierId: emp.employeeId,
                    }));
                })
                .catch((err) => console.error("Error fetching employee data:", err));
        }
    }, []);

   const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios
            .post(API_ROUTES.FORUM + "/reply/" + ID, form)
            .then(() => {
                onReplySubmit(); // trigger reload in parent
                setForm({ content: '', email: '', postId: 0, replierId: 0}); // optional: clear form
                if (textAreaRef.current)
                    textAreaRef.current.value = '';
            })
            .catch((err) => {
                console.error("Error submitting forum reply:", err);
            });
    };


    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className=" md:flex-row gap-6">
                    {/* Left Column: Email or Employee */}
                    <div className="">
                        {user ? (
                            <div>
                                <Label
                                    className="block pb-1 text-sm font-medium text-gray-700"
                                    htmlFor="employeeName"
                                >
                                    Employee
                                </Label>
                                <div className="text-gray-900">
                                    {employeeData?.firstName} {employeeData?.lastName}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Label
                                    className="block pb-1 text-sm font-medium text-gray-700"
                                    htmlFor="email"
                                >
                                    Email
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id="email"
                                    className="w-full h-10 rounded-md border border-gray-300 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <br></br>
                    <div className="">
                        <Label
                            className="block pb-1 text-sm font-medium text-gray-700"
                            htmlFor="content"
                        >
                            Content
                        </Label>
                        <textarea
                            required
                            ref={textAreaRef}
                            id="content"
                            className="w-full h-32 rounded-md border border-gray-300 px-4 py-2 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    content: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full md:w-1/2 bg-blue-900 text-white"
                        onClick={() => {
                            setForm({
                                ...form,
                                replierId: Number(employeeData?.employeeId),
                            })
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </>
    );
}

export default ForumReplyPopup;
