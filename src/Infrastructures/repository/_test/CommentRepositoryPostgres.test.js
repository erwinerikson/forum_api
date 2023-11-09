const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
        
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return comment data correctly', async () => {
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
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);

      // Action
      const comment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(comment).toEqual({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      });
    });
  });

  describe('findCommentsById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentsById('comment-123'))
        .rejects
        .toThrowError('comment tidak ditemukan');
    });

    it('should return comment id correctly', async () => {
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
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentAddRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentAddRepositoryPostgres.addComment(addComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentId = await commentRepositoryPostgres.findCommentsById('comment-321');

      // Assert
      expect(commentId).toHaveLength(1);
    });
  });

  describe('findCommentsByOwner function', () => {
    it('should throw AuthenticationError when comment not found', async () => {
      // Arrange
      const findOwnerComment = {
        comment: 'comment-321',
        thread: 'thread-321',
        owner: 'user-321',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentsByOwner(findOwnerComment))
        .rejects
        .toThrowError('Missing Authentication to Access');
    });

    it('should return comment id correctly', async () => {
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
      const findOwnerComment = {
        comment: 'comment-321',
        thread: 'thread-321',
        owner: 'user-321',
      };
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentAddRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentAddRepositoryPostgres.addComment(addComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action
      const comment = await commentRepositoryPostgres.findCommentsByOwner(findOwnerComment);
  
      // Assert
      expect(comment).toEqual({
        id: 'comment-321',
      });
    });
  });

  describe('readComment function', () => {
    it('should return comment id correctly', async () => {
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
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentAddRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentAddRepositoryPostgres.addComment(addComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
      // Action & Assert
      await expect(commentRepositoryPostgres.readComment('comment-321')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when commentId not found', async () => {
      // Arrange
      const payloadDeleteComment = {
        comment: 'comment-321',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(payloadDeleteComment))
        .rejects
        .toThrowError('Gagal menghapus comment. Id tidak ditemukan');
    });

    it('should return comment id correctly', async () => {
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
      const findOwnerComment = {
        comment: 'comment-321',
        thread: 'thread-321',
        owner: 'user-321',
      };
      const fakeIdGenerator = () => '321'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentAddRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(addThread);
      await commentAddRepositoryPostgres.addComment(addComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.findCommentsByOwner(findOwnerComment);
      
      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment({ comment: 'comment-321' })).resolves.not.toThrowError(NotFoundError);
    });
  });
});
