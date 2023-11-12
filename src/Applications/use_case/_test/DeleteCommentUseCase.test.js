const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {};
            
    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: true,
      owner: 'user-123',
    };

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if failed to delete', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };
    // Mock
    const mockResponseDeleteComment = 'Gagal menghapus comment. Id tidak ditemukan';
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentsByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseDeleteComment));

    // Action
    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deleteComment).toBe(mockResponseDeleteComment);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockResponseDeleteComment = {
      status: 'success',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockCommentRepository.findCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.comment));
    mockCommentRepository.findCommentsByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseDeleteComment));
    // Create the use case instace
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadsById).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.findCommentsById).toBeCalledWith(useCasePayload.comment);
    expect(mockCommentRepository.findCommentsByOwner).toBeCalledWith(useCasePayload);
    expect(deleteComment).toStrictEqual(mockResponseDeleteComment);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(new DeleteComment({
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    }));
  });
});
