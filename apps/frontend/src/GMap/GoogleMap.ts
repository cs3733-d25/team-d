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

    // Distance and time for inner
    // private innerDistances: number[] = []; // in meters
    // private innerDurations: number[] = []; // in seconds (estimate)

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

        // function animateCircle(line: google.maps.Polyline) {
        let offsetPixels = 0;

        window.setInterval(() => {
            offsetPixels = (offsetPixels + 1) % 1000;

            // this.path.setOptions({
            //     icons: [
            //         {
            //             offset: offsetPixels + 'px',
            //         },
            //     ],
            // });

            const icons = this.path.get("icons");
            //
            icons[0].offset = offsetPixels + "px";
            this.path.set("icons", icons);

            // this.path.setOptions({
            //     icons: [
            //         {
            //             icon: icon,
            //         }
            //     ]
            // })
        }, 50);

        // let offsetPixels = 0;
        // function animateDashedLine(this: PathfindingGraph) {
        //     offsetPixels = (offsetPixels + 1) % 1000;
        //     this.path.setOptions({
        //         strokeOpacity: 1,
        //         strokeWeight: 3,
        //         icons: [{
        //             icon: {
        //                 path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        //                 scale: 2,
        //                 strokeColor: '#666666',
        //                 strokeWeight: 2,
        //                 fillColor: '#666666',
        //                 fillOpacity: 1
        //             },
        //             offset: `${offsetPixels}px`,
        //             repeat: "20px"
        //         }]
        //     });
        //
        //     setTimeout(() => {
        //         requestAnimationFrame(() => animateDashedLine.call(this));
        //     }, 50);
        // }
        //
        // // Start the animation
        // animateDashedLine.call(this);

        this.nodes = path.map(position =>
            new google.maps.Marker({
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 2,
                    fillOpacity: 1,
                    strokeColor: '#666666',
                    fillColor: '#666666',
                    strokeWeight: 2
                },
                position: position,
            })
        );

        // Calculate the distance and time
        // for (let i = 0; i < this.nodes.length - 1; i++) {
        //     const pos1 = this.nodes[i].getPosition();
        //     const pos2 = this.nodes[i + 1].getPosition();
        //
        //     if (pos1 && pos2) {
        //         const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
        //         this.innerDistances.push(distanceMeters);
        //
        //         // Estimate duration assuming average indoor walking speed (~1.4 meters/sec)
        //         const estimatedSeconds = distanceMeters / 1.4;
        //         this.innerDurations.push(estimatedSeconds);
        //     } else {
        //         this.innerDistances.push(0);
        //         this.innerDurations.push(0);
        //     }
        // }

        this.selectedSegment = null;

        this.rotation = floor?.imageRotation || 0;

        console.log(this.rotation);

        this.visibility = false;
    }


    // private color: string;


    // For inner map directions

    // private isFinal: boolean;
    // private pathForDisplay: google.maps.LatLngLiteral[];
    // public innerSteps: string[] = [];
    // private pathPolylines: google.maps.Polyline[] = [];
    // public innerStepIndex: number = 0;
    // private highlightedCircle: google.maps.Circle | null = null;
    // private highlightedLine: google.maps.Polyline | null = null;
    // private loadThisAfter: PathfindingGraph | null = null;
    //
    //
    // // floor is the map of the map of the graph itself
    // public floor: FloorPathResponse | null = null;

    // constructor(map: google.maps.Map, path: google.maps.LatLngLiteral[], color: string, after: PathfindingGraph | null, floor: FloorPathResponse | null, isFinal: boolean) {
    //     this.map = map;
    //
    //     // For outside map
    //     this.selectedSegment = null;
    //     this.visibility = false;
    //
    //     if (floor) {
    //         this.floorMap = new google.maps.GroundOverlay(GoogleMap.getImgURL(floor.image), {
    //             north: floor.imageBoundsNorth,
    //             south: floor.imageBoundsSouth,
    //             east: floor.imageBoundsEast,
    //             west: floor.imageBoundsWest,
    //         }, {
    //
    //         });
    //     }
    //     else this.floorMap = null;
    //
    //     this.path = new google.maps.Polyline({
    //         path: path,
    //         strokeColor: '#0cf',
    //     });
    //
    //     this.nodes = path.map(position =>
    //         new google.maps.Marker({
    //             icon: {
    //                 path: google.maps.SymbolPath.CIRCLE,
    //                 scale: 5,
    //                 fillOpacity: 1,
    //                 fillColor: '#0cf',
    //                 strokeColor: '#fff',
    //                 strokeWeight: 2
    //             },
    //             position: position,
    //         })
    //     );
    //
    //     // For inner map
    //     this.pathForDisplay = path;
    //     this.pathPolylines = [];
    //     this.loadThisAfter = after;
    //     this.floor = floor;
    //     this.isFinal = isFinal;
    //     this.color = color;
    //
    // }


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


    // Text to directions functions for inside of hospital

    // private highlightStep(index: number): void {
    //
    //     // TODO: DECIDE IF U WANNA KEEP THE LINE THAT HAVE WALKED OR NOT, ASK EMMA!!
    //
    //     if (this.highlightedCircle) {
    //         this.highlightedCircle.setIcon({
    //             url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
    //             size: new google.maps.Size(7, 7),
    //             anchor: new google.maps.Point(3.5, 3.5)
    //         });
    //     }
    //
    //     const newMarker = this.nodes[index];
    //     newMarker.setIcon({
    //         url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    //         size: new google.maps.Size(30, 30),
    //         // anchor: new google.maps.Point(3., 10)
    //     });
    //     this.highlightedCircle = newMarker;
    //
    //
    //     // Highlight path segment leading to this node, if it exists
    //     const newLine = index > 0 ? this.pathPolylines[index - 1] : undefined;
    //     if (newLine) {
    //         newLine.setOptions({
    //             strokeColor: '#00AACC',
    //             zIndex: 9999, // bring to front
    //         });
    //         this.highlightedLine = newLine;
    //     } else {
    //         if (index > 0) console.warn(`highlightStep: No path at index ${index - 1}`);
    //         this.highlightedLine = undefined;
    //     }
    //
    // }

    // public showInnerStep(): void {
    //     const stepDisplay = document.getElementById("inner-step-instruction");
    //
    //
    //     if (stepDisplay && this.innerSteps.length > 0) {
    //         const stepText = this.innerSteps[this.innerStepIndex];
    //
    //         // Update instruction UI
    //         stepDisplay.innerHTML = `
    //         <strong>Step ${this.innerStepIndex + 1}/${this.innerSteps.length}</strong><br>
    //         ${stepText}
    //     `;
    //
    //         // Text-to-speech
    //         const utter = new SpeechSynthesisUtterance(stepText);
    //         utter.lang = 'en-US';
    //         speechSynthesis.cancel();
    //         speechSynthesis.speak(utter);
    //
    //         // Highlight the corresponding step on map
    //         this.highlightStep(this.innerStepIndex);
    //
    //         // Optional: pan the map to the current step's marker/center
    //         const currentNode = this.nodes[this.innerStepIndex];
    //         if (currentNode) {
    //             this.map.panTo(currentNode.getPosition()!);
    //         }
    //     } else {
    //         console.log("No inner steps found or stepDisplay element is missing.");
    //     }
    // }

    // private innerNextButtonSetup = false;

    // public setupInnerNextButton(): void {
    //     if (this.innerNextButtonSetup) return; // prevent adding listener multiple times
    //     this.innerNextButtonSetup = true;
    //
    //     this.innerStepIndex =0;
    //     // this.path.binder =
    //     this.nodes = this.pathForDisplay.map((position, i) =>
    //         new google.maps.Marker({
    //             map: this.map,
    //             position: position,
    //             icon: {
    //                 url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
    //                 size: new google.maps.Size(7, 7),
    //                 anchor: new google.maps.Point(3.5, 3.5)
    //             },
    //         })
    //     );
    //
    //     const lineSymbol = {
    //         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //     };
    //
    //     this.path = new google.maps.Polyline({
    //         map: this.map,
    //         path: this.pathForDisplay,
    //         strokeColor: this.color,
    //         icons: [
    //             {
    //                 icon: lineSymbol,
    //                 offset: '100%',
    //             },
    //         ],
    //     });
    //
    //     for (let i = 0; i < this.pathForDisplay.length - 1; i++) {
    //         const line = new google.maps.Polyline({
    //             path: [this.pathForDisplay[i], this.pathForDisplay[i + 1]],
    //             geodesic: true,
    //             strokeColor: '#CC3300',
    //             strokeOpacity: 1.0,
    //             strokeWeight: 4,
    //             map: this.map,
    //         });
    //         this.pathPolylines.push(line);
    //     }
    //
    //     const nextButton = document.getElementById("inner-next-step-btn");
    //     if (nextButton) {
    //         nextButton.addEventListener("click", () => {
    //             if (this.innerStepIndex < this.innerSteps.length - 1) {
    //                 this.innerStepIndex++;
    //                 this.showInnerStep();
    //                 console.log(this.innerStepIndex);
    //                 console.log('This graph');
    //                 console.log(this.floor?.image);
    //             } else {
    //
    //                 if(this.isFinal){
    //                     alert('You have reached the final destination!');
    //                 } else {
    //                     this.remove();
    //                 }
    //
    //                 if (this.highlightedCircle) {
    //                     this.highlightedCircle.setIcon({
    //                         url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
    //                         size: new google.maps.Size(7, 7),
    //                         anchor: new google.maps.Point(3.5, 3.5)
    //                     });
    //                 }
    //
    //                 const theNextFloorMap = new google.maps.GroundOverlay(GoogleMap.getImgURL(this.loadThisAfter.floor.image), {
    //                     north: this.loadThisAfter.floor.imageBoundsNorth,
    //                     south: this.loadThisAfter.floor.imageBoundsSouth,
    //                     east: this.loadThisAfter.floor.imageBoundsEast,
    //                     west: this.loadThisAfter.floor.imageBoundsWest,
    //                 });
    //                 theNextFloorMap.setMap(this.map);
    //                 console.log('Next graph');
    //                 console.log(this.loadThisAfter.floor.image);
    //                 this.loadThisAfter?.setupInnerNextButton();
    //                 this.loadThisAfter?.showInnerStep();
    //             }
    //         });
    //     }
    // }

    public remove() {
        this.path.setMap(null);
        this.nodes.forEach(node => node.setMap(null));
        // this.pathPolylines.forEach(polyline => polyline.setMap(null));
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
    distance: string;
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
    // private currentParkingPath: PathfindingGraph | null;
    // private currentFloorPaths: PathfindingGraph[] | null;
    // private selectedFloorPath: PathfindingGraph | null;

    private currentPath: PathfindingGraph | null;
    private allPaths: PathfindingGraph[];

    private directionsBounds: google.maps.LatLngBounds | null;

    // For Google Map directions
    // private stepIndex: number = 0;
    // private steps: google.maps.DirectionsStep[] = [];
    private currentStepPolyline: google.maps.Polyline | null;
    // private currentStepMarker: google.maps.Marker | null = null;

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
            // preserveViewport: true,
            polylineOptions: {
                strokeColor: '#00c',
                strokeWeight: 5,
                strokeOpacity: 1,
                // icons: [{
                //     icon: {
                //         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                //         scale: 2,
                //         strokeColor: '#666666',
                //         strokeWeight: 2,
                //         fillColor: '#666666',
                //         fillOpacity: 1
                //     },
                //     offset: '0px',
                //     repeat: '20px'
                // }]
            }
        });
        // let offsetPixels = 0;
        // // Add animation for the directions polyline
        // function animateDirectionsLine(this: PathfindingMap) {
        //     offsetPixels = (offsetPixels + 1) % 1000;
        //     this.directionsRenderer.setOptions({
        //         polylineOptions: {
        //             strokeColor: '#00c',
        //             strokeWeight: 3,
        //             strokeOpacity: 1,
        //             icons: [{
        //                 icon: {
        //                     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        //                     scale: 2,
        //                     strokeColor: '#666666',
        //                     strokeWeight: 2,
        //                     fillColor: '#666666',
        //                     fillOpacity: 1
        //                 },
        //                 offset: `${offsetPixels}px`,
        //                 repeat: '20px'
        //             }]
        //         }
        //     });
        //
        //     setTimeout(() => {
        //         requestAnimationFrame(() => animateDirectionsLine.call(this));
        //     }, 50);
        // }

        // let offsetPixels = 0;
        //
        // let count = 0;
        //
        // window.setInterval(() => {
        //     offsetPixels = (offsetPixels + 1) % 1000;
        //     count++;
        //
        //     const icon = this.directionsRenderer.get("polylineOptions").get("icons")[0];
        //
        //     icon.offset = offsetPixels + 'px';
        //
        //     const plo: google.maps.PolylineOptions = this.directionsRenderer.get("polylineOptions");
        //
        //     plo.set
        //
        //     this.directionsRenderer.set
        //
        //     // const icons = this.directionsRenderer.get("polylineOptions").get("icons");
        //
        //     // icons[0].offset = offsetPixels + "px";
        //     // this.directionsRenderer.setOptions({
        //     //     polylineOptions: {
        //     //         icons: [{
        //     //             offset: `${offsetPixels}px`,
        //     //         }]
        //     //     }
        //     // });
        //     // const icons = this.directionsRenderer.get("polylineOptions").get("icons");
        //     //
        //     // icons[0].offset = offsetPixels + "px";
        //
        //     // this.directionsRenderer
        //
        //     // const plo: google.maps.PolylineOptions = this.directionsRenderer.get("polylineOptions");
        //     // if (count === 100) console.log('1 ', plo);
        //     //
        //     // const icos: google.maps.IconSequence[] = plo.icons || [];
        //     // if (count === 100) console.log('2 ', icos);
        //     //
        //     // icos[0].offset = offsetPixels + "px";
        //     // if (count === 100) console.log('3 ', icos);
        //     //
        //     //
        //     //
        //     //
        //     //
        //     // // const icons = this.path.get("icons");
        //     // //
        //     // // icons[0].offset = offsetPixels + "px";
        //     // plo.icons = icos;
        //     // if (count === 100) console.log('4 ', plo);
        //     //
        //     // this.directionsRenderer.set("polylineOptions", plo);
        //     //
        //     // if (count === 100) console.log('5 ', this.directionsRenderer.get("polylineOptions"));
        //
        // }, 100);

        // Start the animation
        // animateDirectionsLine.call(this);

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
                // this.route();
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
        // this.currentParkingPath = null;
        // this.currentFloorPaths = null;
        // this.selectedFloorPath = null;
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

    // updateDepartmentPathfinding(pathfindingResponse: PathfindingResponse) {
    //     this.currentPathfindingResponse = pathfindingResponse;
    //     this.endLocation = pathfindingResponse.parkingLotPath.path[0];
    //
    //     // Load new floor overlay
    //     console.log(pathfindingResponse.floorPaths.length)
    //
    //     let floor: FloorPathResponse | null;
    //     floor = null;
    //     let graph: PathfindingGraph;
    //     let previousGraph: PathfindingGraph | null = null;
    //     for (let i = pathfindingResponse.floorPaths.length - 1 ;i >=0; i--) {
    //         floor = pathfindingResponse.floorPaths[i];
    //
    //         // 4th floor
    //         if (i==pathfindingResponse.floorPaths.length - 1) {
    //             graph = new PathfindingGraph(this.map, floor.path, '#CC3300', null, floor, true);
    //             graph.innerSteps = floor.direction;
    //             console.log(graph);
    //
    //         }
    //         else {
    //             graph = new PathfindingGraph(this.map, floor.path, '#CC3300', previousGraph, floor, false);
    //             graph.innerSteps = floor.direction;
    //             console.log(graph);
    //
    //         }
    //         previousGraph = graph;
    //     }
    //
    //
    //     // Now create the parking path and pass in the floor path to trigger after
    //     this.currentParkingPath = new PathfindingGraph(this.map, pathfindingResponse.parkingLotPath.path, '#CC3300', previousGraph, null , false);
    //     this.currentParkingPath.innerSteps = pathfindingResponse.parkingLotPath.direction;
    //     this.currentParkingPath.setupInnerNextButton();
    //     this.currentParkingPath.showInnerStep(); // start here
    // }

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
            unitSystem: google.maps.UnitSystem.METRIC,
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
                    distance: step.distance?.text || '',
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


        // Add the result from above into the steps
        // this.directionsRenderer.getDirections()?.routes[0].legs[0].steps.forEach((step) => {
        //     this.currentSteps?.push({
        //         step: {
        //             instructions: step.instructions.split('<div')[0].replace(/<[^>]*>/g, ''),
        //             distance: step.distance?.text || '',
        //             time: step.duration?.text || '',
        //             icon:
        //                 step.maneuver.includes('right') ? 'right' :
        //                     step.maneuver.includes('left') ? 'left' :
        //                         'straight',
        //         },
        //         googleMapData: step,
        //         pathFindingData: null,
        //     });
        // });

        this.currentPath?.setVisibility(false);
        this.allPaths?.forEach((path) => {path.remove()});
        this.currentStepPolyline?.setMap(null);


        this.allPaths = [new PathfindingGraph(this.map, this.currentPathfindingResponse.parkingLotPath.path)];
        // this.allPaths.push();
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
                    distance: distance.toFixed(2).toString() + ' m',
                    time: time.toFixed(2).toString() + ' sec',
                    icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
                    googleMapData: null,
                    pathFindingData:  {
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


        // Pushing the directions in the parking lot
        // for (let j=0; j<=this.currentPathfindingResponse.parkingLotPath.path.length - 1; j++) {
        //
        //     let distance: number;
        //     // distance is in meter
        //     let time: number;
        //     const pos1 = this.currentPathfindingResponse.parkingLotPath.path[j];
        //     const pos2 = this.currentPathfindingResponse.parkingLotPath.path[j+1];
        //
        //     if (pos1 && pos2) {
        //         distance = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
        //
        //         // Estimate duration assuming average indoor walking speed (~1.4 meters/sec)
        //         time = distance / 1.4;
        //     } else {
        //         distance = 0;
        //         time = 0;
        //     }
        //
        //     const direction = this.currentPathfindingResponse.parkingLotPath.direction[j];
        //
        //     if (j==0){
        //         this.currentSteps?.push({
        //             step: {
        //                 instructions: 'PARKING LOT INSTRUCTIONS: '+ direction,
        //                 distance: distance.toFixed(2).toString() + ' m',
        //                 time: time.toFixed(2).toString() + ' sec',
        //                 icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //             },
        //             googleMapData: null,
        //             pathFindingData:  {
        //                 graphIdx: 0,
        //                 points: [
        //                     {
        //                         lat: pos1.lat,
        //                         lng: pos1.lng,
        //                     },
        //                     {
        //                         lat: pos2.lat,
        //                         lng: pos2.lng,
        //                     },
        //                 ],
        //             },
        //         });
        //         continue;
        //     }
        //
        //     if (j == this.currentPathfindingResponse.parkingLotPath.path.length - 1){
        //         this.currentSteps?.push({
        //             step: {
        //                 instructions: direction,
        //                 distance: '0 m',
        //                 time: '0 sec',
        //                 icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //             },
        //             googleMapData: null,
        //             pathFindingData:  {
        //                 graphIdx: 0,
        //                 points: [
        //                     {
        //                         lat: pos1.lat,
        //                         lng: pos1.lng,
        //                     },
        //                 ],
        //             },
        //         });
        //         continue;
        //     }
        //
        //     this.currentSteps?.push({
        //         step: {
        //             instructions: direction,
        //             distance: distance.toFixed(2).toString() + ' m',
        //             time: time.toFixed(2).toString() + ' sec',
        //             icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //         },
        //         googleMapData: null,
        //         pathFindingData:  {
        //             graphIdx: 0,
        //             points: [
        //                 {
        //                     lat: pos1.lat,
        //                     lng: pos1.lng,
        //                 },
        //                 {
        //                     lat: pos2.lat,
        //                     lng: pos2.lng,
        //                 },
        //             ],
        //         },
        //     });
        //
        // }


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
                            distance: distance.toFixed(2).toString() + ' m',
                            time: time.toFixed(2).toString() + ' sec',
                            icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
                            googleMapData: null,
                            pathFindingData:  {
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

        // // Pushing the directions in the floor paths
        // for (let i=0; i<this.currentPathfindingResponse.floorPaths.length; i++) {
        //     for (let j=0; j<=this.currentPathfindingResponse.floorPaths[i].path.length - 1; j++) {
        //
        //         let distance: number;
        //         // distance is in meter
        //         let time: number;
        //         const pos1 = this.currentPathfindingResponse.floorPaths[i].path[j];
        //         const pos2 = this.currentPathfindingResponse.floorPaths[i].path[j+1];
        //
        //         if (pos1 && pos2) {
        //             distance = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
        //
        //             // Estimate duration assuming average indoor walking speed (~1.4 meters/sec)
        //             time = distance / 1.4;
        //         } else {
        //             distance = 0;
        //             time = 0;
        //         }
        //
        //         const direction = this.currentPathfindingResponse.floorPaths[i].direction[j];
        //
        //         if (j == 0){
        //             this.currentSteps?.push({
        //                 step: {
        //                     instructions: 'FLOOR ' + this.currentPathfindingResponse.floorPaths[i].floorNum +' INSTRUCTIONS: ' + direction,
        //                     distance: distance.toFixed(2).toString() + ' m',
        //                     time: time.toFixed(2).toString() + ' sec',
        //                     icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //                 },
        //                 googleMapData: null,
        //                 pathFindingData: {
        //                     graphIdx: i + 1,
        //                     points: [
        //                         {
        //                             lat: pos1.lat,
        //                             lng: pos1.lng,
        //                         },
        //                         {
        //                             lat: pos2.lat,
        //                             lng: pos2.lng,
        //                         },
        //                     ],
        //                 },
        //             });
        //             continue;
        //         }
        //
        //
        //         if (j == this.currentPathfindingResponse.floorPaths[i].path.length - 1){
        //             this.currentSteps?.push({
        //                 step: {
        //                     instructions: direction,
        //                     distance: '0 m',
        //                     time: '0 sec',
        //                     icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //                 },
        //                 googleMapData: null,
        //                 pathFindingData: {
        //                     graphIdx: i + 1,
        //                     points: [
        //                         {
        //                             lat: pos1.lat,
        //                             lng: pos1.lng,
        //                         },
        //                     ],
        //                 },
        //             });
        //             continue;
        //         }
        //
        //         this.currentSteps?.push({
        //             step: {
        //                 instructions: direction,
        //                 distance: distance.toFixed(2).toString() + ' m',
        //                 time: time.toFixed(2).toString() + ' sec',
        //                 icon: direction.includes('right') ? 'right' : direction.includes('left') ? 'left' : 'straight',
        //             },
        //             googleMapData: null,
        //             pathFindingData: {
        //                 graphIdx: i + 1,
        //                 points: [
        //                     {
        //                         lat: pos1.lat,
        //                         lng: pos1.lng,
        //                     },
        //                     {
        //                         lat: pos2.lat,
        //                         lng: pos2.lng,
        //                     },
        //                 ],
        //             },
        //         });
        //
        //     }
        // }

        // this.currentPath.setVisibility(true);


        // // Set the parking path to be visible
        // this.currentParkingPath?.setVisibility(false);
        // this.currentParkingPath = new PathfindingGraph(this.map, this.currentPathfindingResponse.parkingLotPath.path);
        // this.currentParkingPath.setVisibility(true);
        //
        // // Set the first floor map to be visible
        // this.currentFloorPaths?.forEach(path => {
        //     path.setVisibility(false);
        // });
        // this.currentFloorPaths = this.currentPathfindingResponse.floorPaths.map(floor =>
        //     new PathfindingGraph(this.map, floor.path, floor)
        // );
        // this.currentFloorPaths[0].setVisibility(true);

        // Update the frontend directions

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

        // for (let i = 0; i < stepIdx; i++) {
        //
        // }

        this.currentSteps.sections.forEach((section, i) => {
            const candidate = section.directions.find((direction) => {
                return direction.idx === stepIdx;
            });

            if (candidate) {
                step = candidate;
                this.sectioner(i);
            }
            // if (section.directions.length > 0 &&
            //     section.directions[0].idx <= stepIdx &&
            //     section.directions[section.directions.length - 1].idx >= stepIdx) {
            //
            //     step = section.directions[stepIdx - section.directions[0].idx];
            // }
        });

        console.log(step);

        // this.currentSteps.sections.find(section => {
        //     return
        // })

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
                strokeColor: '#0ff',
                strokeOpacity: 0.8,
                zIndex: 50,
            });
            path.forEach(point => {
                bounds.extend(point);
            });

            this.map.fitBounds(bounds);
            this.map.setZoom((this.map.getZoom() || 10) - 1);


            // this.map.panTo(step.googleMapData.start_location);
            // this.map.setZoom(17);
        }

        if (step?.pathFindingData) {
            step.pathFindingData.points.forEach(point => {
                bounds.extend(point);
            });
            this.map.fitBounds(bounds);
            this.map.setZoom((this.map.getZoom() || 10) - 1);

            this.setCurrentGraphIdx(step.pathFindingData.graphIdx);
            this.currentStepPolyline?.setMap(null);
            this.currentStepPolyline = new google.maps.Polyline({
                map: this.map,
                path: step.pathFindingData.points,
                strokeWeight: 10,
                strokeColor: '#0ff',
                strokeOpacity: 0.8,
                zIndex: 50,
            });

            // await new Promise(f => setTimeout(f, 100));

            // this.map.panTo(step.pathFindingData.points[0]);
            // this.map.setZoom(21);
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
        // this.route();
    }

    recenter(lat: number, lng: number, zoom: number) {
        this.map.setCenter({lat, lng});
        this.map.setZoom(zoom);
    }


}



