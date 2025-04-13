import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table.tsx";
import axios from "axios";
export interface TranslatorRequest {
    languageFrom: string;
    languageTo: string;
    roomNum: number;
    startDateTime: number;
    endDateTime: number;
    serviceRequestId: number;
}

export interface EquipmentRequest {
    medicalDevice: string;
    signature: string;
    quantity: number;
    comments: string;
    roomNum: string;
    startDateTime: string;
    endDateTime: string;
}

export interface ServiceRequest {
    requestId: number;
    createdAt: number;
    updatedAt: number;
    assignedEmployeeId: number;
    translatorRequest: TranslatorRequest;
    equipmentRequest: EquipmentRequest;
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
}

export default function ShowAllRequests() {
    const [dataTranslator, setDataTranslator] = useState<ServiceRequest[]>([]);
    const [dataEquipment, setDataEquipment] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        console.log('Fetching---');
        // getRequests();
        axios.get('api/servicereqs/translator').then((response) => {
            setDataTranslator(response.data);
            console.log(response.data);
        })

        axios.get('/api/servicereqs/equipment').then((response) => {
            setDataEquipment(response.data);
            console.log(response.data);
        })
    }, [])

    return (
        <>
            <div className="min-h-screen w-full p-6 bg-white">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Service Request Database:</h2>
                    <br />
                </div>

                <h2 className="text-xl font-bold">Translator Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Language To</TableHead>
                            <TableHead>Language From</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dataTranslator.map((element, i) => (
                            <TableRow key={i}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.employeeRequestedById}</TableCell>
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.languageTo}</TableCell>
                                <TableCell>{element.languageFrom}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.priority}</TableCell>
                                <TableCell>{element.requestStatus}</TableCell>
                                <TableCell>{element.createdAt}</TableCell>
                                <TableCell>{element.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


                <h2 className="text-xl font-bold">Equipment Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Medical Device</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Signature</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dataEquipment.map((element, j) => (
                            <TableRow key={j}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.employeeRequestedById}</TableCell>
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.medicalDevice}</TableCell>
                                <TableCell>{element.quantity}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.priority}</TableCell>
                                <TableCell>{element.requestStatus}</TableCell>
                                <TableCell>{element.comments}</TableCell>
                                <TableCell>{element.signature}</TableCell>
                                <TableCell>{element.createdAt}</TableCell>
                                <TableCell>{element.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

