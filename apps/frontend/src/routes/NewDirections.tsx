import {useEffect, useRef, useState} from "react";
import {DirectionsStep, PathfindingMap, PathfindingResults} from "@/GMap/GoogleMap.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCar, faWalking, faBus, faBicycle, faArrowLeft, faArrowRight, faArrowUp} from "@fortawesome/free-solid-svg-icons";
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
    icon: IconDefinition; // You might want to be more specific with the icon type
}

//const primaryDarkBlue = "#012D5A";
//const primaryOrange = "#D47F00";
const transportModes: TransportModeOption[] = [
    { value: "DRIVING", label: "Driving", icon: faCar },
    { value: "WALKING", label: "Walking", icon: faWalking },
    { value: "TRANSIT", label: "Transit", icon: faBus },
    { value: "BICYCLING", label: "Bicycling", icon: faBicycle },
];

export default function NewDirections() {

    // References for the div that holds
    // the gmap and the autocomplete input,
    // needed for compatibility w/ gmap api
    const mapRef = useRef<HTMLDivElement>(null);
    const autocompleteRef = useRef<HTMLInputElement>(null);

    // 'backend' for google map
    const [map, setMap] = useState<PathfindingMap>();

    // all hospitals and their departments
    const [displayData, setDisplayData] = useState<PathfindingOptions>({
        hospitals: [],
    });

    // for storing current selection
    const [selectedHospital, setSelectedHospital] = useState<HospitalOptions | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOptions | null>(null);

    const [pathfindingResults, setPathfindingResults] = useState<PathfindingResults | null>(null);

    const [tts, setTts] = useState<boolean>(false);

    // const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();
    //
    // const [directionsSteps, setDirectionsSteps] = useState<DirectionsStep[]>([]);
    // const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();
    const [selectedMode, setSelectedMode] = useState<string>("DRIVING");

    const [currentStep, setCurrentStep] = useState<number>(-1);

    const setPathfindingResultsExternal = (results: PathfindingResults | null) => {
        setPathfindingResults(results);
        setCurrentStep(-1);
    }

    useEffect(() => {
        console.log('useEffect NewDirections');
        const fetchMap = async () => {
            if (mapRef.current && autocompleteRef.current ) {
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
        if (!selectedHospital) return;

        const newDepartment = selectedHospital.departments.find(d => d.name === value);
        if (!newDepartment) return;
        setSelectedDepartment(newDepartment);

        if (!map) return;
        map.setDepartment(newDepartment);

        // setCurrentStep(-1);
    }

    const handleModeChange = (mode: string) => {
        setSelectedMode(mode);
        if (!map) return;
        map.setTravelMode(mode);
    }



    const handleNextStep = () => {
        if (!pathfindingResults || currentStep >= pathfindingResults.directions.length - 1) return;

        map?.setCurrentStepIdx(currentStep + 1, tts);
        setCurrentStep(currentStep + 1);
        console.log(currentStep + 1);
    }

    const handlePrevStep = () => {
        if (!pathfindingResults || currentStep < 1) return;

        map?.setCurrentStepIdx(currentStep - 1, tts);
        setCurrentStep(currentStep - 1);
        console.log(currentStep - 1);
    }




    const handleZoom = () => {
        // if (!pathfindingResponse || !map) return;
        // map.recenter(
        //     pathfindingResponse.parkingLotPath.path[0].lat,
        //     pathfindingResponse.parkingLotPath.path[0].lng, 20
        // );
    }

    const handleStepSelect = () => {

    }

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden border-2 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
            <div className="flex-1 p-4 overflow-y-scroll">
                <h2 className="text-3xl font-bold">Get Directions</h2>
                <Separator className="mt-4 mb-4 border-[#012D5A]" />

                <div className="flex flex-row">
                    <Card className="flex-1 grow border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                        <CardContent>
                            {/* Start Location */}
                            <Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">Start Location</Label>
                            <input
                                ref={autocompleteRef}
                                id="start-input"
                                type="text"
                                className={cn(
                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px]",
                                    "mb-4"
                                )}
                            />

                            {/* Transport Mode */}
                            <Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">Transport Mode</Label>
                            <div className="flex flex-col items-center justify-center gap-6 rounded-md shadow-md p-4 bg-[#012D5A] mb-4 w-full max-w-lg border-2 border-[#012D5A]">
                                <div className="flex flex-wrap gap-4 justify-center w-full">
                                    {transportModes.map((mode) => (
                                        <button
                                            key={mode.value}
                                            onClick={() => handleModeChange(mode.value)}
                                            className={cn(
                                                "p-2 rounded-md shadow-sm border w-[30%] min-w-[80px] max-w-[120px] border-2 border-[#012D5A]",
                                                selectedMode === mode.value
                                                    ? `bg-[#012D5A] text-[#D47F00] border-[#D47F00]`
                                                    : `bg-[#F1F1F1] text-[#012D5A] hover:bg-gray-100 hover:border-[#D47F00]`
                                            )}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FontAwesomeIcon icon={mode.icon} className="text-lg md:text-xl mb-1" />
                                                <span className="text-xs md:text-sm">{mode.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Destination Hospital */}
                            <Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">Destination Hospital</Label>
                            <Select onValueChange={handleHospitalChange}>
                                <SelectTrigger className="w-full mt-1 mb-4 border-2 border-[#012D5A] focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px]">
                                    <SelectValue placeholder="Choose a hospital..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Hospitals</SelectLabel>
                                        {displayData.hospitals.map((h: HospitalOptions) => (
                                            <SelectItem key={h.hospitalId + 1} value={h.name}>
                                                {h.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>




                                {selectedHospital &&
                                <>
                                    {/*<Separator className="mt-4 mb-4" />*/}

                                    <Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">Department</Label>
                                    <Select onValueChange={handleDepartmentChange}>
                                        <SelectTrigger className="w-full mt-1 mb-4">
                                            <SelectValue placeholder="Choose a department..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup key="0">
                                                <SelectLabel>Departments</SelectLabel>
                                                {selectedHospital.departments.map((d: DepartmentOptions) => (
                                                    <SelectItem key={d.departmentId + 1} value={d.name}>
                                                        {d.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </>
                            }
                        </CardContent>
                    </Card>
                </div>



                {pathfindingResults &&
                    <>
                        <Separator className="mt-4 mb-4" />
                        <div className="flex flex-row">
                            <Card className="flex-1 grow">
                                <CardHeader>
                                    <Label className="">
                                        Text-to-speech
                                        <Switch className="data-[state=checked]:bg-blue-900" onCheckedChange={setTts} />
                                    </Label>
                                    <div className="flex flex-row">
                                        <Button className="flex-1 grow m-2 bg-blue-900" onClick={handlePrevStep} disabled={currentStep < 1}>Previous</Button>
                                        <Separator className="mt-4 mb-4" orientation="vertical" />
                                        <Button className="flex-1 grow m-2 bg-blue-900" onClick={handleNextStep} disabled={currentStep >= pathfindingResults.directions.length - 1}>Next</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px] overflow-y-scroll">
                                        {pathfindingResults.directions.map((step, i) => (
                                            <div className= {`relative group px-2 ${currentStep === i ? 'bg-gray-200 rounded-md' : 'bg-white'}`}
                                                 onClick={() => {
                                                     map?.setCurrentStepIdx(i, tts);
                                                     setCurrentStep(i);
                                                     console.log(i);
                                                 }}>
                                                {step.icon === "right" ? <FontAwesomeIcon icon={faArrowRight}/>
                                                    : step.icon === "left" ? <FontAwesomeIcon icon={faArrowLeft}/>
                                                        : <FontAwesomeIcon icon={faArrowUp}/>}
                                                <span> </span>
                                                <span className="text-blue-500">{step.instructions}</span>
                                                <br/>
                                                <span className="text-gray-500">{step.time} ({step.distance})</span>
                                                <span className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black ml-30">
                                        Click to view
                                    </span>
                                                <br/><br/>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            {/*<Separator className="mt-4 mb-4" />*/}

                            {/*<Label className="mb-4">*/}
                            {/*    Text-to-speech*/}
                            {/*    <Switch className="data-[state=checked]:bg-blue-900" onCheckedChange={setTts} />*/}
                            {/*</Label>*/}
                            {/*<div className="flex flex-row">*/}
                            {/*    <Button className="flex-1 grow m-2 bg-blue-900" onClick={handlePrevStep} disabled={currentStep < 1}>Previous</Button>*/}
                            {/*    <Separator className="mt-4 mb-4" orientation="vertical" />*/}
                            {/*    <Button className="flex-1 grow m-2 bg-blue-900" onClick={handleNextStep} disabled={currentStep >= pathfindingResults.directions.length - 1}>Next</Button>*/}
                            {/*</div>*/}
                            {/*<div className="h-[400px] overflow-y-scroll">*/}
                            {/*    {pathfindingResults.directions.map((step, i) => (*/}
                            {/*        <div className= {`relative group px-2 ${currentStep === i ? 'bg-gray-200 rounded-md' : 'bg-white'}`}*/}
                            {/*             onClick={() => {*/}
                            {/*                 map?.setCurrentStepIdx(i, tts);*/}
                            {/*                 setCurrentStep(i);*/}
                            {/*                 console.log(i);*/}
                            {/*             }}> {step.icon}*/}
                            {/*            <span className="text-blue-500">{step.instructions}</span>*/}
                            {/*            <br/>*/}
                            {/*            <span className="text-gray-500">{step.time} ({step.distance})</span>*/}
                            {/*            <span className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black ml-30">*/}
                            {/*            Click to view*/}
                            {/*        </span>*/}
                            {/*            <br/><br/>*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*</div>*/}


                            {/*<div className="mb-5">*/}
                            {/*    <div id="inner-step-instruction">Loading directions...</div>*/}
                            {/*    <button*/}
                            {/*        id="inner-next-step-btn"*/}
                            {/*        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"*/}
                            {/*    >*/}
                            {/*        Next Step*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                    </>

                }
            </div>
            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}