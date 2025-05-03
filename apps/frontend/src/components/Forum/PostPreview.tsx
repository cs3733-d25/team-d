import React from 'react';

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
    return (
        <div className="border-4 border-[#012D5A] rounded-2xl shadow-lg p-6 bg-white max-w-xl mx-auto my-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#012D5A]">{title}</h2>
                <p className="text-sm text-gray-500">Created at {createdAt.slice(0,10)} by {email}</p>
                <div className="text-gray-700 truncate">
                    {content}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-600">Number of replies {replies.length}</h3>
            </div>
        </div>
    );
};

export default PostPreview;
