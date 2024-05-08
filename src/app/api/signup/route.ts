import { sendVerificationMail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs"
export async function POST(request:Request){
    await dbConnect() 

    try {
        const {username,email,password} = await request.json();
        const userWithUsernameExistsAndIsVerified =await UserModel.findOne({username,isverified:true})
        if(userWithUsernameExistsAndIsVerified){
            return Response.json({
                success:false,
                message:"User already exists and is already verified"
            },{status:400})
        }

        const userWithEmailExists=await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random()*9000).toString()
        if(userWithEmailExists){
            if(userWithEmailExists.isverified){
                return  Response.json({
                    success:false,
                    message:"User already exists with this email."},{status:400}
                )
            }else{
                const hashedPassword = await bcryptjs.hash(password,10)
                userWithEmailExists.password=hashedPassword;
                userWithEmailExists.verifyCode=verifyCode;
                userWithEmailExists.verifyCodyExpiry= new Date(Date.now()+ 3600000)
                await userWithEmailExists.save()
            }

        }else{
           const hashedPassword= await bcryptjs.hash(password,10)
           const expiryDate = new Date();
           expiryDate.setHours(expiryDate.getHours()+1)
           const newUser= new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodyExpiry:expiryDate,
            isverified:false,
            isAcceptingMessages:true,
            messages:[]
           })
           await newUser.save()
        }

        const emailResponse= await sendVerificationMail(email,username,verifyCode)

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message},{status:500}
            )
        }

        return Response.json({
            success:true,
            message:"User Registered successfully.Please verify your email"},{status:201}
        )

    } catch (error) {
        console.log("Error registering user");
        return Response.json({
            success:false,
            message:"Error registering user"
        },
{status:500})
        
    }
   // const {username,email,password} = await request.json()
}

