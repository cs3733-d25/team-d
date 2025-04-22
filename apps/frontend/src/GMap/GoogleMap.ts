import axios from "axios";
import {API_ROUTES, EditorGraph, PathfindingResponse} from "common/src/constants.ts";

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

    // For inner map directions
    public innerSteps: string[] = [];
    public innerStepIndex: number = 0;
    private highlightedCircle: google.maps.Circle | null = null;
    private highlightedLine: google.maps.Polyline | null = null;

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

    // TODO: INNER HOSPITAL
    // Text to directions functions for inside of hospital

    private highlightStep(index: number): void {
        // Reset previous circle
        if (this.highlightedCircle) {
            this.highlightedCircle.setOptions({
                fillColor: '#00FF88',
                strokeColor: '#00FF88',
            });
        }

        // Reset previous line
        if (this.highlightedLine) {
            this.highlightedLine.setOptions({
                strokeColor: '#CC3300',
            });
        }

        if (this.highlightedCircle) {
            this.highlightedCircle.setIcon({
                url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
                size: new google.maps.Size(7, 7),
                anchor: new google.maps.Point(3.5, 3.5)
            });
        }

        const newMarker = this.nodes[index];
        newMarker.setIcon({
            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png', // or your own highlight icon
            size: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(3.5, 3.5),
        });
        this.highlightedCircle = newMarker;


        // Highlight path segment leading to this node, if it exists
        const newLine = index > 0 ? this.path[index - 1] : undefined;
        if (newLine) {
            newLine.setOptions({
                strokeColor: '#FFD700',
            });
            this.highlightedLine = newLine;
        } else {
            if (index > 0) console.warn(`highlightStep: No path at index ${index - 1}`);
            this.highlightedLine = undefined;
        }
    }

    public showInnerStep(): void {
        const stepDisplay = document.getElementById("inner-step-instruction");

        if (stepDisplay && this.innerSteps.length > 0) {
            const stepText = this.innerSteps[this.innerStepIndex];

            // Update instruction UI
            stepDisplay.innerHTML = `
            <strong>Step ${this.innerStepIndex + 1}/${this.innerSteps.length}</strong><br>
            ${stepText}
        `;

            // Text-to-speech
            const utter = new SpeechSynthesisUtterance(stepText);
            utter.lang = 'en-US';
            speechSynthesis.cancel();
            speechSynthesis.speak(utter);

            // Highlight the corresponding step on map
            this.highlightStep(this.innerStepIndex);

            // // Optional: pan the map to the current step’s marker/center
            // const currentNode = this.nodes[this.innerStepIndex];
            // if (currentNode) {
            //     this.map.panTo(currentNode.getCenter());
            // }
        } else {
            console.log("No inner steps found or stepDisplay element is missing.");
        }
    }

    private innerNextButtonSetup = false;

    public setupInnerNextButton(): void {
        if (this.innerNextButtonSetup) return; // prevent adding listener multiple times
        this.innerNextButtonSetup = true;

        const nextButton = document.getElementById("inner-next-step-btn");
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                if (this.innerStepIndex < this.innerSteps.length - 1) {
                    this.innerStepIndex++;
                    this.showInnerStep();
                } else {
                    alert("You’ve reached the destination!");
                }
            });
        }
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

    // For Google Map directions
    private stepIndex: number = 0;
    private steps: google.maps.DirectionsStep[] = [];
    private currentStepPolyline: google.maps.Polyline | null = null;
    private currentStepMarker: google.maps.Marker | null = null;



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
        this.currentParkingPath.innerSteps = pathfindingResponse.parkingLotPath.direction;

        console.log('steps');

        this.currentParkingPath.showInnerStep();
        this.currentParkingPath.setupInnerNextButton();
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


    // Text to directions functions for outside of hospital
    private showCurrentStep(): void {
        const stepDisplay = document.getElementById("step-instruction");
        if (stepDisplay && this.steps.length > 0) {
            const step = this.steps[this.stepIndex];

            // Update instruction UI
            stepDisplay.innerHTML = `
            <strong>Step ${this.stepIndex + 1}/${this.steps.length}</strong><br>
            ${step.instructions}<br>
            <small>${step.distance?.text}, ${step.duration?.text}</small>
        `;

            // Text-to-speech
            const plainText = step.instructions.replace(/<[^>]*>/g, '');
            const utter = new SpeechSynthesisUtterance(plainText);
            utter.lang = 'en-US';
            speechSynthesis.cancel();
            speechSynthesis.speak(utter);

            // Clear previous step polyline
            if (this.currentStepPolyline) {
                this.currentStepPolyline.setMap(null);
            }

            // Draw current step polyline
            this.currentStepPolyline = new google.maps.Polyline({
                path: google.maps.geometry.encoding.decodePath(step.polyline.points),
                strokeOpacity: 1.0,
                strokeWeight: 6,
                map: this.map,
            });

            // Pan and zoom to current step start location
            this.map.panTo(step.start_location);
            this.map.setZoom(17); // or adjust dynamically

            // Optional: Add a marker to indicate position
            if (this.currentStepMarker) {
                this.currentStepMarker.setMap(null);
            }

            this.currentStepMarker = new google.maps.Marker({
                position: step.start_location,
                map: this.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillOpacity: 1,
                    strokeColor: "#fff",
                    strokeWeight: 2
                }
            });
        } else {
            console.log("No steps found or stepDisplay element is missing.");
        }
    }

    private setupNextButton(): void {
        const nextButton = document.getElementById("next-step-btn");
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                if (this.stepIndex < this.steps.length - 1) {
                    this.stepIndex++;
                    this.showCurrentStep();
                } else {
                    alert("You’ve reached the destination!");
                }
            });
        }
    }




    // To route from home to the wanted hospital
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

                    const route = response?.routes[0];
                    const leg = route?.legs[0];
                    this.steps = leg?.steps;
                    this.stepIndex = 0;

                    console.log(response);
                    this.showCurrentStep();
                    this.setupNextButton();
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }
}

