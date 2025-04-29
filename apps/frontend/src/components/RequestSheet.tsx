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

import { ServiceRequest, TranslatorRequest, EquipmentRequest, SecurityRequest, SanitationRequest } from "@/routes/AllServiceRequests.tsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

type RequestSheetProps = {
    ID: number;
    requestType: string;
    trigger?: React.ReactNode;
};

const RequestSheet: React.FC<RequestSheetProps> = ({ID, requestType, trigger}) => {
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [translator, setTranslator] = useState<TranslatorRequest | null>(null);
    const [equipment, setEquipment] = useState<EquipmentRequest | null>(null);
    const [security, setSecurity] = useState<SecurityRequest | null>(null);
    const [sanitation, setSanitation] = useState<SanitationRequest | null>(null);
    const [open, setOpen] = React.useState(false);

    const fetchData = async () => {
        try {
            const translatorRes = await axios.get('/api/servicereqs/translator');
            const equipmentRes = await axios.get('/api/servicereqs/equipment');
            const securityRes = await axios.get('/api/servicereqs/security');
            const sanitationRes = await axios.get('/api/servicereqs/sanitation');

            setTranslator(translatorRes.data);
            setEquipment(equipmentRes.data);
            setSecurity(securityRes.data);
            setSanitation(sanitationRes.data);

            const allRequests: ServiceRequest[] = [
                ...translatorRes.data,
                ...equipmentRes.data,
                ...securityRes.data,
                ...sanitationRes.data,
            ];

            const match = allRequests.find(req => req.requestId === ID);
            if (match) {
                setRequest(match);
            }
        } catch (error) {
            console.error("Error fetching service requests:", error);
        }
    };

    const formattedDate = new Date().toISOString().slice(0, 16);

    const [requestedById, setRequestedById] = useState("");
    const [department, setDepartment] = useState("");
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
    }, []);

    useEffect(() => {
        if (request) {
            setRequestedById(request.employeeRequestedById.toString());
            setDepartment(request.departmentUnderId.toString());
            setRoomNum(request.roomNum);
            setPriority(request.priority);
            setStatus(request.requestStatus)
            if (request.translatorRequest) {
                setLanguageTo(request.translatorRequest.languageTo)
                setLanguageFrom(request.translatorRequest.languageFrom)
                setTranslatorStart(new Date(request.translatorRequest.startDateTime).toISOString().slice(0, 16))
                setTranslatorEnd(new Date(request.translatorRequest.endDateTime).toISOString().slice(0, 16))
            }
            if (request.equipmentRequest) {
                setEquipmentStart(new Date(request.equipmentRequest.endDateTime).toISOString().slice(0, 16))
                setEquipmentEnd(new Date(request.equipmentRequest.endDateTime).toISOString().slice(0, 16))
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeRequestedById" className="text-left">
                                Requested By
                            </Label>
                            <Input id="employeeRequestedById"
                                   value={requestedById}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequestedById(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="departmentUnderId" className="text-left">
                                Department
                            </Label>
                            <Input id="departmentUnderId"
                                   value={department}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setDepartment(e.target.value)}
                            />
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
                                           value={translatorStart}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setTranslatorStart(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="endDateTime" className="text-left">
                                        End Date
                                    </Label>
                                    <Input id="endDateTime"
                                           value={translatorEnd}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setTranslatorEnd(e.target.value)}
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
                                           value={equipmentStart}
                                           type="datetime-local"
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setEquipmentStart(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="endDateTime" className="text-left">
                                        End Date
                                    </Label>
                                    <Input id="endDateTime"
                                           value={equipmentEnd}
                                           className="col-span-3"
                                           type="datetime-local"
                                           onChange={(e) =>
                                               setEquipmentEnd(e.target.value)}
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
                                                    startDateTime: translatorStart || equipmentStart,
                                                    endDateTime: translatorEnd || equipmentEnd,
                                                    quantity: quantity,
                                                    medicalDevice: medicalDevice,
                                                    signature: signature,
                                                    securityType: securityType,
                                                    numOfGuards: guards,
                                                    sanitationType: sanitationType,
                                                    status: roomStatus,
                                                    comments: comments,
                                                };
                                                await axios.put(`/api/servicereqs/${ID}`, updatedRequest);
                                                console.log('Request updated successfully.');
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