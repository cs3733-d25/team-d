import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Post } from '@/routes/Forum/DetailPost.tsx';


interface PostProps {
    post: Post;
}

export default function FullPost(props: PostProps) {
    return (
        <div className="w-screen p-10 flex">
            {/*<Card className="flex-1 border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">*/}
            {/*    <CardHeader className="pl-10">*/}
            {/*        <CardTitle className="text-left pb-0">{props.post.title}</CardTitle>*/}
            {/*        <i>Posted by {props.post.poster.firstName} on {props.post.createdAt.toLocaleDateString()} at {props.post.createdAt.toLocaleTimeString()}</i>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}
            {/*        {props.post.content}*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
        </div>
    );
}