class EditorMapGraph {
    private nodes: {id: number, marker: google.maps.Marker}[];
    private edges: {id: number, line: google.maps.Polyline}[];

    private readonly editorMap: EditorMap;
    
    constructor(map: google.maps.Map, graph: EditorGraph, color: string, editorMap: EditorMap) {

        this.editorMap = editorMap;

        this.nodes = graph.Nodes.map(node => {
            const marker = new google.maps.Marker({
                map: map,
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
            });

            marker.addListener("click", () => {
                const infowindow = new google.maps.InfoWindow({
                    content: `
                            <div>
                                <b>Node Info</b><br/>
                                ID: ${node.nodeId} <br/>
                                Tag: ${node.name} <br/>
                                Lat: ${node.lat.toFixed(5)}<br/>
                                Lng: ${node.lng.toFixed(5)}
                            </div>
                        `,
                });
                infowindow.setPosition(marker.getPosition());
                infowindow.open(map);
            });

            return {
                id: node.nodeId,
                marker: marker,
            }
        });

        this.edges = graph.Edges.map(edge => {
            const startNode = this.nodes.find(node => node.id === edge.startNodeId);
            const endNode = this.nodes.find(node => node.id === edge.endNodeId);
            if (!startNode || !endNode) {
                return {
                    id: -1,
                    line: new google.maps.Polyline()
                }
            }

            const line = new google.maps.Polyline({
                map: map,
                path: [
                    startNode.marker.getPosition() || {lat: 0, lng: 0},
                    endNode.marker.getPosition() || {lat: 0, lng: 0},
                ],
                strokeColor: color,
            });
            line.setMap(map);

            startNode.marker.addListener('drag', (e: google.maps.MapMouseEvent) => {
                const rawPosition = e.latLng;
                if (!rawPosition) return;

                line.setPath([
                    {
                        lat: rawPosition.toJSON().lat,
                        lng: rawPosition.toJSON().lng,
                    },
                    line.getPath().getAt(1),
                ]);


            });

            startNode.marker.addListener('dragend', () => {

            })

            endNode.marker.addListener('drag', (e: google.maps.MapMouseEvent) => {
                const rawPosition = e.latLng;
                if (!rawPosition) return;

                line.setPath([
                    line.getPath().getAt(0),
                    {
                        lat: rawPosition.toJSON().lat,
                        lng: rawPosition.toJSON().lng,
                    },
                ]);
            });

            return {
                id: edge.edgeId,
                line: line,
            }
        });
        // this.nodes = new Map();
        // this.edges = new Map();
        //
        // graph.Nodes.forEach(node => {
        //     this.nodes.set(
        //         node.nodeId,
        //         new google.maps.Marker({
        //             map: map,
        //             position: {
        //                 lat: node.lat,
        //                 lng: node.lng,
        //             },
        //             icon: {
        //                 url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
        //                 size: new google.maps.Size(7, 7),
        //                 anchor: new google.maps.Point(3.5, 3.5),
        //             },
        //             draggable: true,
        //         })
        //     );
        // })
    }

    remove() {
        this.edges.forEach(edge => {
            edge.line.setMap(null);
        });
        this.edges = [];
        this.nodes.forEach(node => {
            node.marker.setMap(null);
        });
        this.nodes = [];
    }
}

export class EditorMap extends GoogleMap {

    public static async makeMap(mapDivElement: HTMLDivElement) {
        await GoogleMap.loadScript();
        return new EditorMap(mapDivElement);
    }
    
    private currentGraph: EditorMapGraph | null;
    private currentFloorMap: google.maps.GroundOverlay | null;

    private editorGraphs: EditorGraph[];

    constructor(mapDivElement: HTMLDivElement) {
        super(mapDivElement, {
            center: {
                lat: 42.31934987791928,
                lng: -71.3162829187303,
            },
            zoom: 10,
        });
        
        this.currentGraph = null;
        this.currentFloorMap = null;
        this.editorGraphs = [];

        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
            const rawPosition = e.latLng;
            if (!rawPosition) return;

            console.log('lat: ' + rawPosition.toJSON().lat + ',\nlng: ' + rawPosition.toJSON().lng + ',');
        });
    }

    changeGraph(graph: EditorGraph) {
        if (this.currentGraph) {
            this.currentGraph.remove();
        }
        if (this.currentFloorMap) {
            this.currentFloorMap.setMap(null);
            this.currentFloorMap = null;
        }

        this.currentGraph = new EditorMapGraph(this.map, graph, '#00AACC', this);
        if (graph.graphType === 'FLOORGRAPH' && graph.FloorGraph) {
            this.currentFloorMap = new google.maps.GroundOverlay(graph.FloorGraph.image, {
                north: graph.FloorGraph.imageBoundsNorth,
                south: graph.FloorGraph.imageBoundsSouth,
                east: graph.FloorGraph.imageBoundsEast,
                west: graph.FloorGraph.imageBoundsWest,
            });
            this.currentFloorMap.setMap(this.map);

            this.currentFloorMap.addListener('click', (e: google.maps.MapMouseEvent) => {
                const rawPosition = e.latLng;
                if (!rawPosition) return;

                console.log('lat: ' + rawPosition.toJSON().lat + ',\nlng: ' + rawPosition.toJSON().lng + ',');
            });
        }
    }

    initialize(editorGraphs: EditorGraph[]) {
        this.editorGraphs = editorGraphs;
    }

    getCurrentGraph() {
        return this.currentGraph;
    }
}