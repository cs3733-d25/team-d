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

        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
            const ll = e.latLng;
            if (ll) {
                console.log('Point:\nlat: ' + ll.toJSON().lat + ',\nlng: ' + ll.toJSON().lng + ',');
            }
        });

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
    private nodes: Map<number, google.maps.Marker>;
    private edges: Map<number, google.maps.Polyline>;
    
    constructor(map: google.maps.Map, graph: EditorGraph) {
        this.nodes = new Map();
        this.edges = new Map();
        
        graph.Nodes.forEach(node => {
            this.nodes.set(
                node.nodeId,
                new google.maps.Marker({
                    map: map,
                    position: {
                        lat: node.lat,
                        lng: node.lng,
                    },
                    icon: {
                        url: 'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
                        size: new google.maps.Size(7, 7),
                        anchor: new google.maps.Point(3.5, 3.5),
                    },
                    draggable: true,
                })
            );
        })
    }
}

export class EditorMap extends GoogleMap {

    public static async makeMap(mapDivElement: HTMLDivElement) {
        await GoogleMap.loadScript();
        return new EditorMap(mapDivElement);
    }
    
    private currentGraph: EditorMapGraph | null;
    private currentFloorMap: google.maps.GroundOverlay | null;

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
    }

    changeGraph(graph: EditorGraph) {
        this.currentGraph = new EditorMapGraph(this.map, graph);
    }

    initialize()
}