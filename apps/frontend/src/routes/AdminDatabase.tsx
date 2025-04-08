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
import {GetDirectory} from "@/database/csv-export.ts";
import {updateDirectory} from "@/database/csv-import.ts";
import { useState, useEffect } from 'react';
import axios from "axios";

type department = {
    departmentId: number;
    name: string;
    floor: number;
    suite: string;
    specialtyServices: string;
    hours: string;
    telephone: string;
}

const AdminDatabase: React.FC = () => {
    const [departments, currDepartments] = useState<department[]>([]);
    const [loading, setLoading] = React.useState(false); // true means it needs to reload
    const getDepartments = async() => {
        try{
            const data = await axios.get('api/department');
            currDepartments(data.data);
            setLoading(false);
        }catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getDepartments();
    }, [loading]);

    const  importOnClick = async () => {
        await updateDirectory();
        await setLoading(true);
    }
    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <div className="flex items-center gap-4 mb-6">
                <Button onClick={() => GetDirectory()}>Export as CSV</Button>

                <Input type="file" accept=".csv" className="max-w-xs" id="directory"/>

                <Button onClick={() => importOnClick()}>Import CSV</Button>

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
                    {departments.map((department,i) => (
                        <TableRow key={i}>
                            <TableCell>{department.departmentId}</TableCell>
                            <TableCell>{department.name}</TableCell>
                            <TableCell>{department.floor}</TableCell>
                            <TableCell>{department.suite}</TableCell>
                            <TableCell>{department.specialtyServices}</TableCell>
                            <TableCell>{department.hours}</TableCell>
                            <TableCell>{department.telephone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminDatabase;



