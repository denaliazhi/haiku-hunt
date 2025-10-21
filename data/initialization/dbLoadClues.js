/**
 *  Query to load `clues` table into SQL database.
 *  RECOMMENDED: Run dbLoadAll.js.
 */

// TO DO: replace author with userid
const cluesQuery = `
    DROP TABLE IF EXISTS clues;

    CREATE TABLE IF NOT EXISTS clues (
        clueId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        landmarkId INTEGER REFERENCES landmarks(id),
        author VARCHAR(20) DEFAULT 'Anonymous',
        haiku_line_1 VARCHAR(255) NOT NULL,
        haiku_line_2 VARCHAR(255) NOT NULL,
        haiku_line_3 VARCHAR(255) NOT NULL,
        submitted DATE DEFAULT CURRENT_DATE,
        votes INTEGER DEFAULT 0
    );

    INSERT INTO clues (landmarkId, author, haiku_line_1, haiku_line_2, haiku_line_3) VALUES %L;
`;

export { cluesQuery };
