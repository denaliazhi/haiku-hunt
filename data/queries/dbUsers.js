/**
 * Queries to interact with user-related data in SQL database.
 */
import pool from "../dbConnection.js";
import format from "pg-format";
import { upVote, downVote } from "./dbClues.js";
import { baseQuery } from "./dbLandmarks.js";

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
    SELECT *, s.userId AS is_saved FROM clues c
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
  WITH solved AS (
    SELECT l.id, l.name, l.borough, sl.userId as is_solved
    FROM landmarks l
    JOIN solved_landmarks sl ON l.id = sl.landmarkId
    WHERE sl.userId = $1
  ),
  ranked_clues AS (
    SELECT c.*, ROW_NUMBER() OVER (PARTITION BY c.landmarkId ORDER BY c.votes DESC) AS ranking
    FROM clues c
    JOIN solved_landmarks sl ON c.landmarkId = sl.landmarkId
    WHERE sl.userId = $1
  )
  SELECT *
  FROM solved s 
  LEFT JOIN ranked_clues rc ON s.id = rc.landmarkId
  WHERE rc.ranking = 1 OR rc.ranking IS NULL
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
    upVote(clueId);
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
    downVote(clueId);
  }
}

/* Credit solved landmark to user */
async function solveLandmark(userId, landmarkId) {
  const sql = `
    INSERT INTO solved_landmarks VALUES %L
    ON CONFLICT DO NOTHING
  ;`;
  try {
    await pool.query(format(sql, [[userId, landmarkId]]));
  } catch (err) {
    throw new Error("Failed to update landmark's status");
  }
}

/* Check if user has solved landmark */
async function checkSolved(userId, landmarkId) {
  const sql = `
    SELECT * FROM solved_landmarks
    WHERE userId = $1 AND landmarkId = $2
  ;`;
  const { rows } = await pool.query(sql, [userId, landmarkId]);
  return rows;
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
  solveLandmark,
  checkSolved,
};
