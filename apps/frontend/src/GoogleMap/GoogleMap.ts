import {GoogleMapProps} from "@/GoogleMap/GoogleMap.tsx";
import chestnutHill1 from '@/public/rotated-transparent.png';
import {Department} from "@/routes/Directions.tsx";
// import {Department} from "@/routes/Directions.tsx";

type FloorMap = {
    hospitalName: string
    floorNumber: number
    overlay: google.maps.GroundOverlay
    // defaultView: number
    // defaultCoords: google.maps.LatLngLiteral
}

export default class GoogleMap {



    private readonly map: google.maps.Map;
    private readonly directionsService: google.maps.DirectionsService;
    private readonly directionsRenderer: google.maps.DirectionsRenderer;
    private readonly autocomplete: google.maps.places.Autocomplete;
    private readonly floorMaps: FloorMap[];

    private startPlaceId: string;
    private destinationPlaceId: string;

    private floorMap: FloorMap | null;

    constructor(mapRef: HTMLDivElement, props: GoogleMapProps) {

        if (!mapRef || !props.autoCompleteRef.current) throw new Error('Missing References');

        this.map = new google.maps.Map(mapRef, {
            mapTypeControl: false,
            center: {lat: 42.32610824896946, lng: -71.14955534500426},
            zoom: 20,
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
        });
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
        this.startPlaceId = '';
        this.destinationPlaceId = '';
        this.floorMap = null;

        this.floorMaps = [
            {
                hospitalName: 'Chestnut Hill',
                floorNumber: 1,
                overlay: new google.maps.GroundOverlay(chestnutHill1, {
                    north: 42.32629629062394,
                    south: 42.32566563128395,
                    east: -71.14918542914931,
                    west: -71.15015356316003,
                }),
            },
        ];
    }

    private route(): void {
        // cant go anywher ewithout start and end
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
        if (props.hospital) {
            if (props.hospital.placeId !== this.destinationPlaceId) {
                this.destinationPlaceId = props.hospital.placeId;
                this.route();
            }
            this.resetFloorMap();
            // if (props.department) {
            //     for (const fm of this.floorMaps) {
            //         if (props.department.floor === fm.floorNumber && props.hospital.name === fm.hospitalName) {
            //             this.floorMap = fm;
            //             this.floorMap.overlay.setMap(this.map);
            //         }
            //     }
            // }
        }
    }

    private resetFloorMap() {
        if (this.floorMap) {
            this.floorMap.overlay.setMap(null);
            this.floorMap = null;
        }
    }

    updateDestinationPlaceId(destinationPlaceId: string): void {
        this.destinationPlaceId = destinationPlaceId;
        console.log('Destination is now ' + this.destinationPlaceId);
        this.route();
    }

    updatePathfinding(props: GoogleMapProps): void {
        // if (!props.department || !props.hospital) {
        //     // console.warn('Department not found ' + this.props.department?.name + ' ' + this.props.hospital?.name);
        //     return;
        // }
        // if (this.floorMap) {
        //     this.floorMap.overlay.setMap(null);
        // }
        // console.log('Searching for departments...');
        // let found = false;
        // for (const fm of this.floorMaps) {
        //     if (props.department.floor === fm.floorNumber && props.hospital.name === fm.hospitalName) {
        //         this.floorMap = fm;
        //         this.floorMap.overlay.setMap(this.map);
        //         found = true;
        //     }
        // }
        // console.log(found);
    }
}