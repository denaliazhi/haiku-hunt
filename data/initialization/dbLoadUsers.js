/**
 * Query to load `users` table into SQL database.
 * RECOMMENDED: Run dbLoadAll.js.
 */

const usersQuery = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE
    );

    INSERT INTO clues (username, password, admin) VALUES %L;
`;

export { usersQuery };
