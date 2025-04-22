import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!session || !user) return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 });

        const userId = new mongoose.Types.ObjectId(user._id);

        const messages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "messages" },
            { $sort: { "$createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]);

        if (!messages || messages.length === 0) return Response.json({
            success: false,
            message: "No messages found"
        }, { status: 404 });;

        return Response.json({
            success: true,
            message: "Messages found",
            messages: messages[0].messages,
        }, { status: 200 });

    } catch (error) {
        console.log("Couldn't update message state");
        return Response.json({
            success: false,
            message: "Couldn't update message accepting status"
        }, { status: 500 });
    }
}
