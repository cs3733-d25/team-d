import {GoogleMapProps} from "@/GoogleMap/GoogleMap.tsx"

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
    lat: 42.31934987791928,
    lng: -71.3162829187303,
};

const DEFAULT_ZOOM = 10;

export default class GoogleMap {

    private readonly map: google.maps.Map;
    private readonly directionsService: google.maps.DirectionsService;
    private readonly directionsRenderer: google.maps.DirectionsRenderer;
    private readonly autocomplete: google.maps.places.Autocomplete;

    private readonly floorMaps: Map<number, google.maps.GroundOverlay>;
    private floorMap: google.maps.GroundOverlay | null;

    private startPlaceId: string;
    private destinationPlaceId: string;

    private zoomFlag: boolean;

    // TODO: remove later
    private pointNum: number;

    constructor(mapRef: HTMLDivElement, props: GoogleMapProps) {


        if (!mapRef || !props.autoCompleteRef.current) throw new Error('Missing References');

        // Make map
        this.map = new google.maps.Map(mapRef, {
            mapTypeControl: false,
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            // center: {lat: 42.32610824896946, lng: -71.14955534500426},
            // zoom: 20,
        });

        // TODO: remove later
        this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
            // console.log('click', e);
            const ll = e.latLng;
            if (ll) {
                console.log('Point ' + this.pointNum++ + ':   ' + ll.toJSON().lat + ' ' + ll.toJSON().lng);
            }
        });

        // Make directions
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
        });

        // Make autocomplete for origin
        this.autocomplete = new google.maps.places.Autocomplete(props.autoCompleteRef.current, {
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

        // Set floor maps
        this.floorMaps = new Map<number, google.maps.GroundOverlay>();
        this.floorMap = null;

        // Set start and finish locations
        this.startPlaceId = '';
        this.destinationPlaceId = '';

        this.zoomFlag = false;

        // TODO: remove later
        this.pointNum = 0;
    }

    private route(): void {
        // can't go anywhere without start and end
        if (!this.startPlaceId || !this.destinationPlaceId) {
            console.log('Insufficient fields')
            return;
        }
        console.log('Routing ' + this.startPlaceId + ' to ' + this.destinationPlaceId);
        this.directionsService.route(
            {
                origin: {placeId: this.startPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: google.maps.TravelMode.DRIVING,
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

    update(props: GoogleMapProps): void {
        console.log('Update method');
        // Reset the currently showing floor map
        if (this.floorMap !== null) {
            this.floorMap.setMap(null);
            this.floorMap = null;
        }
        // If the destination hospital has changed, re-route via
        // Google Maps to the new hospital
        if (props.hospital && (props.hospital.placeId !== this.destinationPlaceId)) {
            this.destinationPlaceId = props.hospital.placeId;
            this.route();
        }
        // If the floor has changed, show the current floor
        if (props.floor) {
            const floorMap = this.floorMaps.get(props.floor.floorId);
            if (!floorMap) {
                console.log('Getting floor map url from ' + props.floor.imageURL + ' ' + props.floor.north);
                const newFloorMap = new google.maps.GroundOverlay(props.floor.imageURL, {
                    north: props.floor.north,
                    south: props.floor.south,
                    east: props.floor.east,
                    west: props.floor.west,
                });
                this.floorMaps.set(props.floor.floorId, newFloorMap);
                this.floorMap = newFloorMap;

                // TODO: remove later
                this.floorMap.addListener('click', (e: google.maps.MapMouseEvent) => {
                    // console.log('click', e);
                    const ll = e.latLng;
                    if (ll) {
                        console.log('Point ' + this.pointNum++ + ':   ' + ll.toJSON().lat + ' ' + ll.toJSON().lng);
                    }
                });

                // let fm1 = new google.maps.GroundOverlay()
            }
            else {
                this.floorMap = floorMap;
            }
            this.floorMap.setMap(this.map);
        }
        // If the department has changed, re-route
        // the pathfinding to the nearest check-in location
        // to that dept.
        if (props.department) {
            // TODO: implement
        }

        if (props.hospital && props.zoomFlag !== this.zoomFlag) {
            this.zoomFlag = props.zoomFlag;
            this.map.setCenter({
                lat: props.hospital.defaultLat,
                lng: props.hospital.defaultLng,
            });
            this.map.setZoom(props.hospital.defaultZoom);
        }
    }
}