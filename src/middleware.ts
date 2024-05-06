import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request})
    console.log("The token is found and is: ",token);
    
    const url = request.nextUrl
    console.log("The url is :",url);
    
    if(token &&(
        url.pathname.startsWith('/signin')||
        url.pathname.startsWith('/signup')||
        url.pathname.startsWith('/verify')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
 
    }else if(!token && url.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL('/signin', request.url))

    }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/signin",
    "/",
    "/signup",
    "/dashboard/:path*",
    "/verify/:path*"
]
}