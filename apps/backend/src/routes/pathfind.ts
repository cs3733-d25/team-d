import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import {
    Graph,
    BFSStrategy,
    DFSStrategy,
    DijkstraStrategy,
    PathFindingStrategy,
    createFloorPath,
} from '../pathfinding/src/bfs.ts';
import PrismaClient from '../bin/prisma-client';
import { computeDistance } from '../pathfinding/src/distance';

import {
    FloorPathResponse,
    HospitalOptions,
    NodePathResponse,
    PathfindingOptions,
    PathfindingResponse,
    NodePathResponseType,
} from 'common/src/constants.ts';

function getStrategyByName(name: string): PathFindingStrategy {
    switch (name) {
        case 'BFS':
            return new BFSStrategy();
        case 'DFS':
            return new DFSStrategy();
        case 'Dijkstra':
            return new DijkstraStrategy();
        default:
            throw new Error(`Unknown algorithm strategy: ${name}`);
    }
}

router.get('/algorithm', async (req: Request, res: Response) => {
    const response = await PrismaClient.algorithm.findMany();
    // If no service requests are found, send 204 and log it
    if (response == null) {
        console.error('No service requests found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(response);
        res.json(response);
    }
});

router.get('/options', async (req: Request, res: Response) => {
    const hospitals = await PrismaClient.hospital.findMany({
        include: {
            Buildings: {
                include: {
                    FloorGraphs: {
                        include: {
                            Departments: true,
                        },
                    },
                },
            },
        },
    });

    const response: PathfindingOptions = {
        hospitals: [],
    };

    hospitals.forEach((hospital, i) => {
        response.hospitals.push({
            hospitalId: hospital.hospitalId,
            name: hospital.name,
            departments: [],
        });
        hospital.Buildings.forEach((building) => {
            building.FloorGraphs.forEach((floorGraph) => {
                floorGraph.Departments.forEach((department) => {
                    response.hospitals[i].departments.push({
                        departmentId: department.departmentId,
                        name: department.name,
                        floorNum: department.floorNum,
                        room: department.room,
                        buildingName: building.name,
                        buildingAddress: building.address,
                    });
                });
            });
        });
    });

    response.hospitals.forEach((hospital) => {
        hospital.departments.sort((a, b) => a.name.localeCompare(b.name));
    });

    res.json(response);
});

router.get('/path-to-dept/:did', async (req: Request, res: Response) => {
    // Find the algorithm we want and return it as a new object strategy
    const activeAlgorithm = await PrismaClient.algorithm.findFirst({
        where: { isActive: true },
    });

    const strategy = getStrategyByName(activeAlgorithm?.name || 'BFS'); // default fallback

    // Find the department with the given id
    const department = await PrismaClient.department.findUnique({
        where: {
            departmentId: Number(req.params.did),
        },
    });

    // If it doesn't exist return 404
    // (most likely a bad request)
    if (!department) {
        res.status(404).send({ message: 'Department not found' });
        return;
    }

    // Find the floor graph of that department
    const topFloorGraph = await PrismaClient.floorGraph.findUnique({
        where: {
            graphId: department.floorGraphId,
        },
        include: {
            Graph: {
                include: {
                    Nodes: true,
                    Edges: true,
                },
            },
        },
    });

    // If it doesn't exist return 500
    // (most likely a bad database)
    if (!topFloorGraph || !topFloorGraph.Graph) {
        res.status(500).send({ message: 'Top Floor Graph does not exist' });
        return;
    }

    // Find the building of that floor graph
    const building = await PrismaClient.building.findUnique({
        where: {
            buildingId: topFloorGraph.buildingId,
        },
    });

    // If it doesn't exist return 500
    // (most likely a bad database)
    if (!building) {
        res.status(500).send({ message: 'Building does not exist' });
        return;
    }

    // Find the hospital of that building
    const hospital = await PrismaClient.hospital.findUnique({
        where: {
            hospitalId: building.hospitalId,
        },
    });

    // If it doesn't exist return 500
    // (most likely a bad database)
    if (!hospital) {
        res.status(500).send({ message: 'Hospital does not exist' });
        return;
    }

    // Return the parking lot graph of that hospital
    const parkingLotGraph = await PrismaClient.parkingGraph.findUnique({
        where: {
            hospitalId: hospital.hospitalId,
        },
        include: {
            Graph: {
                include: {
                    Nodes: true,
                    Edges: true,
                },
            },
        },
    });

    // If it doesn't exist return 500
    // (most likely a bad database)
    if (!parkingLotGraph || !parkingLotGraph.Graph) {
        res.status(500).send({ message: 'ParkingLot does not exist' });
        return;
    }

    const parkingGraphObj = new Graph(strategy);

    parkingLotGraph.Graph.Nodes.forEach((node) => {
        const normalizedNode = {
            ...node,
            type: (node.type?.toUpperCase() ?? 'UNKNOWN') as NodePathResponseType,
        };
        parkingGraphObj.addNode(normalizedNode);
    });

    parkingLotGraph.Graph.Edges.forEach((edge) =>
        parkingGraphObj.addEdge(edge.startNodeId, edge.endNodeId)
    );

    const topFloorGraphObj = new Graph(strategy);

    topFloorGraph.Graph.Nodes.forEach((node) => {
        const normalizedNode: NodePathResponse = {
            ...node,
            type: (node.type?.toUpperCase() ?? 'UNKNOWN') as NodePathResponseType,
            connectedNodeId: node.connectedNodeId ?? null,
        };
        topFloorGraphObj.addNode(normalizedNode);
    });

    topFloorGraph.Graph.Edges.forEach((edge) =>
        topFloorGraphObj.addEdge(edge.startNodeId, edge.endNodeId)
    );

    const allNodeTypes = topFloorGraph.Graph.Nodes.map((n) => n.type);
    const typeCounts = allNodeTypes.reduce(
        (acc, type) => {
            const key = type?.toUpperCase() || 'UNKNOWN';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    console.log('Node type counts in topFloorGraph:', typeCounts);

    let bottomFloorGraphObj: Graph | null = null;

    if (topFloorGraph.floorNum > 2) {
        const bottomFloorGraph = await PrismaClient.floorGraph.findFirst({
            where: {
                buildingId: building.buildingId,
                floorNum: 1,
            },
            include: {
                Graph: {
                    include: {
                        Nodes: true,
                        Edges: true,
                    },
                },
            },
        });

        if (!bottomFloorGraph || !bottomFloorGraph.Graph) {
            res.status(500).send({ message: 'Bottom Floor Graph does not exist' });
            return;
        }
        bottomFloorGraphObj = new Graph(strategy);

        //  Add nodes
        bottomFloorGraph.Graph.Nodes.forEach((node) => {
            const normalizedNode: NodePathResponse = {
                ...node,
                type: (node.type?.toUpperCase() ?? 'UNKNOWN') as NodePathResponseType,
                connectedNodeId: node.connectedNodeId ?? null,
            };
            bottomFloorGraphObj!.addNode(normalizedNode);
        });
        //  Add edges
        bottomFloorGraph.Graph.Edges.forEach((edge) => {
            bottomFloorGraphObj!.addEdge(edge.startNodeId, edge.endNodeId);
        });

        // Use GraphNode, not NodePathResponse
        const elevatorNode = bottomFloorGraphObj.getNode(216);
        if (!elevatorNode) {
        } else {
            const neighbors = elevatorNode.getNeighbors().map((n) => n.data.nodeId);
        }

        // Check all DOOR paths
        const allDoors = bottomFloorGraphObj.getNodesOfType('DOOR').map((n) => n.nodeId);

        for (const doorId of allDoors) {
            const path = bottomFloorGraphObj.search('DOOR', doorId);
        }

        bottomFloorGraphObj.floorNum = bottomFloorGraph.floorNum;
        bottomFloorGraphObj.image = bottomFloorGraph.image;
        bottomFloorGraphObj.imageBoundsNorth = bottomFloorGraph.imageBoundsNorth;
        bottomFloorGraphObj.imageBoundsSouth = bottomFloorGraph.imageBoundsSouth;
        bottomFloorGraphObj.imageBoundsEast = bottomFloorGraph.imageBoundsEast;
        bottomFloorGraphObj.imageBoundsWest = bottomFloorGraph.imageBoundsWest;
        bottomFloorGraphObj.imageRotation = bottomFloorGraph.imageRotation;
    }

    const result = await findOptimalFullPath(
        parkingGraphObj,
        bottomFloorGraphObj,
        topFloorGraphObj,
        {
            floorNum: topFloorGraph.floorNum,
            image: topFloorGraph.image,
            imageBoundsNorth: topFloorGraph.imageBoundsNorth,
            imageBoundsSouth: topFloorGraph.imageBoundsSouth,
            imageBoundsEast: topFloorGraph.imageBoundsEast,
            imageBoundsWest: topFloorGraph.imageBoundsWest,
            imageRotation: topFloorGraph.imageRotation,
            lat: department.lat,
            lng: department.lng,
        }
    );

    res.status(200).json(result);
});

//algorithms rewrite:
async function findOptimalFullPath(
    parkingGraph: Graph,
    bottomFloorGraph: Graph | null,
    topFloorGraph: Graph,
    department: {
        floorNum: number;
        image: string;
        imageBoundsNorth: number;
        imageBoundsSouth: number;
        imageBoundsEast: number;
        imageBoundsWest: number;
        imageRotation: number;
        lat: number;
        lng: number;
    }
): Promise<PathfindingResponse> {
    const allPaths: {
        totalDistance: number;
        parkingPath: NodePathResponse[];
        floorPaths: FloorPathResponse[];
    }[] = [];

    const parkingNodes = parkingGraph.getNodesOfType('PARKING');
    const checkInNodes = topFloorGraph.getNodesOfType('CHECKIN');

    for (const parkingNode of parkingNodes) {
        for (const checkInNode of checkInNodes) {
            const checkInNodeObj = topFloorGraph.getNode(checkInNode.nodeId);
            const neighbors = checkInNodeObj?.getNeighbors().map((n: any) => n.data.nodeId);

            const tempFloorPaths: FloorPathResponse[] = [];
            let totalDistance = 0;

            // From CHECKIN to ELEVATOR (on top floor)
            const hasDoor = topFloorGraph.getNodesOfType('DOOR').length > 0;

            let topPath: NodePathResponse[] = [];

            //check if have door, if yes do not need to check elevator
            if (hasDoor) {
                topPath = topFloorGraph.search('DOOR', checkInNode.nodeId);
                if (topPath.length === 0) {
                    continue;
                }
            } else {
                topPath = topFloorGraph.search('ELEVATOR', checkInNode.nodeId);
                if (topPath.length === 0) {
                    continue;
                }
            }

            const topFloorDirection = topFloorGraph.generateDirectionStepsFromNodes(topPath);
            tempFloorPaths.push({
                floorNum: department.floorNum,
                image: department.image,
                imageBoundsNorth: department.imageBoundsNorth,
                imageBoundsSouth: department.imageBoundsSouth,
                imageBoundsEast: department.imageBoundsEast,
                imageBoundsWest: department.imageBoundsWest,
                imageRotation: department.imageRotation,
                path: topPath,
                direction: topFloorDirection,
            });

            totalDistance += computeDistance(topPath);

            let insideDoorNodeId: number | null = null;

            if (bottomFloorGraph) {
                // Get top floor elevator node
                const topElevatorNode = topPath[0];
                const connectedNodeId = topElevatorNode.connectedNodeId;
                if (!connectedNodeId) {
                    console.log(`Elevator node ${topElevatorNode.nodeId} has no connectedNodeId.`);
                    continue;
                }

                // From ELEVATOR to DOOR (on bottom floor)
                const bottomPath = bottomFloorGraph.search('DOOR', connectedNodeId);
                if (bottomPath.length === 0) {
                    console.log(`No path from bottom floor elevator (${connectedNodeId}) to DOOR.`);
                    continue;
                }

                const bottomFloorDirection =
                    bottomFloorGraph.generateDirectionStepsFromNodes(bottomPath);

                tempFloorPaths.push({
                    floorNum: bottomFloorGraph.floorNum!,
                    image: bottomFloorGraph.image!,
                    imageBoundsNorth: bottomFloorGraph.imageBoundsNorth!,
                    imageBoundsSouth: bottomFloorGraph.imageBoundsSouth!,
                    imageBoundsEast: bottomFloorGraph.imageBoundsEast!,
                    imageBoundsWest: bottomFloorGraph.imageBoundsWest!,
                    imageRotation: bottomFloorGraph.imageRotation!,
                    path: bottomPath,
                    direction: bottomFloorDirection,
                });

                totalDistance += computeDistance(bottomPath);

                insideDoorNodeId = bottomPath[0].nodeId;
            } else {
                // From CHECKIN to DOOR directly (for single floor buildings)

                insideDoorNodeId = topPath.find((n) => n.type === 'DOOR')?.nodeId ?? null;
            }

            let insideDoorNode: NodePathResponse | undefined;

            if (bottomFloorGraph) {
                insideDoorNode = bottomFloorGraph.getNodeById(insideDoorNodeId!);
            } else {
                insideDoorNode = topFloorGraph.getNodeById(insideDoorNodeId!);
            }

            if (!insideDoorNode || !insideDoorNode.connectedNodeId) {
                continue;
            }

            const outsideDoorId = insideDoorNode.connectedNodeId;
            const parkingPath = parkingGraph.search('PARKING', outsideDoorId);
            if (parkingPath.length === 0) {
                continue;
            }
            totalDistance += computeDistance(parkingPath);

            allPaths.push({
                totalDistance,
                parkingPath,
                floorPaths: tempFloorPaths,
            });
        }
    }

    const best = allPaths.sort((a, b) => a.totalDistance - b.totalDistance)[0];
    if (!best) throw new Error('No valid full path found');

    return {
        parkingLotPath: {
            path: best.parkingPath,
            direction: parkingGraph.generateDirectionStepsFromNodes(best.parkingPath),
        },
        floorPaths: best.floorPaths.reverse(), // bottom to top
    };
}

router.put('/algorithm/:name', async (req: Request, res: Response) => {
    const name = req.params.name;

    const existing = await PrismaClient.algorithm.findUnique({ where: { name } });
    if (!existing) {
        res.status(404).json({ message: 'Algorithm not found' });
        return;
    }

    // Reset all to inactive
    await PrismaClient.algorithm.updateMany({ data: { isActive: false } });

    // Activate the selected one
    await PrismaClient.algorithm.update({
        where: { name },
        data: { isActive: true },
    });

    res.status(200).json({
        message: 'Successfully updated algorithm',
    });
});

export default router;
