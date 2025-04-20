import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.tsx";
import axios from "axios";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    FilterFn,
    Row, Column, RowData,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

const priorityList = ["Low", "Medium", "High", "Emergency"];

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}

export type TranslatorRequest = {
    languageFrom: string;
    languageTo: string;
    startDateTime: number;
    endDateTime: number;
}

export type EquipmentRequest = {
    medicalDevice: string;
    signature: string;
    quantity: number;
    startDateTime: string;
    endDateTime: string;
}

export type SecurityRequest = {
    numOfGuards: number;
    securityType: string;
}

export type SanitationRequest = {
    type: string;
    status: string;
}

export type ServiceRequest = {
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
    // employeeName: string; // For later use
}

export const exactFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const cellValue = row.getValue(columnId);
    return filterValue === "" || cellValue === filterValue;
}

export const columns: ColumnDef<ServiceRequest>[] = [
    {
        accessorKey: "requestId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Request ID
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "employeeRequestedById",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Requested By
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "assignedEmployeeId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned Employee
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "departmentUnderId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Department
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "roomNum",
        header: ({ column }) => {
            return (
                <Button variant="ghost">Room Number</Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "comments",
        header: ({ column }) => {
            return (
                <Button variant="ghost">Comments</Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "priority",
        header: 'Priority',
        meta: {
            filterVariant: 'select',
        },
        filterFn: exactFilter,
    },
        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //         <Button variant="ghost" className="ml-auto">
        //             Priority <ChevronDown />
        //         </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end">
        //         {table
        //             .getAllColumns()
        //             .filter((column) => column.getCanHide())
        //             .map((column) => {
        //                 return (
        //                     <DropdownMenuCheckboxItem
        //                         key={column.id}
        //                         className="capitalize"
        //                         checked={column.getIsVisible()}
        //                         onCheckedChange={(value) =>
        //                             column.toggleVisibility(!!value)
        //                         }
        //                     >
        //                         {column.id}
        //                     </DropdownMenuCheckboxItem>
        //                 )
        //             })}
        //     </DropdownMenuContent>
        // </DropdownMenu>
    {
        accessorKey: "requestStatus",
        header: 'Status',
        meta: {
            filterVariant: 'select',
        },
        filterFn: exactFilter,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated At
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: undefined,
        },
    },
]



export default function ShowAllRequests() {
    const [dataTranslator, setDataTranslator] = useState<ServiceRequest[]>([]);
    const [dataEquipment, setDataEquipment] = useState<ServiceRequest[]>([]);
    const [dataSecurity, setDataSecurity] = useState<ServiceRequest[]>([]);
    const [dataSanitation, setDataSanitation] = useState<ServiceRequest[]>([]);
    const [data, setData] = useState<ServiceRequest[]>([]);

    const fetchData = async () => {
        try {
            const translatorResponse = await axios.get('/api/servicereqs/translator');
            setDataTranslator(translatorResponse.data);

            const equipmentResponse = await axios.get('/api/servicereqs/equipment');
            setDataEquipment(equipmentResponse.data);

            const securityResponse = await axios.get('/api/servicereqs/security');
            setDataSecurity(securityResponse.data);

            const sanitationResponse = await axios.get('/api/servicereqs/sanitation');
            setDataSanitation(sanitationResponse.data);

            const dataResponse = await axios.get('/api/servicereqs');
            setData(dataResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    useEffect(() => {
        fetchData();
    }, []);

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        initialState: {
            pagination: {
                pageIndex: pagination.pageIndex,
                pageSize: data.length,
            },
        },
        onPaginationChange: setPagination,
    })

    return (
        <div className="min-h-screen w-full p-10 bg-white">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Service Request Database</h2>
            </div>
            <div className="rounded-md border">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // return (
                                    //     <TableHead key={header.id}>
                                    //         {header.isPlaceholder
                                    //             ? null
                                    //             : flexRender(
                                    //                 header.column.columnDef.header,
                                    //                 header.getContext()
                                    //             )}
                                    //     </TableHead>
                                    // )

                                    return (
                                        <th key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            //asc: ' ↑',
                                                            //desc: ' ↓',
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </th>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="even:bg-gray-50 hover:bg-blue-100"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center py-2 border-b">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-23 text-center"
                                >
                                    No Results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
        // <div className="min-h-screen w-full p-6 bg-white">
        //     <div className="flex items-center gap-4 mb-6">
        //         <h2 className="text-2xl font-bold">Service Request Database</h2>
        //     </div>
        //
        //     {/* Translator Requests */}
        //     <section className="mb-10">
        //         <h2 className="text-xl font-semibold mb-4">Translator Requests</h2>
        //         <Table className="table-auto w-full border border-gray-200">
        //             <TableHeader>
        //                 <TableRow className="bg-gray-100">
        //                     <TableHead className="text-center py-2 border-b">Request ID</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Requested By</TableHead>
        //                     {/*<TableHead className="text-center py-2 border-b">Employee Name</TableHead>*/}
        //                     <TableHead className="text-center py-2 border-b">Assigned Employee</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Department</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Room Number</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Language To</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Language From</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Comments</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Priority</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Status</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Created At</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Updated At</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {dataTranslator.map((element, i) => (
        //                     <TableRow key={i} className="even:bg-gray-50 hover:bg-gray-100">
        //                         <TableCell className="text-center py-2 border-b">{element.requestId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.employeeRequestedById}</TableCell>
        //                         {/*<TableCell className="text-center py-2 border-b">{element.employeeName}</TableCell>*/}
        //                         <TableCell className="text-center py-2 border-b">{element.assignedEmployeeId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.departmentUnderId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.roomNum}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.translatorRequest.languageTo}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.translatorRequest.languageFrom}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.comments}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.priority}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.requestStatus}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.createdAt}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.updatedAt}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     </section>
        //
        //     {/* Equipment Requests */}
        //     <section className="mb-10">
        //         <h2 className="text-xl font-semibold mb-4">Equipment Requests</h2>
        //         <Table className="table-auto w-full border border-gray-200">
        //             <TableHeader>
        //                 <TableRow className="bg-gray-100">
        //                     <TableHead className="text-center py-2 border-b">Request ID</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Requested By</TableHead>
        //                     {/*<TableHead className="text-center py-2 border-b">Employee Name</TableHead>*/}
        //                     <TableHead className="text-center py-2 border-b">Assigned Employee</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Department</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Room Number</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Medical Device</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Quantity</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Signature</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Comments</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Priority</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Status</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Created At</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Updated At</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {dataEquipment.map((element, j) => (
        //                     <TableRow key={j} className="even:bg-gray-50 hover:bg-gray-100">
        //                         <TableCell className="text-center py-2 border-b">{element.requestId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.employeeRequestedById}</TableCell>
        //                         {/*<TableCell className="text-center py-2 border-b">{element.employeeName}</TableCell>*/}
        //                         <TableCell className="text-center py-2 border-b">{element.assignedEmployeeId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.departmentUnderId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.roomNum}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.equipmentRequest.medicalDevice}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.equipmentRequest.quantity}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.equipmentRequest.signature}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.comments}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.priority}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.requestStatus}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.createdAt}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.updatedAt}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     </section>
        //
        //     {/* Security Requests */}
        //     <section className="mb-10">
        //         <h2 className="text-xl font-semibold mb-4">Security Requests</h2>
        //         <Table className="table-auto w-full border border-gray-200">
        //             <TableHeader>
        //                 <TableRow className="bg-gray-100">
        //                     <TableHead className="text-center py-2 border-b">Request ID</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Requested By</TableHead>
        //                     {/*<TableHead className="text-center py-2 border-b">Employee Name</TableHead>*/}
        //                     <TableHead className="text-center py-2 border-b">Assigned Employee</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Department</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Room Number</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Security Type</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Guards Needed</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Comments</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Priority</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Status</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Created At</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Updated At</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {dataSecurity.map((element, j) => (
        //                     <TableRow key={j} className="even:bg-gray-50 hover:bg-gray-100">
        //                         <TableCell className="text-center py-2 border-b">{element.requestId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.employeeRequestedById}</TableCell>
        //                         {/*<TableCell className="text-center py-2 border-b">{element.employeeName}</TableCell>*/}
        //                         <TableCell className="text-center py-2 border-b">{element.assignedEmployeeId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.departmentUnderId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.roomNum}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.securityRequest.securityType}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.securityRequest.numOfGuards}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.comments}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.priority}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.requestStatus}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.createdAt}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.updatedAt}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     </section>
        //
        //     {/* Sanitation Requests */}
        //     <section className="mb-10">
        //         <h2 className="text-xl font-semibold mb-4">Sanitation Requests</h2>
        //         <Table className="table-auto w-full border border-gray-200">
        //             <TableHeader>
        //                 <TableRow className="bg-gray-100">
        //                     <TableHead className="text-center py-2 border-b">Request ID</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Requested By</TableHead>
        //                     {/*<TableHead className="text-center py-2 border-b">Employee Name</TableHead>*/}
        //                     <TableHead className="text-center py-2 border-b">Assigned Employee</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Department</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Room Number</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Sanitation Type</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Room Status</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Comments</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Priority</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Status</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Created At</TableHead>
        //                     <TableHead className="text-center py-2 border-b">Updated At</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {dataSanitation.map((element, i) => (
        //                     <TableRow key={i} className="even:bg-gray-50 hover:bg-gray-100">
        //                         <TableCell className="text-center py-2 border-b">{element.requestId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.employeeRequestedById}</TableCell>
        //                         {/*<TableCell className="text-center py-2 border-b">{element.employeeName}</TableCell>*/}
        //                         <TableCell className="text-center py-2 border-b">{element.assignedEmployeeId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.departmentUnderId}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.roomNum}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.sanitationRequest.type}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.sanitationRequest.status}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.comments}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.priority}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.requestStatus}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.createdAt}</TableCell>
        //                         <TableCell className="text-center py-2 border-b">{element.updatedAt}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     </section>
        // </div>
    // );
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    if(filterVariant === "select" && column.id === "priority") {
        return (
            <select
                onChange={e => column.setFilterValue(e.target.value)}
                value={columnFilterValue?.toString()}
            >
                {}
                <option value="">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
            </select>
        );
    } else if (filterVariant === "select" && column.id === "requestStatus") {
        return (
            <select
                onChange={e => column.setFilterValue(e.target.value)}
                value={columnFilterValue?.toString()}
            >
                {}
                <option value="">All</option>
                <option value="Unassigned">Unassigned</option>
                <option value="Assigned">Assigned</option>
                <option value="Working">Working</option>
                <option value="Done">Done</option>
            </select>
        )
    }

    return null;
}