import React, {FormEvent} from 'react';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState, useEffect} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {ScrollArea} from "@/components/ui/scrollarea.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Employee} from "@/routes/AllServiceRequests.tsx";

type Post = {
    postId: number;
    title: string;
    content: string
    posterId: number;
    email: string;
}

type ForumPostPopupProps = {
    trigger?: React.ReactNode;
};

const ForumPostPopup: React.FC<ForumPostPopupProps> = ({trigger}) => {

    const [form, setForm] = useState<Post>({
        postId: 0,
        title: '',
        content: '',
        posterId: 0,
        email: '',
    });

    const { user } = useAuth0();
    const [open, setOpen] = React.useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);

        axios
            .post(API_ROUTES.FORUM + "/post", form)
            .catch((err) => {
                console.error("Error submitting forum post:", err);
            });
    };
    return (
        <>
            <ScrollArea className="max-h-[95vh] w-115 overflow-y-auto">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        {trigger ? trigger : (
                            <Button variant="outline">Assign Employee</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Assign Employee</DialogTitle>
                            <DialogDescription>
                                Service Request {request?.requestId}
                            </DialogDescription>
                        </DialogHeader>
                            <div className="flex flex-col items-center gap-4 bg-white">
                                <div className="bg-blue-900 rounded-md px-6 py-4 max-w-5xl w-full mx-auto">
                                    <h2 className="text-4xl font-bold text-white text-center">
                                        Make a Forum Post
                                    </h2>
                                </div>
                                <form onSubmit={onSubmit}>
                                    {/*employeeId if logged in, else require email*/}
                                    if (user) {
                                    <div>
                                        <Label className="pt-4 pb-2" htmlFor="employeeName">
                                            Employee:
                                        </Label>
                                        <p>
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                    </div>
                                } else {
                                    <div>
                                        <Label className="pt-4 pb-2" htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            required
                                            type="text"
                                            id="email"
                                            className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                }

                                    <div>
                                        <Label className="pt-4 pb-2" htmlFor="title">
                                            Title
                                        </Label>
                                        <Input
                                            required
                                            type="text"
                                            id="title"
                                            className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <Label className="pt-4 pb-2" htmlFor="content">
                                            Content
                                        </Label>
                                        <Input
                                            required
                                            type="text"
                                            id="content"
                                            className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    content: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-row justify-center items-center">
                                        <Button type="submit" className="mt-6 w-full bg-blue-900">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        <DialogFooter>
                            <Button type="submit"
                                    onClick={async () => {
                                        try {
                                            const updatedRequest = {
                                                ...request!,
                                                assignedEmployeeId: Number(assignedEmployeeId),
                                            };
                                            await axios.put(`/api/servicereqs/${ID}`, updatedRequest);
                                            console.log('Assigned employee successfully.');
                                            if (onUpdate) {
                                                onUpdate();
                                            }
                                            setOpen(false);
                                        } catch (error) {
                                            console.error('Failed to assign an employee', error);
                                        }
                                    }}
                            >Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="flex flex-col items-center gap-4 bg-white">
                    <div className="bg-blue-900 rounded-md px-6 py-4 max-w-5xl w-full mx-auto">
                        <h2 className="text-4xl font-bold text-white text-center">
                            Make a Forum Post
                        </h2>
                    </div>
                    <form onSubmit={onSubmit}>
                        {/*employeeId if logged in, else require email*/}
                        if (user) {
                            <div>
                                <Label className="pt-4 pb-2" htmlFor="employeeName">
                                    Employee:
                                </Label>
                                <p>
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        } else {
                            <div>
                                <Label className="pt-4 pb-2" htmlFor="email">
                                    Email
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id="email"
                                    className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        }

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="title">
                                Title
                            </Label>
                            <Input
                                required
                                type="text"
                                id="title"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <Label className="pt-4 pb-2" htmlFor="content">
                                Content
                            </Label>
                            <Input
                                required
                                type="text"
                                id="content"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        content: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-row justify-center items-center">
                            <Button type="submit" className="mt-6 w-full bg-blue-900">
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </ScrollArea>
        </>
    );
}

export default ForumPostPopup;
