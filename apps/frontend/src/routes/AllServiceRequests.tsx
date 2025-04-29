import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.tsx";
import axios from "axios";
import {
    ColumnDef,
    createColumnHelper,
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
import {ArrowUpDown, ChevronDown, Funnel, MoreHorizontal, SquarePen, Trash, UserPen} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import RequestCollapsible from "@/components/RequestCollapsible.tsx"
import RequestSheet from "@/components/RequestSheet.tsx"
import AssignEmployeeDialog from "@/components/AssignEmployeeDialog.tsx"

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'none' | 'select'
        filterOptions?: string[];
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
    assignedEmployeeId: number | null;
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

export type Employee = {
    employeeId: number;
    firstName: string;
    lastName: string;
}

export const getRequestType = (request: ServiceRequest): string => {
    if (request.translatorRequest) {
        return "Translator";
    }
    if (request.equipmentRequest) {
        return "Equipment";
    }
    if (request.securityRequest) {
        return "Security";
    }
    if (request.sanitationRequest) {
        return "Sanitation";
    }
    return "Unknown"; // Fallback in case nothing matches
};

export const columns: ColumnDef<ServiceRequest>[] = [
    {
        id: "expand",
        enableHiding: false,
        cell: ({ row }) => {
            const expand = row.original
            return (
                <ChevronDown className="text-blue-950 pl-2"/>
            )
        }
    },
    {
        accessorKey: "requestType",
        header: ({ column }) => {
        },
        meta: {
            filterVariant: 'select',
            filterOptions: ["Translator", "Sanitation", "Equipment", "Security"],
        },
        filterFn: (row, columnId, filterValue: string[]) => {
            return filterValue.includes(getRequestType(row.original as ServiceRequest))
        },
        cell: ({ row }) => {
            const request = row.original as ServiceRequest;
            return getRequestType(request);
        },
    },
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
            filterVariant: 'none',
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
            filterVariant: 'none',
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
                    Assigned To
                    <ArrowUpDown />
                </Button>
            )
        },
        meta: {
            filterVariant: 'none',
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
            filterVariant: 'none',
        },
    },
    {
        accessorKey: "roomNum",
        header: ({ column }) => {
            return (
                <Button variant="ghost">Room</Button>
            )
        },
        meta: {
            filterVariant: 'none',
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {},
        meta: {
            filterVariant: "select",
            filterOptions: ["Low", "Medium", "High", "Emergency"],
        },
        filterFn: (row, columnId, filterValue: string[]) =>
            filterValue.includes(row.getValue(columnId)),
        cell: ({ getValue }) => {
            const value = getValue<string>();
            const styles =
                value === "Low"
                    ? "bg-yellow-200 text-yellow-800"
                    : value === "Medium"
                        ? "bg-orange-300 text-orange-900"
                        : value === "High"
                            ? "bg-orange-500 text-white"
                            : "bg-red-600 text-white";
            return (
                <span className={`px-2 py-1 rounded font-semibold ${styles}`}>
        {value}
      </span>
            );
        },
    },
    {
        accessorKey: "requestStatus",
        header: ({ column }) => {
        },
        meta: {
            filterVariant: 'select',
            filterOptions: ["Unassigned", "Assigned", "Working", "Done"],
        },
        filterFn: (row, columnId, filterValue: string[]) => {
            return filterValue.includes(row.getValue(columnId))
        },
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
            filterVariant: 'none',
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
            filterVariant: 'none',
        },
    },
    {
        id: "assignEmployee",
        enableHiding: false,
        cell: ({ row }) => {
            const request = row.original

            return (
                <AssignEmployeeDialog ID={row.original.requestId}
                              requestType={getRequestType(row.original)}
                              trigger={<div className="pl-4 w-full text-left"><UserPen className="text-gray-500"/></div>}
                />
            )
        }
    },
    {
        id: "editRequest",
        enableHiding: false,
        cell: ({ row }) => {
            const request = row.original

            return (
                <RequestSheet ID={row.original.requestId}
                              requestType={getRequestType(row.original)}
                              trigger={<div className="pl-4 w-full text-left"><SquarePen className="text-gray-500"/></div>}
                />
            )
        }
    },
    {
        id: "deleteRequest",
        enableHiding: false,
        cell: ({ row }) => {
            const request = row.original

            return (
                <div className="pl-4 w-full text-left"><Trash className="text-gray-500"/></div>
            )
        }
    },
]



export default function ShowAllRequests() {
    const [data, setData] = useState<ServiceRequest[]>([]);

    const fetchData = async () => {
        try {
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
            <div className="border rounded-md">
                <Table className="rounded-md">
                    <TableHeader className="bg-blue-900 rounded-md">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            // asc: <ArrowUp />,
                                                            // desc: <ArrowDown />
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
                                <Collapsible asChild>
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <TableRow
                                                className="even:bg-gray-50 hover:bg-blue-100"
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="text-wrap text-center border-b table-cell">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent asChild>
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="bg-gray-100">
                                                    <div className="transition-all duration-500 ease-in-out overflow-hidden">
                                                        <RequestCollapsible
                                                            ID={row.original.requestId}
                                                            requestType={getRequestType(row.original)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </CollapsibleContent>
                                    </>
                                </Collapsible>
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
}

function Filter({ column }: { column: Column<ServiceRequest, unknown> }) {
    const columnFilterValue = column.getFilterValue() as string[] ?? [];
    const meta = column.columnDef.meta;

    if (meta?.filterVariant === 'select') {
        const options: string[] = meta.filterOptions ??
            Array.from(column.getFacetedUniqueValues().keys()) as string[];

        const toggleOption = (option: string) => {
            const newValue = columnFilterValue.includes(option)
                ? columnFilterValue.filter((val) => val !== option)
                : [...columnFilterValue, option];

            column.setFilterValue(newValue.length ? newValue : undefined);
        }
        const columnHeaders = {
            requestType: "Service Type",
            priority: "Priority",
            requestStatus: "Status"
        };
        return (
            <DropdownMenu>
                <DropdownMenuTrigger className="bg-blue-900 hover:bg-blue-950 inline rounded-md">
                    <Button
                        variant="ghost" className="ml-auto bg-blue-900 hover:bg-blue-950"
                    >
                        {columnHeaders[column.id as keyof typeof columnHeaders]}
                        <Funnel/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {options.map((value) => (
                        <DropdownMenuCheckboxItem
                            key={value} className="items-center space-x-2"
                            checked={columnFilterValue.includes(value)}
                            onCheckedChange={() => toggleOption(value)}>
                            {value}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}