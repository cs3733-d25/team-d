import { useEffect, useState } from 'react';
// import ForumReplyPopup from '@/components/Forum/ForumReplyPopup.tsx'
import FullPost from '@/components/Forum/FullPost.tsx';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ReplyCard from '@/components/Forum/ReplyCard.tsx';
import { API_ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ForumReplyPopup from "@/components/Forum/ForumReplyPopup.tsx";
export type Employee = {
    firstName: string;
    lastName: string;
}

export type Post = {
    postId: string;
    title: string;
    content: string;
    createdAt: string;
    poster: Employee | null;
    email: string | null;
    replies: Reply[];
}

export type Reply = {
    content: string;
    createdAt: string;
    poster: Employee;
}


export default function DetailPost() {

    const [post, setPost] = useState<Post>();

    const params = useParams();

    useEffect(() => {
        const postId = params.postId;
        if (!postId) return;
        axios.get(API_ROUTES.FORUM + '/post/' + postId).then(res => {
            const p = (res.data) as Post;
            console.log(p);
            // p.createdAt
            setPost(p);

        });
    }, []);

    return (
        <>
            {post ? (
                <>
                    <div className="w-screen p-10 flex">
                        <Card className="flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                            <CardHeader className="pl-10">
                                <CardTitle className="text-left pb-0">{post.title}</CardTitle>
                                <i>Posted by {post.poster ? post.poster.firstName : post.email} on {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}</i>
                            </CardHeader>
                            <CardContent>
                                {post.content}
                            </CardContent>
                        </Card>
                    </div>

                    <ForumReplyPopup ID={post.postId}></ForumReplyPopup>
                </>


            ) : (
                <div>
                    Loading...
                </div>
            )}
        </>
    )
}