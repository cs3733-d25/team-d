import { Reply } from '@/routes/Forum/DetailPost.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';

interface ReplyProps {
    reply: Reply
}

export default function ReplyCard(props: ReplyProps) {
    return (
        <div className="flex-1 pl-10 pr-10 flex">
            <Card className="flex-1">
                <CardContent>
                    {props.reply.content}
                </CardContent>
            </Card>
        </div>
    );
}