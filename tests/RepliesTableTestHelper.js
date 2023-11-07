/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', comment = 'comment-123', thread = 'thread-123', content = 'sebuah reply', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', updatedAt = '2021-08-08T07:19:09.775Z', is_delete = '0',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, thread, comment, content, owner, date, updatedAt, is_delete],
    };
          
    const result = await pool.query(query);
    return result;
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
  
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  },

  async findRepliesByOwner({
    id = 'comment-123', thread = 'thread-123', comment = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND thread = $2 AND comment = $3 AND owner = $4 RETURNING id',
      values: [id, thread, comment, owner],
    };
  
    const result = await pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread, komentar atau balasan tidak ditemukan');
    }

    return result;
  },

  async readReply(id) {
    const query = {
      text: `SELECT replies.id, users.username, replies.date, replies.content FROM replies
      LEFT JOIN users ON users.id = replies.owner
      WHERE replies.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteReply(id) {
    const updatedAt = '2021-08-08T07:19:09.775Z';
    const is_delete = 1;
    const query = {
      text: 'UPDATE replies SET updated_at = $1, is_delete = $2 WHERE id = $3',
      values: [updatedAt, is_delete, id],
    };
      
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus balasan. Id tidak ditemukan');
    }
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
