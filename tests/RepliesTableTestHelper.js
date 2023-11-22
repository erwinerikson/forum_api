/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', comment = 'comment-123', thread = 'thread-123', content = 'sebuah reply', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', is_delete = '0',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, content, owner',
      values: [id, thread, comment, content, owner, date, date, is_delete],
    };
          
    const result = await pool.query(query);
    return result.rows[0];
  },

  async getReply(reply) {
    const { id } = reply;
    const query = {
      text: `SELECT replies.id, replies.comment, users.username, replies.date, replies.content, replies.is_delete FROM replies
      LEFT JOIN users ON users.id = replies.owner
      WHERE replies.thread = $1 ORDER BY date ASC`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteReply(id) {
    const updatedAt = '2021-08-08T07:19:09.775Z';
    const is_delete = 1;
    const query = {
      text: 'UPDATE replies SET updated_at = $1, is_delete = $2 WHERE id = $3 RETURNING is_delete',
      values: [updatedAt, is_delete, id],
    };
      
    const result = await pool.query(query);
    return result.rows[0].is_delete;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
