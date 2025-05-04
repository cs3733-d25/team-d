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
    DialogHeader,
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
        email: '',
    });

    const { user } = useAuth0();
    const [open, setOpen] = React.useState(false);
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);

    useEffect(() => {
        if (user?.email) {
            axios.get(`/api/employee/user/${user?.email}`)
                .then((res) => setEmployeeData(res.data))
                .catch((err) => console.error('Error fetching data:', err));
        }
    }, [user]);

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
                            <Button variant="outline">+ Make a Post</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        </DialogHeader>
                            <div className="flex flex-col items-center gap-4 bg-white">
                                <div className="bg-blue-900 rounded-md px-6 py-4 max-w-5xl w-full mx-auto">
                                    <h2 className="text-4xl font-bold text-white text-center">
                                        Make a Forum Post
                                    </h2>
                                </div>
                                <form onSubmit={onSubmit}>
                                    {user ? (
                                        <div>
                                            <Label className="pt-4 pb-2" htmlFor="employeeName">
                                                Employee:
                                            </Label>
                                            <div>
                                                {employeeData?.firstName} {employeeData?.lastName}
                                            </div>
                                        </div>
                                    ) : (
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
                                    )}

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
                                        <textarea
                                            required
                                            id="content"
                                            className="w-80 h-30 rounded-md border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    content: e.target.value
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
                    </DialogContent>
                </Dialog>
            </ScrollArea>
        </>
    );
}

export default ForumPostPopup;
