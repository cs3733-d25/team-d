import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma } from 'database';
const router: Router = express.Router();

// Returns all posts, if any
router.get('/posts', async function (req: Request, res: Response) {
    // Query db, store response
    const posts = await PrismaClient.post.findMany({
        include: {
            poster: true,
            replies: {
                include: {
                    replier: true,
                },
            },
        },
    });
    // If no posts are found, send 204 and log it
    if (posts == null) {
        console.error('No posts found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(posts);
        res.json(posts);
    }
});

router.get('/post/:pid', async function (req: Request, res: Response) {
    // Query db, store response
    const posts = await PrismaClient.post.findUnique({
        where: {
            postId: Number(req.params.pid),
        },
        include: {
            poster: true,
            replies: {
                include: {
                    replier: true,
                },
            },
        },
    });
    // If no posts are found, send 204 and log it
    if (posts == null) {
        console.error('No posts found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(posts);
        res.json(posts);
    }
});

router.get('/post', async function (req: Request, res: Response) {
    // Query db, store response
    const posts = await PrismaClient.post.findMany({
        include: {
            poster: true,
            replies: {
                include: {
                    replier: true,
                },
            },
        },
    });
    // If no posts are found, send 204 and log it
    if (posts == null) {
        console.error('No posts found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(posts);
        res.json(posts);
    }
});

// Returns all replies, if any
router.get('/replies', async function (req: Request, res: Response) {
    // Query db, store response
    const replies = await PrismaClient.reply.findMany();
    // If no replies are found, send 204 and log it
    if (replies == null) {
        console.error('No replies found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(replies);
        res.json(replies);
    }
});

// Returns all posts by created time order, if any
router.get('/newest', async function (req: Request, res: Response) {
    // Query db, store response
    const posts = await PrismaClient.post.findMany({
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
    });
    // If no posts are found, send 204 and log it
    if (posts == null) {
        console.error('No posts found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(posts);
        res.json(posts);
    }
});

// post request to add a post to the database
router.post('/post', async function (req: Request, res: Response) {
    const postDataAttempt: Prisma.PostCreateInput = req.body;
    try {
        await PrismaClient.post.create({ data: postDataAttempt });
        console.log('Post created');
    } catch (error) {
        console.error(`Unable to create a new post ${postDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

// post request to add a reply to the database
router.post('/reply', async function (req: Request, res: Response) {
    const replyDataAttempt: Prisma.ReplyCreateInput = req.body;
    try {
        await PrismaClient.reply.create({ data: replyDataAttempt });
        console.log('Reply created');
    } catch (error) {
        console.error(`Unable to create a new reply ${replyDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

export default router;
