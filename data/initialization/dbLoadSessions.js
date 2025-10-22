/**
 * Query to load `session` table into SQL database.
 * RECOMMENDED: Run dbLoadAll.js.
 */

const sessionQuery = ` 
    DROP TABLE IF EXISTS session;

    CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
    ) WITH (OIDS=FALSE);

    ALTER TABLE session
        ADD CONSTRAINT session_pkey PRIMARY KEY 
        ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX IDX_session_expire ON session ("expire");
`;

export { sessionQuery };
