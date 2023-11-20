const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {
      owner: 'user-123',
    };
    
    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {
      content: true,
      thread: 'thread-123',
      owner: 'user-123',
    };

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };
    const expectedAddedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Mocking
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    // Action
    const addComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addComment).toStrictEqual({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });
    expect(mockThreadRepository.findThreadsById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      thread: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));
  });
});
