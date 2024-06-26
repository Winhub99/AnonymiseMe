import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageId= params.messageid;
    console.log("the message id is :" ,messageId);
    console.log("And the params are ",params);
    
    
await dbConnect()
const session =await getServerSession(authOptions)
const user:User =session?.user as User;

if(!session || !session.user){
    return Response.json({
        success:false,
    message:"Not authenticated"
    },{status:401})
}
try {
    const updatedResult= await UserModel.updateOne(
        {_id:user._id},
        {$pull:{messages:{_id: messageId}}}
    )

    if(updatedResult.modifiedCount===0){
     return Response.json({
        success:false,
        message:"Message not found"
     },{status:404})       
    }
    return Response.json({
        success:true,
        message:"Message Deleted"
     },{status:200}) 
} catch (error) {
    console.log("Error deleting th message",error);
    
    return Response.json({
        success:false,
        message:"Internal server error"
     },{status:501}) 
}
}