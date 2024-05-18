import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import authProvider from "@/lib/authProvider";
export const authOptions = authProvider
export default authOptions

// import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // ...add more providers here
//   ],
// }
// export default NextAuth(authOptions)