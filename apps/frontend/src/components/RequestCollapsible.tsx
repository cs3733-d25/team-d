import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import {ServiceRequest} from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

type RequestCollapsibleProps = {
    ID: number;
};

const RequestCollapsible: React.FC<RequestCollapsibleProps> = ({ID}) => {
    const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

    useEffect(() => {
        axios
            .get(API_ROUTES.SERVICEREQS + "/translator")
            .then((res) => {
                setRequests(res.data); // Assuming API returns an array of request objects
            })
            .catch((err) => {
                console.error("Error fetching translator requests:", err);
            });
    }, []);

    return (
        <div className="w-full sm:p-4">
            <h2 className="p-4">All links</h2>
            <div className="rounded-md sm:border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-medium">Language To</TableHead>
                            <TableHead className="font-medium">Language From</TableHead>
                            <TableHead className="font-medium">Start</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests ? (
                            requests.filter((link) => link.requestId === ID) // Filter for the specific request
                                .map((link) => (
                                        <TableRow key={link.requestId}>
                                            <TableCell>{link.translatorRequest.languageTo}</TableCell>
                                            <TableCell>{link.translatorRequest.languageFrom}</TableCell>
                                            <TableCell>{link.translatorRequest.startDateTime}
                                                <div>Hello</div>
                                            </TableCell>
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