import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
await dbConnect();


try {
    
    const {code,username} =await request.json()
  //  console.log("Code is here: ", code,"and username is: ",username);
    
    const decodedUsername = decodeURIComponent(username)
 //   console.log('the decoded username is: ',decodedUsername);
    
    const user=await UserModel.findOne({username:decodedUsername,verifyCode:code})
   // console.log(user);
    
    if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },{status:500})    
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodyExpiry) > new Date() 
    if(isCodeValid && isCodeNotExpired){
        user.isverified=true;
        await user.save()
        return Response.json({
            success:true,
            message:"User Account verified successfully"
        },{status:200})    
    }else if(!isCodeNotExpired){
           return Response.json({
            success:false,
            message:"Verification code has expired"
        },{status:400})   
    }else{
        return Response.json({
            success:false,
            message:"Invalid verification code"
        },{status:400})   
    }
    
} catch (error) {
    console.error("Error verifying code", error);
    
    return Response.json({
        success:false,
        message:"Error verifying code"
    },{status:500})
}
}