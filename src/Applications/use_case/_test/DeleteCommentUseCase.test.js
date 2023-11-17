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

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockResponseDeleteComment = 1;

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Mocking
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentsByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
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
    expect(deleteComment).toStrictEqual(1);
    expect(mockThreadRepository.findThreadsById).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.findCommentsById).toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockCommentRepository.findCommentsByOwner).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(new DeleteComment({
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    }));
  });
});
