import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { env } from 'process';
import dotenv from 'dotenv';
import * as z from 'zod';
//dotenv.config();

const userSchema = z
  .object({
    username:z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters')
  })

export default async function handler(//POST REQ
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    try {
      console.log("here")
      const body = request.body;
      const {email,username,password } = userSchema.parse(body);
      //check if email already exists
      const existingUserByEmail = await db.user.findUnique({
        where: {email: email}
      });
      if (existingUserByEmail) {
        return response.status(500).json({user: null, message : "User with this email already exists"})
      }

      const existingUserByUsername = await db.user.findUnique({
        where: {username: username}
      });
      if (existingUserByUsername) {
        console.log("HERE")
        return response.status(500).json({user: null, message : "User with this user name already exists"})
      }
      //const secret_salt = env.AUTH_SECRET as string;
      //console.log(secret_salt)
      const hashedPassword = await hash(password, 10)
      //console.log("error: ",hashedPassword)
      //created at, updated at, and unqiue are generated
      const newUser = await db.user.create({
        data : {
          username,
          email,
          password : hashedPassword
        }
      })
 
      return response.json({user : newUser, message : "user creation success"})
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
  //make sure these response jsons are rendered on the sign up page
  //http://localhost:3000/api/get_settings?id=2