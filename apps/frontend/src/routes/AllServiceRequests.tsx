import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import getAllRequests from "@/services/servicerequests.ts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table.tsx";
import axios from "axios";

interface TranslatorRequest {
    languageFrom: string;
    languageTo: string;
    roomNum: number;
    startDateTime: number;
    endDateTime: number;
    serviceRequestId: number;
}

interface EquipmentRequest {
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
    translatorRequest: TranslatorRequest[];
    requestStatus: string;
    priority: string;
    employeeRequestedById: number;
    departmentUnderId: number;
}

export default function ShowAllRequests() {
    const [data, setData] = useState<ServiceRequest[]>([]);

    const getRequests = async() => {
        try {
            const data = await axios.get('api/servicereqs');
            // console.log(data.data);
            // curRequests.push(data.data);
            // console.log(curRequests);
            setData(data.data);
            console.log('Data:' + data.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        console.log('Fetching---');
        // getRequests();
        axios.get('api/servicereqs').then((response) => {
            setData(response.data);
            console.log(response.data);
        })
    }, [])

    return (
        <>
            <div className="min-h-screen w-full p-6 bg-white">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Service Request Database: Translator Requests</h2>
                </div>

                {/* Data table (headers only for now) */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Request ID</TableHead>
                            <TableHead>Language To</TableHead>
                            <TableHead>Language From</TableHead>
                            <TableHead>Room Number</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                            <TableHead>Assigned Employee</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Empty table body for now */}
                    <TableBody>
                        {data.map((element, i) => (
                            <TableRow key={i}>
                                <TableCell>{element.requestId}</TableCell>
                                <TableCell>{element.translatorRequest[0].languageTo}</TableCell>
                                <TableCell>{element.translatorRequest[0].languageFrom}</TableCell>
                                <TableCell>{element.translatorRequest[0].roomNum}</TableCell>
                                <TableCell>{element.createdAt}</TableCell>
                                <TableCell>{element.updatedAt}</TableCell>
                                <TableCell>{element.assignedEmployeeId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

