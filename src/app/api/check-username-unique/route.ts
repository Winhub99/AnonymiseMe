
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User';
import { usernameValidationSchema } from '@/schemas/signupSchema'
import { z } from 'zod'

const UsernameQuerySchema = z.object({
    username: usernameValidationSchema
})

export async function GET(request: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
      //  console.log("Displaying result");
        
        //console.log(result);//remove this line after analysing output

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(",") : 'Invalid query parameters'
            }, { status: 400 })
        }
        const username = result.data.username
        const existingVerifiedUser = await UserModel.findOne({ username, isverified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "username already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}