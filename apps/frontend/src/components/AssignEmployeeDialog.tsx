import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {Label} from "@radix-ui/react-label";

import { ServiceRequest, TranslatorRequest, EquipmentRequest, SecurityRequest, SanitationRequest } from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import RequestSheet from "@/components/RequestSheet.tsx";

type AssignEmployeeDialogProps = {
    ID: number;
    requestType: string;
    trigger?: React.ReactNode;
    onUpdate?: () => void;
};

const AssignEmployeeDialog: React.FC<AssignEmployeeDialogProps> = ({ID, requestType, trigger, onUpdate}) => {
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [translator, setTranslator] = useState<TranslatorRequest | null>(null);
    const [equipment, setEquipment] = useState<EquipmentRequest | null>(null);
    const [security, setSecurity] = useState<SecurityRequest | null>(null);
    const [sanitation, setSanitation] = useState<SanitationRequest | null>(null);
    const [open, setOpen] = React.useState(false);
    const [assignedEmployee, setAssignedEmployee] = useState("");

    const fetchData = async () => {
        try {
            const translatorRes = await axios.get('/api/servicereqs/translator');
            const equipmentRes = await axios.get('/api/servicereqs/equipment');
            const securityRes = await axios.get('/api/servicereqs/security');
            const sanitationRes = await axios.get('/api/servicereqs/sanitation');

            setTranslator(translatorRes.data);
            setEquipment(equipmentRes.data);
            setSecurity(securityRes.data);
            setSanitation(sanitationRes.data);

            const allRequests: ServiceRequest[] = [
                ...translatorRes.data,
                ...equipmentRes.data,
                ...securityRes.data,
                ...sanitationRes.data,
            ];

            const match = allRequests.find(req => req.requestId === ID);
            if (match) {
                setRequest(match);
            }
        } catch (error) {
            console.error("Error fetching service requests:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (request?.assignedEmployeeId) {
            setAssignedEmployee(request.assignedEmployeeId.toString());
        }
    }, [request]);

    return (
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
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignedEmployeeId" className="text-left">
                        Assigned To
                    </Label>
                    <Input id="assignedEmployeeId"
                           value={assignedEmployee}
                           className="col-span-3"
                           onChange={(e) =>
                               setAssignedEmployee(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit"
                            onClick={async () => {
                                try {
                                    const updatedRequest = {
                                        ...request!,
                                        assignedEmployeeId: Number(assignedEmployee),
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
    )
}

export default AssignEmployeeDialog;