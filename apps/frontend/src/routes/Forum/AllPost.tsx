import PostPreview from "@/components/Forum/PostPreview.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {useEffect, useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";


export type PostPreviewProps = {
    postId: string,
    title: string,
    content: string,
    createdAt: string,
    email: string,
    replies: Array<ReplyProps>,
}


type ReplyProps = {
    replyId: string,
    content: string,
    createdAt: string,
    email: string,
    postId: number,
}


export default function AllPost () {
    const [allPosts, setAllPosts] = useState<PostPreviewProps[]>([]);
    const [currentPost, setCurrentPosts] = useState<PostPreviewProps[]>([]);
    const [batchNumber, setBatchNumber] = useState<number>(0);
    const postPerBatch = 3;

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
            const response = await axios.get<PostPreviewProps[]>('/api/forum/posts');
            const fetchArrays = response.data;

            setAllPosts(fetchArrays);
            setBatchNumber(0);

            if (fetchArrays.length > postPerBatch) {
                setCurrentPosts(fetchArrays.slice(0, postPerBatch));
            } else {
                setCurrentPosts(fetchArrays.slice(0, fetchArrays.length));
            }

            console.log('Current posts:', fetchArrays.slice(0, postPerBatch));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(()=> {
            fetchData();
        },
        []
    )

    return(
        <div>

            <div>
                <h2 className="text-3xl font-bold"> Help forum</h2>

                <div>
                    Search bar and filtering stuff
                </div>


                <div>
                    Make a post button
                </div>
            </div>



            <div>
                <div>
                    {currentPost.length > 0 && (
                        currentPost.map((post: PostPreviewProps) => (
                                <h1> <PostPreview {...post}></PostPreview> </h1>
                            ))
                        )
                    }
                </div>


                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={toPreviousBatch} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={ () => toThisBatch(1) }>1</PaginationLink>
                            </PaginationItem>
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
        </div>
    )
}