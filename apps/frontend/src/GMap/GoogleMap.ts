import axios from "axios";
import {API_ROUTES, EditorEdges, EditorGraph, EditorNode, PathfindingResponse} from "common/src/constants.ts";
import {EditorEncapsulator} from "@/routes/MapEditor.tsx";

import {Button} from '@/components/ui/button.tsx'

const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SCRIPT_URL: string = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`


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
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);

            if (!existingScript) {
                const script = document.createElement('script');
                script.src = SCRIPT_URL;
                script.async = true;
                script.defer = true;
                script.onload = () => window.initMap?.();
                document.body.appendChild(script);
            } else {
                // Already loaded
                window.initMap?.();
            }
            window.initMap = () => {
                resolve(true);
            }
        });
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
        this.map = new google.maps.Map(mapDivElement, mapOptions);
    }
}



class PathfindingGraph {
    private readonly path: google.maps.Polyline;
    private readonly nodes: google.maps.Marker[];

    constructor(map: google.maps.Map, path: google.maps.LatLngLiteral[], color: string) {

        this.path = new google.maps.Polyline({
            map: map,
            path: path,
            strokeColor: color,
        });
        // this.path.binder =
        this.nodes = path.map((position, i) =>
            new google.maps.Marker({
                map: map,
                position: position,
                icon: {
                    url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
                    size: new google.maps.Size(7, 7),
                    anchor: new google.maps.Point(3.5, 3.5)
                },
            })
        );
    }

    remove() {
        this.path.setMap(null);
        this.nodes.forEach(node => node.setMap(null));
    }
}

export class PathfindingMap extends GoogleMap {



    public static async makeMap(mapDivElement: HTMLDivElement, autocompleteInput: HTMLInputElement) {
        await GoogleMap.loadScript();
        return new PathfindingMap(mapDivElement, autocompleteInput);
    }

    private readonly directionsService: google.maps.DirectionsService;
    private readonly directionsRenderer: google.maps.DirectionsRenderer;
    private readonly autocomplete: google.maps.places.Autocomplete;

    private startPlaceId: string | null;
    private endLocation: google.maps.LatLngLiteral | null;
    private travelMode: google.maps.TravelMode;

    private currentPathfindingResponse: PathfindingResponse | null;
    private currentParkingPath: PathfindingGraph | null;
    private currentFloorPath: PathfindingGraph | null;
    private currentFloorMap: google.maps.GroundOverlay | null;

    private constructor(mapDivElement: HTMLDivElement, autocompleteInput: HTMLInputElement) {

        super(mapDivElement, {
            center: {
                lat: 42.31934987791928,
                lng: -71.3162829187303,
            },
            zoom: 10,
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
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
                this.route();
            }
        });

        this.startPlaceId = null;
        this.endLocation = null;
        this.travelMode = google.maps.TravelMode.DRIVING;

        this.currentPathfindingResponse = null;
        this.currentParkingPath = null;
        this.currentFloorPath = null;
        this.currentFloorMap = null;
    }

    updateDepartmentPathfinding(pathfindingResponse: PathfindingResponse) {
        this.currentPathfindingResponse = pathfindingResponse;

        this.updateCurrentFloor(1);

        this.endLocation = pathfindingResponse.parkingLotPath.path[0];
        this.route();

        if (this.currentParkingPath) {
            this.currentParkingPath.remove();
            this.currentFloorPath = null;
        }
        this.currentParkingPath = new PathfindingGraph(this.map, pathfindingResponse.parkingLotPath.path, '#CC3300');
    }

    updateTravelMode(travelMode: string) {
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
        this.route();
    }

    updateCurrentFloor(floorNum: number) {
        if (!this.currentPathfindingResponse) return;
        const floorPath = this.currentPathfindingResponse.floorPaths.find(fp => fp.floorNum === floorNum);

        if (floorPath) {
            if (this.currentFloorPath) {
                this.currentFloorPath.remove();
                this.currentFloorPath = null;
            }
            if (this.currentFloorMap) {
                this.currentFloorMap.setMap(null);
                this.currentFloorMap = null;
            }
            this.currentFloorPath = new PathfindingGraph(this.map, this.currentPathfindingResponse.floorPaths[0].path, '#00AACC');
            this.currentFloorMap = new google.maps.GroundOverlay(this.currentPathfindingResponse.floorPaths[0].image, {
                north: this.currentPathfindingResponse.floorPaths[0].imageBoundsNorth,
                south: this.currentPathfindingResponse.floorPaths[0].imageBoundsSouth,
                east: this.currentPathfindingResponse.floorPaths[0].imageBoundsEast,
                west: this.currentPathfindingResponse.floorPaths[0].imageBoundsWest,
            });

            this.currentFloorMap.setMap(this.map);
        }
    }

    recenter(lat: number, lng: number, zoom: number) {
        this.map.setCenter({lat, lng});
        this.map.setZoom(zoom);
    }

    private route() {
        if (!this.startPlaceId || !this.endLocation) return;

        this.directionsService.route(
            {
                origin: {placeId: this.startPlaceId},
                destination: this.endLocation,
                travelMode: this.travelMode,
            },
            (response, status) => {
                if (status === 'OK') {
                    console.log('Routed!');
                    this.directionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }
}

class EditorMapGraph {

    private readonly map: google.maps.Map;
    private readonly editorEncapsulator: EditorEncapsulator;
    private readonly editorGraph: EditorGraph;

    private nodes: {data: EditorNode, marker: google.maps.Marker}[];
    private edges: {data: EditorEdges, line: google.maps.Polyline}[];

    private newEdge: {startNodeId: number, line: google.maps.Polyline} | null;

    private editingState: 'DEFAULT' | 'ADDEDGE';
    private visible: boolean;

    constructor(map: google.maps.Map, editorEncapsulator: EditorEncapsulator, editorGraph: EditorGraph) {

        this.map = map;
        this.editorEncapsulator = editorEncapsulator;
        this.editorGraph = editorGraph;

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

        // If in default state,
        // add a node at this position
        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
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



    private addNodeLocal(node: EditorNode) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: {
                lat: node.lat,
                lng: node.lng,
            },
            icon: {
                url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
                size: new google.maps.Size(10, 10),
                anchor: new google.maps.Point(5, 5),
            },
            draggable: true,
            zIndex: 20,
        });

        // If clicked in default state,
        // display info. If clicked in
        // add edge state, finalize this edge
        marker.addListener("click", (e: google.maps.MapMouseEvent) => {
            const rawPosition = e.latLng;
            if (!rawPosition) return;

            if (this.editingState === 'ADDEDGE' && this.newEdge) {
                this.newEdge.line.setMap(null);
                this.addEdge({
                    edgeId: -1,
                    name: '',
                    startNodeId: this.newEdge.startNodeId,
                    endNodeId: node.nodeId,
                    graphId: this.editorGraph.graphId,
                })
                this.editingState = 'DEFAULT';
            }


            // const infowindow = new google.maps.InfoWindow({
            //     content: `
            //             <button class="bg-blue-700 text-white">Remove</button>
            //             <button class="bg-blue-700 text-white">Add</button>
            //         `
            // });
            // infowindow.setPosition(marker.getPosition());
            // infowindow.open(this.map);
        });

        // If right clicked in default mode,
        // start to add an edge
        marker.addListener("rightclick", (e: google.maps.MapMouseEvent) => {
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

                // // If clicked and in adding an
                // // edge state,
                // line.addListener('click', (e: google.maps.MapMouseEvent) => {
                //     // For creating a new node
                //     if (this.editingState === 'ADDEDGE') {
                //         this.editingState = 'DEFAULT';
                //         console.log(1);
                //     }
                // })
            }
        });

        marker.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
            console.log('edge doubleclicked');
            if (this.editingState === 'DEFAULT') {
                this.deleteNode(node.nodeId);
            }
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
            strokeColor: '#00AACC',
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

        // Once the drag has ended, update
        // the node position in the
        // encapsulator
        startNode.marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
            if (this.editingState === 'DEFAULT') {
                const rawPosition = e.latLng;
                if (!rawPosition) return;
                startNode.data.lat = rawPosition.toJSON().lat;
                startNode.data.lat = rawPosition.toJSON().lng;
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
        // Once the drag has ended, update
        // the node position in the
        // encapsulator
        endNode.marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
            if (this.editingState === 'DEFAULT') {
                const rawPosition = e.latLng;
                if (!rawPosition) return;
                endNode.data.lat = rawPosition.toJSON().lat;
                endNode.data.lat = rawPosition.toJSON().lng;
            }
        });


        line.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
            if (this.editingState === 'DEFAULT') {
                this.deleteEdge(edge.edgeId);
            }
        });

        this.edges.push({
            data: edge,
            line: line,
        });
    }

    addNode(node: EditorNode) {

        // Give the node an ID that doesn't exist yet
        // Needs improving for efficiency
        let id = 0;
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

        node.nodeId = id;
        console.log(id);
        this.editorGraph.Nodes.push(node);
        this.addNodeLocal(node);

        return node;
    }

    addEdge(edge: EditorEdges) {

        // Give the edge an ID that doesn't exist yet
        // Needs improving for efficiency
        let id = 0;
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

        edge.edgeId = id;
        console.log(id);
        this.editorGraph.Edges.push(edge);
        this.addEdgeLocal(edge);

        return edge;
    }

    deleteNode(nodeId: number) {
        const nodeIndexLocal = this.nodes.findIndex(cnode =>
            cnode.data.nodeId === nodeId
        );

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
        })
    }

    deleteEdge(edgeId: number) {
        const edgeIndexLocal = this.edges.findIndex(cedge =>
            cedge.data.edgeId === edgeId
        );

        this.edges[edgeIndexLocal].line.setMap(null);

        this.edges.splice(edgeIndexLocal, 1);

        const edgeIndexEncapsulator = this.editorGraph.Edges.findIndex(edge =>
            edge.edgeId === edgeId
        );

        this.editorGraph.Edges.splice(edgeIndexEncapsulator, 1);
    }

    setVisibility(visibility: boolean) {
        if (visibility) {
            this.nodes.forEach(node => {
                node.marker.setMap(this.map);
            });
            this.edges.forEach(edge => {
                edge.line.setMap(this.map);
            });
        }
        else {
            this.edges.forEach(edge => {
                edge.line.setMap(null);
            });
            this.nodes.forEach(node => {
                node.marker.setMap(null);
            });
        }
        this.visible = visibility;
    }
}

