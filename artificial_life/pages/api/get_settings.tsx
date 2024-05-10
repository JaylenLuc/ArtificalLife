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
        const id = request.query.id as string;
        const resp = await sql`SELECT * FROM Settings WHERE id=${id};`;
        return response.status(200).json({ resp });
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
  //http://localhost:3000/api/get_settings?id=2