import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 });

        const codeValid: boolean = user?.verificationCode === code;
        const codeNotExpire: boolean = new Date(user.verificationCodeExpiry) > new Date();

        if (codeValid && codeNotExpire) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 });
        }

        return Response.json({
            success: false,
            message: "Invalid otp"
        }, { status: 401 });

    } catch (error) {
        console.log("Error while verifying code:", error);
        return Response.json({
            success: false,
            message: "Invalid username"
        }, { status: 500 })
    }
}