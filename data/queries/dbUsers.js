/**
 * Queries to interact with user-related data in SQL database.
 */
import pool from "../dbConnection.js";

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

export { addUser, findUser, getPublished, deleteClue };
