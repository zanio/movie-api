const db = require('../persistence/db');
module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE comment
      ADD COLUMN ip varchar(120);
`);

  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE comment
    DROP COLUMN ip;
  `);

  await client.release(true);
  next()
}
