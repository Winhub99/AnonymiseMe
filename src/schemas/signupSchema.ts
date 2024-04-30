import {z} from "zod"

export const usernameValidationSchema = z
.string()
.min(3,"Username must be atleast 3 char long")
.max(20,"Username must be atmost of 20 char long")
.regex(/^[a-zA-Z0-9_]+$/,"username must not contain special char")

export const signupSchema = z.object({
    username:usernameValidationSchema,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(5,{message:"Password must be atleast 5 char long "})
})
