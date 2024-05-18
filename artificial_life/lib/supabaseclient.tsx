
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv';
import { Database } from '@/database.types'
dotenv.config();
// Create a single supabase client for interacting with your databas
console.log(process.env.DATABASE_URL as string)
const database_url = process.env.DATABASE_URL as string
const pub_key =  process.env.PUB_ANON_KEY as string
const supabase = createClient<Database>(
    database_url,
    pub_key
)



export default supabase