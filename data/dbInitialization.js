/**
 *  One-time script to load fountains data from API into SQL database.
 */

import { Client } from "pg";
import format from "pg-format";
import { getFountainsFromAPI } from "./apiConnection.js";
import FIELDS from "./queryFields.js";

// Params for database connection
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

/* Create `fountains` table in SQL database and populate
   it with the data for each fountain */
const initialQuery = `
  DROP TABLE IF EXISTS fountains;

  CREATE TABLE IF NOT EXISTS fountains (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR ( 255 ) NOT NULL,
      number INTEGER NOT NULL,
      borough VARCHAR ( 13 ) NOT NULL,
      parkname VARCHAR ( 255 ) DEFAULT 'N/A',
      location VARCHAR ( 255 ) DEFAULT 'N/A',
      extant CHAR(1),
      dedicated VARCHAR( 255 ),
      descrip VARCHAR( 255 ),
      architect VARCHAR ( 255 ) DEFAULT 'N/A',
      categories VARCHAR ( 255 ) DEFAULT 'N/A',
      x DECIMAL,
      y DECIMAL,
      url VARCHAR ( 255 )
  );

  INSERT INTO fountains (${FIELDS.join(", ") + ", url"}) VALUES %L;
`;

/* Delete irrelevant rows from `fountains` table
   that couldn't be filtered out of initial API call */
const filterQuery = `
  WITH dupes AS (
    SELECT *, row_number() OVER(PARTITION BY number ORDER BY id) AS dupeRank
    FROM fountains
  )
  DELETE 
  FROM fountains 
  WHERE id IN 
  ( SELECT id 
    FROM dupes 
    WHERE NOT (dupeRank = 1 AND extant = 'Y' AND name ILIKE '%fountain%'));
`;

/* Format data for all rows as comma-separated list */
function formatAllRows(data) {
  return data.map((entry) => formatRow(entry));
}

/* Helper function to format data for one row 
   (Also a comma-separated list) */
function formatRow(entry) {
  let allFields = [];
  for (let field of FIELDS) {
    // Exclude Socrata system fields that are also returned by API
    // Only format fields we originally requested
    const value = entry[field];
    allFields.push(
      !value
        ? null // Field wasn't returned from API for this entry
        : ["number", "x", "y"].includes(field)
        ? Number(entry[field])
        : String(entry[field])
    );
  }
  let derivedField = getFountainURL(entry["number"]);
  allFields.push(derivedField);
  return allFields;
}

/* Helper function to get NYC Parks page for the fountain */
function getFountainURL(id) {
  return `https://www.nycgovparks.org/art-and-antiquities/permanent-art-and-monuments/info?monId=${id}`;
}

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  });
  await client.connect();
  console.log("Connected!");

  const data = await getFountainsFromAPI();
  console.log("Data retrieved from API:", data.length);

  try {
    await client.query(format(initialQuery, formatAllRows(data)));
    console.log("Table initialized");

    await client.query(filterQuery);
    console.log("Table filtered down to relevant rows");
  } catch (err) {
    console.log(err);
  }

  await client.end();
  console.log("Done");
}

main();
