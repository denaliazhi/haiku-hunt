/**
 * Queries to interact with clues table in SQL database.
 */
import pool from "../dbConnection.js";
import format from "pg-format";

/* Get clues for a landmark */
async function getLandmarkClues(landmarkId) {
  const sql = `
  SELECT *
  FROM clues
  WHERE landmarkId = $1
  ORDER BY votes DESC
  ;`;
  const { rows } = await pool.query(sql, [landmarkId]);
  return rows;
}

/* Get clues for a landmark, including whether
   any clues have been saved by current user */
async function getLandmarkCluesWithSaves(userId, landmarkId) {
  const sql = `
  SELECT c.*, s.userId AS is_saved
  FROM clues c
  LEFT JOIN saved_clues s 
    ON c.clueId = s.clueId AND s.userId = $1
  WHERE c.landmarkId = $2
  ORDER BY c.votes DESC
  ;`;
  const { rows } = await pool.query(sql, [userId, landmarkId]);
  return rows;
}

async function addClue(values) {
  const sql = `
  INSERT INTO clues (userId, landmarkId, haiku_line_1, haiku_line_2, haiku_line_3, author)
  VALUES %L
  ;`;
  try {
    await pool.query(format(sql, [values]));
  } catch (err) {
    console.log(err);
    throw new Error("Error adding clue to database.");
  }
}

export { getLandmarkClues, getLandmarkCluesWithSaves, addClue };
