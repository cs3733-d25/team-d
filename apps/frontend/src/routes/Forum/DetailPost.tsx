import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ForumReplyPopup from "@/components/Forum/ForumReplyPopup.tsx";
import { API_ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import { ArrowLeft } from "lucide-react"; // optional: for an icon

export type Employee = {
    firstName: string;
    lastName: string;
};

export type Post = {
    postId: string;
    title: string;
    content: string;
    createdAt: string;
    poster: Employee | null;
    email: string | null;
    replies: Reply[];
};

export type Reply = {
    content: string;
    createdAt: string;
    replier: Employee;
};

export default function DetailPost() {
    const navigate = useNavigate();
    const [post, setPost] = useState<Post>();
    const params = useParams();

    useEffect(() => {
        const postId = params.postId;
        if (!postId) return;
        axios.get(API_ROUTES.FORUM + '/post/' + postId).then(res => {
            const p = res.data as Post;
            setPost(p);
        });
    }, []);

    return (
        <>
            {post ? (
                <>
                    <div className="p-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-4 flex items-center text-[#012D5A] hover:underline font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return
                        </button>

                        <div className="border-4 border-[#012D5A] rounded-md shadow-md bg-white p-6 space-y-2">
                            <h2 className="text-2xl font-semibold text-[#012D5A]">{post.title}</h2>
                            <p className="text-sm text-gray-500 italic">
                                Posted by {post.poster ? `${post.poster.firstName} ${post.poster.lastName}` : post.email} on{' '}
                                {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                            </p>
                            <div className="text-gray-800">{post.content}</div>
                        </div>
                    </div>

                    <div className="px-10 pb-10">
                        <div className="border-4 border-[#012D5A] rounded-md shadow-md bg-white p-6">
                            <ForumReplyPopup
                                ID={post.postId}
                                onReplySubmit={() => {
                                    axios.get(API_ROUTES.FORUM + '/post/' + post.postId).then(res => {
                                        const p = res.data as Post;
                                        setPost(p);
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="px-10 pb-10 space-y-4">
                        {post.replies && post.replies.length > 0 ? (
                            post.replies.map((reply, index) => (
                                <div key={index} className="border border-gray-300 rounded-md shadow-sm bg-white p-4 space-y-1">
                                    <div className="text-sm font-medium text-gray-700">
                                        {reply.replier?.firstName
                                            ? `${reply.replier.firstName} ${reply.replier.lastName}`
                                            : 'Anonymous'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString()}
                                    </div>
                                    <div className="text-gray-800">{reply.content}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No replies yet.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="p-10 text-gray-500">Loading...</div>
            )}
        </>
    );
}
