const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });
            
  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return reply data correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const payloadAddReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const expectedAddReply = {
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
  
      // Action
      const addReply = await replyRepositoryPostgres.addReply(payloadAddReply);
  
      // Assert
      const replyId = await replyRepositoryPostgres.findRepliesById(expectedAddReply.id);
      expect(addReply).toEqual(expectedAddReply);
      expect(replyId).toEqual(expectedAddReply.id);
    });
  });

  describe('findRepliesById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.findRepliesById('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return reply id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedIdReply = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.findRepliesById('reply-123');

      // Assert
      expect(reply).toStrictEqual(expectedIdReply);
    });
  });

  describe('findRepliesByOwner function', () => {
    it('should throw AuthenticationError when reply not found', async () => {
      // Arrange
      const findOwnerReply = {
        id: 'reply-321',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.findRepliesByOwner(findOwnerReply))
        .rejects
        .toThrowError('Missing Authentication to Access');
    });

    it('should return reply id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const findOwnerReply = {
        id: 'reply-123',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      };
      const expectedIdReply = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action
      const reply = await replyRepositoryPostgres.findRepliesByOwner(findOwnerReply);
  
      // Assert
      expect(reply).toEqual(expectedIdReply);
    });
  });

  describe('readReply function', () => {
    it('should return reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedReadReply = [
        {
          id: 'reply-123',
          comment: 'comment-123',
          content: 'sebuah reply',
          date: '2021-08-08T07:19:09.775Z',
          username: 'dicoding',
          is_delete: 0,
        },
      ];
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    
      // Action
      const readReply = await replyRepositoryPostgres.readReply({ id: 'thread-123' });

      // Assert
      expect(readReply).toStrictEqual(expectedReadReply);
    });
  });

  describe('deleteReply function', () => {
    it('should return reply id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedDeleteReply = 1;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action
      const deleteReply = await replyRepositoryPostgres.deleteReply({ reply: 'reply-123' });

      // Assert
      expect(deleteReply).toStrictEqual(expectedDeleteReply);
    });
  });
});
