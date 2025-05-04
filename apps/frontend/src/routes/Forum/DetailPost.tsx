import { useEffect, useState } from 'react';

import FullPost from '@/components/Forum/FullPost.tsx';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ReplyCard from '@/components/Forum/ReplyCard.tsx';

export type User = {
    name: string;
}

export type Post = {
    title: string;
    content: string;
    date: Date;
    user: User;
    replies: Reply[];
}

export type Reply = {
    content: string;
    date: Date;
    user: User;
}


export default function DetailPost() {

    const [post, setPost] = useState<Post>();

    useEffect(() => {
        setPost({
            title: 'testn jknfdskj',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            date: new Date(Date.now()),
            user: {
                name: 'John Smith',
            },
            replies: [
                {
                    content: 'I like trains',
                    date: new Date(Date.now()),
                    user: {
                        name: 'Alice Bob',
                    }
                },
                {
                    content: 'dsiuf hdsgh uifghsog hruihgr iurh iguhreiu ghiureh iugh iuruh guiresh giuhreeui igho',
                    date: new Date(Date.now()),
                    user: {
                        name: 'Juan',
                    }
                }
            ]
        })
    }, []);

    return (
        <>
            {post ? (
                <>
                    <FullPost post={post}></FullPost>
                    <div className="w-screen p-10 flex">
                        <Card className="flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                            <CardHeader className="pl-10">
                                <CardTitle className="text-left pb-0">Replies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex-1 flex flex-col">
                                    {post.replies.map(reply => (
                                        <ReplyCard reply={reply} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                <div>
                    Loading...
                </div>
            )}
        </>
    )
}