import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReturnRequest from "@/components/ReturnRequest";
import { API_ROUTES } from "common/src/constants";


type SanitationRequestForm = {
    roomNumber: string;
    priority: string;
    type: string;
    status: string;
    comments: string;
};

export default function SanitationRequest() {
    const [form, setForm] = useState<SanitationRequestForm>({
        roomNumber: "",
        priority: "",
        type: "",
        status: "",
        comments: "",
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
            {/*{!submitted ? (*/}
                <div className="grid place-items-center h-full items-center">
                    <h2 className="text-4xl font-bold pb-3">Request Sanitation</h2>
                    <form onSubmit={onSubmit} className="flex flex-col">

                        {/* Room Number */}
                        <Label className="pb-2" htmlFor="roomNumber">
                            Room Number
                        </Label>
                        <Input
                            type="text"
                            id="roomNumber"
                            onChange={(e) =>
                                setForm({ ...form, roomNumber: e.target.value })
                            }
                        />

                        {/*<Label className="pt-4 pb-2" htmlFor="date">*/}
                        {/*    Date*/}
                        {/*</Label>*/}
                        {/*<Input*/}
                        {/*    type="date"*/}
                        {/*    id="date"*/}
                        {/*    onChange={(e) =>*/}
                        {/*        setForm({ ...form, date: e.target.value })*/}
                        {/*    }*/}
                        {/*/>*/}

                        <Label className="pt-4 pb-2" htmlFor="priority">
                            Priority
                        </Label>
                        <select
                            id="priority"
                            className="border border-gray-300 rounded-md p-2"
                            onChange={(e) =>
                                setForm({ ...form, priority: e.target.value })
                            }
                        >
                            <option value="">-- Select Priority --</option>
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>

                        <Label className="pt-4 pb-2" htmlFor="type">
                            Type
                        </Label>
                        <select
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

            {/*// ) : (*/}
            {/*//     <ReturnRequest*/}
            {/*//         languageFrom={form.roomNumber}*/}
            {/*//         languageTo={form.priority}*/}
            {/*//         roomNumber={form.date}*/}
            {/*//         startDateTime={form.type}*/}
            {/*//         endDateTime={form.comments}*/}
            {/*//     />*/}
            {/*// )}*/}
        </>
    );
}
