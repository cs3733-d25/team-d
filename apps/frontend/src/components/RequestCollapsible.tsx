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
                <Table className="border rounded-full">
                    <TableHeader className="bg-gray-50">
                        <TableRow className={"border"}>
                            {requestType === "Translator" ? (
                                <>
                                    <TableHead className="text-black">Language To</TableHead>
                                    <TableHead className="text-black">Language From</TableHead>
                                    <TableHead className="text-black">Start Date</TableHead>
                                </>
                            ) : requestType === "Equipment" ? (
                                <>
                                    <TableHead className="text-black">End Date</TableHead>
                                    <TableHead className="text-black">Start Time</TableHead>
                                    <TableHead className="text-black">Quantity</TableHead>
                                    <TableHead className="text-black">Medical Device</TableHead>
                                    <TableHead className="text-black">Signature</TableHead>
                                </>
                            ) : requestType === "Security" ? (
                                <>
                                    <TableHead className="text-black">Security Needed For</TableHead>
                                    <TableHead className="text-black">Number of Guards</TableHead>
                                </>
                            ) : requestType === "Sanitation" ? (
                                <>
                                    <TableHead className="text-black">Type</TableHead>
                                    <TableHead className="text-black">Status</TableHead>
                                </>
                            ) : null}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
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
    );
}

export default RequestCollapsible;