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
    date: string,
    email: string
}


type ReplyProps = {
    content: string,
    date: string,
    email: string,
    postId: number,
}


export default function AllPost () {
    const [allPosts, setAllPosts] = useState<PostPreviewProps[]>([]);
    const [currentPost, setCurrentPosts] = useState<PostPreviewProps[]>([]);
    const [batchNumber, setBatchNumber] = useState<number>(0);

    const toPreviousBatch = ()=>{
        if(batchNumber > 0){
            console.log("To previous batch");
            setBatchNumber(batchNumber - 1);
            setCurrentPosts(allPosts.slice(batchNumber * 5, batchNumber * 5 + 5) as PostPreviewProps[]);
        }
        else return;
    }

    const toThisBatch = (number: number) => {
        setBatchNumber(number);
        setCurrentPosts(allPosts.slice(number * 5, number * 5 + 5) as PostPreviewProps[]);
    }

    const toNextBatch = ()=>{
        if(batchNumber > allPosts.length/5){
            console.log("To next batch");
            setBatchNumber(batchNumber + 1);
            setCurrentPosts(allPosts.slice(batchNumber * 5, batchNumber * 5 + 5) as PostPreviewProps[]);
        }
        else return;
    }


    const fetchData = async () => {
        try {
            const postArrays = await axios.get<PostPreviewProps[]>('/api/forum/posts');
            const fetchArrays= postArrays.data;
            setAllPosts(fetchArrays);
            setBatchNumber(0)
            if (allPosts.length > 5){
                setCurrentPosts(fetchArrays.slice(0, 4) as PostPreviewProps[]);
            }
            else {
                setCurrentPosts(fetchArrays.slice(0, fetchArrays.length) as PostPreviewProps[]);

            }
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