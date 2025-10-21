/**
 * Queries to interact with landmarks table in SQL database.
 */
import pool from "../dbConnection.js";

/* Get a landmark by its unique id */
async function getLandmark(id) {
  const sql = `
  SELECT *
  FROM landmarks
  WHERE id = $1
  ;`;
  const { rows } = await pool.query(sql, [id]);
  return rows;
}

// Joins landmarks and clues tables
const baseQuery = `
  WITH ranked_clues AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY landmarkId ORDER BY votes DESC) AS ranking
    FROM clues
  )
  SELECT *
  FROM landmarks f 
  LEFT JOIN ranked_clues c ON f.id = c.landmarkId `;

/* Get all landmarks and each landmark's top clue (if it exists) */
async function getAllEntries() {
  const query = baseQuery + `WHERE c.ranking = 1 OR c.ranking IS NULL`;
  const { rows } = await pool.query(query);
  return rows;
}

/* Get landmarks located in a borough */
async function filterByBorough(borough) {
  const query =
    baseQuery +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND borough ILIKE $1;`;
  const { rows } = await pool.query(query, [`%${borough}%`]);
  return rows;
}

/* Get landmarks with a name matching 
   (all or part of) the search term */
async function filterByName(term) {
  const query =
    baseQuery + `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND name ILIKE $1;`;
  const { rows } = await pool.query(query, [`%${term}%`]);
  return rows;
}

/* Get all boroughs where landmarks are located */
async function getAllBoroughs() {
  const query = `
  SELECT DISTINCT borough
  FROM landmarks
  ;`;
  const { rows } = await pool.query(query);
  return rows;
}

export {
  getLandmark,
  getAllEntries,
  filterByBorough,
  filterByName,
  getAllBoroughs,
};