class EditorMapGraph {

    private readonly map: google.maps.Map;
    private readonly editorEncapsulator: EditorEncapsulator;
    private readonly editorGraph: EditorGraph;

    private readonly nodeUpdater: (selected: EditorNode | null) => void;
    private readonly edgeUpdater: (selected: EditorEdges | null) => void;


    private readonly undoRedoStack: (() => void)[][];
    private undoing: boolean;

    private selectedNode: EditorNode | null;
    private selectedEdge: EditorEdges | null;

    private readonly floorMap: google.maps.GroundOverlay | null;

    private nodes: {data: EditorNode, marker: google.maps.Marker}[];
    private edges: {data: EditorEdges, line: google.maps.Polyline}[];

    private newEdge: {startNodeId: number, line: google.maps.Polyline} | null;

    private editingState: 'DEFAULT' | 'ADDEDGE';
    private visible: boolean;

    constructor(map: google.maps.Map, editorEncapsulator: EditorEncapsulator, editorGraph: EditorGraph, nodeUpdater: (selected: EditorNode | null) => void, edgeUpdater: (selected: EditorEdges | null) => void) {

        this.map = map;
        this.editorEncapsulator = editorEncapsulator;
        this.editorGraph = editorGraph;

        this.nodeUpdater = nodeUpdater;
        this.edgeUpdater = edgeUpdater;

        this.undoRedoStack = [];
        this.undoing = false;

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
                return '#AAAAAA';

        }
        return '#AAAAAA';
    }

    private getNodeStrokeColor(type: number | null): string {

        if (!type){

            return '#FFFFFF';
        } else {

            return '#7038c9';
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
                scale: 5,
                fillOpacity: 1,
                fillColor: this.getNodeColor(node.type),
                strokeColor: this.getNodeStrokeColor(node.connectedNodeId),
                strokeWeight: 2
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
            // const rawPosition = e.latLng;
            // if (!rawPosition) return;
            //
            // const infowindow = new google.maps.InfoWindow({
            //     content: `
            //             <p>ID: ${node.nodeId}</p>
            //             <p>Name: ${node.name}</p>
            //             <p>Type: ${node.type}</p>
            //             <p>Lat: ${node.lat}</p>
            //             <p>Lng: ${node.lng}</p>
            //             <p>GID: ${node.graphId}</p>
            //             <p>CID: ${node.connectedNodeId}</p>
            //         `
            // });
            // infowindow.setPosition({
            //     lat: rawPosition.toJSON().lat + 0.00001 * ((this.map.getZoom() || 1) / 7),
            //     lng: rawPosition.toJSON().lng,
            // });
            // infowindow.open(this.map);
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
                        this.addEdge({
                            edgeId: -1,
                            name: '',
                            startNodeId: this.newEdge.startNodeId,
                            endNodeId: newNode.nodeId,
                            graphId: this.editorGraph.graphId,
                        });
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
            strokeColor: '#0cf',
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
                startNode.data.lng = rawPosition.toJSON().lng;
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
                endNode.data.lng = rawPosition.toJSON().lng;
                console.log({
                    lat: rawPosition.toJSON().lat,
                    lng: rawPosition.toJSON().lng,
                })
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

        if (!this.undoing) {
            this.undoRedoStack.push([() => {
                this.deleteNode(node.nodeId);
            }]);
        }


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

        if (!this.undoing) {
            this.undoRedoStack.push([() => {
                this.deleteEdge(edge.edgeId);
            }]);
        }

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
        });

        if (!this.undoing) {
            this.undoRedoStack.push([() => {

            }])
        }
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

    updateNode(nodeCopy: EditorNode) {

        console.log(nodeCopy);

        const nodeEncapsulator = this.editorGraph.Nodes.find(cnode => cnode.nodeId === nodeCopy.nodeId);
        const nodeVisual = this.nodes.find(cnode => cnode.data.nodeId === nodeCopy.nodeId);



        if (nodeEncapsulator && nodeVisual) {
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
        }
    }

    updateEdge(edgeCopy: EditorEdges) {
        const edgeEncapsulator = this.editorGraph.Edges.find(cedge => cedge.edgeId === edgeCopy.edgeId);
        const edgeVisual = this.edges.find(cedge => cedge.data.edgeId === edgeCopy.edgeId);

        if (edgeEncapsulator && edgeVisual) {
            const temp = JSON.parse(JSON.stringify(edgeCopy)) as EditorEdges;
            edgeVisual.data = temp;
            edgeEncapsulator.edgeId = temp.edgeId;
            edgeEncapsulator.graphId = temp.graphId;
            edgeEncapsulator.name = temp.name;
            edgeEncapsulator.startNodeId = temp.startNodeId;
            edgeEncapsulator.endNodeId = temp.endNodeId;
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

        // new google.maps.GroundOverlay(mcf2, {
        //     north: 42.33694,
        //     south: 42.33450,
        //     east: -71.10385,
        //     west: -71.10915,
        // }, {
        //     map: this.map,
        // });
        //
        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
            console.log(e.latLng?.toJSON());
        });

        this.map.setZoom(20);
        this.map.panTo({lat: 42.33694, lng: -71.10895});
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
        this.map.fitBounds(bounds);
        this.map.setZoom((this.map.getZoom() || 10) - 1);

        // if (this.currentGraphId?.toString() && this.editorEncapsulator) {
        //     const node = this.editorEncapsulator.editorGraphs.find(graph => graph.graphId === this.currentGraphId)?.Nodes[0];
        //
        //     if (node) {
        //         this.map.setCenter({lat: node.lat, lng: node.lng});
        //         this.map.setZoom(20);
        //     }
        // }
    }

    updateNode(node: EditorNode) {
        this.currentGraph?.updateNode(node);
    }

    updateEdge(edge: EditorEdges) {
        this.currentGraph?.updateEdge(edge);
    }
}