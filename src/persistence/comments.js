const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  async create(payload) {
    const {content,movie_id,ip} = payload;
    try {
      const {rows} = await db.query(sql`
      INSERT INTO comment (id, message, movie_id, ip)
        VALUES (${uuidv4()}, ${content},${movie_id},${ip})
        RETURNING id, message,movie_id, ip;
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
    SELECT * FROM comment WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async findAll() {
    console.log(db)
    const {rows} = await db.query(sql`
    SELECT * FROM comment order by created_at desc ;
    `);
    return rows;
  },
  async findAllByMovieId(movie_id) {
    const {rows} = await db.query(sql`
    SELECT * FROM comment where movie_id = ${movie_id} order by created_at desc`);
    return rows;
  }

};
