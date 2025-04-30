import {useEffect, useRef, useState} from "react";
import {DirectionsStep, PathfindingMap, PathfindingResults} from "@/GMap/GoogleMap.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCar, faWalking, faBus, faBicycle, faArrowLeft, faArrowRight, faArrowUp, faCrosshairs} from "@fortawesome/free-solid-svg-icons";
import {Switch} from '@/components/ui/switch.tsx';
import {
    API_ROUTES,
    DepartmentOptions,
    HospitalOptions,
    PathfindingOptions,
    PathfindingResponse
} from "common/src/constants.ts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
import {cn} from "@/lib/utils.ts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface TransportModeOption {
    value: string;
    label: string;
    icon: IconDefinition;
}

const transportModes: TransportModeOption[] = [
    { value: "DRIVING", label: "Driving", icon: faCar },
    { value: "WALKING", label: "Walking", icon: faWalking },
    { value: "TRANSIT", label: "Transit", icon: faBus },
    { value: "BICYCLING", label: "Bicycling", icon: faBicycle },
];

export default function NewDirections() {
    const mapRef = useRef<HTMLDivElement>(null);
    const autocompleteRef = useRef<HTMLInputElement>(null);

    const [map, setMap] = useState<PathfindingMap>();
    const [displayData, setDisplayData] = useState<PathfindingOptions>({ hospitals: [] });
    const [selectedHospital, setSelectedHospital] = useState<HospitalOptions | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOptions | null>(null);
    const [pathfindingResults, setPathfindingResults] = useState<PathfindingResults | null>(null);
    const [tts, setTts] = useState<boolean>(false);
    const [selectedMode, setSelectedMode] = useState<string>("DRIVING");
    const [currentStep, setCurrentStep] = useState<number>(-1);

    const setPathfindingResultsExternal = (results: PathfindingResults | null) => {
        setPathfindingResults(results);
        setCurrentStep(-1);
    }

    useEffect(() => {
        const fetchMap = async () => {
            if (mapRef.current && autocompleteRef.current) {
                setMap(await PathfindingMap.makeMap(mapRef.current, autocompleteRef.current, setPathfindingResultsExternal));
            }
        }
        fetchMap().then(() => {
            axios.get(API_ROUTES.PATHFIND + '/options/').then(response => {
                setDisplayData(response.data as PathfindingOptions);
            });
        });
    }, []);

    const handleHospitalChange = (value: string) => {
        setSelectedHospital(displayData.hospitals.find(h => h.name === value) || null);
    }

    const handleDepartmentChange = (value: string) => {
        if (!selectedHospital || !map) return;
        const newDept = selectedHospital.departments.find(d => d.name === value);
        if (!newDept) return;
        setSelectedDepartment(newDept);
        map.setDepartment(newDept);
    }

    const handleModeChange = (mode: string) => {
        setSelectedMode(mode);
        if (map) map.setTravelMode(mode);
    }

    const handleNextStep = () => {
        if (!pathfindingResults || currentStep >= pathfindingResults.directions.length - 1) return;
        map?.setCurrentStepIdx(currentStep + 1, tts);
        setCurrentStep(currentStep + 1);
    }

    const handlePrevStep = () => {
        if (!pathfindingResults || currentStep < 1) return;
        map?.setCurrentStepIdx(currentStep - 1, tts);
        setCurrentStep(currentStep - 1);
    }

    const handleRecenter = () => {
        if (map && pathfindingResults) {
            map.setCurrentStepIdx(currentStep, false);
        }
    };

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden">
            <div className="flex-1 p-4 overflow-y-scroll">
                <h2 className="text-3xl font-bold">Get Directions</h2>
                <Separator className="mt-4 mb-4" />

                <div className="flex flex-row">
                    <Card className="flex-1 grow">
                        <CardContent>
                            <Label className="mb-1">Start Location</Label>
                            <input
                                ref={autocompleteRef}
                                id="start-input"
                                type="text"
                                className={cn(
                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                    "mb-4"
                                )}
                            />

                            <Label className="mb-2">Transport Mode</Label>
                            <div className="flex flex-col items-center justify-center gap-6 rounded-md shadow-md p-4 bg-[#012D5A] mb-4">
                                <div className="flex gap-6">
                                    {transportModes.map((mode) => (
                                        <button
                                            key={mode.value}
                                            onClick={() => handleModeChange(mode.value)}
                                            className={cn(
                                                "p-2 rounded-md shadow-sm border",
                                                `text-[#012D5A]`,
                                                selectedMode === mode.value
                                                    ? `bg-[#012D5A] text-[#D47F00] foreground border-[#D47F00]`
                                                    : `bg-[#F1F1F1] text-[#012D5A] hover:bg-gray-100 border-gray-300`
                                            )}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FontAwesomeIcon icon={mode.icon} className="text-xl mb-1" />
                                                <span className="text-xs">{mode.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Label>Destination Hospital</Label>
                            <Select onValueChange={handleHospitalChange}>
                                <SelectTrigger className="w-full mt-1 mb-4">
                                    <SelectValue placeholder="Choose a hospital..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Hospitals</SelectLabel>
                                        {displayData.hospitals.map(h => (
                                            <SelectItem key={h.hospitalId} value={h.name}>{h.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {selectedHospital && (
                                <>
                                    <Label>Department</Label>
                                    <Select onValueChange={handleDepartmentChange}>
                                        <SelectTrigger className="w-full mt-1 mb-4">
                                            <SelectValue placeholder="Choose a department..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Departments</SelectLabel>
                                                {selectedHospital.departments.map(d => (
                                                    <SelectItem key={d.departmentId} value={d.name}>{d.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {pathfindingResults && (
                    <>
                        <Separator className="mt-4 mb-4" />
                        <div className="flex flex-row">
                            <Card className="flex-1 grow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2">
                                            Text-to-speech
                                            <Switch className="data-[state=checked]:bg-blue-900" onCheckedChange={setTts} />
                                        </Label>
                                        <Button
                                            className="flex-1 grow m-2 bg-blue-900"
                                            onClick={handleRecenter}
                                        >
                                            <FontAwesomeIcon icon={faCrosshairs} />
                                            Re-center
                                        </Button>
                                    </div>
                                    <div className="flex flex-row">
                                        <Button className="flex-1 grow m-2 bg-blue-900" onClick={handlePrevStep} disabled={currentStep < 1}>Previous</Button>
                                        <Separator className="mt-4 mb-4" orientation="vertical" />
                                        <Button className="flex-1 grow m-2 bg-blue-900" onClick={handleNextStep} disabled={currentStep >= pathfindingResults.directions.length - 1}>Next</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px] overflow-y-scroll">
                                        {pathfindingResults.directions.map((step, i) => (
                                            <div key={i} className={`relative group px-2 ${currentStep === i ? 'bg-gray-200 rounded-md' : 'bg-white'}`} onClick={() => { map?.setCurrentStepIdx(i, tts); setCurrentStep(i); }}>
                                                <FontAwesomeIcon icon={
                                                    step.icon === 'right' ? faArrowRight :
                                                        step.icon === 'left' ? faArrowLeft : faArrowUp
                                                } />
                                                <span className="text-blue-500"> {step.instructions}</span>
                                                <br/>
                                                <span className="text-gray-500">{step.time} ({step.distance})</span>
                                                <span className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">Click to view</span>
                                                <br/><br/>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
            <div ref={mapRef} className="flex-3" />
        </div>
    );
}