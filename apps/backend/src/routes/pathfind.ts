import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import { Graph } from 'backend/src/pathfinding/src/bfs.ts';
import PrismaClient from '../bin/prisma-client';

import { euclideanDistance, haversineDistance } from '../pathfinding/src/distance.ts';
import {
    FloorPathResponse,
    HospitalOptions,
    NodePathResponse,
    PathfindingOptions,
    PathfindingResponse,
} from 'common/src/constants.ts';
import prismaClient from '../bin/prisma-client';

import {
    BFSStrategy,
    DFSStrategy,
    DijkstraStrategy,
    PathFindingStrategy,
} from '../pathfinding/src/bfs.ts';

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

    // Load nodes and edges from the
    // top floor into a Graph object
    const topFloorGraphObj = new Graph(strategy);
    topFloorGraph.Graph.Nodes.forEach((node) => {
        topFloorGraphObj.addNode(node as NodePathResponse);
    });
    topFloorGraph.Graph.Edges.forEach((edge) => {
        topFloorGraphObj.addEdge(edge.startNodeId, edge.endNodeId);
    });

    // Load nodes and edges from the
    // top floor into a Graph object
    const parkingLotGraphObj = new Graph(strategy);
    console.log('adding parking' + parkingLotGraph.graphId);
    parkingLotGraph.Graph.Nodes.forEach((node) => {
        parkingLotGraphObj.addNode(node as NodePathResponse);
    });
    parkingLotGraph.Graph.Edges.forEach((edge) => {
        parkingLotGraphObj.addEdge(edge.startNodeId, edge.endNodeId);
    });

    // console.log(topFloorGraph);
    // console.log(topFloorGraph.Graph);
    // console.log(topFloorGraph.Graph.Nodes);

    // Find the node ID of the closest check-in node on that floor
    const checkInCandidates = topFloorGraph.Graph.Nodes.filter((node) => node.type === 'CHECKIN');

    if (checkInCandidates.length === 0) {
        res.status(500).send({ message: 'No checkin candidates found' });
        return;
    }

    const checkInNodeId = checkInCandidates.reduce((closest, node) => {
        const nodeDistance = haversineDistance(
            { lat: node.lat, lng: node.lng },
            { lat: department.lat, lng: department.lng }
        );

        const closestDistance = haversineDistance(
            { lat: closest.lat, lng: closest.lng },
            { lat: department.lat, lng: department.lng }
        );

        if (nodeDistance < closestDistance) {
            return node;
        } else {
            return closest;
        }
    }).nodeId;

    // Start to build response
    const response: PathfindingResponse = {
        parkingLotPath: {
            path: [],
            direction: [],
        },
        floorPaths: [],
    };

    let insideDoorNode;
    // Create a unified graph that combines all floors and parking lot
    const unifiedGraph = new Graph(strategy);

    // Add all nodes from all graphs
    const allGraphs = [topFloorGraph, parkingLotGraph];
    if (topFloorGraph.floorNum > 2) {
        // Return the bottom floor of that building
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

        // If it doesn't exist return 500
        // (most likely a bad database)
        if (!bottomFloorGraph) {
            res.status(500).send({ message: 'Bottom Floor Graph does not exist' });
            return;
            if (bottomFloorGraph) {
                allGraphs.push(bottomFloorGraph);
            }
        }

        // Load nodes and edges from the
        // bottom floor into a Graph object
        const bottomFloorGraphObj = new Graph(strategy);
        bottomFloorGraph.Graph.Nodes.forEach((node) => {
            bottomFloorGraphObj.addNode(node as NodePathResponse);
            //add all nodes and edges to the unified graph
            allGraphs.forEach(graph => {
                graph.Graph.Nodes.forEach(node => {
                    unifiedGraph.addNode(node as NodePathResponse);
                });
                bottomFloorGraph.Graph.Edges.forEach((edge) => {
                    bottomFloorGraphObj.addEdge(edge.startNodeId, edge.endNodeId);
                    graph.Graph.Edges.forEach(edge => {
                        unifiedGraph.addEdge(edge.startNodeId, edge.endNodeId);
                    });
                });

                // TODO: fill this with the path from the
                // check-in node to the first elevator node it sees
                // instead of an empty array
                const topFloorPath: NodePathResponse[] = topFloorGraphObj.search('ELEVATOR', checkInNodeId);
                const topFloorDirection: string[] =
                    topFloorGraphObj.generateDirectionStepsFromNodes(topFloorPath);

                if (topFloorPath.length === 0) {
                    res.status(500).send({ message: 'No valid path from elevator to checkin' });
                    return;
                }

                response.floorPaths.push({
                    floorNum: topFloorGraph.floorNum,
                    image: topFloorGraph.image,
                    imageBoundsNorth: topFloorGraph.imageBoundsNorth,
                    imageBoundsSouth: topFloorGraph.imageBoundsSouth,
                    imageBoundsEast: topFloorGraph.imageBoundsEast,
                    imageBoundsWest: topFloorGraph.imageBoundsWest,
                    imageRotation: topFloorGraph.imageRotation,
                    path: topFloorPath,
                    direction: topFloorDirection,
                } as FloorPathResponse);

                // The node ID of the elevator node is the last node in the array
                const topFloorElevatorNodeId =
                    response.floorPaths[response.floorPaths.length - 1].path[0].nodeId;

                // Get the node with the node ID of the top floor elevator
                const topFloorElevatorNode = topFloorGraph.Graph.Nodes.find(
                    (node) => node.nodeId === topFloorElevatorNodeId
                );

                // This should never run but just in case
                if (!topFloorElevatorNode) {
                    res.status(500).send({ message: 'Top floor elevator node does not exist' });
                    return;
                }

                // The bottom floor elevator node is connected to the top floor elevator node
                const bottomFloorElevatorNodeId = topFloorElevatorNode.connectedNodeId;

                // If it doesn't exist return 500
                // (most likely a bad database)
                if (
                    !bottomFloorElevatorNodeId ||
                    !bottomFloorGraph.Graph.Nodes.find((node) => node.nodeId === bottomFloorElevatorNodeId)
                ) {
                    res.status(500).send({ message: 'Bottom Floor Elevator node does not exist' });
                    return;
                }
                //find the closest check-in node
                const checkInCandidates = topFloorGraph.Graph.Nodes.filter(node => node.type === 'CHECKIN');
                if (checkInCandidates.length === 0) {
                    res.status(500).send({ message: 'No checkin candidates found' });
                    return;
                }

                // TODO: fill this with the path from the
                // elevator node to the first door node it sees
                // instead of an empty array
                const bottomFloorPath: NodePathResponse[] = bottomFloorGraphObj.search(
                    'DOOR',
                    bottomFloorElevatorNodeId
                const checkInNodeId = checkInCandidates.reduce((closest, node) => {
                    const nodeDistance = haversineDistance(
                        { lat: node.lat, lng: node.lng },
                        { lat: department.lat, lng: department.lng }
                    );
                    const bottomFloorDirection: string[] =
                        topFloorGraphObj.generateDirectionStepsFromNodes(bottomFloorPath);

                    if (bottomFloorPath.length === 0) {
                        res.status(500).send({ message: 'No valid path from door to elevator' });
                        return;
                    }

                    response.floorPaths.push({
                        floorNum: bottomFloorGraph.floorNum,
                        image: bottomFloorGraph.image,
                        imageBoundsNorth: bottomFloorGraph.imageBoundsNorth,
                        imageBoundsSouth: bottomFloorGraph.imageBoundsSouth,
                        imageBoundsEast: bottomFloorGraph.imageBoundsEast,
                        imageBoundsWest: bottomFloorGraph.imageBoundsWest,
                        imageRotation: bottomFloorGraph.imageRotation,
                        path: bottomFloorPath,
                        direction: bottomFloorDirection,
                    });

                    // The node ID of the elevator node is the last node in the array
                    const insideDoorNodeId = response.floorPaths[response.floorPaths.length - 1].path[0].nodeId;

                    // Get the node with the node ID of the top floor elevator
                    insideDoorNode = bottomFloorGraph.Graph.Nodes.find(
                        (node) => node.nodeId === insideDoorNodeId
                    const closestDistance = haversineDistance(
                        { lat: closest.lat, lng: closest.lng },
                        { lat: department.lat, lng: department.lng }
                    );
                } else {
                    // TODO: fill this with the path from the
                    // check-in node to the first door node it sees
                    // instead of an empty array
                    const topFloorPath: NodePathResponse[] = topFloorGraphObj.search('DOOR', checkInNodeId);
                    const topFloorDiretion: string[] =
                        topFloorGraphObj.generateDirectionStepsFromNodes(topFloorPath);

                    if (topFloorPath.length === 0) {
                        // console.log(topFloorGraph.Graph.Nodes);
                        res.status(500).send({ message: 'No valid path from door to checkin' });
                        return;
                    }

                    response.floorPaths.push({
                        floorNum: topFloorGraph.floorNum,
                        image: topFloorGraph.image,
                        imageBoundsNorth: topFloorGraph.imageBoundsNorth,
                        imageBoundsSouth: topFloorGraph.imageBoundsSouth,
                        imageBoundsEast: topFloorGraph.imageBoundsEast,
                        imageBoundsWest: topFloorGraph.imageBoundsWest,
                        imageRotation: topFloorGraph.imageRotation,
                        path: topFloorPath,
                        direction: topFloorDiretion,
                    });

                    // The node ID of the door node is the first node in the last floorpath
                    const insideDoorNodeId = response.floorPaths[response.floorPaths.length - 1].path[0].nodeId;

                    // Get the node with the node ID of the inside door
                    insideDoorNode = topFloorGraph.Graph.Nodes.find((node) => node.nodeId === insideDoorNodeId);
                }
                return nodeDistance < closestDistance ? node : closest;
            }).nodeId;

            // This should never run but just in case
            if (!insideDoorNode) {
                res.status(500).send({ message: 'Top floor elevator node does not exist' });
                //find the closest parking node
                const parkingNodes = parkingLotGraph.Graph.Nodes.filter(node => node.type === 'PARKING');
                if (parkingNodes.length === 0) {
                    res.status(500).send({ message: 'No parking nodes found' });
                    return;
                }

                // The outside door is connected to the inside door node
                const outsideDoorNodeId = insideDoorNode.connectedNodeId;

                // If it doesn't exist return 500
                // (most likely a bad database)
                if (
                    !outsideDoorNodeId ||
                    !parkingLotGraph.Graph.Nodes.find((node) => node.nodeId === outsideDoorNodeId)
                ) {
                    res.status(500).send({ message: 'Outside door node does not exist' });
                    //find the shortest path from check-in to parking
                    const fullPath = unifiedGraph.search('PARKING', checkInNodeId);
                    if (fullPath.length === 0) {
                        res.status(500).send({ message: 'No valid path found' });
                        return;
                    }

                    // TODO: fill this with the path from the
                    // door node to the first parking node it sees
                    // instead of an empty array
                    //split the path into segments based on floor changes
                    const response: PathfindingResponse = {
                        parkingLotPath: {
                            path: [],
                            direction: [],
                        },
                        floorPaths: [],
                    };

                    const parkingLotPath: NodePathResponse[] = parkingLotGraphObj.search(
                        'PARKING',
                        outsideDoorNodeId
                    );
                    let currentFloor = null;
                    let currentPath: NodePathResponse[] = [];
                    let currentGraph = null;

                    const parkingLotDirections: string[] =
                        parkingLotGraphObj.generateDirectionStepsFromNodes(parkingLotPath);
                    response.parkingLotPath.direction = parkingLotDirections;
                    for (let i = 0; i < fullPath.length; i++) {
                        const node = fullPath[i];
                        const graph = allGraphs.find(g =>
                            g.Graph.Nodes.some(n => n.nodeId === node.nodeId)
                        );

                        if (!graph) continue;

                        if (currentFloor !== graph.floorNum) {
                            // Save previous path if exists
                            if (currentPath.length > 0 && currentGraph) {
                                const directions = currentGraph.generateDirectionStepsFromNodes(currentPath);
                                if (currentGraph === parkingLotGraph) {
                                    response.parkingLotPath.path = currentPath;
                                    response.parkingLotPath.direction = directions;
                                } else {
                                    response.floorPaths.push({
                                        floorNum: currentGraph.floorNum,
                                        image: currentGraph.image,
                                        imageBoundsNorth: currentGraph.imageBoundsNorth,
                                        imageBoundsSouth: currentGraph.imageBoundsSouth,
                                        imageBoundsEast: currentGraph.imageBoundsEast,
                                        imageBoundsWest: currentGraph.imageBoundsWest,
                                        imageRotation: currentGraph.imageRotation,
                                        path: currentPath,
                                        direction: directions,
                                    });
                                }
                            }

                            // Start new path
                            currentFloor = graph.floorNum;
                            currentPath = [node];
                            currentGraph = graph;
                        } else {
                            currentPath.push(node);
                        }
                    }

                    if (parkingLotPath.length === 0) {
                        res.status(500).send({ message: 'No valid path from parking lot to door' });
                        return;
                        //add the last segment
                        if (currentPath.length > 0 && currentGraph) {
                            const directions = currentGraph.generateDirectionStepsFromNodes(currentPath);
                            if (currentGraph === parkingLotGraph) {
                                response.parkingLotPath.path = currentPath;
                                response.parkingLotPath.direction = directions;
                            } else {
                                response.floorPaths.push({
                                    floorNum: currentGraph.floorNum,
                                    image: currentGraph.image,
                                    imageBoundsNorth: currentGraph.imageBoundsNorth,
                                    imageBoundsSouth: currentGraph.imageBoundsSouth,
                                    imageBoundsEast: currentGraph.imageBoundsEast,
                                    imageBoundsWest: currentGraph.imageBoundsWest,
                                    imageRotation: currentGraph.imageRotation,
                                    path: currentPath,
                                    direction: directions,
                                });
                            }
                        }

                        response.parkingLotPath.path = parkingLotPath;
                        //reverse floor paths to maintain correct order
                        response.floorPaths.reverse();

                        res.json(response);
                    });

                    ////////////////////////////////////////////algorithms rewrite:

                    async function findOptimalFullPath(

                        parkingGraph: Graph,
                        bottomFloorGraph: Graph | null,
                        topFloorGraph: Graph,
                        department: { lat: number; lng: number }

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
                                const tempFloorPaths: FloorPathResponse[] = [];
                                let totalDistance = 0;

                                //From CHECKIN to ELEVATOR







                                //Elevator connection across floors






                                //From ELEVATOR to DOOR






                                //From DOOR to PARKING









                                const parkingPath = parkingGraph.search('PARKING', outsideDoorId);
                                if (parkingPath.length === 0) continue;
                                totalDistance += computeDistance(parkingPath);



                                allPaths.push({
                                    totalDistance,
                                    parkingPath,
                                    floorPaths: tempFloorPaths,

                                });
                            }
                        }

                        //Pick the shortest path
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

////////////////////////////////////////////

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