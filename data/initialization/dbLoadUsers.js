/**
 *  One-time script to create `users` table in SQL database.
 */

import { Client } from "pg";
import format from "pg-format";

// Params for database connection
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

/* SQL query to create `users` table */
const initialQuery = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE
    );
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  });
  await client.connect();
  console.log("Connected!");

  try {
    await client.query(initialQuery);
    console.log("Table initialized.");
  } catch (err) {
    console.log(err);
  }

  await client.end();
  console.log("Done.");
}

main();
