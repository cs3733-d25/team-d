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
import { ServiceRequest, TranslatorRequest, EquipmentRequest, SecurityRequest, SanitationRequest, Employee } from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";
import {Button} from "@/components/ui/button.tsx";

type AssignEmployeeDialogProps = {
    ID: number;
    requestType: string;
    trigger?: React.ReactNode;
    onUpdate?: () => void;
    employees: Employee[];
    serviceReq: ServiceRequest;
};

const AssignEmployeeDialog: React.FC<AssignEmployeeDialogProps> = ({ID, requestType, trigger, onUpdate, employees, serviceReq}) => {
    const [request, setRequest] = useState<ServiceRequest | null>(serviceReq);
    const [open, setOpen] = React.useState(false);
    const [assignedEmployee, setAssignedEmployee] = useState("");
    const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
    const [assignedEmployeeFirstName, setAssignedEmployeeFirstName] = useState("");
    const [assignedEmployeeLastName, setAssignedEmployeeLastName] = useState("");


    useEffect(() => {
        if (request?.assignedEmployeeId) {
            setAssignedEmployee(request.assignedEmployee.toString());
            setAssignedEmployeeId(request.assignedEmployeeId.toString());
            setAssignedEmployeeFirstName(request.assignedEmployee.firstName);
            setAssignedEmployeeLastName(request.assignedEmployee.lastName);
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
                <div>
                    <Label className="pt-4 pb-2" htmlFor="assignedEmployeeId">
                        Assigned To
                    </Label>
                    <select
                        required
                        id="assignedEmployeeId"
                        className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                        onChange={(e) =>
                            setAssignedEmployeeId(e.target.value)}
                    >
                        <option value={assignedEmployeeId}>{assignedEmployeeFirstName} {assignedEmployeeLastName}</option>
                        {employees.map((e: Employee) => (
                            <option key={e.employeeId} value={e.employeeId}>
                                {e.firstName} {e.lastName}
                            </option>
                        ))}
                    </select>
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
    )
}

export default AssignEmployeeDialog;