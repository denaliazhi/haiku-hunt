/**
 * Queries to interact with SQL database.
 */
import pool from "./dbConnection.js";

async function getFountain(id) {
  const sql = `
  SELECT *
  FROM fountains
  WHERE id = $1
  ;`;
  const { rows } = await pool.query(sql, [id]);
  return rows;
}

/* Get all distinct entries for fountains that 
   still exist and are explicitly named 'fountain'*/
async function getAllEntries() {
  const sql = `
  SELECT *
  FROM fountains
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

async function filterByBorough(borough) {
  const sql = `
  SELECT *
  FROM fountains 
  WHERE borough ILIKE $1
  ;`;
  const { rows } = await pool.query(sql, [`%${borough}%`]);
  return rows;
}

async function filterByName(name) {
  const sql = `
  SELECT *
  FROM fountains 
  WHERE name ILIKE $1
  ;`;
  const { rows } = await pool.query(sql, [`%${name}%`]);
  return rows;
}

async function getAllBoroughs() {
  const sql = `
  SELECT borough
  FROM fountains
  GROUP BY borough
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

// console.log(await filterByBorough("Manhattan"));

export {
  getFountain,
  getAllEntries,
  filterByBorough,
  filterByName,
  getAllBoroughs,
};
