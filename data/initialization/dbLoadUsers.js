/**
 * Queries to load user-related tables into SQL database.
 * RECOMMENDED: Run dbLoadAll.js.
 */

/* Create `users` table in SQL database and populate
   it with the data for initial users */
const usersQuery = `
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE
    );

    INSERT INTO users (username, password, admin) VALUES %L;
`;

/* Create `saved_clues` table in SQL database  */
const savedCluesQuery = `
    DROP TABLE IF EXISTS saved_clues;

    CREATE TABLE IF NOT EXISTS saved_clues (
        userId INTEGER REFERENCES users(userId) ON DELETE CASCADE,
        clueId INTEGER REFERENCES clues(clueId) ON DELETE CASCADE,
        PRIMARY KEY(userId, clueId)
    );
`;

/* Create `solved_landmarks` table in SQL database  */
const solvedLandmarksQuery = `
    DROP TABLE IF EXISTS solved_landmarks;

    CREATE TABLE IF NOT EXISTS solved_landmarks (
        userId INTEGER REFERENCES users(userId) ON DELETE CASCADE,
        landmarkId INTEGER REFERENCES landmarks(id) ON DELETE CASCADE,
        PRIMARY KEY(userId, landmarkId)
    );
`;

export { usersQuery, savedCluesQuery, solvedLandmarksQuery };
