/**
 *  Load data from API into database.
 */

import { getFountainsFromAPI } from "./apiConnection.js";
import dummyData from "./dummyData.js";
import FIELDS from "./queryFields.js";

function formatQuery(values) {
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

INSERT INTO messages VALUES ${values};
`;
  console.log(query);
  return query;
}

const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PWD;

async function main() {
  //   console.log("Seeding...");
  //   const client = new Client({
  //     connectionString: `postgres://${username}:${password}@${host}/${database}?sslmode=require`,
  //   });
  //   await client.connect();
  //   console.log("Connected!");

  //   const results = await getFountainsFromAPI();
  //   console.log(results[0]);
  //   const values = results
  //     .map(
  //       (result) =>
  //         `(${result.name}, ${result.borough}, ${result.parkname}, ${result.location}, ${result.architect}, ${result.categories}, ${result.dedicated}, ${result.x}, ${result.y}, 'www.placeholder.com')`
  //     )
  //     .join(",");

  //   await client.query(formatQuery(values));
  //   await client.end();
  //   console.log("Done");

  const values = dummyData
    .map((result) => {
      let ogFields = "";
      for (let field of FIELDS) {
        ogFields += ` ${result[field]},`;
      }
      let derivedField = "link to website"; // TO DO: replace link
      return `(${ogFields} ${derivedField})`;
    })
    .join(",");
  const formatted = formatQuery(values);
  console.log(formatted);
}

main();
