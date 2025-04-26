import {useEffect, useRef, useState} from "react";
import {EditorMap} from "@/GMap/GoogleMap.ts";
import {
    API_ROUTES,
    DepartmentOptions, EditorEdges, EditorGraph, EditorNode,
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
import {Button} from "@/components/ui/button.tsx";
import { Input } from '@/components/ui/input.tsx';

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


export default function MapEditor() {

    // References for the div that holds
    // the gmap and the autocomplete input,
    // needed for compatibility w/ gmap api
    const mapRef = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<EditorMap>();

    const [displayData, setDisplayData] = useState<EditorGraph[]>([]);

    const [editingData, setEditingData] = useState<EditorEncapsulator>();

    const [selectedNode, setSelectedNode] = useState<EditorNode | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<EditorEdges | null>(null);

    useEffect(() => {
        console.log('useEffect MapEditor');
        let tempMap: EditorMap
        const fetchMap = async () => {
            if (mapRef.current) {
                tempMap = await EditorMap.makeMap(mapRef.current, setSelectedNode, setSelectedEdge)
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
        map.changeGraph(Number(value));
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

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden">
            <div className="flex-1 p-4 overflow-y-scroll">

                <h2 className="text-3xl font-bold">Map Editor</h2>
                <Separator className="mt-4 mb-4" />

                <Label>Choose a Graph</Label>
                <Select onValueChange={handleGraphChange}>
                    <SelectTrigger className="w-full mt-1 mb-4">
                        <SelectValue placeholder="Choose a graph..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Graphs</SelectLabel>
                            {displayData.map((g) => (
                                <SelectItem key={g.graphId + 1} value={g.graphId.toString()}>
                                    {g.graphName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Separator className="mt-4 mb-4" />
                {}
                <div className="flex flex-row">
                    <Button className="mb-4" onClick={handleZoom}>
                        Zoom
                    </Button>
                    <Separator className="mr-4 ml-4" orientation="vertical" />
                    <Button className="mb-4" onClick={handleSave}>
                        Save
                    </Button>
                </div>

                {selectedNode && (
                    <>
                        <Separator className="mt-4 mb-4" />
                        <h2 className="text-xl font-bold mb-4">Node #{selectedNode.nodeId}</h2>
                        <Label className="mt-4 mb-4">
                            <Input defaultValue={selectedNode.name} />
                        </Label>
                    </>
                )}

                <Separator className="mt-4 mb-4" />
                <h2 className="text-xl font-bold mb-4">Instructions</h2>
                <ul className="list-disc ml-4">
                    <li>Left-click a node to view its information</li>
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