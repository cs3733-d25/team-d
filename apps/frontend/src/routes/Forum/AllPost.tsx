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
import {Button} from "@/components/ui/button.tsx";
import ForumPostPopup from "@/components/Forum/ForumPostPopup.tsx";
import AssignEmployeeDialog from "@/components/AssignEmployeeDialog.tsx";
import {getRequestType} from "@/routes/AllServiceRequests.tsx";



type PostPreviewProps = {
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
    const [batchNumber, setBatchNumber] = useState<number>();
    const [showPopup, setShowPopup] = useState(false);

    // useEffect(()=> {
    //
    //         // Get all posts data into
    //         axios.get<PostPreviewProps>()
    //             .then((response) => {
    //                 setAllPosts(response.data as PostPreviewProps[]);
    //                 setBatchNumber(0);
    //                 if (allPosts.length > 5){
    //                     setCurrentPosts(allPosts.slice(0, 5) as PostPreviewProps[]);
    //                 }
    //                 else {
    //                     setCurrentPosts(allPosts.slice(0, allPosts.length) as PostPreviewProps[]);
    //                 }
    //             })
    //
    //     },
    //     []
    // )

    return(
        <div>

            <div>
                <h2 className="text-3xl font-bold"> Help forum</h2>

                <div>
                    Search bar and filtering stuff
                </div>


                <div>
                    <ForumPostPopup trigger={<div className="pl-4 w-full text-left">Make a Post</div>}
                    />
                </div>
            </div>



            <div>
                <div>
                    {allPosts.length > 0 && (
                            allPosts.map((post: PostPreviewProps) => (
                                <h1> hi </h1>
                            ))
                        )
                    }

                    <PostPreview></PostPreview>
                    <PostPreview></PostPreview>
                    <PostPreview></PostPreview>

                </div>


                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}