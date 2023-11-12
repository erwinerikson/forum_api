const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async findThreadsById(id) {
    const query = {
      text: 'SELECT threads.id FROM threads WHERE id = $1',
      values: [id],
    };
    
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0].id;
  }

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
  }
}

module.exports = ThreadRepositoryPostgres;
