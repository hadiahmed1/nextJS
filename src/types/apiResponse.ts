import { Message } from "@/model/Message.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptionMessage?: boolean;
    messages?: Array<Message>
}