import resend from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../email/verificationTemplate";

export const sendVerificationEmail = async (email: string, username: string, otp: string): Promise<ApiResponse> => {
  try {
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'My verification code',
      react: VerificationEmail({ username, otp })
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.log("couldn't send email");
    return { success: false, message: "Couldnt send Email" };
  }
}