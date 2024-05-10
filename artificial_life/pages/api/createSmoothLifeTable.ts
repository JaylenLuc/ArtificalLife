import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
const listTables = async () => sql`
SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'settings';
`;
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    try {
      const result =
        await sql`CREATE TABLE Settings (user_id varchar(256), id INT, d1 FLOAT, d2 FLOAT, b1 FLOAT, b2 FLOAT, ra FLOAT, ri FLOAT, alphaM FLOAT, alphaN FLOAT, color FLOAT, seed FLOAT, PRIMARY KEY (user_id, id));`;
      return response.status(200).json({ result });
      const results = await listTables();

      console.log(results);
    } catch (error) {
      return response.status(500).json({ error });
    }
  }