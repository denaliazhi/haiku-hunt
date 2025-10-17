/**
 *  One-time script to load clues into SQL database.
 */

import { Client } from "pg";
import format from "pg-format";
import clues from "./initialClues.js";

// Params for database connection
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

/* Create `clues` table in SQL database and populate
   it with the initial data */
const initialQuery = `
    DROP TABLE IF EXISTS clues;

    CREATE TABLE IF NOT EXISTS clues (
        clueId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        fountainId INTEGER REFERENCES fountains(id),
        author VARCHAR(20) DEFAULT 'Anonymous',
        haiku_line_1 VARCHAR(255) NOT NULL,
        haiku_line_2 VARCHAR(255) NOT NULL,
        haiku_line_3 VARCHAR(255) NOT NULL,
        submitted DATE DEFAULT CURRENT_DATE,
        votes INTEGER DEFAULT 0
    );

    INSERT INTO clues (fountainId, author, haiku_line_1, haiku_line_2, haiku_line_3) VALUES %L;
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  });
  await client.connect();
  console.log("Connected!");

  try {
    console.log(format(initialQuery, clues));
    await client.query(format(initialQuery, clues));
    console.log("Table initialized.");
  } catch (err) {
    console.log(err);
  }

  await client.end();
  console.log("Done.");
}

main();
