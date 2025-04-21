import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schema/username.schema";
import { error } from "console";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = { username: searchParams.get('username') };
        //validate
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: "Invalid user name",
                errors: usernameErrors
            }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ username: queryParam.username});
        if (existingUser)
            return Response.json({
                success: false,
                message: "username already in use",
            }, { status: 409 });
        //success
        return Response.json({
            success: true,
            message: "username is valid",
        }, { status: 200 });

    } catch (error) {
        console.log("Error while checking user name:", error);
        return Response.json({
            success: false,
            message: "Invalid username"
        }, { status: 500 })
    }
}