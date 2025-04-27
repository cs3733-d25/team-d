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
};

const RequestSheet: React.FC<RequestSheetProps> = ({ID, requestType}) => {
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

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Edit Request</Button>
            </SheetTrigger>
            <SheetContent>
                {request && (
                    <React.Fragment>
                        <SheetHeader>
                            <SheetTitle>Edit request</SheetTitle>
                        </SheetHeader>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeRequestedById" className="text-right">
                                Requested By
                            </Label>
                            <Input id="employeeRequestedById"
                                   value={request.employeeRequestedById}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, employeeRequestedById: Number(e.target.value)} : null)
                                   }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assignedEmployeeId" className="text-right">
                                Assigned To
                            </Label>
                            <Input id="assignedEmployeeId"
                                   value={request.assignedEmployeeId}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, assignedEmployeeId: Number(e.target.value)} : null)
                                   }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="departmentUnderId" className="text-right">
                                Department
                            </Label>
                            <Input id="departmentUnderId"
                                   value={request.departmentUnderId}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, departmentUnderId: Number(e.target.value)} : null)
                                   }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roomNum" className="text-right">
                                Room
                            </Label>
                            <Input id="roomNum"
                                   value={request.roomNum || ""}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, roomNum: e.target.value} : null)
                                   }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                                Priority
                            </Label>
                            <Input id="priority"
                                   value={request.priority || ""}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, priority: e.target.value} : null)
                                   }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="requestStatus" className="text-right">
                                Status
                            </Label>
                            <Input id="requestStatus"
                                   value={request.requestStatus || ""}
                                   className="col-span-3"
                                   onChange={(e) =>
                                       setRequest(prev => prev ? {
                                           ...prev, requestStatus: e.target.value} : null)
                                   }
                            />
                        </div>
                        {requestType === "Translator" ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="langaugeTo" className="text-right">
                                        Language To
                                    </Label>
                                    <Input id="langaugeTo"
                                           value={request.translatorRequest.languageTo || ""}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setRequest(prev => prev ? {
                                                   ...prev, languageTo: e.target.value} : null)
                                               }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="langaugeFrom" className="text-right">
                                        Language From
                                    </Label>
                                    <Input id="languageFrom"
                                           value={request.translatorRequest.languageFrom || ""}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setRequest(prev => prev ? {
                                                   ...prev, languageFrom: e.target.value} : null)
                                           }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="startDateTime" className="text-right">
                                        Start Date
                                    </Label>
                                    <Input id="startDateTime"
                                           value={request.translatorRequest.startDateTime || ""}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setRequest(prev => prev ? {
                                                   ...prev, startDateTime: e.target.value} : null)
                                           }
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="endDateTime" className="text-right">
                                        End Date
                                    </Label>
                                    <Input id="endDateTime"
                                           value={request.translatorRequest.endDateTime || ""}
                                           className="col-span-3"
                                           onChange={(e) =>
                                               setRequest(prev => prev ? {
                                                   ...prev, endDateTime: e.target.value} : null)
                                           }
                                    />
                                </div>
                            </div>
                            ) : requestType === "Equipment" ? (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="startDateTime" className="text-right">
                                            Start Date
                                        </Label>
                                        <Input id="startDateTime"
                                               value={request.equipmentRequest.startDateTime || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, startDateTime: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="endDateTime" className="text-right">
                                            End Date
                                        </Label>
                                        <Input id="endDateTime"
                                               value={request.equipmentRequest.endDateTime || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, endDateTime: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="quantity" className="text-right">
                                            Quantity
                                        </Label>
                                        <Input id="quantity"
                                               value={request.equipmentRequest.quantity}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, quantity: Number(e.target.value)} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="medicalDevice" className="text-right">
                                            Medical Device
                                        </Label>
                                        <Input id="medicalDevice"
                                               value={request.equipmentRequest.medicalDevice || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, medicalDevice: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="signature" className="text-right">
                                            Signature
                                        </Label>
                                        <Input id="signature"
                                               value={request.equipmentRequest.signature || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, signature: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                </div>
                            ) : requestType === "Security" ? (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="securityType" className="text-right">
                                            Security Type
                                        </Label>
                                        <Input id="securityType"
                                               value={request.securityRequest.securityType || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, securityType: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="numOfGuards" className="text-right">
                                            Number of Guards
                                        </Label>
                                        <Input id="numOfGuards"
                                               value={request.securityRequest.numOfGuards}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, numOfGuards: Number(e.target.value)} : null)
                                               }
                                        />
                                    </div>
                                </div>
                            ) : requestType === "Sanitation" ? (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">
                                            Type
                                        </Label>
                                        <Input id="type"
                                               value={request.sanitationRequest.type || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, type: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Room Status
                                        </Label>
                                        <Input id="status"
                                               value={request.sanitationRequest.status || ""}
                                               className="col-span-3"
                                               onChange={(e) =>
                                                   setRequest(prev => prev ? {
                                                       ...prev, status: e.target.value} : null)
                                               }
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="comments" className="text-right">
                                    Comments
                                </Label>
                                <Input id="comments"
                                       value={request.comments || ""}
                                       className="col-span-3"
                                       onChange={(e) =>
                                           setRequest(prev => prev ? {
                                               ...prev, comments: e.target.value} : null)
                                       }
                                />
                            </div>
                            <SheetFooter>
                                <Button type="submit"
                                        onClick={async () => {
                                            try {
                                                await axios.put(`/api/servicereqs/${ID}`, request);
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