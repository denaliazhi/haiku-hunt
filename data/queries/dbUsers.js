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

export { addUser, findUser, getPublished };
