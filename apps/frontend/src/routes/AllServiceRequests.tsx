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

export interface TranslatorRequest{
    languageFrom: string;
    languageTo: string;
    startDateTime: number;
    endDateTime: number;
}

export interface EquipmentRequest {
    medicalDevice: string;
    signature: string;
    quantity: number;
    startDateTime: string;
    endDateTime: string;
}

export interface SecurityRequest {
    numOfGuards: number;
    securityType: string;
}

export interface SanitationRequest {
    type: string;
    status: string;
}

export interface ServiceRequest {
    requestId: number;
    createdAt: number;
    updatedAt: number;
    assignedEmployeeId: number;
    translatorRequest: TranslatorRequest;
    equipmentRequest: EquipmentRequest;
    securityRequest: SecurityRequest;
    sanitationRequest: SanitationRequest;
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
    comments: string;
    roomNum: string;
    // employee name will be displayed in the table in later iterations
    // employeeName: string;
}


export default function ShowAllRequests() {
    const [dataTranslator, setDataTranslator] = useState<ServiceRequest[]>([]);
    const [dataEquipment, setDataEquipment] = useState<ServiceRequest[]>([]);
    const [dataSecurity, setDataSecurity] = useState<ServiceRequest[]>([]);
    const [dataSanitation, setDataSanitation] = useState<ServiceRequest[]>([]);
    const fetchData = async () => {
        try {
            const translatorResponse = await axios.get('/api/servicereqs/translator');
            setDataTranslator(translatorResponse.data);
            console.log(translatorResponse.data);

            const equipmentResponse = await axios.get('/api/servicereqs/equipment');
            setDataEquipment(equipmentResponse.data);
            console.log(equipmentResponse.data);

            const securityResponse = await axios.get('/api/servicereqs/security');
            setDataSecurity(securityResponse.data);
            console.log(securityResponse.data);

            const sanitationResponse = await axios.get('/api/servicereqs/sanitation');
            setDataSanitation(sanitationResponse.data);
            console.log(sanitationResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect( () => {
        fetchData().then();
    }, [])

    return (
        <>
            <div className="min-h-screen w-full p-6 bg-white">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Service Request Database:</h2>
                    <br/>
                </div>

                <h2 className="text-xl font-bold">Translator Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            {/*<TableHead>Employee Name</TableHead>*/}
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Language To</TableHead>
                            <TableHead>Language From</TableHead>
                            <TableHead>Comments</TableHead>
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
                                {/*<TableCell>{element.employeeName}</TableCell>*/}
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.translatorRequest.languageTo}</TableCell>
                                <TableCell>{element.translatorRequest.languageFrom}</TableCell>
                                <TableCell>{element.comments}</TableCell>
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
                            {/*<TableHead>Employee Name</TableHead>*/}
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Medical Device</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Signature</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dataEquipment.map((element, j) => (
                            <TableRow key={j}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.employeeRequestedById}</TableCell>
                                {/*<TableCell>{element.employeeName}</TableCell>*/}
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.equipmentRequest.medicalDevice}</TableCell>
                                <TableCell>{element.equipmentRequest.quantity}</TableCell>
                                <TableCell>{element.equipmentRequest.signature}</TableCell>
                                <TableCell>{element.comments}</TableCell>
                                <TableCell>{element.priority}</TableCell>
                                <TableCell>{element.requestStatus}</TableCell>
                                <TableCell>{element.createdAt}</TableCell>
                                <TableCell>{element.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


                <h2 className="text-xl font-bold">Security Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            {/*<TableHead>Employee Name</TableHead>*/}
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Security Type</TableHead>
                            <TableHead>Guards Needed</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dataSecurity.map((element, j) => (
                            <TableRow key={j}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.employeeRequestedById}</TableCell>
                                {/*<TableCell>{element.employeeName}</TableCell>*/}
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.securityRequest.securityType}</TableCell>
                                <TableCell>{element.securityRequest.numOfGuards}</TableCell>
                                <TableCell>{element.comments}</TableCell>
                                <TableCell>{element.priority}</TableCell>
                                <TableCell>{element.requestStatus}</TableCell>
                                <TableCell>{element.createdAt}</TableCell>
                                <TableCell>{element.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


                <h2 className="text-xl font-bold">Sanitation Requests</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            {/*<TableHead>Employee Name</TableHead>*/}
                            <TableHead>Assigned Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Sanitation Type</TableHead>
                            <TableHead>Room Status</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dataSanitation.map((element, i) => (
                            <TableRow key={i}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.employeeRequestedById}</TableCell>
                                {/*<TableCell>{element.employeeName}</TableCell>*/}
                                <TableCell>{element.departmentUnderId}</TableCell>
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                                <TableCell>{element.sanitationRequest.type}</TableCell>
                                <TableCell>{element.sanitationRequest.status}</TableCell>
                                <TableCell>{element.comments}</TableCell>
                                <TableCell>{element.roomNum}</TableCell>
                                <TableCell>{element.priority}</TableCell>
                                <TableCell>{element.requestStatus}</TableCell>
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

