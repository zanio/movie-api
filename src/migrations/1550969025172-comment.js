const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY,
    content text UNIQUE,
    createAt NOW()
    password text
  );

  `);

  await client.query(`
  CREATE INDEX comments_id on comments (id);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE comments;
  `);

  await client.release(true);
  next();
};
