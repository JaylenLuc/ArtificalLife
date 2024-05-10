import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const id = request.query.id as string;
  const user_id = request.query.user_id as string;
  try {
    const d1 = request.query.d1 as string;
    const d2 = request.query.d2 as string;
    const b1 = request.query.b1 as string;
    const b2 = request.query.b2 as string;
    const alphaM = request.query.m as string;
    const alphaN = request.query.n as string;
    const color = request.query.color as string;
    const ra = request.query.ra as string;
    const ri = request.query.ri as string;
    const seed = request.query.seed as string;
    
    //if (!petName || !ownerName) throw new Error('Pet and owner names required');
    // console.log(`INSERT INTO Settings (id, d1, d2, b1, b2, alphaM, alphaN, color, ra, ri, seed) VALUES (${id}, ${d1}, ${d2}, ${b1}, ${b2}, ${alphaM}, ${alphaN}, ${color}, ${ra}, ${ri}, ${seed});`)
    await sql`INSERT INTO settings (user_id, id, d1, d2, b1, b2, alpham, alphan, color, ra, ri, seed) VALUES (${user_id},${id}, ${d1}, ${d2}, ${b1}, ${b2}, ${alphaM}, ${alphaN}, ${color}, ${ra}, ${ri}, ${seed});`;
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error });
  }
 
}
//http://localhost:3000/api/add_settings?user_id=1111111&id=2&d1=0.123&d2=0.431&b1=0.7&b2=0.999&m=0.654&n=0.222&color=2&ra=12&ri=4&seed=0