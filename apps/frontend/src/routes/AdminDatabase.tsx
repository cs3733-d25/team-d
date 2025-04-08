import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminDatabase: React.FC = () => {
    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <div className="flex items-center gap-4 mb-6">
                <Button>Export as CSV</Button>

                <Input type="file" accept=".csv" className="max-w-xs" />

                <Button>Import CSV</Button>

                {/* Vertical Separator */}
                <Separator className="h-8 mx-4" />

                {/* Table Title */}
                <h2 className="text-xl font-bold">Department Database</h2>
            </div>

            {/* Data table (headers only for now) */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-32">Department ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead>Suite</TableHead>
                        <TableHead>Specialty Services</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Telephone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* No rows yet, add <TableRow> items here as needed */}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminDatabase;



