import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma, ServiceRequest } from 'database';
import { transcode } from 'node:buffer';
const router: Router = express.Router();

// GET ALL SERVICE REQUESTS
router.get('/', async function (req: Request, res: Response) {
    // Query db, store response

    const requests = await PrismaClient.serviceRequest.findMany({
        include: {
            translatorRequest: true,
            equipmentRequest: true,
            securityRequest: true,
            sanitationRequest: true,
            employeeRequestedBy: {
                select: { firstName: true, lastName: true },
            },
            assignedEmployee: {
                select: { firstName: true, lastName: true },
            },
            departmentUnder: {
                select: { name: true },
            },
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

// GET ALL TRANSLATOR REQUESTS
router.get('/translator', async function (req: Request, res: Response) {
    // Find all service request of type translator request
    const translatorRequests = await PrismaClient.serviceRequest.findMany({
        where: {
            translatorRequest: {
                isNot: null,
            },
        },
        include: {
            translatorRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
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

// GET ALL SECURITY REQUESTS
router.get('/security', async function (req: Request, res: Response) {
    // Find all service request of type equipment request
    const securityRequests = await PrismaClient.serviceRequest.findMany({
        where: {
            securityRequest: {
                isNot: null,
            },
        },
        include: {
            securityRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (securityRequests == null) {
        console.error(`No security requests found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(securityRequests);
        res.json(securityRequests);
    }
});

// GET ALL MEDICAL EQUIPMENT REQUESTS
router.get('/equipment', async function (req: Request, res: Response) {
    // Find all service request of type equipment request
    const equipmentRequests = await PrismaClient.serviceRequest.findMany({
        where: {
            equipmentRequest: {
                isNot: null,
            },
        },
        include: {
            equipmentRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (equipmentRequests == null) {
        console.error(`No medical device requests found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(equipmentRequests);
        res.json(equipmentRequests);
    }
});

// GET ALL SANITATION REQUESTS
router.get('/sanitation', async function (req: Request, res: Response) {
    // Find all service request of type translator request
    const sanitationRequests = await PrismaClient.serviceRequest.findMany({
        where: {
            sanitationRequest: {
                isNot: null,
            },
        },
        include: {
            sanitationRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (sanitationRequests == null) {
        console.error(`No sanitation requests found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(sanitationRequests);
        res.json(sanitationRequests);
    }
});

// GET SERVICE REQ TYPE BREAKDOWN
router.get('/typeBreakdown', async function (req: Request, res: Response) {
    //count num of translator requests
    const translatorRequests = await PrismaClient.serviceRequest.aggregate({
        _count: {
            requestId: true,
        },
        where: {
            translatorRequest: {
                isNot: null, //filter for translator request
            },
        },
    });

    //count num of equipment requests
    const equipmentRequests = await PrismaClient.serviceRequest.aggregate({
        _count: {
            requestId: true,
        },
        where: {
            equipmentRequest: {
                isNot: null, //filter for equipment request
            },
        },
    });

    //count num of security requests
    const securityRequests = await PrismaClient.serviceRequest.aggregate({
        _count: {
            requestId: true,
        },
        where: {
            securityRequest: {
                isNot: null, //filter for security request
            },
        },
    });

    //count num of sanitation requests
    const sanitationRequests = await PrismaClient.serviceRequest.aggregate({
        _count: {
            requestId: true,
        },
        where: {
            sanitationRequest: {
                isNot: null, //filter for sanitation request
            },
        },
    });

    //breakdown of request types
    const typeBreakdown = [
        { Type: 'Translator', num: translatorRequests._count.requestId },
        { Type: 'Equipment', num: equipmentRequests._count.requestId },
        { Type: 'Security', num: securityRequests._count.requestId },
        { Type: 'Sanitation', num: sanitationRequests._count.requestId },
    ];

    res.json(typeBreakdown);
});

//Priority breakdown
router.get('/priorityBreakdown', async function (req: Request, res: Response) {
    const requests = await PrismaClient.serviceRequest.groupBy({
        by: ['priority'],
        _count: {
            requestId: true,
        },
    });

    const typeBreakdown = [];
    for (const request of requests) {
        typeBreakdown.push({ Priority: request.priority, count: request._count.requestId });
    }

    const priorityOrder = ['low', 'medium', 'high', 'emergency'];

    typeBreakdown.sort(
        (a, b) =>
            priorityOrder.indexOf(a.Priority.toLowerCase()) -
            priorityOrder.indexOf(b.Priority.toLowerCase())
    );

    res.json(typeBreakdown);
});

// GET NUM OF SERVICE REQ PAST 7 DAYS
router.get('/past7days', async function (req: Request, res: Response) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    try {
        const newReqs = await PrismaClient.serviceRequest.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            _count: {
                _all: true,
            },
        });

        const completedReqs = await PrismaClient.serviceRequest.groupBy({
            by: ['updatedAt'],
            where: {
                updatedAt: {
                    gte: sevenDaysAgo,
                },
                requestStatus: 'Done',
            },
            _count: {
                _all: true,
            },
        });

        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const newByDay: Record<string, number> = {};
        for (const entry of newReqs) {
            const date = formatDate(entry.createdAt);
            newByDay[date] = (newByDay[date] || 0) + entry._count._all;
        }

        const completedByDay: Record<string, number> = {};
        for (const entry of completedReqs) {
            const date = formatDate(entry.updatedAt);
            completedByDay[date] = (completedByDay[date] || 0) + entry._count._all;
        }

        const allDates = new Set([...Object.keys(newByDay), ...Object.keys(completedByDay)]);
        const result = Array.from(allDates)
            .map((date) => ({
                date,
                numOfNewReq: newByDay[date] || 0,
                numOfCompletedReq: completedByDay[date] || 0,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.json(result);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
});

// GET NUM OF REQUESTS BY DEPARTMENT
router.get('/departmentBreakdown', async function (req: Request, res: Response) {
    const requests = await PrismaClient.serviceRequest.groupBy({
        by: ['departmentUnderId'],
        _count: {
            requestId: true,
        },
    });

    const departmentIds: number[] = requests
        .map((r) => r.departmentUnderId)
        .filter((id): id is number => id !== null);
    const departments = await PrismaClient.department.findMany({
        where: {
            departmentId: { in: departmentIds },
        },
        select: {
            departmentId: true,
            name: true,
        },
    });

    const departmentMap = new Map(departments.map((d) => [d.departmentId, d.name]));
    const typeBreakdown = requests.map((r) => ({
        Department: departmentMap.get(r.departmentUnderId!) ?? 'Unknown',
        count: r._count.requestId,
    }));

    res.json(typeBreakdown);
});

// POST TRANSLATOR REQUESTS TO DATABASE
router.post('/translator', async function (req: Request, res: Response) {
    const {
        languageTo,
        languageFrom,
        roomNum,
        employeeRequestedById,
        departmentUnderId,
        priority,
        requestStatus,
        comments,
    } = req.body;
    try {
        await PrismaClient.serviceRequest.create({
            data: {
                assignedEmployeeId: null,
                roomNum,
                requestStatus,
                priority,
                departmentUnderId,
                employeeRequestedById,
                comments,
                translatorRequest: {
                    create: {
                        languageFrom,
                        languageTo,
                        startDateTime: req.body.startDateTime + ':00.000Z',
                        endDateTime: req.body.endDateTime + ':00.000Z',
                    },
                },
            },
        });
        console.log('Service request created');
    } catch (error) {
        console.error(`Unable to create a new service request: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

// POST SECURITY REQUESTS TO DATABASE
router.post('/security', async function (req: Request, res: Response) {
    const {
        numOfGuards,
        securityType,
        roomNum,
        employeeRequestedById,
        departmentUnderId,
        priority,
        requestStatus,
        comments,
    } = req.body;
    try {
        await PrismaClient.serviceRequest.create({
            data: {
                assignedEmployeeId: null,
                employeeRequestedById,
                departmentUnderId,
                roomNum,
                priority,
                requestStatus,
                comments,
                securityRequest: {
                    create: {
                        numOfGuards,
                        securityType,
                    },
                },
            },
        });
        console.log('Service request created');
    } catch (error) {
        console.error(`Unable to create a new service request: ${error}`);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
});

// POST EQUIPMENT REQUESTS TO DATABASE
router.post('/equipment', async function (req: Request, res: Response) {
    const {
        medicalDevice,
        quantity,
        comments,
        signature,
        roomNum,
        employeeRequestedById,
        departmentUnderId,
        priority,
        requestStatus,
    } = req.body;
    try {
        await PrismaClient.serviceRequest.create({
            data: {
                assignedEmployeeId: null,
                employeeRequestedById,
                departmentUnderId,
                roomNum,
                priority,
                requestStatus,
                comments,
                equipmentRequest: {
                    create: {
                        medicalDevice,
                        quantity,
                        signature,
                        startDateTime: req.body.startDateTime + ':00.000Z',
                        endDateTime: req.body.endDateTime + ':00.000Z',
                    },
                },
            },
        });
        console.log('Service request created');
    } catch (error) {
        console.error(`Unable to create a new service request: ${error}`);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

// POST SANITATION REQUESTS TO DATABASE
router.post('/sanitation', async (req, res) => {
    const {
        roomNum,
        type,
        status,
        comments,
        employeeRequestedById,
        departmentUnderId,
        priority,
        requestStatus,
    } = req.body;

    try {
        await PrismaClient.serviceRequest.create({
            data: {
                assignedEmployeeId: null,
                employeeRequestedById,
                departmentUnderId,
                roomNum,
                priority,
                requestStatus,
                comments,
                sanitationRequest: {
                    create: {
                        type,
                        status,
                    },
                },
            },
        });

        console.log('Service request created');
    } catch (error) {
        console.error('Error creating sanitation request:', error);
        res.status(500).json({ error: 'Error creating sanitation request' });
    }
    res.sendStatus(200);
});

// Return a service request with specified id
router.get('/:id', async function (req: Request, res: Response) {
    // Parse the id param into a variable
    const requestNum: number = Number(req.params.id);
    // Find the service request with the id
    const request = await PrismaClient.serviceRequest.findUnique({
        where: { requestId: requestNum },
        include: {
            translatorRequest: true,
            equipmentRequest: true,
            securityRequest: true,
            sanitationRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
        },
    });

    // If no service request with the ID is found, send 204 and log it
    if (request == null) {
        console.error(`The request with Id ${requestNum} not found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(request);
        res.json(request);
    }
});

// Return all service request under an employee email
router.get('/employee/:email', async function (req: Request, res: Response) {
    // parse email into variable
    const userEmail: string = encodeURI(req.params.email);

    const employee = await PrismaClient.employee.findUnique({
        where: {
            email: userEmail,
        },
    });

    console.log(userEmail);
    // find profile with email
    const requests = await PrismaClient.serviceRequest.findMany({
        where: {
            employeeRequestedById: employee?.employeeId,
        },
        include: {
            translatorRequest: true,
            equipmentRequest: true,
            securityRequest: true,
            sanitationRequest: true,
            employeeRequestedBy: true,
            assignedEmployee: true,
            departmentUnder: true,
        },
    });
    // If no profiles are found, send 204 and log it
    if (employee == null) {
        console.error(`No employee found in database with email ${userEmail}!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    {
        console.log(requests);
        res.json(requests);
    }
});

// Update service request with specified id
router.put('/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const requestId: number = Number(req.params.id);

    // find service request with id
    const request = await PrismaClient.serviceRequest.findUnique({
        where: { requestId: requestId },
        include: {
            translatorRequest: true,
            equipmentRequest: true,
            securityRequest: true,
            sanitationRequest: true,
        },
    });

    // error if no service request with the id is found
    if (request == null) {
        console.error(`The request with Id ${requestId} not found in database!`);
        res.status(404);
    }

    // success: update specified service request
    try {
        const {
            languageTo,
            languageFrom,
            roomNum,
            startDateTime,
            endDateTime,
            assignedEmployeeId,
            employeeRequestedById,
            departmentUnderId,
            priority,
            requestStatus,
            medicalDevice,
            quantity,
            signature,
            numOfGuards,
            securityType,
            type,
            status,
            comments,
        } = req.body;

        if (request) {
            if (request.translatorRequest) {
                const updateTranslatorRequest = await PrismaClient.translatorRequest.update({
                    where: { serviceRequestId: requestId },
                    data: {
                        languageTo,
                        languageFrom,
                        startDateTime,
                        endDateTime,
                    },
                });
            }

            if (request.equipmentRequest) {
                const updateEquipmentRequest = await PrismaClient.equipmentRequest.update({
                    where: { serviceRequestId: requestId },
                    data: {
                        medicalDevice,
                        quantity,
                        signature,
                    },
                });
            }

            if (request.securityRequest) {
                const updateSecurityRequest = await PrismaClient.securityRequest.update({
                    where: { serviceRequestId: requestId },
                    data: {
                        numOfGuards,
                        securityType,
                    },
                });
            }

            if (request.sanitationRequest) {
                const updateSanitationRequest = await PrismaClient.sanitationRequest.update({
                    where: { serviceRequestId: requestId },
                    data: {
                        type,
                        status,
                    },
                });
            }

            const updateServiceRequest = await PrismaClient.serviceRequest.update({
                where: { requestId: requestId },
                data: {
                    assignedEmployeeId,
                    priority,
                    requestStatus,
                    employeeRequestedById,
                    departmentUnderId,
                    roomNum,
                    comments,
                },
            });
            // send 200 and updated service request if success
            res.status(200).json({
                message: 'Successfully updated service request',
                updateServiceRequest,
            });
        }
    } catch (error) {
        console.error(`Unable to update service request ${requestId}: ${error}`);
        res.sendStatus(400);
    }
});

// Delete service request with specific id
router.delete('/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const requestId: number = Number(req.params.id);
    // find service request with id
    const serviceRequest = await PrismaClient.serviceRequest.findUnique({
        where: { requestId: requestId },
    });
    const translatorRequest = await PrismaClient.translatorRequest.findUnique({
        where: { serviceRequestId: requestId },
    });
    const equipmentRequest = await PrismaClient.equipmentRequest.findUnique({
        where: { serviceRequestId: requestId },
    });
    const securityRequest = await PrismaClient.securityRequest.findUnique({
        where: { serviceRequestId: requestId },
    });
    const sanitationRequest = await PrismaClient.securityRequest.findUnique({
        where: { serviceRequestId: requestId },
    });

    // error if no service request with the id is found
    if (
        serviceRequest == null &&
        translatorRequest == null &&
        equipmentRequest == null &&
        securityRequest == null &&
        sanitationRequest == null
    ) {
        console.error(`The request with Id ${requestId} not found in database!`);
        res.status(404);
    }
    // success: delete specified service request
    else {
        try {
            const [deleteServiceRequest] = await PrismaClient.$transaction([
                PrismaClient.serviceRequest.delete({
                    where: { requestId: requestId },
                }),
            ]);

            // send 200 if success
            res.status(200).json({
                message: 'Successfully deleted service request',
                deleteServiceRequest,
            });
            // send 400 and error message if request cannot be updated
        } catch (error) {
            console.error(`Unable to delete service request ${requestId}: ${error}`);
            res.sendStatus(400);
        }
    }
});

export default router;
