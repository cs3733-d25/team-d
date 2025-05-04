import PostPreview from "@/components/Forum/PostPreview.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button} from "@/components/ui/button.tsx";
import ForumPostPopup from "@/components/Forum/ForumPostPopup.tsx";
import AssignEmployeeDialog from "@/components/AssignEmployeeDialog.tsx";
import {getRequestType} from "@/routes/AllServiceRequests.tsx";


export type PostPreviewProps = {
    postId: string;
    title: string;
    content: string;
    createdAt: string;
    email: string;
    replies: Array<ReplyProps>;
};

type ReplyProps = {
    replyId: string;
    content: string;
    createdAt: string;
    email: string;
    postId: number;
};

export default function AllPost() {
    const [allPosts, setAllPosts] = useState<PostPreviewProps[]>([]);
    const [currentPost, setCurrentPosts] = useState<PostPreviewProps[]>([]);
    const [batchNumber, setBatchNumber] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const postPerBatch = 3;

    const handleSearch = () => {
        const filtered = allPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCurrentPosts(filtered.slice(0, postPerBatch));
        setBatchNumber(0);
    };
    const [showPopup, setShowPopup] = useState(false);

    const resetSearch = () => {
        setSearchQuery("");
        setCurrentPosts(allPosts.slice(0, postPerBatch));
        setBatchNumber(0);
    };

    useEffect(() => {
        if (searchQuery.trim() === "") {
            resetSearch();
        }
    }, [searchQuery]);

    const toPreviousBatch = () => {
        if (batchNumber > 0) {
            setBatchNumber(batchNumber - 1);
        }
    };

    const toNextBatch = () => {
        if ((batchNumber + 1) * postPerBatch < allPosts.length) {
            setBatchNumber(batchNumber + 1);
        }
    };

    const toThisBatch = (number: number) => {
        setBatchNumber(number);
    };

    useEffect(() => {
        const start = batchNumber * postPerBatch;
        const end = start + postPerBatch;
        setCurrentPosts(allPosts.slice(start, end));
    }, [batchNumber, allPosts]);

    const fetchData = async () => {
        try {
            const response = await axios.get<PostPreviewProps[]>("/api/forum/newest");
            const fetchArrays = response.data;

            setAllPosts(fetchArrays);
            setCurrentPosts(fetchArrays.slice(0, postPerBatch));
            setBatchNumber(0);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className=" p-6">
            <div className="border-4 border-[#012D5A] rounded-2xl shadow-lg p-6 bg-white my-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-3xl font-bold text-[#012D5A] mb-4 md:mb-0">Help Forum</h2>

                    <div>
                        <ForumPostPopup onUpdate={fetchData}
                                        trigger={<button
                                        onClick={handleSearch}
                                        className="bg-blue-900 text-white px-5 py-2 rounded-xl hover:bg-black transition">
                                            + Make a Post
                        </button>}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:max-w-md focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-900 text-white px-4 py-2 rounded-xl hover:bg-black transition"
                    >
                        Search
                    </button>
                    <button
                        onClick={resetSearch}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {currentPost.length > 0 ? (
                    currentPost.map((post: PostPreviewProps) => (
                        <div key={post.postId} className=" ">
                            <PostPreview {...post} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">No posts to show.</p>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={toPreviousBatch} />
                        </PaginationItem>
                        {[...Array(Math.ceil(allPosts.length / postPerBatch))].map((_, idx) => (
                            <PaginationItem key={idx}>
                                <PaginationLink
                                    isActive={idx === batchNumber}
                                    onClick={() => toThisBatch(idx)}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={toNextBatch} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
