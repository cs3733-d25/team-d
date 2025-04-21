export const API_ROUTES = {
    HEALTHCHECK: '/api/healthcheck',
    EMPLOYEE: '/api/employee',
    SERVICEREQS: '/api/servicereqs',
    ASSIGNED: '/api/assigned',
    DEPARTMENT: '/api/department',
    PATHFIND: '/api/pathfind',
    PATHFINDING: '/api/pathfinding',
};

export type Coordinates = {
    lat: number;
    lng: number;
};

///////////// FOR PATHFINDING OPTIONS
export type HospitalOptions = {
    hospitalId: number;
    name: string;
    departments: DepartmentOptions[]
}

export type DepartmentOptions = {
    departmentId: number;
    name: string;
    floorNum: number;
    room: string;
    buildingName: string;
    buildingAddress: string;
}

export type PathfindingOptions = {
    hospitals: HospitalOptions[];
}


///////////// FOR DIRECTIONS

export type NodePathResponseType = 'NORMAL' | 'PARKING' | 'DOOR' | 'ELEVATOR' | 'CHECKIN';

export type NodePathResponse = {
    nodeId: number;
    name: string;
    lat: number;
    lng: number;
    type: NodePathResponseType;
}

export type ParkingPathResponse = {
    path: NodePathResponse[];
}

export type FloorPathResponse = {
    floorNum: number;
    image: string;
    imageBoundsNorth: number;
    imageBoundsSouth: number;
    imageBoundsEast: number;
    imageBoundsWest: number;
    path: NodePathResponse[];
}

export type PathfindingResponse = {
    parkingLotPath: ParkingPathResponse;
    floorPaths: FloorPathResponse[];
}

///////////// FOR EDITING

// export type

