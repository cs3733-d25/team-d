import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// TODO: handle a GET request
router.get('/', async function (req: Request, res: Response) {
    const employees = await PrismaClient.employee.findMany({
        include: {
            TranslatorRequest: true,
        },
    });
    res.json(employees);
});

export default router;
