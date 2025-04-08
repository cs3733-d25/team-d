// import { line } from "react-leaflet";


type Coordinates = {
    x: number;
    y: number;
};

type Line = {
    start: Coordinates
    end: Coordinates
}

export default function Path({coords}: {coords: Coordinates[]}) {

    // const coords = null;

    if (coords === null || coords === undefined || coords.length < 2) return <></>

    // const firstCoord: Coordinates = coords[0];

    // const path: React = <></>;
    const path: Line[] = new Array<Line>(coords.length - 1);

    for (let i = 0; i < path.length; i++) {
        path[i] = {start: coords[i], end: coords[i + 1]};
    }

    return (
        <>
            {path.map((line) =>
                <line x1={line.start.x} y1={line.start.y}
                      x2={line.end.x} y2={line.end.y} width={3} />
            )}
        </>
    )
}