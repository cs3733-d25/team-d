import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma } from 'database';
const router: Router = express.Router();

// Returns all service requests, if any
router.get('/', async function (req: Request, res: Response) {
    // Query db, store response
    const requests = await PrismaClient.serviceRequest.findMany({
        include: {
            translatorRequest: true,
        },
    });
    // If no service requests are found, send 204 and log it
    if (requests == null) {
        console.error('No service requests found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(requests);
        res.json(requests);
    }
});

// Returns only translator requests, if any
// /api/servicereqs/translator
router.get('/translator', async function (req: Request, res: Response) {
    // Find all service request of type translator request
    const translatorRequests = await PrismaClient.translatorRequest.findMany({
        include: {
            serviceRequest: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (translatorRequests == null) {
        console.error(`No translator requests found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(translatorRequests);
        res.json(translatorRequests);
    }
});

// Post request to add service requests to the database
router.post('/', async function (req: Request, res: Response) {
    const serviceRequestAttempt: Prisma.ServiceRequestCreateInput = req.body;
    try {
        await PrismaClient.serviceRequest.create({ data: serviceRequestAttempt });
        console.log('Service request created');
    } catch (error) {
        console.error(`Unable to create service request ${serviceRequestAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

// Return a service request with specified id
router.get('/:id', async function (req: Request, res: Response) {
    // Parse the id param into a variable
    const requestId: number = Number(req.params.id);
    // Find the service request with the id
    const request = await PrismaClient.serviceRequest.findUnique({
        where: { requestId: requestId },
        include: {
            translatorRequest: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (request == null) {
        console.error(`The request with ${requestId} not found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(request);
        res.json(request);
    }
});

// Update service request with specified id
router.put('/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const requestId: number = Number(req.params.id);

    // find service request with id
    const request = await PrismaClient.translatorRequest.findUnique({
        where: { serviceRequestId: requestId },
    });

    // error if no service request with the id is found
    if (request == null) {
        console.error(`The request with ${requestId} not found in database!`);
        res.status(404);
    }
    // success: update specified service request
    else {
        try {
            const updateRequest = await PrismaClient.translatorRequest.update({
                where: { serviceRequestId: requestId },
                data: req.body,
            });
            // send 200 and updated service request if success
            res.status(200).json(updateRequest);
            // send 400 and error message if request cannot be updated
        } catch (error) {
            console.error(`Unable to update service request ${requestId}: ${error}`);
            res.sendStatus(400);
        }
    }
});

// // Delete service request with specific id
// router.delete('/:id', async function (req: Request, res: Response) {
//     // parse id into variable
//     const requestId: number = Number(req.params.id);
//     // find service request with id
//     const request = await PrismaClient.serviceRequest.findUnique({
//         where: { requestId: requestId },
//     });
// })

export default router;
