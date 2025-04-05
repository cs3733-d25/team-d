import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma } from 'database';
const router: Router = express.Router();

// Returns all departments in the directory, if any
router.get('/', async function (req: Request, res: Response) {
    const departments = await PrismaClient.department.findMany();
    // if there are no departments found
    if (departments == null) {
        console.error('No departments found in database');
        res.sendStatus(204);
    } else {
        console.log(departments); // display department data to console
        res.json(departments);
    }
});

// post request to add departments to the database
router.post('/', async function (req: Request, res: Response) {
    const departmentDataAttempt: Prisma.DepartmentCreateInput = req.body;
    try {
        await PrismaClient.department.create({data: departmentDataAttempt});
        console.log('Department created');
    } catch (error) {
        console.error(`Unable to create a new department ${departmentDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});3

export default router;