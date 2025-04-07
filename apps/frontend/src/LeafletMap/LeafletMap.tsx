import "./styles.css";
import 'leaflet/dist/leaflet.css';

import { MapContainer } from "react-leaflet";
import { TileLayer } from "react-leaflet";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";

export default function LeafletMap() {
    return (
        <div className="LLMap">
            <h1>Hello </h1>
            <h2></h2>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ width: "400px", height: "400px" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
