/**
 * Create connection pool for SQL database.
 */
import { Pool } from "pg";

const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

export default new Pool({
  connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
});
