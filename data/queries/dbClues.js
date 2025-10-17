/**
 * Queries to interact with clues table in SQL database.
 */
import pool from "../dbConnection.js";
import format from "pg-format";

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

async function addClue(values) {
  const sql = `
  INSERT INTO clues (fountainId, haiku_line_1, haiku_line_2, haiku_line_3, author)
  VALUES %L
  ;`;
  try {
    await pool.query(format(sql, [values]));
  } catch (err) {
    console.log(err);
    throw new Error("Error adding clue to database.");
  }
}

export { getFountainClues, addClue };
