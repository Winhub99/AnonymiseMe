import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs"



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text " },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect()
                console.log("the identifier is :",credentials.identifier);
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier }, { username: credentials.identifier }]
                    })
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    if (!user.isverified) {
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Password is incorrect.")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        })
    ],
    callbacks:{
        async session({ session, token }) {
           session.user._id=token._id 
           session.user.isverified = token.isverified
           session.user.isAcceptingMessages = token.isAcceptingMessages
           session.user.username= token.username
            return session
          },
          async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isverified = user.isverified
                token.isAcceptingMessages= user.isAcceptingMessages
                token.username = user.username
            }
            return token
          }
    },
    pages:{
        signIn:"/signin"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
    
}