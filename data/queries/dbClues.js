/**
 * Queries to interact with clues table in SQL database.
 */
import pool from "../dbConnection.js";

/* Get clues for a fountain */
async function getFountainClues(id) {
  const sql = `
  SELECT *
  FROM clues
  WHERE fountainId = $1
  ;`;
  const { rows } = await pool.query(sql, [id]);
  return rows;
}

export { getFountainClues };
