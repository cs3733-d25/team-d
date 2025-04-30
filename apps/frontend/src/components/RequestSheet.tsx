import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Label} from "@radix-ui/react-label";

import {
    ServiceRequest,
    TranslatorRequest,
    EquipmentRequest,
    SecurityRequest,
    SanitationRequest,
    Employee
} from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Department} from "@/routes/Directions.tsx";

type RequestSheetProps = {
    ID: number;
    requestType: string;
    trigger?: React.ReactNode;
    onUpdate?: () => void;
};

const RequestSheet: React.FC<RequestSheetProps> = ({ID, requestType, trigger, onUpdate}) => {
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [translator, setTranslator] = useState<TranslatorRequest | null>(null);
    const [equipment, setEquipment] = useState<EquipmentRequest | null>(null);
    const [security, setSecurity] = useState<SecurityRequest | null>(null);
    const [sanitation, setSanitation] = useState<SanitationRequest | null>(null);
    const [open, setOpen] = React.useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchData = async () => {
        try {
            const translatorRes = (await axios.get('/api/servicereqs/translator')).data as ServiceRequest[];
            const equipmentRes = (await axios.get('/api/servicereqs/equipment')).data as ServiceRequest[];
            const securityRes = (await axios.get('/api/servicereqs/security')).data as ServiceRequest[];
            const sanitationRes = (await axios.get('/api/servicereqs/sanitation')).data as ServiceRequest[];

            // setTranslator(translatorRes.translatorRequest);
            // setEquipment(equipmentRes.equipmentRequest);
            // setSecurity(securityRes.securityRequest);
            // setSanitation(sanitationRes.sanitationRequest);

            const allRequests: ServiceRequest[] = [
                ...translatorRes,
                ...equipmentRes,
                ...securityRes,
                ...sanitationRes,
            ];

            console.log(allRequests);

            const match = allRequests.find(req => req.requestId === ID);
            if (match) {
                setRequest(match);
            }
        } catch (error) {
            console.error("Error fetching service requests:", error);
        }
    };

    const formattedDate = new Date();

    const [requestedById, setRequestedById] = useState("");
    const [requestedByFirstName, setRequestedByFirstName] = useState("");
    const [requestedByLastName, setRequestedByLastName] = useState("");
    const [department, setDepartment] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [roomNum, setRoomNum] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [languageTo, setLanguageTo] = useState("");
    const [languageFrom, setLanguageFrom] = useState("");
    const [translatorStart, setTranslatorStart] = useState(formattedDate);
    const [translatorEnd, setTranslatorEnd] = useState(formattedDate);
    const [equipmentStart, setEquipmentStart] = useState(formattedDate);
    const [equipmentEnd, setEquipmentEnd] = useState(formattedDate);
    const [quantity, setQuantity] = useState("");
    const [medicalDevice, setMedicalDevice] = useState("");
    const [signature, setSignature] = useState("");
    const [securityType, setSecurityType] = useState("");
    const [guards, setGuards] = useState("");
    const [sanitationType, setSanitationType] = useState("");
    const [roomStatus, setRoomStatus] = useState("");
    const [comments, setComments] = useState("");

    useEffect(() => {
        fetchData();
        axios.get(API_ROUTES.DEPARTMENT + "/all").then((response) => {
            setDepartments(response.data)
        });
        axios.get(API_ROUTES.EMPLOYEE + "/names").then((response) => {
            setEmployees(response.data)
        });
    }, []);

    useEffect(() => {
        console.log(request);
        if (request) {
            setRequestedById(request.employeeRequestedById.toString());
            setRequestedByFirstName(request.employeeRequestedBy.firstName);
            setRequestedByLastName(request.employeeRequestedBy.lastName);
            setDepartmentName(request.departmentUnder.name);
            setDepartment(request.departmentUnderId.toString());
            setRoomNum(request.roomNum);
            setPriority(request.priority);
            setStatus(request.requestStatus)
            if (request.translatorRequest) {
                setLanguageTo(request.translatorRequest.languageTo)
                setLanguageFrom(request.translatorRequest.languageFrom)
                setTranslatorStart(new Date(request.translatorRequest.startDateTime))
                setTranslatorEnd(new Date(request.translatorRequest.endDateTime))
            }
            if (request.equipmentRequest) {
                setEquipmentStart(new Date(request.equipmentRequest.endDateTime))
                setEquipmentEnd(new Date(request.equipmentRequest.endDateTime))
                setQuantity(request.equipmentRequest.quantity.toString())
                setMedicalDevice(request.equipmentRequest.medicalDevice)
                setSignature(request.equipmentRequest.signature)
            }
            if (request.securityRequest) {
                setSecurityType(request.securityRequest.securityType)
                setGuards(request.securityRequest.numOfGuards.toString())
            }
            if (request.sanitationRequest) {
                setSanitationType(request.sanitationRequest.type)
                setRoomStatus(request.sanitationRequest.status)
            }
            setComments(request.comments)
        }
    }, [request]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ? trigger : (
                    <Button variant="outline">Edit Request</Button>
                )}
            </SheetTrigger>
            <SheetContent className="grid gap-1s py-4">
                {request && (
                    <React.Fragment>
                        <SheetHeader>
                            <SheetTitle>Edit request</SheetTitle>
                        </SheetHeader>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="employeeName">
                                Employee Name
                            </Label>
                            <select
                                required
                                id="employeeName"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setRequestedById(e.target.value)}
                            >
                                <option value={requestedById}>{requestedByFirstName} {requestedByLastName}</option>
                                {employees.map((e: Employee) => (
                                    <option key={e.employeeId} value={e.employeeId}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="department">
                                Department
                            </Label>
                            <select
                                required
                                id="department"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setDepartment(e.target.value)}
                            >
                                <option value={department}>{departmentName}</option>
                                {departments.map((d: Department) => (
                                    <option key={d.departmentId + 1} value={d.departmentId}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roomNum" className="text-left">
                                Room
                            </Label>
                            <Input id="roomNum"
                                   value={roomNum}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRoomNum(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-left">
                                Priority
                            </Label>
                            <select
                                required
                                id="priority"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setPriority(e.target.value)}
                            >
                                <option value={request.priority}>{request.priority}</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <Label className="pt-4 pb-2" htmlFor="requestStatus">
                                Request Status
                            </Label>
                            <select
                                required
                                id="requestStatus"
                                className="w-80 h-8 rounded-2xl border border-gray-500 px-4 transition-colors duration-300 focus:border-blue-500 focus:bg-blue-100"
                                onChange={(e) =>
                                    setStatus(e.target.value)}
                            >
                                <option value={request.requestStatus}>{request.requestStatus}</option>
                                <option value="Unassigned">Unassigned</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Working">Working</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        {requestType === "Translator" ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="langaugeTo" className="text-left">
                                        Language To
                                    </Label>
                                    <Input id="langaugeTo"
                                           value={languageTo}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setLanguageTo(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="langaugeFrom" className="text-left">
                                        Language From
                                    </Label>
                                    <Input id="languageFrom"
                                           value={languageFrom}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setLanguageFrom(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="startDateTime" className="text-left">
                                        Start Date
                                    </Label>
                                    <Input id="startDateTime"
                                           value={translatorStart.toISOString().slice(0, 16)}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) => {
                                               const date = new Date(e.target.value)
                                               setTranslatorStart(date)}
                                           }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="endDateTime" className="text-left">
                                        End Date
                                    </Label>
                                    <Input id="endDateTime"
                                           value={translatorEnd.toISOString().slice(0, 16)}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) => {
                                               const date = new Date(e.target.value)
                                               setTranslatorEnd(date)}
                                           }
                                    />
                                </div>
                            </div>
                        ) : requestType === "Equipment" ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="startDateTime" className="text-left">
                                        Start Date
                                    </Label>
                                    <Input id="startDateTime"
                                           value={equipmentStart.toISOString().slice(0, 16)}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) => {
                                               const date = new Date(e.target.value)
                                               setEquipmentStart(date)}
                                           }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="endDateTime" className="text-left">
                                        End Date
                                    </Label>
                                    <Input id="endDateTime"
                                           value={equipmentEnd.toISOString().slice(0, 16)}
                                           className="col-span-3"
                                           type="datetime-local"
                                           onChange={(e) => {
                                               const date = new Date(e.target.value)
                                               setEquipmentEnd(date)}
                                           }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantity" className="text-left">
                                        Quantity
                                    </Label>
                                    <Input id="quantity"
                                           value={quantity}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="medicalDevice" className="text-left">
                                        Medical Device
                                    </Label>
                                    <Input id="medicalDevice"
                                           value={medicalDevice}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setMedicalDevice(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="signature" className="text-left">
                                        Signature
                                    </Label>
                                    <Input id="signature"
                                           value={signature}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setSignature(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : requestType === "Security" ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="securityType" className="text-left">
                                        Security Type
                                    </Label>
                                    <Input id="securityType"
                                           value={securityType}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setSecurityType(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="numOfGuards" className="text-left">
                                        Number of Guards
                                    </Label>
                                    <Input id="numOfGuards"
                                           value={guards}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setGuards(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : requestType === "Sanitation" ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-left">
                                        Type
                                    </Label>
                                    <Input id="type"
                                           value={sanitationType}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setSanitationType(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-left">
                                        Room Status
                                    </Label>
                                    <Input id="status"
                                           value={roomStatus}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setRoomStatus(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="comments" className="text-left">
                                Comments
                            </Label>
                            <Input id="comments"
                                   value={comments}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setComments(e.target.value)}
                            />
                        </div>
                            <SheetFooter>
                                <Button type="submit"
                                        onClick={async () => {
                                            try {
                                                const updatedRequest = {
                                                    ...request!,
                                                    employeeRequestedById: Number(requestedById),
                                                    departmentUnderId: Number(department),
                                                    roomNum: roomNum,
                                                    priority: priority,
                                                    requestStatus: status,
                                                    languageTo: languageTo,
                                                    languageFrom: languageFrom,
                                                    startDateTime: new Date((translatorStart || equipmentStart) + ":00").toISOString(),
                                                    endDateTime: new Date((translatorEnd|| equipmentEnd) + ":00").toISOString(),
                                                    quantity: Number(quantity),
                                                    medicalDevice: medicalDevice,
                                                    signature: signature,
                                                    securityType: securityType,
                                                    numOfGuards: Number(guards),
                                                    sanitationType: sanitationType,
                                                    status: roomStatus,
                                                    comments: comments,
                                                };
                                                await axios.put(`/api/servicereqs/${ID}`, updatedRequest);
                                                console.log('Request updated successfully.');
                                                if (onUpdate) {
                                                    onUpdate();
                                                }
                                                setOpen(false);
                                            } catch (error) {
                                                console.error('Failed to update request', error);
                                            }
                                        }}
                                >Save changes</Button>
                            </SheetFooter>
                    </React.Fragment>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default RequestSheet;