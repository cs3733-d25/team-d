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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Button} from "@/components/ui/button.tsx";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import StartLocationImg from "../public/StartLocation.jpg";
import TransportImg from "../public/Transport.jpg";
import DestinationImg from "../public/Destination.jpg";
import DepartmentImg from "../public/Department.jpg";
import { Checkbox } from '@/components/ui/checkbox.tsx';


interface TransportModeOption {
    value: string;
    label: string;
    icon: IconDefinition; // You might want to be more specific with the icon type
}

//const primaryDarkBlue = "#012D5A";

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

    /* ────────────── onboarding pop‑up tour ────────────── */
    const onboardingSteps = [
        { title: 'choose your current address',         img: StartLocationImg },
        { title: 'choose your mode of transportation',  img: TransportImg },
        { title: 'pick your destination hospital',      img: DestinationImg },
        { title: "once you're here, pick a department", img: DepartmentImg },
    ];

    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardIdx,    setOnboardIdx]    = useState(0);

    const handleOnboardNext = () => {
        if (onboardIdx < onboardingSteps.length - 1) {
            setOnboardIdx(onboardIdx + 1);
        } else {
            setShowOnboarding(false);          // “Got it” closes the tour
        }
    };


    const [currentSection, setCurrentSection] = useState<number>(-1);

    const setPathfindingResultsExternal = (results: PathfindingResults | null, refresh: boolean) => {
        setPathfindingResults(results);
        // console.log(results?.sections[0].directions[0].distance);
        setCurrentStep(-1);
        if (refresh) {
            console.log('resetSecton');
            setCurrentSection(-1);
        }
        else {
            const temp = currentSection;
            // setCurrentSection(-1);
            console.log(temp);
            setCurrentSection(temp);
        }
    }

    useEffect(() => {
        console.log('useEffect NewDirections');
        const fetchMap = async () => {
            if (mapRef.current && autocompleteRef.current ) {
                setMap(await PathfindingMap.makeMap(mapRef.current, autocompleteRef.current, setPathfindingResultsExternal, setCurrentSection));
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
        if (!pathfindingResults || currentStep >= pathfindingResults.numSteps - 1) return;

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

    const [units, setUnits] = useState<string>('Imperial');

    const handleRecenter = () => {
        if (map && pathfindingResults) {
            map?.setCurrentStepIdx(currentStep, false);
        }
    };

    const handleSectionChange = (value: string) => {
        const val = Number(value) - 1;
        if (!pathfindingResults) return;
        if (val === -1) {
            map?.setCurrentStepIdx(-1, false);
            setCurrentStep(-1);
            return;
        }
        map?.setCurrentStepIdx(pathfindingResults.sections[val].directions[0].idx, tts);
        setCurrentStep(pathfindingResults.sections[val].directions[0].idx);
    }

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden border-2 bg-white">
            <div className="flex-1 p-4 overflow-y-scroll">
                {/* Header + inline help button */}
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Get Directions</h2>

                    {/* help button + bubble tooltip */}
                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => { setShowOnboarding(true); setOnboardIdx(0); }}
                            className="w-7 h-7 flex items-center justify-center rounded-full
             border border-gray-400 bg-white text-gray-600
             hover:bg-gray-200 focus:outline-none">
                            ?
                        </button>

                    </div>
                </div>

                <Separator className="mt-4 mb-4" />

                <div className="flex flex-row">
                    <Card className="flex-1 grow border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                        <CardContent>
                            {/* Start Location */}
                            <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">Start Location</Label>
                            <input
                                ref={autocompleteRef}
                                id="start-input"
                                type="text"
                                className={cn(
                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-yellow-400 focus:ring-yellow-400/50 focus:ring-[3px]",
                                    "mb-4"
                                )}
                            />

                            {/* Transport Mode */}
                            <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">Transport Mode</Label>
                            <div className="flex flex-col items-center justify-center gap-6 rounded-md shadow-md p-4 bg-[#012D5A] mb-4 w-full max-w-lg border-2 border-[#012D5A]">
                                <div className="flex flex-wrap gap-4 justify-center w-full">
                                    {transportModes.map((mode) => (
                                        <button
                                            key={mode.value}
                                            onClick={() => handleModeChange(mode.value)}
                                            className={cn(
                                                "p-2 rounded-md shadow-sm border w-[30%] min-w-[80px] max-w-[120px] border-2 border-[#012D5A]",
                                                selectedMode === mode.value
                                                    ? `bg-[#012D5A] text-yellow-400 border-yellow-400`
                                                    : `bg-[#F1F1F1] text-[#012D5A] hover:bg-gray-100 hover:border-yellow-400`
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
                            <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">Destination Hospital</Label>
                            <Select onValueChange={handleHospitalChange}>
                                <SelectTrigger className="w-full mt-1 mb-4 border-2 border-[#012D5A] focus:border-yellow-400 focus:ring-yellow-400/50 focus:ring-[3px]">
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

                                    <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">Department</Label>
                                    <Select onValueChange={handleDepartmentChange}>
                                        <SelectTrigger className="w-full mt-1 mb-4 border-2 border-[#012D5A] focus:border-yellow-400 focus:ring-yellow-400/50 focus:ring-[3px]">
                                            <SelectValue placeholder="Choose a department..." className=""/>
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
                            <Card className="flex-1 grow border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">

                            {/*</CardHeader>*/}
                                <CardContent>
                                    <div className="flex flex-row">
                                        <div className="flex-1 grow">
                                            {/*<Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">*/}
                                            {/*    Text-to-speech?*/}
                                            {/*</Label>*/}
                                            <br/>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="tts" className="border-2 yellow-400 rounded-xs" onCheckedChange={() => setTts(!tts)}/>
                                                <Label htmlFor="tts">Text-to-Speech</Label>
                                            </div>
                                            <br/>
                                            {/*<Label className="mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1">*/}
                                            {/*    Unit System*/}
                                            {/*</Label>*/}
                                            <RadioGroup defaultValue="Imperial" onValueChange={(value: string) => setUnits(value)}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="imp" value="Imperial" className="border-2 peer-checked:bg-blue-900"/>
                                                    <Label htmlFor="imp">Imperial</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="met" value="Metric" className="border-2 peer-checked:bg-blue-900"/>
                                                    <Label htmlFor="met">Metric</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <>
                                            <Button
                                                onClick={handleRecenter}
                                                className=" flex-1 grow flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform"
                                            >
                                                <FontAwesomeIcon icon={faCrosshairs} />
                                                Re-center
                                            </Button>
                                        </>
                                    </div>
                                    {/*<div className="flex items-center justify-between">*/}
                                    {/*    <Label className="flex items-center gap-2">*/}
                                    {/*        Text-to-speech*/}
                                    {/*        <Switch className="data-[state=checked]:bg-blue-900" onCheckedChange={setTts} />*/}
                                    {/*    </Label>*/}
                                    {/*    <Button*/}
                                    {/*        onClick={handleRecenter}*/}
                                    {/*        className=" border-2 border-amber-600 flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform"*/}
                                    {/*    >*/}
                                    {/*        <FontAwesomeIcon icon={faCrosshairs} />*/}
                                    {/*        Re-center*/}
                                    {/*    </Button>*/}
                                    {/*</div>*/}
                                    {/*<div className="items-center justify-center">*/}
                                    {/*    <Tabs defaultValue="Metric" onValueChange={(value: string) => map?.convertUnits(value)}>*/}
                                    {/*        <TabsList>*/}
                                    {/*            <TabsTrigger className="border-2 border-amber-600 flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform" value="Metric">Metric</TabsTrigger>*/}
                                    {/*            <TabsTrigger className="border-2 border-amber-600 flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform" value="Imperial">Imperial</TabsTrigger>*/}
                                    {/*        </TabsList>*/}
                                    {/*    </Tabs>*/}
                                    {/*</div>*/}
                                    <div className="flex flex-row">
                                        <Button className="flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform" onClick={handlePrevStep} disabled={currentStep < 1}>
                                            <FontAwesomeIcon icon={faArrowLeft} />
                                            Previous
                                        </Button>
                                        <Separator className="mt-4 mb-4" orientation="vertical" />
                                        <Button className="flex-1 grow m-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform" onClick={handleNextStep} disabled={currentStep >= pathfindingResults.numSteps - 1}>
                                            Next
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </Button>
                                    </div>
                                    <div className="h-[400px] overflow-y-scroll pr-2" key={currentSection}>
                                        <Accordion type="single" defaultValue={(currentSection + 1).toString()} collapsible onValueChange={handleSectionChange}>
                                            {pathfindingResults.sections.map((section, j) => {
                                                return <AccordionItem value={(j + 1).toString()}>
                                                    <AccordionTrigger>
                                                        {section.name}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        {
                                                            section.directions.map((step) => (
                                                                <div className= {`relative group px-2 border-2 rounded-md ${currentStep === step.idx ? 'border-yellow-400 bg-[#FAFAFA]' : 'border-transparent'}`}
                                                                     onClick={() => {
                                                                         map?.setCurrentStepIdx(step.idx, tts);
                                                                         setCurrentStep(step.idx);
                                                                         console.log(step.idx);
                                                                     }}>
                                                                    {step.icon === "right" ? <FontAwesomeIcon icon={faArrowRight} className="text-yellow-400"/>
                                                                        : step.icon === "left" ? <FontAwesomeIcon icon={faArrowLeft} className="text-yellow-400"/>
                                                                            : <FontAwesomeIcon icon={faArrowUp} className="text-yellow-400"/>}
                                                                    <span> </span>
                                                                    <span className="text-blue-900">{step.instructions}</span>
                                                                    <br/>
                                                                    <span className="text-black">{step.time} ({units === 'Imperial' ? step.distanceImp : step.distanceMet})</span>
                                                                    <span className="absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black ml-30">
                                                                        {currentStep !== step.idx && 'Click to view'}
                                                                    </span>
                                                                    <br/><br/>
                                                                </div>
                                                            ))
                                                        }
                                                    </AccordionContent>
                                                </AccordionItem>
                                            })}
                                        </Accordion>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                }
            </div>
            {showOnboarding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="relative bg-white w-11/12 max-w-md rounded-xl shadow-lg p-6 text-center">
                        <button
                            type="button"
                            onClick={() => setShowOnboarding(false)}
                            aria-label="Close"
                            className="absolute top-4 right-4 text-xl font-semibold text-gray-400
             hover:text-gray-600 focus:outline-none">
                            ×
                        </button>


                        <h3 className="text-lg font-bold mb-4 capitalize">
                            {onboardingSteps[onboardIdx].title}
                        </h3>

                        {/* Picture area */}
                        <div className="h-48 flex items-center justify-center mb-6 border border-dashed rounded-lg bg-[#F1F1F1]">
                            {onboardingSteps[onboardIdx].img ? (
                                <img
                                    src={onboardingSteps[onboardIdx].img}
                                    alt=""
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400">picture here</span>
                            )}
                        </div>

                        <Button
                            onClick={handleOnboardNext}
                            className="w-full border-2 bg-blue-900 active:scale-95 active:shadow-inner transition-transform"
                        >
                            {onboardIdx === onboardingSteps.length - 1 ? 'Got it!' : 'Next'}
                        </Button>
                    </div>
                </div>
            )}

            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}
