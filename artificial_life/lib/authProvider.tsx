import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import { db } from "@/lib/db";
import { compare } from "bcrypt";
export const authOptions = NextAuth({
    adapter: PrismaAdapter(db),
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/userauth/signin'

    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text", placeholder: "User" },
                email: { label: "Email", type: "text", placeholder: "user@mail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials.username || !credentials?.password ){
                    return null;
                }
                const existingUseremail = await db.user.findUnique({
                   where : {email : credentials?.email} 
                })
                if (!existingUseremail){
                    return null;
                }
                console.log( "cred username: ", credentials?.username)
                const existingUsername = await db.user.findUnique({
                    where : {username : credentials?.username} 
                 })
                 console.log("eee: ", existingUsername)
                if (!existingUsername){
                    return null;
                }
                const passwordMatch = await compare (credentials.password, existingUsername.password)
                
                if (!passwordMatch){
                    return null;
                }
                const ret = {
                    id : existingUsername.id + '',
                    username : existingUsername.username,
                    email: existingUsername.email
                }
                console.log(ret)
                return ret

            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            return session
          },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }

    }
})
export default authOptions