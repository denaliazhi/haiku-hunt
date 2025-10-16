/**
 * Queries to interact with SQL database.
 */
import pool from "./dbConnection.js";

/* Get all distinct entries for fountains that 
   still exist and are explicitly named 'fountain'*/
async function getAllEntries() {
  const sql = `
  SELECT *
  FROM (
    SELECT *, ROW_NUMBER() OVER(PARTITION BY number ORDER BY (SELECT NULL)) as dupeCount
    FROM fountains 
    WHERE extant = 'Y' AND name ILIKE '%fountain%'
  ) WHERE dupeCount = 1
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

async function filterByBorough(borough) {
  const sql = `
  SELECT *
  FROM (
    SELECT *, ROW_NUMBER() OVER(PARTITION BY number ORDER BY (SELECT NULL)) as dupeCount
    FROM fountains 
    WHERE extant = 'Y' AND name ILIKE '%fountain%'
  ) WHERE dupeCount = 1 AND borough ILIKE '%${borough}%'
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

async function getAllBoroughs() {
  const sql = `
  SELECT borough
  FROM fountains
  WHERE extant = 'Y' AND name ILIKE '%fountain%'
  GROUP BY borough
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

// console.log(await filterByBorough("Manhattan"));

export { getAllEntries, filterByBorough, getAllBoroughs };
