//create post method to send the message
//to send the message first fetch the message and the recievers's identity
//search for the reciever in db
//if not found send sender not found error
//if found check whether he is accepting messages 
//if not send exception that user is not accepting any msg
//if he is accepting then push this msg in the reciever's messages array
//retuirn the success message

import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const {username,content}= await request.json();
console.log("The username is: ",username,"and the content is : ",content);

    try {
        const user= await UserModel.findOne({username});
        console.log("User found");
        
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User not accespting messages"
            },{status:403})
        }
        
        const msg={
            createdAt:new Date(),
            content:content
        }
console.log(msg);

        user.messages.push(msg as Message)
        console.log(user.messages);
        
        await user.save()
        return Response.json({
            success:true,
            messsage:"Message sent successfully"
        },{status:200})
        

    } catch (error) {
        console.log("Could not complete request",error);     
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}