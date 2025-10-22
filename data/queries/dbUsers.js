/**
 * Queries to interact with user-related data in SQL database.
 */
import pool from "../dbConnection.js";
import format from "pg-format";

/* Find user by username */
async function findUser(username) {
  const sql = `
    SELECT * FROM users WHERE username = $1
  ;`;
  const { rows } = await pool.query(sql, [username]);
  return rows;
}

/* Add a user */
async function addUser(username, password) {
  const sql = `
    INSERT INTO users (username, password) VALUES ($1, $2)
  ;`;
  const { rows } = await pool.query(sql, [username, password]);
  return rows;
}

/* Get all clues published by user */
async function getPublished(userId) {
  const sql = `
    SELECT * FROM clues c
    JOIN landmarks l ON c.landmarkId = l.id
    WHERE userId = $1
  ;`;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}

/* Get all clues saved by user */
async function getSaved(userId) {
  const sql = `
    SELECT * FROM clues c
    JOIN saved_clues s ON c.clueId = s.clueId
    JOIN landmarks l ON c.landmarkId = l.id
    WHERE s.userId = $1
  ;`;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}

/* Get all landmarks solved by user */
async function getSolved(userId) {
  const sql = `
    SELECT * FROM clues c
    JOIN solved_landmarks s ON c.landmarkId = s.landmarkId
    WHERE s.userId = $1
  ;`;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}

/* Delete clue with id */
async function deleteClue(clueId) {
  const sql = `
    DELETE FROM clues c
    WHERE clueId = $1
  ;`;
  try {
    await pool.query(sql, [clueId]);
  } catch (err) {
    throw new Error("Error: the clue could not be deleted.");
  }
  return;
}

/* Save clue with id */
async function saveClue(userId, clueId) {
  let sql = `
    INSERT INTO saved_clues VALUES %L 
    ON CONFLICT DO NOTHING
  ;`;
  let result;
  try {
    result = await pool.query(format(sql, [[userId, clueId]]));
  } catch (err) {
    throw new Error("The clue could not be saved.");
  }
  // Increment total votes for clue
  if (result.rowCount === 1) {
    sql = `UPDATE clues SET votes = votes + 1 WHERE clueId = $1;`;
    try {
      result = await pool.query(sql, [clueId]);
    } catch (err) {
      console.log(
        "The clue was saved, but total votes could not be updated: ",
        err
      );
    }
  }
}

/* Unsave clue with id */
async function unsaveClue(userId, clueId) {
  let sql = `
    DELETE FROM saved_clues 
    WHERE userId = $1 AND clueId = $2
  ;`;
  let result;
  try {
    result = await pool.query(sql, [userId, clueId]);
  } catch (err) {
    throw new Error("The clue could not be un-saved.");
  }
  // Decrement total votes for clue
  if (result.rowCount === 1) {
    sql = `UPDATE clues SET votes = votes - 1 WHERE clueId = $1;`;
    try {
      result = await pool.query(sql, [clueId]);
    } catch (err) {
      console.log(
        "The clue was unsaved, but total votes could not be updated: ",
        err
      );
    }
  }
}

export {
  addUser,
  findUser,
  getPublished,
  getSaved,
  getSolved,
  deleteClue,
  saveClue,
  unsaveClue,
};
