import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// TODO: handle a GET request
router.get('/', async function (req: Request, res: Response) {
    const employee = await PrismaClient.employee.findMany();

    if (employee == null) {
        console.error('No employee found in database!');
        res.sendStatus(204);
    } else {
        res.json(employee);
    }
});

// TODO: handle a POST request
router.post('/', async function (req: Request, res: Response) {
    const employeeData: Prisma.EmployeeCreateInput = req.body;
    try {
        await PrismaClient.employee.create({ data: employeeData });
        console.info('Data of employee saved');
    } catch (error) {
        console.error(`Unable to save employee ${employeeData}: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

// IMPORTANT!! Make sure the path is defined in app.ts!
// I put a to-do on where to do this.

export default router;
