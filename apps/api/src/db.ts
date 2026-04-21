import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://aperture:aperture@localhost:5432/aperture"
});

export async function query<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, values);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
