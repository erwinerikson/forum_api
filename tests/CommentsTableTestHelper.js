/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', thread = 'thread-123', content = 'sebuah content', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', updatedAt = '2021-08-08T07:19:09.775Z', is_delete = '0',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, thread, content, owner, date, updatedAt, is_delete],
    };
      
    const result = await pool.query(query);
    return result.rows[0];
  },

  async readComment(comments) {
    const { id } = comments;
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments
      LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread = $1 ORDER BY date ASC`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async deleteComment(comments) {
    const { comment: id } = comments;
    const updatedAt = '2021-08-08T07:19:09.775Z';
    const is_delete = 1;
    const query = {
      text: 'UPDATE comments SET updated_at = $1, is_delete = $2 WHERE id = $3 RETURNING is_delete',
      values: [updatedAt, is_delete, id],
    };
      
    const result = await pool.query(query);
    return result.rows[0].is_delete;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
