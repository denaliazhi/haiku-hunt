/**
 *  One-time script to initialize all tables in SQL database.
 */

import { Client } from "pg";
import format from "pg-format";

import { sessionQuery } from "./dbLoadSessions.js";
import {
  usersQuery,
  savedCluesQuery,
  solvedLandmarksQuery,
} from "./dbLoadUsers.js";
import getInitialUser from "./initialUsers.js";
import { getFountainsFromAPI } from "./initialLandmarks.js";
import {
  landmarksQuery,
  filterLandmarksQuery,
  formatAllRows,
} from "./dbLoadLandmarks.js";
import { cluesQuery } from "./dbLoadClues.js";
import clues from "./initialClues.js";

// Params for database connection
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  });
  await client.connect();
  console.log("Connected!");

  // Initial landmarks are fountains in NYC
  const data = await getFountainsFromAPI();
  console.log("Data retrieved from API:", data.length);

  try {
    await client.query(sessionQuery);
    console.log("Session table initialized.");

    await client.query(format(landmarksQuery, formatAllRows(data)));
    await client.query(filterLandmarksQuery);
    console.log("Landmarks table initialized and filtered.");

    const initialUser = await getInitialUser();
    await client.query(format(usersQuery, initialUser));
    console.log("All users table initialized.");

    await client.query(format(cluesQuery, clues));
    console.log("Clues table initialized.");

    await client.query(savedCluesQuery);
    await client.query(solvedLandmarksQuery);
    console.log("User-specific tables initialized.");
  } catch (err) {
    console.log(err);
  }

  await client.end();
  console.log("Done.");
}

main();
