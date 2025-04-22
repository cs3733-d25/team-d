// import express, { Router, Request, Response } from 'express';
// import PrismaClient from '../bin/prisma-client';
// import { Prisma } from 'database';
// import {EditorParkingGraph} from "common/src/constants.ts";
// const router: Router = express.Router();
//
// // GET request for all hospitals
// router.get('/', async (req, res) => {
//     const data = await PrismaClient.hospital.findMany({
//         include: {
//             Departments: {
//                 include: {
//                     Graph: true,
//                 },
//                 orderBy: {
//                     name: 'asc',
//                 },
//             },
//         },
//     });
//     if (!data) {
//         console.error('No data found');
//         res.sendStatus(204);
//     } else {
//         console.log(data);
//         res.json(data);
//     }
// });
//
// // GET request for all departments in a specific hospital
// router.get('/:id/all', async function (req: Request, res: Response) {
//     const hospitalId: number = Number(req.params.id);
//     const departments = await PrismaClient.department.findMany({
//         where: { hospitalId: hospitalId },
//     });
//     // if there are no departments found
//     if (departments == null) {
//         console.error('No departments found in database');
//         res.sendStatus(204);
//     } else {
//         console.log(departments); // display department data to console
//         res.json(departments);
//     }
// });
//
// // GET request for all departments in the directory, if any
// router.get('/all', async function (req: Request, res: Response) {
//     const departments = await PrismaClient.department.findMany();
//     // if there are no departments found
//     if (departments == null) {
//         console.error('No departments found in database');
//         res.sendStatus(204);
//     } else {
//         console.log(departments); // display department data to console
//         res.json(departments);
//     }
// });
//
// // POST request to add departments to the database
// router.post('/', async function (req: Request, res: Response) {
//     const departmentDataAttempt: Prisma.DepartmentCreateInput = req.body;
//     try {
//         await PrismaClient.department.create({ data: departmentDataAttempt });
//         console.log('Department created');
//     } catch (error) {
//         console.error(`Unable to create a new department ${departmentDataAttempt}: ${error}`);
//         res.sendStatus(400);
//         return;
//     }
//
//     res.sendStatus(200);
// });
//
// // DELETE all departments in the database
// router.delete('/', async function (req: Request, res: Response) {
//     try {
//         await PrismaClient.department.deleteMany({});
//     } catch (error) {
//         console.error('Unable to delete a department', error);
//         res.sendStatus(400);
//         return;
//     }
//     res.sendStatus(200);
// });
//
// // GET request for all buildings
// router.get('/directory/buildings', async (req: Request, res: Response) => {
//     const buildings = await PrismaClient.building.findMany({
//         include: {
//             Hospital: {},
//             FloorGraphs: {},
//         },
//     });
//     if (buildings == null) {
//         console.error('No buildings found in database');
//         res.sendStatus(204);
//     } else {
//         console.log(buildings);
//         res.json(buildings);
//     }
// });
//
// // PUT request for building with specific Id
// router.put('/directory/buildings/:id', async function (req: Request, res: Response) {
//     // parse id into variable
//     const buildingId: number = Number(req.params.id);
//
//     // find building with id
//     const request = await PrismaClient.building.findUnique({
//         where: { buildingId: buildingId },
//     });
//
//     // error if no building with the id is found
//     if (request == null) {
//         console.error(`The building with Id ${buildingId} not found in database!`);
//         res.status(404);
//     }
//     // success: update specified building
//     else {
//         try {
//             const {
//                 name,
//                 address,
//                 hospitalId,
//                 Hospital,
//                 FloorGraphs,
//             } = req.body;
//             const [
//                 updateBuilding,
//             ] = await PrismaClient.$transaction([
//                 PrismaClient.building.update({
//                     where: { buildingId: buildingId },
//                     data: {
//                         name,
//                         address,
//                         hospitalId,
//                         Hospital,
//                         FloorGraphs,
//                     },
//                 }),
//             ]);
//             // send 200 and updated building if success
//             res.status(200).json({
//                 message: 'Successfully updated building',
//                 updateBuilding,
//             });
//             // send 400 and error message if building cannot be updated
//         } catch (error) {
//             console.error(`Unable to update building ${buildingId}: ${error}`);
//             res.sendStatus(400);
//         }
//     }
// });
//
// export default router;
