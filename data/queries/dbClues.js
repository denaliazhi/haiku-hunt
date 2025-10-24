/**
 * Queries to interact with clues table in SQL database.
 */
import pool from "../dbConnection.js";
import format from "pg-format";

/* Add a clue to the table */
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

/* Increment the total votes on a clue */
async function upVote(clueId) {
  const sql = `UPDATE clues SET votes = votes + 1 WHERE clueId = $1;`;
  try {
    const result = await pool.query(sql, [clueId]);
  } catch (err) {
    console.log(
      "The clue was saved, but total votes could not be updated: ",
      err
    );
  }
}

/* Decrement the total votes on a clue */
async function downVote(clueId) {
  const sql = `UPDATE clues SET votes = votes - 1 WHERE clueId = $1;`;
  try {
    const result = await pool.query(sql, [clueId]);
  } catch (err) {
    console.log(
      "The clue was unsaved, but total votes could not be updated: ",
      err
    );
  }
}

export { addClue, upVote, downVote };
