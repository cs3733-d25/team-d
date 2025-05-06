import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {EditorMap} from "@/GMap/GoogleMap.ts";
import {
    API_ROUTES,
    DepartmentOptions, EditorEdges, EditorGraph, EditorNode, EditorNodeType,
    HospitalOptions,
    PathfindingOptions,
    PathfindingResponse,
} from 'common/src/constants.ts';
import axios from "axios";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
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
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import { Input } from '@/components/ui/input.tsx';

import {faCrosshairs, faSave, faUndo, faRedo, faCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export class EditorEncapsulator {
    editorGraphs: EditorGraph[];

    constructor(editorGraphs: EditorGraph[]) {
        this.editorGraphs = editorGraphs;
    }

    getGraphById(graphId: number): EditorGraph {
        const graph = this.editorGraphs.find(graph => graph.graphId === graphId);
        if (!graph) {
            throw new Error("Graph id not found.");
        }
        return graph;
    }
}

type OnboardingStep = {
    title: string;
    img: string | null;
    description: string;
}


export default function MapEditor() {

    // References for the div that holds
    // the gmap and the autocomplete input,
    // needed for compatibility w/ gmap api
    const mapRef = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<EditorMap>();

    const [displayData, setDisplayData] = useState<EditorGraph[]>([]);

    const [editingData, setEditingData] = useState<EditorEncapsulator>();

    const [connectedNodeIdExists, setConnectedNodeIdExists] = useState<boolean>(true);

    const [selectedNode, setSelectedNode] = useState<EditorNode | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<EditorEdges | null>(null);

    const nodeUpdater = (node: EditorNode | null) => {
        setSelectedNode(node);
        setConnectedNodeIdExists(true);
    }

    useEffect(() => {
        console.log('useEffect MapEditor');
        let tempMap: EditorMap
        const fetchMap = async () => {
            if (mapRef.current) {
                tempMap = await EditorMap.makeMap(mapRef.current, nodeUpdater, setSelectedEdge)
                setMap(tempMap);
            }
        }
        fetchMap().then(() => {
            axios.get(API_ROUTES.EDITOR).then(response => {
                setDisplayData(response.data as EditorGraph[]);
                const editorGraphEncapsulator = new EditorEncapsulator(response.data as EditorGraph[]);
                setEditingData(editorGraphEncapsulator);
                if (tempMap) {
                    tempMap.initialize(editorGraphEncapsulator);
                }
            });
        });
    }, []);

    const handleGraphChange = (value: string) => {
        if (!map) return;
        map.changeGraph(Number(value) - 1);
    }

    const handleZoom = () => {
        if (!map) return;
        map.zoom();
    }

    const handleSave = () => {
        if (!editingData) return;
        axios.put(API_ROUTES.EDITOR, editingData.editorGraphs).then(response => {
            console.log(response);
        }).then((res) => {
            alert('Successfully imported nodes');
        }).catch((err) => {
            alert('Error importing nodes');
        });
    }

    const handleUpdateConnectedNodeID = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            if (selectedNode) {
                selectedNode.connectedNodeId = null;
            }
            setConnectedNodeIdExists(true);
            return;
        }
        let exists = false;
        const nodeId = Number(e.target.value)
        editingData?.editorGraphs.forEach(graph => {
            graph.Nodes.forEach(node => {
                if (node.nodeId === nodeId && node.nodeId !== selectedNode?.nodeId) {
                    exists = true;
                }
            });
        });

        if (selectedNode) {
            selectedNode.connectedNodeId = exists? nodeId : null;
            setConnectedNodeIdExists(exists);
        }

    }

    /* ────────────── onboarding pop‑up tour ────────────── */
    const onboardingSteps: OnboardingStep[] = [
        {
            title: 'Select a graph',
            description:
                'Use the dropdown to select a graph to edit.',
            img: null,
        },
        {
            title: 'Legend',
            description:
                'Colors:\n' +
                '\tTeal: Normal\n' +
                '\tBlue: Parking\n' +
                '\tGreen: Door\n' +
                '\tYellow: Elevator\n' +
                '\tRed: Check-in\n' +
                '\tBlack Border: Node has an external connection.',
            img: null,
        },
        {
            title: 'External Connections',
            description:
                'External Connections provide connections between different graphs. They are intended to be used by indoor door nodes to connect to outdoor door nodes and by upper-floor elevator nodes to connect to ground-floor elevator nodes.',
            img: null,
        },
        {
            title: 'Mouse Gestures',
            description:
                'Left-click a node or edge to view or change its information on the sidebar\n' +
                'Click and drag a node to change its location\n',
            img: null,
        },
    ];

    // <li>Left-click a node or edge to view or change its information on the sidebar</li>
    // <li>Click and drag a node to change its location</li>
    // <li>Right-click the map to add a node at the click location</li>
    // <li>Right-click a node to start adding an edge
    //     <ul className="list-disc ml-4">
    //         <li>Right-click another node to connect both nodes</li>
    //         <li>Right-click the map to make a new node and connect it to the starting node</li>
    //         <li>Left-click to cancel adding a new edge</li>
    //     </ul>
    // </li>
    // <li>Double-click an edge to delete it</li>
    // <li>Double click a node to delete it and any connecting edges</li>

    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardIdx,    setOnboardIdx]    = useState(0);

    const handleOnboardNext = () => {
        if (onboardIdx < onboardingSteps.length - 1) {
            setOnboardIdx(onboardIdx + 1);
        } else {
            setShowOnboarding(false);          // “Got it” closes the tour
        }
    };

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden bg-white">
            <div className="flex-1 p-4 overflow-y-scroll ">

                <h2 className="text-3xl font-bold">Map Editor</h2>
                <Separator className="mt-4 mb-4" />
                <div className="flex flex-row">
                    <Card className="flex-1 grow flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                        <CardContent>
                            <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">Graph</Label>
                            <Select onValueChange={handleGraphChange}>
                                <SelectTrigger className="w-full mb-4 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px]">
                                    <SelectValue placeholder="Choose a graph..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Graphs</SelectLabel>
                                        {displayData.map((g) => (
                                            <SelectItem key={g.graphId + 1} value={(g.graphId + 1).toString()}>
                                                {g.graphName} (ID: {g.graphId})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Separator className="mt-4 mb-4" />

                            <div className="flex flex-wrap">
                                <Button className="m-2 flex-1 grow bg-blue-900 border-2 hover:bg-gray-400 border-yellow-400" onClick={handleZoom}>
                                    <FontAwesomeIcon icon={faCrosshairs} />
                                    Re-center
                                </Button>
                                <Separator className="" orientation="vertical" />
                                <Button className="m-2 flex-1 grow bg-blue-900 border-2 hover:bg-gray-400 border-yellow-400" onClick={handleSave}>
                                    <FontAwesomeIcon icon={faSave} />
                                    Save
                                </Button>
                            </div>
                            <Separator className="w-full" orientation="horizontal" />
                            <div className="flex flex-wrap">
                                <Button className="m-2 flex-1 grow bg-blue-900 hover:bg-gray-400 border-2 border-yellow-400" onClick={() => map?.undo()}>
                                    <FontAwesomeIcon icon={faUndo} />
                                    Undo
                                </Button>
                                <Separator className="" orientation="vertical" />
                                <Button className="m-2 flex-1 grow bg-blue-900 hover:bg-gray-400 border-2 border-yellow-400" onClick={() => map?.redo()}>
                                    <FontAwesomeIcon icon={faRedo} />
                                    Redo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {selectedNode && (
                    <>
                        <Separator className="mt-4 mb-4" />
                        <div key={selectedNode.nodeId} className="flex flex-row">
                            <Card className="flex-1 grow flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                                <CardContent>
                                    <h2 className="text-xl font-bold">Node ID: {selectedNode.nodeId}</h2>
                                    <p className="mb-4">({selectedNode.lat}, {selectedNode.lng})</p>

                                    <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">
                                        Name
                                    </Label>
                                    <Input
                                        defaultValue={selectedNode.name}
                                        placeholder={'Enter a name'}
                                        onChange={(e) => selectedNode.name = e.target.value}
                                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px] mb-4"
                                    />

                                    <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">
                                        Type
                                    </Label>
                                    <Select onValueChange={(value: string) => selectedNode.type = value as EditorNodeType} defaultValue={selectedNode.type}>
                                        <SelectTrigger className="w-full mb-4 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px]">
                                            <SelectValue placeholder="Choose a type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Types</SelectLabel>
                                                {['Normal', 'Parking', 'Door', 'Elevator', 'Checkin'].map(type => (
                                                    <SelectItem value={type.toUpperCase()}>{type}</SelectItem>
                                                ))}
                                                {/*<SelectItem value={'NORMAL'}>NORMAL</SelectItem>*/}
                                                {/*<SelectItem value={'PARKING'}>PARKING</SelectItem>*/}
                                                {/*<SelectItem value={'DOOR'}>DOOR</SelectItem>*/}
                                                {/*<SelectItem value={'ELEVATOR'}>ELEVATOR</SelectItem>*/}
                                                {/*<SelectItem value={'CHECKIN'}>CHECKIN</SelectItem>*/}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">
                                        Connected To Node ID:
                                    </Label>
                                    <Input
                                        defaultValue={selectedNode.connectedNodeId || ''}
                                        placeholder={'(none)'}
                                        onChange={handleUpdateConnectedNodeID}
                                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px] mb-4"
                                    />
                                    {!connectedNodeIdExists && (
                                        <p className={'text-red-600'}>Connected node ID doesn't exist!</p>
                                    )}
                                    <Button
                                        className="mt-4 flex-1 grow m-2 bg-blue-900 hover:bg-gray-400 border-2 border-yellow-400"
                                        onClick={() => {
                                            map?.updateNode(selectedNode);
                                        }}
                                        disabled={!connectedNodeIdExists}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                        Apply
                                    </Button>
                                </CardContent>
                            </Card>


                        </div>
                    </>
                )}
                {selectedEdge && (
                    <>
                        <Separator className="mt-4 mb-4" />
                        <div key={selectedEdge.edgeId} className="flex flex-row">
                            <Card className="flex-1 grow flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                                <CardContent>
                                    <h2 className="text-xl font-bold">Edge ID: {selectedEdge.edgeId}</h2>
                                    <p className="mb-4">(Node ID: {selectedEdge.startNodeId}) {'<-->'} (Node ID: {selectedEdge.endNodeId})</p>

                                    <Label className="mb-1 mb-2 rounded-md inline-block px-2 py-1">
                                        Name
                                    </Label>
                                    <Input
                                        defaultValue={selectedEdge.name}
                                        placeholder={'Enter a name'}
                                        onChange={(e) => selectedEdge.name = e.target.value}
                                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border-2 border-[#012D5A] bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none focus:border-[#D47F00] focus:ring-[#D47F00]/50 focus:ring-[3px] mb-4"
                                    />
                                    <Button
                                        className="mt-4 flex-1 grow m-2 bg-blue-900 border-2 hover:bg-gray-400 border-yellow-400"
                                        onClick={() => {
                                            map?.updateEdge(selectedEdge);
                                        }}
                                        disabled={!connectedNodeIdExists}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                        Apply
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                <Separator className="mt-4 mb-4" />
                <div className="flex flex-row">
                    <Card className="flex-1 grow border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                        <CardContent>
                            <h2 className="text-xl font-bold mb-4 mb-1 mb-2 rounded-md inline-block px-2 py-1">Legend</h2>
                            <ul className="list-disc ml-4">
                                <li className="marker:text-[#c5facf] marker">Teal: Normal</li>
                                <li className="marker:text-[#4285F4] marker">Blue: Parking</li>
                                <li className="marker:text-[#34A853] marker">Green: Door</li>
                                <li className="marker:text-[#FBBC05] marker">Yellow: Elevator</li>
                                <li className="marker:text-[#EA4335] marker">Red: Check-in</li>
                                <li className="marker:text-[#000000] marker">Black Outline: Node has an external connection</li>
                            </ul>
                            <br/>
                            <h2 className="text-xl font-bold mb-4 mb-1 mb-2 rounded-md inline-block px-2 py-1">Instructions</h2>
                            <ul className="list-disc ml-4">
                                <li>Left-click a node or edge to view or change its information on the sidebar</li>
                                <li>Click and drag a node to change its location</li>
                                <li>Right-click the map to add a node at the click location</li>
                                <li>Right-click a node to start adding an edge
                                    <ul className="list-disc ml-4">
                                        <li>Right-click another node to connect both nodes</li>
                                        <li>Right-click the map to make a new node and connect it to the starting node</li>
                                        <li>Left-click to cancel adding a new edge</li>
                                    </ul>
                                </li>
                                <li>Double-click an edge to delete it</li>
                                <li>Double click a node to delete it and any connecting edges</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

            </div>
            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}

declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}