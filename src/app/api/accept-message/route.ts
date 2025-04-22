import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import MessageModel from "@/model/Message.model";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 });

        const userId = user._id;

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            $set: { isAcceptingMessage: !user.isAcceptingMessage }
        }, { new: true });

        if (!updatedUser) return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 });

        return Response.json({
            success: true,
            message: "sucess"
        }, { status: 200 });

    } catch (error) {
        console.log("Couldn't update message state");
        return Response.json({
            success: false,
            message: "Couldn't update message accepting status"
        }, { status: 500 });
    }
}



export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 });

        const userId = user._id;

        const currentUser = await UserModel.findById(userId);

        if (!currentUser) return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 });

        return Response.json({
            success: true,
            message: "sucess",
            isAcceptingMessage: currentUser.isAcceptingMessage
        }, { status: 200 });

    } catch (error) {
        console.log("Couldn't update message state");
        return Response.json({
            success: false,
            message: "Couldn't update message accepting status"
        }, { status: 500 });
    }
}
