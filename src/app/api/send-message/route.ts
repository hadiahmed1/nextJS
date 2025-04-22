import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import MessageModel, { Message } from "@/model/Message.model";

export async function POST(request: Request) {
    try {
        const { username, content } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 });

        if (!user.isAcceptingMessage) return Response.json({
            success: false,
            message: "User not accepting messages"
        }, { status: 403 });
        //create message
        const newMessage: Message = new MessageModel({ content });
        //add message to user
        user.messages.push(newMessage);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent"
        }, { status: 200 });
    } catch (error) {
        console.log("Error while sending message:", error);
        return Response.json({
            success: false,
            message: "Couldn't send message"
        }, { status: 500 });
    }
}