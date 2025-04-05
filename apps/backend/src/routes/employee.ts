import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma } from 'database';
const router: Router = express.Router();

// Returns all employees, if any
router.get('/', async function (req: Request, res: Response) {
    // Query db, store response
    const employees = await PrismaClient.employee.findMany();
    // If no employees are found, send 204 and log it
    if (employees == null) {
        console.error('No employees found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(employees);
        res.json(employees);
    }
});

// post request to add employees to the database
router.post('/', async function (req: Request, res: Response) {
    const employeeDataAttempt: Prisma.EmployeeCreateInput = req.body;
    try {
        await PrismaClient.employee.create({data: employeeDataAttempt});
        console.log('Employee created');
    } catch (error) {
        console.error(`Unable to create a new employee ${employeeDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

export default router;
