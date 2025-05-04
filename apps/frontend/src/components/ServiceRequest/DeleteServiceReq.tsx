import React, { useState } from "react";
import axios from "axios";
import ProcessAnimation
import ConfirmationModal from "@/components/ConfirmationModal"; // Import the modal component
import { Trash } from "react-feather";

export default function DeleteServiceReq({ row }) {
    const request = row.original as ServiceRequest;
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [isDeletedOpen, setDeletedOpen] = useState(false);

    const handleDelete = async () => {
        await axios.delete(`/api/servicereqs/${Number(request.requestId)}`);
        setConfirmOpen(false);
        setDeletedOpen(true);
    };

    return (
        <>
            <button className="pl-4 w-full text-left" onClick={() => setConfirmOpen(true)}>
                <Trash className="text-gray-500"/>
            </button>

            {/* Confirmation Popup */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this request?"
            />

            {/* Deletion Success Popup */}
            <ConfirmationModal
                isOpen={isDeletedOpen}
                onClose={() => setTimeout(() => setDeletedOpen(false), 15000)}
                onConfirm={() => setTimeout(() => setDeletedOpen(false), 15000)}
                message="The request has been successfully deleted."
            />

        </>
    );
}
