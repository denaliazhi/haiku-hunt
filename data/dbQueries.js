/**
 * Queries to interact with SQL database.
 */
import pool from "./dbConnection.js";

/* Get all distinct entries for fountains that 
   still exist and are explicitly named 'fountain'*/
async function getAllEntries() {
  const sql = `
  SELECT DISTINCT *
  FROM fountains
  WHERE extant = 'Y' AND name ILIKE '%fountain%'
  ;`;
  const { rows } = await pool.query(sql);
  return rows;
}

export { getAllEntries };
