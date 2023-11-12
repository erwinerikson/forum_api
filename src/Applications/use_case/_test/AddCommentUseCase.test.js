const AddComment = require('../../../Domains/comments/entities/AddComment');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
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
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
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
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockResponseAddComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Mocking
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockUserRepository.findUsersById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.owner));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseAddComment));

    // Action
    const addComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadsById).toBeCalledWith('thread-123');
    expect(mockUserRepository.findUsersById).toBeCalledWith(useCasePayload.owner);
    expect(addComment).toStrictEqual(mockResponseAddComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: 'user-123',
    }));
  });
});
