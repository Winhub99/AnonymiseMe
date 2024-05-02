import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()

    const {username,content} = await request.json()
    try {
        const user= await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        //check if user is accepting messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "user not accepting messages"
            }, { status: 403 })
        }

        const newMessage = {content, createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Error adding message: ",error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}