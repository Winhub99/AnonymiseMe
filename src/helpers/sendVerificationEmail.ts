import {resend} from "@/lib/resend"
import VerificationEmail from "../../emailTemplates/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationMail(
    email:string,username:string,verificationCode:string)
    :Promise<ApiResponse>
    {
        try {
            const data = await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'AnonymousMessage | Verification code',
                react: VerificationEmail({username,otp:verificationCode}),
              }); 
            return {success:true,message:"Verification email sent successfully"}

        } catch (emailError) {
            console.log("Error sending verification mail: ",emailError);
            
            return {success:false,message:"Failed to send verification email"}
        }
}