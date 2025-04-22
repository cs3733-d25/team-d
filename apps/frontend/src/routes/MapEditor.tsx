import {useEffect, useRef, useState} from "react";
import {EditorMap} from "@/GMap/GoogleMap.ts";
import {
    API_ROUTES,
    DepartmentOptions, EditorGraph,
    HospitalOptions,
    PathfindingOptions,
    PathfindingResponse
} from "common/src/constants.ts";
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

export class EditorGraphEncapsulator {
    editorGraphs: EditorGraph[];

    constructor(editorGraphs: EditorGraph[]) {
        this.editorGraphs = editorGraphs;
    }
}


export default function MapEditor() {

    // References for the div that holds
    // the gmap and the autocomplete input,
    // needed for compatibility w/ gmap api
    const mapRef = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<EditorMap>();

    const [data, setData] = useState<EditorGraph[]>([]);

    const [editorGraphs, setEditorGraphs] = useState<EditorGraphEncapsulator>();

    useEffect(() => {
        const fetchMap = async () => {
            if (mapRef.current) {
                setMap(await EditorMap.makeMap(mapRef.current));
            }
        }
        fetchMap().then(() => {
            axios.get(API_ROUTES.EDITOR).then(response => {
                setData(response.data as EditorGraph[]);
                const editorGraphEncapsulator = new EditorGraphEncapsulator(response.data as EditorGraph[]);
                setEditorGraphs(editorGraphEncapsulator);
                if (map) {
                    map.initialize(response.data as EditorGraph[]);
                }
            });
        });
    }, []);

    const handleGraphChange = (value: string) => {
        const graph = data.find(graph => graph.graphId === Number(value));
        if (!map || !graph) return;
        map.changeGraph(graph);
    }

    return (
        <div className="flex flex-row flex-1">
            <div className="flex-1 p-4">

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
                            {data.map((g) => (
                                <SelectItem key={g.graphId + 1} value={g.graphId.toString()}>
                                    {g.graphId}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
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