export class EditorMap extends GoogleMap {

    public static async makeMap(mapDivElement: HTMLDivElement) {
        await GoogleMap.loadScript();
        return new EditorMap(mapDivElement);
    }
    
    private currentGraph: EditorMapGraph | null;

    private editorEncapsulator: EditorEncapsulator | null;
    private readonly graphs: Map<number, EditorMapGraph>;

    constructor(mapDivElement: HTMLDivElement) {
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
        this.editorEncapsulator = null;

        console.log('editor map constructosdfsdfsdr');
        this.graphs = new Map();

        // this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
        //     const rawPosition = e.latLng;
        //     if (!rawPosition) return;
        //
        //     if (this.currentGraph) {
        //         this.currentGraph.addNode({
        //             nodeId: -1,
        //             name: '',
        //             lat: rawPosition.toJSON().lat,
        //             lng: rawPosition.toJSON().lng,
        //             type: 'NORMAL',
        //             connectedNodeId: null,
        //         });
        //     }
        //
        //     console.log('lat: ' + rawPosition.toJSON().lat + ',\nlng: ' + rawPosition.toJSON().lng + ',');
        // });
        console.log('yah');
    }

    changeGraph(graphId: number) {
        this.currentGraph?.setVisibility(false);
        const newGraph = this.graphs.get(graphId);
        if (!newGraph) return;

        newGraph.setVisibility(true);
        this.currentGraph = newGraph;
    }

    initialize(editorEncapsulator: EditorEncapsulator) {
        this.editorEncapsulator = editorEncapsulator;

        this.editorEncapsulator.editorGraphs.forEach(graph => {
            console.log('Making graph ' + graph.graphId);
            this.graphs.set(graph.graphId, new EditorMapGraph(this.map, editorEncapsulator, graph));
        })
    }

    getCurrentGraph() {
        return this.currentGraph;
    }
}