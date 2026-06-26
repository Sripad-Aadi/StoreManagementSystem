import pool from './db.js'

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(60)  NOT NULL CHECK (char_length(name) >= 2),
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      address     VARCHAR(400),
      role        VARCHAR(10)  NOT NULL CHECK (role IN ('admin', 'user', 'owner')),
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stores (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(60)  NOT NULL CHECK (char_length(name) >= 2),
      email       VARCHAR(255) NOT NULL UNIQUE,
      address     VARCHAR(400),
      owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at  TIMESTAMPTZ  DEFAULT NOW()
    );

      CREATE TABLE IF NOT EXISTS ratings (
        id          SERIAL PRIMARY KEY,
        store_id    INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        value       SMALLINT NOT NULL CHECK (value BETWEEN 1 AND 5),
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (store_id, user_id)
      );
  `)

  console.log('Tables created')
}

export default createTables