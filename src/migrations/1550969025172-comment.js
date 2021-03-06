const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS comment (
    id uuid PRIMARY KEY,
    message varchar(500) NOT NULL,
    movie_id INTEGER NOT NULL,
    created_at timestamp default current_timestamp

    );
  `);

  await client.query(`
  CREATE INDEX common_id on comment (id);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE comment;
  `);

  await client.release(true);
  next();
};
