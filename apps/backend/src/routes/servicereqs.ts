import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// TODO: handle a GET request
// Use router.get for a GET request, router.post for a POST request, etc.
// Refer to score.ts.

// IMPORTANT!! Make sure the path is defined in app.ts!
// I put a to-do on where to do this.

export default router;
