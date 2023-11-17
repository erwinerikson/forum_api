const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
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
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const payloadAddComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const expectedAddComment = {
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addComment = await commentRepositoryPostgres.addComment(payloadAddComment);

      // Assert
      const commentId = await commentRepositoryPostgres.findCommentsById(expectedAddComment.id);
      expect(addComment).toEqual(expectedAddComment);
      expect(commentId).toEqual(expectedAddComment.id);
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
      const expectedIdComment = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentId = await commentRepositoryPostgres.findCommentsById('comment-123');

      // Assert
      expect(commentId).toStrictEqual(expectedIdComment);
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

    it('should return comment owner correctly', async () => {
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
      const findOwnerComment = {
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      };
      const expectedIdComment = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action
      const comment = await commentRepositoryPostgres.findCommentsByOwner(findOwnerComment);
  
      // Assert
      expect(comment).toEqual(expectedIdComment);
    });
  });

  describe('readComment function', () => {
    it('should return comment correctly', async () => {
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
      const expectedReadComment = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:19:09.775Z',
          content: 'sebuah comment',
          is_delete: 0,
        },
      ];
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
      // Action
      const readComment = await commentRepositoryPostgres.readComment({ id: 'thread-123' });

      // Assert
      expect(readComment).toStrictEqual(expectedReadComment);
    });
  });

  describe('deleteComment function', () => {
    it('should return comment id correctly', async () => {
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
      const expectedDeleteComment = 1;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action
      const deleteComment = await commentRepositoryPostgres.deleteComment({ comment: 'comment-123' });

      // Assert
      expect(deleteComment).toStrictEqual(expectedDeleteComment);
    });
  });
});
