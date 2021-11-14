const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  async create(content) {
    try {

      const {rows} = await db.query(sql`
      INSERT INTO comments (id, contents)
        VALUES (${uuidv4()}, ${content})
        RETURNING id, content;
      `);

      const [comments] = rows;
      return comments;
    } catch (error) {
      if (error.constraint === 'comments_key') {
        return null;
      }

      throw error;
    }
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM comments WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  }
};
