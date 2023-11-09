const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ReplyRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      thread, comment, content, owner,
    } = reply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const is_delete = 0;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, content, owner',
      values: [id, thread, comment, content, owner, date, date, is_delete],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    return result.rows;
  }

  async findRepliesByOwner(reply) {
    const {
      id, thread, comment, owner, 
    } = reply;
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND thread = $2 AND comment = $3 AND owner = $4',
      values: [id, thread, comment, owner],
    };
  
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Missing Authentication to Access');
    }

    return result.rows[0];
  }

  async readReply(reply) {
    const { id } = reply;
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete FROM replies
        LEFT JOIN users ON users.id = replies.owner
        WHERE replies.thread = $1 ORDER BY date ASC`,
      values: [id],
    };
  
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReply(reply) {
    const { reply: id } = reply;
    const updatedAt = new Date().toISOString();
    const is_delete = 1;
    const query = {
      text: 'UPDATE replies SET updated_at = $1, is_delete = $2 WHERE id = $3 RETURNING id',
      values: [updatedAt, is_delete, id],
    };
        
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus balasan. Id tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = ReplyRepositoryPostgres;
