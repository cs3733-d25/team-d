import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// TODO: handle a GET request
// Use router.get for a GET request, router.post for a POST request, etc.
// Refer to score.ts.
router.get('/', async function (req: Request, res: Response) {
    // Fetch the latest score from database
    const employee = await PrismaClient.employee.findMany();

    // If the score doesn't exist
    if (employee == null) {
        // Log that (it's a problem)
        console.error('No employee found in database!');
        res.sendStatus(204); // Send HTTP code 204 (no data)
    } else {
        // Otherwise, send the score
        res.json(employee);
    }
});

// TODO: handle a POST request
router.post('/', async function (req: Request, res: Response) {
    const employeeData: Prisma.EmployeeCreateInput = req.body;
    // Attempt to save the score
    try {
        // Attempt to create in the database
        await PrismaClient.employee.create({ data: employeeData });
        console.info('Data of employee saved'); // Log that it was successful
    } catch (error) {
        // Log any failures
        console.error(`Unable to save employee ${employeeData}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
    }

    res.sendStatus(200); // Otherwise say it's fine
});

// IMPORTANT!! Make sure the path is defined in app.ts!
// I put a to-do on where to do this.

export default router;
