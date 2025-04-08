import "./styles.css";
import 'leaflet/dist/leaflet.css';

import {ImageOverlay, MapContainer, SVGOverlay} from "react-leaflet";
import { TileLayer } from "react-leaflet";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";

import Path from '@/LeafletMap/Path.tsx';


type Coordinates = {
    x: number;
    y: number;
}

export default function LeafletMap() {
    const IMG_WIDTH = 1920;
    const IMG_HEIGHT = 1080;
    const SCALE = 0.001

    const coords: Coordinates[] = [
        {x: 0, y: 0},
        {x: 960, y: 540}
    ];

    return (
        <>
            {/*<button className="z-[100]">sdsds</button>*/}
            <MapContainer
                center={[0, 0]}
                zoom={10}
                // bounds={[[-0.540, -0.960], [0.540, 0.960]]}
                className="w-screen h-screen"
                maxZoom={11}
                minZoom={9}
                maxBounds={[[-IMG_HEIGHT * SCALE, -IMG_WIDTH * SCALE], [IMG_HEIGHT * SCALE, IMG_WIDTH * SCALE]]}
            >
                <TileLayer
                    url="../src/public/literally-just-white.png"
                    bounds={[[-1, -1], [1, 1]]}
                />
                <Marker position={[0, 0]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
                <ImageOverlay url="../src/public/ChestnutHillFloor1Transparent.png" bounds={[[IMG_HEIGHT * SCALE * -0.5, IMG_WIDTH * SCALE * -0.5], [IMG_HEIGHT * SCALE * 0.5, IMG_WIDTH * SCALE * 0.5]]} >

                </ImageOverlay>
                <SVGOverlay bounds={[[IMG_HEIGHT * SCALE * -0.5, IMG_WIDTH * SCALE * -0.5], [IMG_HEIGHT * SCALE * 0.5, IMG_WIDTH * SCALE * 0.5]]} attributes={{stroke: 'red'}}>
                    <Path coords={coords} />
                    <rect x={0} y={0} width={50} height={50} />
                </SVGOverlay>
            </MapContainer>
        </>
        // <div className="LLMap">


            // {/*<div id="leafletmap"></div>*/}
            // {/*<p>hi leaflet should be here</p>*/}
        // </div>
    );
}
