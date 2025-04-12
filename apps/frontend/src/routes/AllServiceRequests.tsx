import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TranslatorRequest {
    languageFrom: string;
    languageTo: string;
    roomNum: number;
    startDateTime: number;
    endDateTime: number;
    serviceRequestId: number;
}

interface SanitationRequest {
    serviceRequestId: number;
    roomNumber: string;
    date: string;
    priority: string;
    type: string;
    status: string;
    comments: string;
}

interface AllRequestsResponse {
    translatorRequests: TranslatorRequest[];
    sanitationRequests: SanitationRequest[];
}

export default function ShowAllRequests() {
    const [translatorData, setTranslatorData] = useState<TranslatorRequest[]>([]);
    const [sanitationData, setSanitationData] = useState<SanitationRequest[]>([]);

    useEffect(() => {
        axios
            .get<AllRequestsResponse>("api/servicereqs/all")
            .then((response) => {
                setTranslatorData(response.data.translatorRequests);
                setSanitationData(response.data.sanitationRequests);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6">All Service Requests</h2>

            {/* Translator Requests Table */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-3">Translator Requests</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Language From</TableHead>
                            <TableHead>Language To</TableHead>
                            <TableHead>Room #</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {translatorData.map((req) => (
                            <TableRow key={req.serviceRequestId}>
                                <TableCell>{req.serviceRequestId}</TableCell>
                                <TableCell>{req.languageFrom}</TableCell>
                                <TableCell>{req.languageTo}</TableCell>
                                <TableCell>{req.roomNum}</TableCell>
                                <TableCell>{req.startDateTime}</TableCell>
                                <TableCell>{req.endDateTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Sanitation Requests Table */}
            <div>
                <h3 className="text-xl font-semibold mb-3">Sanitation Requests</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Room #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Comments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sanitationData.map((req) => (
                            <TableRow key={req.serviceRequestId}>
                                <TableCell>{req.serviceRequestId}</TableCell>
                                <TableCell>{req.roomNumber}</TableCell>
                                <TableCell>{req.date}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.type}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.comments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}



