/**
 *  Queries to load `landmarks` table into SQL database.
 *  RECOMMENDED: Run dbLoadAll.js.
 */
import FIELDS from "./queryFields.js";

/* Create `landmarks` table in SQL database and populate
   it with the data for each landmark */
const landmarksQuery = `
  DROP TABLE IF EXISTS landmarks;

  CREATE TABLE IF NOT EXISTS landmarks (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(255) NOT NULL,
      number INTEGER NOT NULL,
      borough VARCHAR(13) NOT NULL,
      parkname VARCHAR(255) DEFAULT 'N/A',
      location VARCHAR (255) DEFAULT 'N/A',
      extant CHAR(1),
      dedicated VARCHAR(255),
      descrip VARCHAR(255),
      architect VARCHAR(255) DEFAULT 'N/A',
      categories VARCHAR(255) DEFAULT 'N/A',
      x DECIMAL,
      y DECIMAL,
      url VARCHAR(255)
  );

  INSERT INTO landmarks (${FIELDS.join(", ") + ", url"}) VALUES %L;
`;

/* Delete irrelevant rows from `landmarks` table
   that couldn't be filtered out of initial API call */
const filterLandmarksQuery = `
  WITH dupes AS (
    SELECT *, row_number() OVER(PARTITION BY number ORDER BY id) AS dupeRank
    FROM landmarks
  )
  DELETE 
  FROM landmarks 
  WHERE id IN 
  ( SELECT id 
    FROM dupes 
    WHERE NOT (dupeRank = 1 AND extant = 'Y' AND name ILIKE '%fountain%'));
`;

/* Format data for all rows as comma-separated list */
function formatAllRows(data) {
  return data.map((entry) => formatRow(entry));
}

/* Format data for one row as comma-separated list */
function formatRow(entry) {
  let allFields = [];
  for (let field of FIELDS) {
    // Exclude Socrata system fields returned by API
    // Only format fields we originally requested
    const value = entry[field];
    allFields.push(
      !value
        ? null // Field wasn't returned from API
        : ["number", "x", "y"].includes(field)
        ? Number(entry[field])
        : String(entry[field])
    );
  }
  let derivedField = getlandmarkURL(entry["number"]);
  allFields.push(derivedField);
  return allFields;
}

/* Helper function to get NYC Parks page for the landmark */
function getlandmarkURL(id) {
  return `https://www.nycgovparks.org/art-and-antiquities/permanent-art-and-monuments/info?monId=${id}`;
}

export { landmarksQuery, filterLandmarksQuery, formatAllRows };
