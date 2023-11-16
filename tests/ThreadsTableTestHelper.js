/* istanbul ignore file */
const NotFoundError = require('../src/Commons/exceptions/NotFoundError');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'sebuah thread', body = 'sebuah body thread', owner = 'user-123', date = '2021-08-08T07:19:09.775Z',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };
  
    const result = await pool.query(query);
    return result.rows[0];
  },
  
  async findThreadsById(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };
  
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0].id;
  },

  async readThread(thread) {
    const { id } = thread;
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  },
  
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};
  
module.exports = ThreadsTableTestHelper;
