import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import {ServiceRequest} from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

type RequestCollapsibleProps = {
    ID: number;
    requestType: string;
};

const RequestCollapsible: React.FC<RequestCollapsibleProps> = ({ID,requestType}) => {
    const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [translatorRes, equipmentRes, securityRes, sanitationRes] = await Promise.all([
                    axios.get(API_ROUTES.SERVICEREQS + "/translator"),
                    axios.get(API_ROUTES.SERVICEREQS + "/equipment"),
                    axios.get(API_ROUTES.SERVICEREQS + "/security"),
                    axios.get(API_ROUTES.SERVICEREQS + "/sanitation"),
                ]);
                const allRequests: ServiceRequest[] = [
                    ...translatorRes.data,
                    ...equipmentRes.data,
                    ...securityRes.data,
                    ...sanitationRes.data,
                ];
                setRequests(allRequests);
            } catch (error) {
                console.error("Error fetching service requests:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="w-full sm:p-4">
            <div className="rounded-md sm:border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {requestType === "Translator" ? (
                                <>
                                    <TableHead className="font-medium">Language To</TableHead>
                                    <TableHead className="font-medium">Language From</TableHead>
                                    <TableHead className="font-medium">Start Date</TableHead>
                                </>
                            ) : requestType === "Equipment" ? (
                                <>
                                    <TableHead className="font-medium">End Date</TableHead>
                                    <TableHead className="font-medium">Start Time</TableHead>
                                    <TableHead className="font-medium">Quantity</TableHead>
                                    <TableHead className="font-medium">Medical Device</TableHead>
                                    <TableHead className="font-medium">Signature</TableHead>
                                </>
                            ) : requestType === "Security" ? (
                                <>
                                    <TableHead className="font-medium">Type of Security</TableHead>
                                    <TableHead className="font-medium">Number of Guards</TableHead>
                                </>
                            ) : requestType === "Sanitation" ? (
                                <>
                                    <TableHead className="font-medium">Type</TableHead>
                                    <TableHead className="font-medium">Status</TableHead>
                                </>
                            ) : null}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests ? (
                            requests.filter((link) => link.requestId === ID) // Filter for the specific request
                                .map((link) => (
                                        <TableRow key={link.requestId}>
                                            {requestType === "Translator" ? (
                                                <>
                                                    <TableCell>{link.translatorRequest.languageTo}</TableCell>
                                                    <TableCell>{link.translatorRequest.languageFrom}</TableCell>
                                                    <TableCell>{link.translatorRequest.startDateTime}</TableCell>
                                                </>
                                            ) : requestType === "Equipment" ? (
                                                <>
                                                    <TableCell>{link.equipmentRequest.endDateTime}</TableCell>
                                                    <TableCell>{link.equipmentRequest.startDateTime}</TableCell>
                                                    <TableCell>{link.equipmentRequest.quantity}</TableCell>
                                                    <TableCell>{link.equipmentRequest.medicalDevice}</TableCell>
                                                    <TableCell>{link.equipmentRequest.signature}</TableCell>
                                                </>
                                            ) : requestType === "Security" ? (
                                                <>
                                                    <TableCell>{link.securityRequest.securityType}</TableCell>
                                                    <TableCell>{link.securityRequest.numOfGuards}</TableCell>
                                                </>
                                            ) : requestType === "Sanitation" ? (
                                                    <>
                                                        <TableCell>{link.sanitationRequest.type}</TableCell>
                                                        <TableCell>{link.sanitationRequest.status}</TableCell>
                                                    </>
                                            ) : null}
                                        </TableRow>
                            ))
                        ) : null}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default RequestCollapsible;