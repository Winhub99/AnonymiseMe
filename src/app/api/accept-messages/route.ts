import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { log } from "console";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "user not authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    console.log("The userId from session is:",userId);
    
    const { acceptMessages } = await request.json()
    console.log("The accept message of user: ",acceptMessages);
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message accepting status updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })

    }
}

export async function GET(request:Request){
    await dbConnect()    
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "user not authenticated"
        }, { status: 401 })
    }

    const userId = user._id 
   try {
     const foundUser =await UserModel.findById(userId)
     if(!foundUser){
         return Response.json({
             success: false,
             message: "User not found"
         }, { status: 404 })       
     }     
     return Response.json({
         success: true,
         message: "Accepting message state updated successfully",
         isAcceptingMessages:foundUser.isAcceptingMessages,
     }, { status: 200 })
   } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json({
        success: false,
        message: "Failed to get user status to accept messages"
    }, { status: 404 })  
    
   }
}