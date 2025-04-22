import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";

import RequestsInfo from "@/components/RequestCollapsible.tsx"
import {ServiceRequest} from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RequestsInfoTable() {
    const requests = [...]

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
                            requests.map((link) => (
                                        <TableRow>
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