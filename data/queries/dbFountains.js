/**
 * Queries to interact with fountains table in SQL database.
 */
import pool from "../dbConnection.js";

/* Get a fountain by its unique id */
async function getFountain(id) {
  const sql = `
  SELECT *
  FROM fountains
  WHERE id = $1
  ;`;
  const { rows } = await pool.query(sql, [id]);
  return rows;
}

// Joins fountains and clues tables
const baseQuery = `
  WITH ranked_clues AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY fountainId ORDER BY votes DESC) AS ranking
    FROM clues
  )
  SELECT *
  FROM fountains f 
  LEFT JOIN ranked_clues c ON f.id = c.fountainId `;

/* Get all fountains and each fountain's top clue (if it exists) */
async function getAllEntries() {
  const query = baseQuery + `WHERE c.ranking = 1 OR c.ranking IS NULL`;
  const { rows } = await pool.query(query);
  return rows;
}

/* Get fountains located in a borough */
async function filterByBorough(borough) {
  const query =
    baseQuery +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND borough ILIKE $1;`;
  const { rows } = await pool.query(query, [`%${borough}%`]);
  return rows;
}

/* Get fountains with a name matching 
   (all or part of) the search term */
async function filterByName(term) {
  const query =
    baseQuery + `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND name ILIKE $1;`;
  const { rows } = await pool.query(query, [`%${term}%`]);
  return rows;
}

/* Get all boroughs where fountains are located */
async function getAllBoroughs() {
  const query = `
  SELECT DISTINCT borough
  FROM fountains
  ;`;
  const { rows } = await pool.query(query);
  return rows;
}

export {
  getFountain,
  getAllEntries,
  filterByBorough,
  filterByName,
  getAllBoroughs,
};
