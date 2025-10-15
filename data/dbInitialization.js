/**
 *  Load fountains data from API into SQL database.
 */

import { getFountainsFromAPI } from "./apiConnection.js";
import dummyData from "./dummyData.js";
import FIELDS from "./queryFields.js";

// Params for database connection
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

/* Create `fountains` table in SQL database and populate
   it with the formatted data for each fountain */
function initializeTable(data) {
  let query = `
    DROP TABLE IF EXISTS fountains;

    CREATE TABLE IF NOT EXISTS fountains (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    borough VARCHAR ( 13 ) NOT NULL,
    parkname VARCHAR ( 255 ) DEFAULT 'N/A',
    location VARCHAR ( 255 ) DEFAULT 'N/A',
    architect VARCHAR ( 255 ) DEFAULT 'N/A',
    categories VARCHAR ( 255 ) DEFAULT 'N/A',
    dedicated DATE,
    x DECIMAL NOT NULL,
    y DECIMAL NOT NULL,
    url VARCHAR ( 255 )
    );

    INSERT INTO messages VALUES ${formatAllRows(data)};
  `;
  console.log(query);
  return query;
}

/* Format data for all rows as comma-separated list */
function formatAllRows(data) {
  const rows = data.map((entry) => formatRow(entry));
  return rows.join(",");
}

/* Helper function to format data for one row 
   (Also a comma-separated list in parentheses) */
function formatRow(entry) {
  let apiFields = "";
  // Exclude Socrata system fields that are also returned by API
  // Only format fields we originally requested
  for (let field of FIELDS) {
    apiFields += ` ${entry[field]},`;
  }
  let derivedField = getFountainURL(entry["number"]);
  return `(${apiFields} ${derivedField})`;
}

/* Helper function to get NYC Parks page for the fountain */
function getFountainURL(id) {
  return `https://www.nycgovparks.org/art-and-antiquities/permanent-art-and-monuments/info?monId=${id}`;
}

async function main() {
  //   console.log("Seeding...");
  //   const client = new Client({
  //     connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  //   });
  //   await client.connect();
  //   console.log("Connected!");

  //   const data = await getFountainsFromAPI();
  //   console.log(results[0]);

  //   await client.query(initializeTable(data));
  //   await client.end();
  //   console.log("Done");

  const formatted = initializeTable(dummyData);
  console.log(formatted);
}

main();
