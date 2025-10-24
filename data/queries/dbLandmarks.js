/**
 * Queries to interact with landmarks table in SQL database.
 */
import pool from "../dbConnection.js";

/* Get all boroughs where landmarks are located */
async function getAllBoroughs() {
  const query = `
  SELECT DISTINCT borough
  FROM landmarks
  ;`;
  const { rows } = await pool.query(query);
  return rows;
}

/* Get details for a landmark */
async function getLandmarkDetails(landmarkId) {
  const sql = `
  SELECT *
  FROM landmarks l
  LEFT JOIN clues c 
    ON l.id = c.landmarkId
  WHERE l.id = $1
  ORDER BY c.votes DESC
  ;`;
  const { rows } = await pool.query(sql, [landmarkId]);
  return rows;
}

/* Get details for a landmark, including data 
   for logged-in user (solved status and saved clues) */
async function getLandmarkDetailsUser(userId, landmarkId) {
  const sql = `
  WITH details AS (
    SELECT *
    FROM landmarks l
    LEFT JOIN clues c
      ON l.id = c.landmarkId
    WHERE l.id = $1
  )
  SELECT details.*,
    sc.userId AS is_saved,
    sl.userId AS is_solved
  FROM details
  LEFT JOIN saved_clues sc 
    ON details.clueId = sc.clueId AND sc.userId = $2
  LEFT JOIN solved_landmarks sl 
    ON details.id = sl.landmarkId AND sl.userId = $2
  ORDER BY details.votes DESC
  ;`;
  const { rows } = await pool.query(sql, [landmarkId, userId]);
  return rows;
}

// Subsequent base query when user isn't signed in:
// Join landmarks and clues tables
// And rank clues for each landmark by total votes
const baseQuery = `
  WITH ranked_clues AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY landmarkId ORDER BY votes DESC) AS ranking
    FROM clues
  )
  SELECT l.id, l.name, l.borough, c.*
  FROM landmarks l 
  LEFT JOIN ranked_clues c ON l.id = c.landmarkId `;

/* Get all landmarks and each landmark's top clue (if it exists) */
async function getAllEntries() {
  const query =
    baseQuery +
    `WHERE c.ranking = 1 OR c.ranking IS NULL 
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query);
  return rows;
}

/* Get landmarks located in a borough */
async function filterByBorough(borough) {
  const query =
    baseQuery +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND borough ILIKE $1 
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query, [`%${borough}%`]);
  return rows;
}

/* Get landmarks with a name matching 
   (all or part of) the search term */
async function filterByName(term) {
  const query =
    baseQuery +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND name ILIKE $1
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query, [`%${term}%`]);
  return rows;
}

// Subsequent base query when user is signed in:
const baseQueryUser = `
  WITH ranked_clues AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY landmarkId ORDER BY votes DESC) AS ranking
    FROM clues
  )
  SELECT l.id, l.name, l.borough, c.*, sl.userId as is_solved
  FROM landmarks l 
  LEFT JOIN ranked_clues c 
    ON l.id = c.landmarkId
  LEFT JOIN solved_landmarks sl 
    ON l.id = sl.landmarkId AND sl.userId = $1 `;

/* Get all landmarks and each landmark's top clue (if it exists) */
async function getAllEntriesUser(userId) {
  const query =
    baseQueryUser +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) 
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

/* Get landmarks located in a borough */
async function filterByBoroughUser(userId, borough) {
  const query =
    baseQueryUser +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND borough ILIKE $2 
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query, [userId, `%${borough}%`]);
  return rows;
}

/* Get landmarks with a name matching 
   (all or part of) the search term */
async function filterByNameUser(userId, term) {
  const query =
    baseQueryUser +
    `WHERE (c.ranking = 1 OR c.ranking IS NULL) AND name ILIKE $2
     ORDER BY c.ranking
     ;`;
  const { rows } = await pool.query(query, [userId, `%${term}%`]);
  return rows;
}

export {
  baseQuery,
  getLandmarkDetails,
  getLandmarkDetailsUser,
  getAllEntries,
  getAllEntriesUser,
  filterByBorough,
  filterByBoroughUser,
  filterByName,
  filterByNameUser,
  getAllBoroughs,
};
