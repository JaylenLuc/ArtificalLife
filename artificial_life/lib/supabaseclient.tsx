
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv';
dotenv.config();
// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.DATABASE_URL + "", process.env.PUB_ANON_KEY + "") 

export default supabase