import axios from "axios";
import {
    API_ROUTES,
    EditorEdges,
    EditorGraph,
    FloorPathResponse,
    EditorNode,
    PathfindingResponse,
    DepartmentOptions, NodePathResponse,
} from 'common/src/constants.ts';
import {EditorEncapsulator} from "@/routes/MapEditor.tsx";

import chf1 from '@/public/floormaps/new/chf1.png';
import ff1 from '@/public/floormaps/new/ff1.png';
import mcf2 from '@/public/floormaps/new/mcf2.png';
import pp20f1 from '@/public/floormaps/new/pp20f1.png';
import pp22f1 from '@/public/floormaps/new/pp22f1.png';
import pp22f3 from '@/public/floormaps/new/pp22f3.png';
import pp22f4 from '@/public/floormaps/new/pp22f4.png';

// import {Button} from '@/components/ui/button.tsx'

const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SCRIPT_URL: string = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,places&callback=initMap`


declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}

abstract class GoogleMap {

    /**
     * Loads the Google Maps API script.
     */
    protected static async loadScript() {
        return new Promise((resolve) => {
            const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);

            if (!existingScript) {
                console.log('not yet loaded');
                const script = document.createElement('script');
                script.src = SCRIPT_URL;
                script.async = true;
                script.defer = true;
                script.onload = () => window.initMap?.();
                document.body.appendChild(script);
            } else {
                console.log('already loaded');
                console.log(existingScript);
                // (existingScript as HTMLScriptElement).onload = () => window.initMap?.();
                // Already loaded
                window.initMap?.();
            }
            window.initMap = () => {
                console.log('finished init');
                resolve(true);
            }
        });
    }

    static getImgURL(image: string) {
        switch (image) {
            case 'chf1.png':
                return chf1;
            case 'ff1.png':
                return ff1;
            case 'pp20f1.png':
                return pp20f1;
            case 'pp22f1.png':
                return pp22f1;
            case 'pp22f3.png':
                return pp22f3;
            case 'pp22f4.png':
                return pp22f4;
            case 'mcf2.png':
                return mcf2;
            default:
                return '';
        }
    }


    /**
     * The actual Google Map
     * @protected
     */
    protected readonly map: google.maps.Map;

    /**
     * Makes the Google Map and shared
     * parts
     * @param mapDivElement Div element to place the map
     * @param mapOptions Options for the map
     * @protected
     */
    protected constructor(mapDivElement: HTMLDivElement, mapOptions: google.maps.MapOptions) {
        console.log(mapDivElement);
        this.map = new google.maps.Map(mapDivElement, mapOptions);
        console.log(this.map);
    }
}



class PathfindingGraph {
    private readonly map: google.maps.Map;

    private readonly path: google.maps.Polyline;
    private readonly nodes: google.maps.Marker[];
    private readonly floorMap: google.maps.GroundOverlay | null;

    private readonly rotation: number;

    private selectedSegment: google.maps.Polyline | null;

    private visibility: boolean;

    constructor(map: google.maps.Map, path: google.maps.LatLngLiteral[], floor?: FloorPathResponse) {
        this.map = map;

        if (floor) {
            this.floorMap = new google.maps.GroundOverlay(GoogleMap.getImgURL(floor.image), {
                north: floor.imageBoundsNorth,
                south: floor.imageBoundsSouth,
                east: floor.imageBoundsEast,
                west: floor.imageBoundsWest,
            }, {

            });
        }
        else this.floorMap = null;

        this.path = new google.maps.Polyline({
            path: path,
            strokeColor: '#00c',
            strokeWeight: 5,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                    fillColor: '#fff',
                    fillOpacity: 1
                },
                repeat: "20px"
            }]
        });

        //only create markers for start and end points
        this.nodes = [
            new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillOpacity: 1,
                    fillColor: '#ff0000',
                    strokeColor: '#fff',
                    strokeWeight: 2
                },
                position: path[0],
            }),
            new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillOpacity: 1,
                    fillColor: '#00ff00',
                    strokeColor: '#fff',
                    strokeWeight: 2
                },
                position: path[path.length - 1],
            })
        ];

        // Add animation for the path
        let offsetPixels = 0;
        window.setInterval(() => {
            offsetPixels = (offsetPixels + 1) % 1000;
            const icons = this.path.get("icons");
            icons[0].offset = offsetPixels + "px";
            this.path.set("icons", icons);
        }, 50);

        this.selectedSegment = null;

        this.rotation = floor?.imageRotation || 0;

        console.log(this.rotation);

        this.visibility = false;
    }


    setVisibility(visibility: boolean) {
        const map = visibility ? this.map : null;

        this.path.setMap(map);
        this.nodes.forEach(node => {
            node.setMap(map);
        });
        this.floorMap?.setMap(map);
        this.selectedSegment?.setMap(null);


        this.map.setHeading(-this.rotation);
        console.log(this.rotation, this.map.getHeading());

        this.visibility = visibility;
    }


    public remove() {
        this.path.setMap(null);
        this.nodes.forEach(node => node.setMap(null));
    }
}

export type PathfindingResults = {
    numSteps: number,
    sections: PathfindingSection[];
}

export type PathfindingSection = {
    name: string;
    directions: DirectionsStep[];
}

export type DirectionsStep = {
    idx: number;
    instructions: string;
    distanceMet: string;
    distanceImp: string;
    time: string;
    icon: string;
    googleMapData: google.maps.DirectionsStep | null;
    pathFindingData: {graphIdx: number, points: google.maps.LatLngLiteral[]} | null;
}

export class PathfindingMap extends GoogleMap {


    public static async makeMap(mapDivElement: HTMLDivElement, autocompleteInput: HTMLInputElement, updater: (results: PathfindingResults | null, refresh: boolean) => void, sectioner: (section: number) => void) {
        await GoogleMap.loadScript();
        return new PathfindingMap(mapDivElement, autocompleteInput, updater, sectioner);
    }

    private readonly directionsService: google.maps.DirectionsService;
    private readonly directionsRenderer: google.maps.DirectionsRenderer;
    private readonly autocomplete: google.maps.places.Autocomplete;

    private readonly updater: (results: PathfindingResults | null, refresh: boolean) => void;
    private readonly sectioner: (section: number) => void;

    private startPlaceId: string | null;
    private endLocation: google.maps.LatLngLiteral | null;
    private travelMode: google.maps.TravelMode;

    private currentPathfindingResponse: PathfindingResponse | null;
    private currentSteps: PathfindingResults | null;

    private currentPath: PathfindingGraph | null;
    private allPaths: PathfindingGraph[];

    private directionsBounds: google.maps.LatLngBounds | null;

    private currentStepPolyline: google.maps.Polyline | null;

    private department: DepartmentOptions | null;


    private constructor(mapDivElement: HTMLDivElement, autocompleteInput: HTMLInputElement, updater: (results: PathfindingResults | null, refresh: boolean) => void, sectioner: (section: number) => void) {

        super(mapDivElement, {
            center: {
                lat: 42.31934987791928,
                lng: -71.3162829187303,
            },
            zoom: 10,
            mapId: '22c86d134d7873f9',
        });

        console.log('pathfinding constructor');

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map,
            polylineOptions: {
                strokeColor: '#00c',
                strokeWeight: 5,
                strokeOpacity: 1,
            }
        });

        this.autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
            fields: ['place_id'],
        });
        this.autocomplete.addListener('place_changed', () => {
            const placeId = this.autocomplete.getPlace().place_id;
            if (!placeId) {
                window.alert('Please select an option from the dropdown list.');
                return;
            } else {
                this.startPlaceId = placeId;
                console.log('Start is now ' + this.startPlaceId);
                this.update();
            }
        });

        this.updater = updater;
        this.sectioner = sectioner;

        this.startPlaceId = null;
        this.endLocation = null;
        this.travelMode = google.maps.TravelMode.DRIVING;

        this.currentPathfindingResponse = null;
        this.currentSteps = null;
        this.currentPath = null;
        this.allPaths = [];

        this.directionsBounds = null;

        this.currentStepPolyline = null;

        this.department = null;
    }

    setDepartment(department: DepartmentOptions) {
        this.department = department;
        this.update();
    }

    async update() {
        // Can't go anywhere if a start place and
        // destination dept is not found
        if (!this.startPlaceId || !this.department) return;

        this.currentSteps = null;

        // Get directions within the hospital
        await axios.get(API_ROUTES.PATHFIND + '/path-to-dept/' + this.department.departmentId).then(response => {

            // If no pathfinding available, return 404
            if (response.status !== 200) {
                if (response.data.message) {
                    console.log(response.data.message);
                }
                return;
            }
            this.currentPathfindingResponse = response.data as PathfindingResponse;
        });

        if (!this.currentPathfindingResponse) return;

        // Get directions to the hospital
        this.endLocation = this.currentPathfindingResponse.parkingLotPath.path[0];
        await this.directionsService.route({
            origin: {
                placeId: this.startPlaceId
            },
            destination: this.endLocation,
            travelMode: this.travelMode,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }).then((directions) => {
            this.directionsRenderer.setDirections(directions);
            this.directionsBounds = directions.routes[0].bounds;
        }).catch(error => {
            console.log(error);
            this.directionsRenderer.setDirections(null);
        });

        console.log('im tired');
        console.log(this.currentPathfindingResponse);

        this.currentSteps = {
            numSteps: 0,
            sections: [],
        }

        let idx = 0;

        this.currentSteps?.sections.push({
            name: 'To the hospital',
            directions: this.directionsRenderer.getDirections()?.routes[0].legs[0].steps.map(step => {
                if (this.currentSteps) this.currentSteps.numSteps++;
                return {
                    idx: idx++,
                    instructions: step.instructions.split('<div')[0].replace(/<[^>]*>/g, ''),
                    distanceMet: this.imperialToMetric(step.distance?.text || ''),
                    distanceImp: step.distance?.text || '',
                    time: step.duration?.text || '',
                    icon:
                        step.maneuver.includes('right') ? 'right' :
                            step.maneuver.includes('left') ? 'left' :
                                'straight',
                    googleMapData: step,
                    pathFindingData: null,
                }
            }) || []
        });

        this.currentPath?.setVisibility(false);
        this.allPaths?.forEach((path) => {
            path.remove()
        });
        this.currentStepPolyline?.setMap(null);


        this.allPaths = [new PathfindingGraph(this.map, this.currentPathfindingResponse.parkingLotPath.path)];
        this.currentPathfindingResponse.floorPaths.forEach(floor =>
            this.allPaths.push(new PathfindingGraph(this.map, floor.path, floor))
        );

        this.setCurrentGraphIdx(0);
        this.currentSteps?.sections.push({
            name: 'Parking Lot',
            directions: this.currentPathfindingResponse.parkingLotPath.path.map((path, i) => {
                if (this.currentSteps) this.currentSteps.numSteps++;

                const nextPath: NodePathResponse | undefined = this.currentPathfindingResponse?.parkingLotPath.path[i + 1];

                // distance is in meter
                const distance = nextPath ? google.maps.geometry.spherical.computeDistanceBetween(path, nextPath) : 0;
                // Estimate duration assuming average indoor walking speed (~1.4 meters/sec)
                const time = distance / 1.4;

                const direction = this.currentPathfindingResponse?.parkingLotPath.direction[i] || '';

                return {
                    idx: idx++,
                    instructions: direction,
                    distanceMet: distance.toFixed(2).toString() + ' m',
                    distanceImp: this.metricToImperial(distance.toFixed(2).toString() + ' m'),
                    time: time.toFixed(2).toString() + ' sec',
                    icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
                    googleMapData: null,
                    pathFindingData: {
                        graphIdx: 0,
                        points: nextPath ? [
                            {
                                lat: path.lat,
                                lng: path.lng,
                            },
                            {
                                lat: nextPath.lat,
                                lng: nextPath.lng,
                            },
                        ] : [
                            {
                                lat: path.lat,
                                lng: path.lng,
                            },
                        ],
                    },
                }
            }),
        });


        this.currentSteps.sections = this.currentSteps.sections.concat(
            this.currentPathfindingResponse.floorPaths.map((floor, j) => {
                return {
                    name: `Floor ${floor.floorNum}`,
                    directions: floor.path.map((path, i) => {
                        if (this.currentSteps) this.currentSteps.numSteps++;

                        const nextPath: NodePathResponse | undefined = this.currentPathfindingResponse?.floorPaths[j].path[i + 1];

                        // distance is in meter
                        const distance = nextPath ? google.maps.geometry.spherical.computeDistanceBetween(path, nextPath) : 0;
                        // Estimate duration assuming average indoor walking speed (~1.4 meters/sec)
                        const time = distance / 1.4;

                        const direction = this.currentPathfindingResponse?.floorPaths[j].direction[i] || '';

                        return {
                            idx: idx++,
                            instructions: direction,
                            distanceMet: distance.toFixed(2).toString() + ' m',
                            distanceImp: this.metricToImperial(distance.toFixed(2).toString() + ' m'),
                            time: time.toFixed(2).toString() + ' sec',
                            icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
                            googleMapData: null,
                            pathFindingData: {
                                graphIdx: j + 1,
                                points: nextPath ? [
                                    {
                                        lat: path.lat,
                                        lng: path.lng,
                                    },
                                    {
                                        lat: nextPath.lat,
                                        lng: nextPath.lng,
                                    },
                                ] : [
                                    {
                                        lat: path.lat,
                                        lng: path.lng,
                                    },
                                ],
                            },
                        }
                    })
                }
            })
        );

        console.log(this.currentSteps);
        this.sectioner(-1);
        this.updater(this.currentSteps, true);
    }

    async setCurrentStepIdx(stepIdx: number, tts: boolean) {
        console.log('setCurrentStepIdx', stepIdx, tts);

        if (stepIdx === -1) {
            this.setCurrentGraphIdx(0);
            if (this.directionsBounds) this.map.fitBounds(this.directionsBounds);
            this.currentStepPolyline?.setMap(null);
            this.currentStepPolyline = null;
        }

        if (!this.currentSteps) return;

        let step: DirectionsStep | undefined;

        let sectionIdx = -1;

        this.currentSteps.sections.forEach((section, i) => {
            const candidate = section.directions.find((direction) => {
                return direction.idx === stepIdx;
            });

            if (candidate) {
                step = candidate;
                this.sectioner(i);
                sectionIdx = i;
            }
        });

        console.log(step);

        if (tts) {
            console.log('kajbfj');
            const utter = new SpeechSynthesisUtterance(step?.instructions || '');
            utter.lang = 'en-US';
            speechSynthesis.cancel();
            speechSynthesis.speak(utter);
        }

        const bounds = new google.maps.LatLngBounds();

        if (step?.googleMapData?.polyline) {
            this.setCurrentGraphIdx(0);
            this.currentStepPolyline?.setMap(null);
            const path = google.maps.geometry.encoding.decodePath(step.googleMapData.polyline.points);
            this.currentStepPolyline = new google.maps.Polyline({
                map: this.map,
                path: path,
                strokeWeight: 10,
                strokeColor: '#0f4',
                strokeOpacity: 0.9,
                zIndex: 50,
            });
            path.forEach(point => {
                bounds.extend(point);
            });

            this.map.fitBounds(bounds);
            this.map.setZoom((this.map.getZoom() || 10) - 1);

        }

        if (step?.pathFindingData) {
            this.currentSteps.sections[sectionIdx].directions.forEach((direction) => {
                direction.pathFindingData?.points.forEach(point => {
                    bounds.extend(point);
                });
            })

            this.map.fitBounds(bounds);
            this.map.setZoom((this.map.getZoom() || 10) - 1);

            this.setCurrentGraphIdx(step.pathFindingData.graphIdx);
            this.currentStepPolyline?.setMap(null);
            this.currentStepPolyline = new google.maps.Polyline({
                map: this.map,
                path: step.pathFindingData.points,
                strokeWeight: 10,
                strokeColor: '#0f4',
                strokeOpacity: 0.9,
                zIndex: 50,
            });

        }
    }

    private setCurrentGraphIdx(idx: number) {
        this.currentPath?.setVisibility(false);
        this.currentPath = this.allPaths[idx];
        this.currentPath.setVisibility(true);

    }


    setTravelMode(travelMode: string) {
        switch (travelMode) {
            case 'DRIVING':
                this.travelMode = google.maps.TravelMode.DRIVING;
                break;
            case 'WALKING':
                this.travelMode = google.maps.TravelMode.WALKING;
                break;
            case 'TRANSIT':
                this.travelMode = google.maps.TravelMode.TRANSIT;
                break;
            case 'BICYCLING':
                this.travelMode = google.maps.TravelMode.BICYCLING;
                break;
        }
        this.update();
    }

    recenter(lat: number, lng: number, zoom: number) {
        this.map.setCenter({lat, lng});
        this.map.setZoom(zoom);
    }

    metricToImperial(distanceString: string): string {
        if (distanceString.includes('km')) {

            const value = parseFloat(distanceString);
            const miles = value * 0.621371;
            return parseFloat(miles.toFixed(2)) + ' mi';


        } else if (distanceString.includes('m')) {

            const value = parseFloat(distanceString);
            const feet = value * 3.28084;
            return parseFloat(feet.toFixed(0)) + ' ft';

        }
        return distanceString;
    }

    imperialToMetric(distanceString: string): string {
        if (distanceString.includes('mi')) {
            const value = parseFloat(distanceString);
            const meters = value / 0.621371;
            return parseFloat(meters.toFixed(2)) + ' km';

        } else if (distanceString.includes('ft')) {

            const value = parseFloat(distanceString);
            const meters = value / 3.28084;
            return parseFloat(meters.toFixed(0)) + ' m';
        }
        return distanceString;
    }


    convertUnits(unitPreference: string) {

        const convert = (distanceString: string): string => {

            if (unitPreference === 'Imperial') {
                if (distanceString.includes('km')) {

                    const value = parseFloat(distanceString);
                    const miles = value * 0.621371;
                    return parseFloat(miles.toFixed(2)) + ' mi';


                } else if (distanceString.includes('m')) {

                    const value = parseFloat(distanceString);
                    const feet = value * 3.28084;
                    return parseFloat(feet.toFixed(0)) + ' ft';

                }

            } else {
                if (distanceString.includes('mi')) {
                    const value = parseFloat(distanceString);
                    const meters = value / 0.621371;
                    return parseFloat(meters.toFixed(2)) + ' km';

                } else if (distanceString.includes('ft')) {

                    const value = parseFloat(distanceString);
                    const meters = value / 3.28084;
                    return parseFloat(meters.toFixed(0)) + ' m';
                }
            }
            return distanceString;


        }
        this.currentSteps?.sections.forEach((section) => {

            section.directions.forEach(step => {
                step.distanceMet = convert(step.distanceMet);
            });
        });

        console.log(this.currentSteps);

        this.updater(this.currentSteps, false);
    }
}

type VisualNode = {
    data: EditorNode;
    marker: google.maps.Marker;
}

type VisualEdge = {
    data: EditorEdges;
    line: google.maps.Polyline;
}


class EditorMapGraph {

    private readonly map: google.maps.Map;
    private readonly editorEncapsulator: EditorEncapsulator;
    private readonly editorGraph: EditorGraph;

    private readonly nodeUpdater: (selected: EditorNode | null) => void;
    private readonly edgeUpdater: (selected: EditorEdges | null) => void;


    private readonly undoStack: {
        undo: (() => void),
        redo: (() => void),
    }[][];
    private readonly redoStack: {
        undo: (() => void),
        redo: (() => void),
    }[][];
    private undoing: boolean;
    private lock: boolean;

    private selectedNode: EditorNode | null;
    private selectedEdge: EditorEdges | null;

    private readonly floorMap: google.maps.GroundOverlay | null;

    private nodes: VisualNode[];
    private edges: VisualEdge[];

    private newEdge: {startNodeId: number, line: google.maps.Polyline} | null;

    private editingState: 'DEFAULT' | 'ADDEDGE';
    private visible: boolean;

    constructor(map: google.maps.Map, editorEncapsulator: EditorEncapsulator, editorGraph: EditorGraph, nodeUpdater: (selected: EditorNode | null) => void, edgeUpdater: (selected: EditorEdges | null) => void) {

        this.map = map;
        this.editorEncapsulator = editorEncapsulator;
        this.editorGraph = editorGraph;

        this.nodeUpdater = nodeUpdater;
        this.edgeUpdater = edgeUpdater;

        this.undoStack = [];
        this.redoStack = [];
        this.undoing = false;
        this.lock = false;

        this.nodes = [];
        this.edges = [];

        this.editorGraph.Nodes.forEach(node => {
            this.addNodeLocal(node);
        });

        this.editorGraph.Edges.map(edge => {
            this.addEdgeLocal(edge);
        });

        this.editingState = 'DEFAULT';

        this.visible = false;
        this.setVisibility(false);

        this.newEdge = null;

        this.floorMap = null;

        if (this.editorGraph.FloorGraph) {
            this.floorMap = new google.maps.GroundOverlay(GoogleMap.getImgURL(this.editorGraph.FloorGraph.image), {
                north: this.editorGraph.FloorGraph.imageBoundsNorth,
                south: this.editorGraph.FloorGraph.imageBoundsSouth,
                east: this.editorGraph.FloorGraph.imageBoundsEast,
                west: this.editorGraph.FloorGraph.imageBoundsWest,
            }, {
                clickable: false,
            });


        }

        this.selectedNode = null;
        this.selectedEdge = null;

        // If in default state,
        // add a node at this position
        this.map.addListener('rightclick', (e: google.maps.MapMouseEvent) => {
            this.edgeUpdater(null);
            this.nodeUpdater(null);

            if (this.visible) {
                if (this.editingState === 'DEFAULT') {
                    const rawPosition = e.latLng;
                    if (!rawPosition) return;
                    this.addNode({
                        nodeId: -1,
                        name: '',
                        lat: rawPosition.toJSON().lat,
                        lng: rawPosition.toJSON().lng,
                        type: 'NORMAL',
                        graphId: this.editorGraph.graphId,
                        connectedNodeId: null,
                    });
                }
            }
        });

        // If adding an edge, set the edge's
        // location to the mouse pos
        this.map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
            if (this.visible) {
                if (this.editingState === 'ADDEDGE' && this.newEdge) {
                    const rawPosition = e.latLng;
                    if (!rawPosition) return;

                    this.newEdge.line.setPath([
                        this.newEdge.line.getPath().getAt(0),
                        {
                            lat: rawPosition.toJSON().lat,
                            lng: rawPosition.toJSON().lng,
                        },
                    ])
                }
            }
        });
    }

    private getNodeColor(type: string): string {

        switch(type) {

            case 'PARKING':
                return '#4285F4';


            case 'DOOR':
                return '#34A853';

            case 'CHECKIN':
                return '#EA4335';

            case 'ELEVATOR':
                return '#FBBC05';


            case 'NORMAL':
                return '#c5facf';

        }
        return '#c5facf';
    }

    private getNodeStrokeColor(type: number | null): string {

        if (!type){

            return '#c556f5';
        } else {

            return '#0a010a';
        }

    }



    private addNodeLocal(node: EditorNode) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: {
                lat: node.lat,
                lng: node.lng,
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillOpacity: 1,
                fillColor: this.getNodeColor(node.type),
                strokeColor: this.getNodeStrokeColor(node.connectedNodeId),
                strokeWeight: 3
            },
            draggable: true,
            zIndex: 20,
        });

        // If clicked in default state,
        // display info. If clicked in
        // add edge state, finalize this edge
        marker.addListener("click", (e: google.maps.MapMouseEvent) => {
            this.edgeUpdater(null);
            this.nodeUpdater(JSON.parse(JSON.stringify(node)) as EditorNode);
        });

        // If right clicked in default mode,
        // start to add an edge
        marker.addListener("rightclick", (e: google.maps.MapMouseEvent) => {
            this.edgeUpdater(null);
            this.nodeUpdater(null);

            const rawPosition = e.latLng;
            if (!rawPosition) return;

            if (this.editingState === 'DEFAULT') {
                this.editingState = 'ADDEDGE';
                const line = new google.maps.Polyline({
                    map: this.map,
                    path: [
                        {
                            lat: rawPosition.toJSON().lat,
                            lng: rawPosition.toJSON().lng,
                        },
                        {
                            lat: rawPosition.toJSON().lat,
                            lng: rawPosition.toJSON().lng,
                        },
                    ],
                });

                this.newEdge = {
                    startNodeId: node.nodeId,
                    line: line,
                }

                line.addListener("click", (e: google.maps.MapMouseEvent) => {
                    if (this.editingState === 'ADDEDGE' && this.newEdge) {
                        this.newEdge.line.setMap(null);
                        this.newEdge = null;
                        this.editingState = 'DEFAULT';
                    }
                });

                line.addListener("rightclick", (e: google.maps.MapMouseEvent) => {
                    if (this.editingState === 'ADDEDGE' && this.newEdge) {
                        const rawPosition = e.latLng;
                        if (!rawPosition) return;
                        const newNode = this.addNode({
                            nodeId: -1,
                            name: '',
                            lat: rawPosition.toJSON().lat,
                            lng: rawPosition.toJSON().lng,
                            type: 'NORMAL',
                            graphId: this.editorGraph.graphId,
                            connectedNodeId: null,
                        });
                        this.newEdge.line.setMap(null);
                        this.lock = true;
                        this.addEdge({
                            edgeId: -1,
                            name: '',
                            startNodeId: this.newEdge.startNodeId,
                            endNodeId: newNode.nodeId,
                            graphId: this.editorGraph.graphId,
                        });
                        this.lock = false;
                        this.newEdge = null;
                        this.editingState = 'DEFAULT';
                    }
                })
            }
            else if (this.editingState === 'ADDEDGE' && this.newEdge) {
                this.newEdge.line.setMap(null);
                this.addEdge({
                    edgeId: -1,
                    name: '',
                    startNodeId: this.newEdge.startNodeId,
                    endNodeId: node.nodeId,
                    graphId: this.editorGraph.graphId,
                });
                this.newEdge = null;
                this.editingState = 'DEFAULT';
            }
        });

        marker.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
            this.edgeUpdater(null);
            this.nodeUpdater(null);

            console.log('delete node');
            if (this.editingState === 'DEFAULT') {
                this.lock = true;
                this.undoStack.push([]);
                this.deleteNode(node.nodeId);
                this.lock = false;
            }
        });

        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
            const rawPosition = e.latLng;
            if (!rawPosition) return;
            const newNode = JSON.parse(JSON.stringify(node)) as EditorNode;
            newNode.lat = rawPosition.toJSON().lat;
            newNode.lng = rawPosition.toJSON().lng;

            this.updateNode(newNode);
        });

        this.nodes.push({
            data: node,
            marker: marker,
        });
    }

    private addEdgeLocal(edge: EditorEdges) {
        const startNode = this.nodes.find(node => node.data.nodeId === edge.startNodeId);
        const endNode = this.nodes.find(node => node.data.nodeId === edge.endNodeId);

        if (!startNode || !endNode) {
            throw new Error('Unable to locate node');
        }

        const line = new google.maps.Polyline({
            map: this.map,
            path: [
                startNode.marker.getPosition() || {lat: 0, lng: 0},
                endNode.marker.getPosition() || {lat: 0, lng: 0},
            ],
            strokeColor: '#00c',
            strokeWeight: 5,
        });
        line.setMap(this.map);

        // If start node dragged, update
        // the edge's positions
        startNode.marker.addListener('drag', (e: google.maps.MapMouseEvent) => {
            if (this.editingState === 'DEFAULT') {
                const rawPosition = e.latLng;
                if (!rawPosition) return;

                line.setPath([
                    {
                        lat: rawPosition.toJSON().lat,
                        lng: rawPosition.toJSON().lng,
                    },
                    line.getPath().getAt(1),
                ]);
            }
        });


        // If start node dragged, update
        // the edge's positions
        endNode.marker.addListener('drag', (e: google.maps.MapMouseEvent) => {
            if (this.editingState === 'DEFAULT') {
                const rawPosition = e.latLng;
                if (!rawPosition) return;
                line.setPath([
                    line.getPath().getAt(0),
                    {
                        lat: rawPosition.toJSON().lat,
                        lng: rawPosition.toJSON().lng,
                    },
                ]);
            }
        });

        // If line is double-clicked delete it
        line.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
            this.edgeUpdater(null);
            this.nodeUpdater(null);

            if (this.editingState === 'DEFAULT') {
                this.deleteEdge(edge.edgeId);
            }
        });

        line.addListener('click', (e: google.maps.MapMouseEvent) => {
            this.nodeUpdater(null);
            this.edgeUpdater(JSON.parse(JSON.stringify(edge)) as EditorEdges);
        })

        this.edges.push({
            data: edge,
            line: line,
        });
    }

    addNode(node: EditorNode) {
        console.log('addNode');

        // Give the node an ID that doesn't exist yet
        // Needs improving for efficiency
        let id = 0;
        if (node.nodeId >= 0) {
            id = node.nodeId;
        }
        else {
            for (; id < 10000; id++) {
                let idExists = false;
                this.editorEncapsulator.editorGraphs.forEach(graph => {
                    if (graph.Nodes.find(cnode =>
                        cnode.nodeId === id
                    )) idExists = true;
                });
                if (!idExists) {
                    break;
                }
            }
        }


        node.nodeId = id;
        console.log(id);
        this.editorGraph.Nodes.push(node);
        this.addNodeLocal(node);

        const nodeCopy = JSON.parse(JSON.stringify(node)) as EditorNode;

        if (!this.undoing) {
            if (!this.lock) {
                this.undoStack.push([]);
            }
            this.undoStack.at(-1)?.push({
                undo: () => {
                    this.deleteNode(node.nodeId);
                },
                redo: () => {
                    this.addNode(nodeCopy);
                },
            });
            console.log(this.undoStack);
            while (this.redoStack.length > 0) {
                this.redoStack.pop();
            }
        }


        return node;
    }

    addEdge(edge: EditorEdges) {
        console.log('addEdge');

        // Give the edge an ID that doesn't exist yet
        // Needs improving for efficiency
        let id = 0;
        if (edge.edgeId >= 0) {
            id = edge.edgeId;
        }
        else {
            for (; id < 10000; id++) {
                let idExists = false;
                this.editorEncapsulator.editorGraphs.forEach(graph => {
                    if (graph.Edges.find(cedge =>
                        cedge.edgeId === id
                    )) idExists = true;
                });
                if (!idExists) {
                    break;
                }
            }
        }


        edge.edgeId = id;
        console.log(id);
        this.editorGraph.Edges.push(edge);
        this.addEdgeLocal(edge);

        const edgeCopy = JSON.parse(JSON.stringify(edge)) as EditorEdges;

        if (!this.undoing) {
            if (!this.lock) {
                this.undoStack.push([]);
            }
            this.undoStack.at(-1)?.push({
                undo: () => {
                    this.deleteEdge(edge.edgeId);
                },
                redo: () => {
                    this.addEdge(edgeCopy);
                },
            });
            console.log(this.undoStack);
            while (this.redoStack.length > 0) {
                this.redoStack.pop();
            }
        }

        return edge;
    }

    deleteNode(nodeId: number) {
        console.log('deleteNode');

        const nodeIndexLocal = this.nodes.findIndex(cnode =>
            cnode.data.nodeId === nodeId
        );

        const nodeCopy = JSON.parse(JSON.stringify(this.nodes[nodeIndexLocal].data)) as EditorNode;

        this.nodes[nodeIndexLocal].marker.setMap(null);
        this.nodes.splice(nodeIndexLocal, 1);

        const nodeIndexEncapsulator = this.editorGraph.Nodes.findIndex(cnode =>
            cnode.nodeId === nodeId
        );

        this.editorGraph.Nodes.splice(nodeIndexEncapsulator, 1);

        const edgesIdsToDelete: number[] = [];
        this.edges.forEach(edge => {
            if (edge.data.startNodeId === nodeId || edge.data.endNodeId === nodeId) {
                edgesIdsToDelete.push(edge.data.edgeId);
            }
        });
        edgesIdsToDelete.forEach(edgeId => {
            this.deleteEdge(edgeId);
        });

        if (!this.undoing) {
            if (!this.lock) {
                this.undoStack.push([]);
            }
            this.undoStack.at(-1)?.push({
                undo: () => {
                    this.addNode(nodeCopy);
                },
                redo: () => {
                    this.deleteNode(nodeId);
                },
            });
            console.log(this.undoStack);
            while (this.redoStack.length > 0) {
                this.redoStack.pop();
            }
        }
    }

    deleteEdge(edgeId: number) {
        console.log('deleteEdge');

        const edgeIndexLocal = this.edges.findIndex(cedge =>
            cedge.data.edgeId === edgeId
        );

        const edgeCopy = JSON.parse(JSON.stringify(this.edges[edgeIndexLocal].data)) as EditorEdges;

        this.edges[edgeIndexLocal].line.setMap(null);

        this.edges.splice(edgeIndexLocal, 1);

        const edgeIndexEncapsulator = this.editorGraph.Edges.findIndex(edge =>
            edge.edgeId === edgeId
        );

        this.editorGraph.Edges.splice(edgeIndexEncapsulator, 1);

        if (!this.undoing) {
            if (!this.lock) {
                this.undoStack.push([]);
            }
            this.undoStack.at(-1)?.push({
                undo: () => {
                    this.addEdge(edgeCopy);
                },
                redo: () => {
                    this.deleteEdge(edgeId);
                }
            });
            console.log(this.undoStack);
            while (this.redoStack.length > 0) {
                this.redoStack.pop();
            }
        }
    }

    updateNode(nodeCopy: EditorNode) {
        console.log('updateNode');

        // console.log(nodeCopy);

        const nodeEncapsulator = this.editorGraph.Nodes.find(cnode => cnode.nodeId === nodeCopy.nodeId);
        const nodeVisual = this.nodes.find(cnode => cnode.data.nodeId === nodeCopy.nodeId);



        if (nodeEncapsulator && nodeVisual) {
            const old = JSON.parse(JSON.stringify(nodeEncapsulator)) as EditorNode;
            // console.log(node.data);
            const temp = JSON.parse(JSON.stringify(nodeCopy)) as EditorNode;
            nodeVisual.data = temp;
            nodeEncapsulator.nodeId = temp.nodeId;
            nodeEncapsulator.connectedNodeId = temp.connectedNodeId;
            nodeEncapsulator.lat = temp.lat;
            nodeEncapsulator.lng = temp.lng;
            nodeEncapsulator.type = temp.type;
            nodeEncapsulator.name = temp.name;
            nodeEncapsulator.graphId = temp.graphId;
            // console.log(node.data);
            const icon = nodeVisual.marker.getIcon() as google.maps.Symbol;
            icon.fillColor = this.getNodeColor(temp.type);
            icon.strokeColor = this.getNodeStrokeColor(temp.connectedNodeId);
            nodeVisual.marker.setIcon(icon);

            nodeVisual.marker.setPosition({
                lat: temp.lat,
                lng: temp.lng,
            })

            this.edges.forEach(edge => {
                if (edge.data.startNodeId === temp.nodeId) {
                    edge.line.setPath([
                        {
                            lat: temp.lat,
                            lng: temp.lng,
                        },
                        edge.line.getPath().getAt(1),
                    ]);
                }
                if (edge.data.endNodeId === temp.nodeId) {
                    edge.line.setPath([
                        edge.line.getPath().getAt(0),
                        {
                            lat: temp.lat,
                            lng: temp.lng,
                        },
                    ]);
                }
            })

            const tempCopy = JSON.parse(JSON.stringify(temp)) as EditorNode;

            if (!this.undoing) {
                if (!this.lock) {
                    this.undoStack.push([]);
                }
                this.undoStack.at(-1)?.push({
                    undo: () => {
                        this.updateNode(old);
                    },
                    redo: () => {
                        this.updateNode(tempCopy);
                    }
                });
                console.log(this.undoStack);
                while (this.redoStack.length > 0) {
                    this.redoStack.pop();
                }
            }
        }
    }

    updateEdge(edgeCopy: EditorEdges) {
        console.log('updateEdge');
        const edgeEncapsulator = this.editorGraph.Edges.find(cedge => cedge.edgeId === edgeCopy.edgeId);
        const edgeVisual = this.edges.find(cedge => cedge.data.edgeId === edgeCopy.edgeId);

        if (edgeEncapsulator && edgeVisual) {
            const old = JSON.parse(JSON.stringify(edgeEncapsulator)) as EditorEdges;
            const temp = JSON.parse(JSON.stringify(edgeCopy)) as EditorEdges;
            edgeVisual.data = temp;
            edgeEncapsulator.edgeId = temp.edgeId;
            edgeEncapsulator.graphId = temp.graphId;
            edgeEncapsulator.name = temp.name;
            edgeEncapsulator.startNodeId = temp.startNodeId;
            edgeEncapsulator.endNodeId = temp.endNodeId;

            const tempCopy = JSON.parse(JSON.stringify(temp)) as EditorEdges;

            if (!this.undoing) {
                if (!this.lock) {
                    this.undoStack.push([]);
                }
                this.undoStack.at(-1)?.push({
                    undo: () => {
                        this.updateEdge(old);
                    },
                    redo: () => {
                        this.updateEdge(tempCopy);
                    },
                });
                console.log(this.undoStack);
                while (this.redoStack.length > 0) {
                    this.redoStack.pop();
                }
            }
        }
    }

    setVisibility(visibility: boolean) {
        if (visibility) {
            this.nodes.forEach(node => {
                node.marker.setMap(this.map);
            });
            this.edges.forEach(edge => {
                edge.line.setMap(this.map);
            });
            if (this.floorMap) {
                this.floorMap.setMap(this.map);
            }
        }
        else {
            this.edges.forEach(edge => {
                edge.line.setMap(null);
            });
            this.nodes.forEach(node => {
                node.marker.setMap(null);
            });
            if (this.floorMap) {
                this.floorMap.setMap(null);
            }
        }
        this.visible = visibility;
    }

    undo() {
        this.undoing = true;
        const steps = this.undoStack.pop();
        if (steps) {
            const redo = [];
            while (steps.length > 0) {
                const fns = steps.pop();
                if (fns) {
                    fns.undo();
                    redo.push(fns);
                }
            }
            this.redoStack.push(redo);
        }
        this.undoing = false;
    }

    redo() {
        this.undoing = true;
        const steps = this.redoStack.pop();
        if (steps) {
            const undo = [];
            while (steps.length > 0) {
                const fns = steps.pop();
                if (fns) {
                    fns.redo();
                    undo.push(fns);
                }
            }
            this.undoStack.push(undo);
        }


        this.undoing = false;
    }
}

export class EditorMap extends GoogleMap {

    public static async makeMap(mapDivElement: HTMLDivElement, nodeUpdater: (selected: EditorNode | null) => void, edgeUpdater: (selected: EditorEdges | null) => void) {
        await GoogleMap.loadScript();
        return new EditorMap(mapDivElement, nodeUpdater, edgeUpdater);
    }
    
    private currentGraph: EditorMapGraph | null;
    private currentGraphId: number | null;

    private readonly nodeUpdater: (selected: EditorNode | null) => void;
    private readonly edgeUpdater: (selected: EditorEdges | null) => void;

    private editorEncapsulator: EditorEncapsulator | null;
    private readonly graphs: Map<number, EditorMapGraph>;

    private constructor(mapDivElement: HTMLDivElement, nodeUpdater: (selected: EditorNode | null) => void, edgeUpdater: (selected: EditorEdges | null) => void) {
        console.log('editor map constructor');

        super(mapDivElement, {
            center: {
                lat: 42.31934987791928,
                lng: -71.3162829187303,
            },
            zoom: 10,
            clickableIcons: false,
        });
        
        this.currentGraph = null;
        this.currentGraphId = null;
        this.editorEncapsulator = null;

        this.nodeUpdater = nodeUpdater;
        this.edgeUpdater = edgeUpdater;

        console.log('editor map constructosdfsdfsdr');
        this.graphs = new Map();


        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
            console.log(e.latLng?.toJSON());
        });
    }

    changeGraph(graphId: number) {
        this.currentGraph?.setVisibility(false);
        const newGraph = this.graphs.get(graphId);
        if (!newGraph) return;

        newGraph.setVisibility(true);
        this.currentGraph = newGraph;
        this.currentGraphId = graphId;

        this.zoom();
    }

    initialize(editorEncapsulator: EditorEncapsulator) {
        this.editorEncapsulator = editorEncapsulator;

        this.editorEncapsulator.editorGraphs.forEach(graph => {
            console.log('Making graph ' + graph.graphId);
            this.graphs.set(graph.graphId, new EditorMapGraph(this.map, editorEncapsulator, graph, this.nodeUpdater, this.edgeUpdater));
        })
    }

    zoom() {
        const bounds = new google.maps.LatLngBounds();
        this.editorEncapsulator?.getGraphById(this.currentGraphId || 0)?.Nodes.forEach((node, i) => {
            if (i === 0) {
                this.map.setCenter({lat: node.lat, lng: node.lng});
                this.map.setZoom(30);
            }
            bounds.extend({lat: node.lat, lng: node.lng});
        });
        // Account for height of navbar
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const height = ne.lat() - sw.lat();
        bounds.extend({
            lat: sw.lat() - (height * 0.1),
            lng: sw.lng(),
        });
        this.map.fitBounds(bounds);
    }

    updateNode(node: EditorNode) {
        this.currentGraph?.updateNode(node);
    }

    updateEdge(edge: EditorEdges) {
        this.currentGraph?.updateEdge(edge);
    }

    undo() {
        this.currentGraph?.undo();
    }

    redo() {
        this.currentGraph?.redo();
    }
}