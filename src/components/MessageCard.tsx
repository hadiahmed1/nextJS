'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Message } from "@/model/Message.model"

interface MessageCardProps {
    message: Message;
}

const MessageCard = ({ message }: MessageCardProps) => {
    return (
        <Card>
            <CardContent>
                <p>{message.content}</p>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
