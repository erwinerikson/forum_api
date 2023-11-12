const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
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
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const addComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentRepositoryPostgres.addComment(addComment);
  
      // Action
      const reply = await replyRepositoryPostgres.addReply(addReply);
  
      // Assert
      expect(reply).toEqual({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      });
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
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-321',
      });
      const addComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-321',
        owner: 'user-321',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyAddRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentRepositoryPostgres.addComment(addComment);
      await replyAddRepositoryPostgres.addReply(addReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.findRepliesById('reply-321');

      // Assert
      expect(reply).toStrictEqual('reply-321');
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
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-321',
      });
      const addComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-321',
        owner: 'user-321',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      });
      const findOwnerReply = {
        id: 'reply-321',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      };
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyAddRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentRepositoryPostgres.addComment(addComment);
      await replyAddRepositoryPostgres.addReply(addReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action
      const reply = await replyRepositoryPostgres.findRepliesByOwner(findOwnerReply);
  
      // Assert
      expect(reply).toEqual('reply-321');
    });
  });

  describe('readReply function', () => {
    it('should return reply id correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-321',
      });
      const addComment = new AddComment({
        content: 'sebuah content',
        thread: 'thread-321',
        owner: 'user-321',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyAddRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentRepositoryPostgres.addComment(addComment);
      await replyAddRepositoryPostgres.addReply(addReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    
      // Action & Assert
      await expect(replyRepositoryPostgres.readReply({ id: 'thread-321' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should throw NotFoundError when replyId not found', async () => {
      // Arrange
      const payloadDeleteReply = {
        reply: 'reply-321',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(payloadDeleteReply))
        .rejects
        .toThrowError('Gagal menghapus balasan. Id tidak ditemukan');
    });

    it('should return reply id correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-321',
      });
      const addComment = new AddComment({
        content: 'sebuah content',
        thread: 'thread-321',
        owner: 'user-321',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      });
      const findOwnerReply = {
        id: 'reply-321',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      };
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyAddRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentRepositoryPostgres.addComment(addComment);
      await replyAddRepositoryPostgres.addReply(addReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.findRepliesByOwner(findOwnerReply);
      
      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply({ reply: 'reply-321' }))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
