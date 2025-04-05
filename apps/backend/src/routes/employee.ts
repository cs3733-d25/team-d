import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

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

router.get('/:id', async function (req: Request, res: Response) {
    // Parse the id param into a variable
    const employeeId: number = Number(req.params.id);
    // Find the employee with the id
    const employee = await PrismaClient.employee.findUnique({
        where: { employeeId: employeeId },
    });

    // If no employee with the ID is found, send 204 and log it
    if (employee == null) {
        console.error(`The employee with ${employeeId} not found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(employee);
        res.json(employee);
    }
});

export default router;
