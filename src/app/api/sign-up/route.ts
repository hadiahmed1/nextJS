import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const verificationCode = Math.floor(100000 + 899999 * Math.random()).toString();
        const verificationCodeExpiry = new Date();
        verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 1);

        const existingVerifiedUserName = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUserName)
            return Response.json({
                success: false,
                message: "Couldn't register user: Username already in use"
            }, { status: 409 });

        const existingUserEmail = await UserModel.findOne({ email });
        if (existingUserEmail) {
            if (existingUserEmail.isVerified)
                return Response.json({
                    success: false,
                    message: "Couldn't register user: Email already in use"
                }, { status: 409 });
            else {
                //update existing user
                existingUserEmail.password = bcrypt.hashSync(password);
                existingUserEmail.verificationCodeExpiry = verificationCodeExpiry;
                await existingUserEmail.save();
            }
        }
        else {
            //registering new user
            const user = new UserModel({
                username,
                email,
                password: bcrypt.hashSync(password, 10),
                isVerified: false,
                verificationCode,
                verificationCodeExpiry,
                isAcceptingMessage: true,
                messages: [],
                createdAt: new Date()
            });
            await user.save();
        }
        //send email
        const emailResponse = await sendVerificationEmail(email, username, verificationCode);
        console.log(emailResponse)
        if (!emailResponse.success)
            return Response.json({
                success: false,
                message: "User registered: Verification email not sent"
            }, { status: 424 });



        return Response.json({
            success: true,
            message: "User Registred, verification email sent"
        }, { status: 201 });
    } catch (error) {
        console.error("Error while registering User:\n", error);
        return Response.json({
            success: false,
            message: "Couldn't register user"
        }, { status: 500 });
    }
}