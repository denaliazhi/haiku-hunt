/**
 * Queries to interact with SQL database.
 */
import pool from "./dbConnection.js";

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

/* Get all fountains */
async function getAllEntries() {
  const sql = `
  SELECT *
  FROM fountains
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

/* Get fountains located in a borough */
async function filterByBorough(borough) {
  const sql = `
  SELECT *
  FROM fountains 
  WHERE borough ILIKE $1
  ;`;
  const { rows } = await pool.query(sql, [`%${borough}%`]);
  return rows;
}

/* Get fountains with a name matching 
   (all or part of) the search term */
async function filterByName(term) {
  const sql = `
  SELECT *
  FROM fountains 
  WHERE name ILIKE $1
  ;`;
  const { rows } = await pool.query(sql, [`%${term}%`]);
  return rows;
}

/* Get all boroughs where fountains are located */
async function getAllBoroughs() {
  const sql = `
  SELECT DISTINCT borough
  FROM fountains
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

export {
  getFountain,
  getAllEntries,
  filterByBorough,
  filterByName,
  getAllBoroughs,
};
