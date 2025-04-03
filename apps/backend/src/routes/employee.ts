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

export default router;
