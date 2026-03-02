import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function logInteraction(data) {
  return pool.query(
    `INSERT INTO ai_logs
     (user_id, user_email, question, response, tokens_used)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      data.user_id,
      data.user_email,
      data.question,
      data.response,
      data.tokens_used
    ]
  );
}