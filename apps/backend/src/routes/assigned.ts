import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// Returns all translator requests with an assigned employee, if any
router.get('/', async function (req: Request, res: Response) {
    const assignedRequests = await PrismaClient.translatorRequest.findMany({
        where: {
            NOT: {
                assignedEmployee: null,
            },
        },
    });
    // If no employees are found, send 204 and log it
    if (assignedRequests == null) {
        console.error('No employees found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(assignedRequests);
        res.json(assignedRequests);
    }
});

export default router;
