import React from 'react';
import {Navigate, useNavigate} from "react-router-dom";
export type PostPreviewProps = {
    postId: string;
    title: string;
    content: string;
    createdAt: string;
    email: string;
    replies: ReplyProps[];
};
type ReplyProps = {
    replyId: string,
    content: string,
    createdAt: string,
    email: string,
    postId: number,
}


const PostPreview: React.FC<PostPreviewProps> = ({ postId, title, content, createdAt, email, replies }) => {
    const navigate = useNavigate();
    const redirectHandler = () => {
        console.log("Redirecting to post", postId);
        const postIdString = postId.toString();
        navigate('/detailed-post/'+postIdString);
    }
    return (
        <div className="border-3 border-[#012D5A] shadow-lg p-6 bg-white my-6">
            <div className="flex justify-between items-start">
                {/* Left side: title, meta, content */}
                <div className="space-y-2 max-w-4xl">
                    <h2 className="text-2xl font-semibold text-[#012D5A] hover:underline cursor-pointer" onClick={ () => {redirectHandler()}} >{title}</h2>
                    <p className="text-sm text-gray-500">
                        Created at {createdAt.slice(0, 10)} by {email}
                    </p>
                    <div className="text-gray-700 truncate">{content}</div>
                </div>

                {/* Right side: display number or replies */}

                <div className="ml-6 mt-1 text-right">
                    <h3 className="text-sm font-medium text-gray-600">
                        Replies: {replies.length}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default PostPreview;
