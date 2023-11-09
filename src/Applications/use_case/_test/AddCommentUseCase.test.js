const AddComment = require('../../../Domains/comments/entities/AddComment');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');
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

  it('should throw error if thread not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      thread: 'thread',
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

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    // User
    const useCasePayloadUser = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayloadUser.username,
      fullname: useCasePayloadUser.fullname,
    });

    const useCasePayload = {
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockResponseAddComment = {
      id: 'comment-123',
      title: 'sebuah comment',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Mocking
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    await getUserUseCase.execute(useCasePayloadUser);
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockUserRepository.findUsersById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser.id));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseAddComment));

    // Action
    const addComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayloadUser.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayloadUser.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayloadUser.username,
      password: 'encrypted_password',
      fullname: useCasePayloadUser.fullname,
    }));
    expect(mockThreadRepository.findThreadsById).toBeCalledWith(useCasePayload.thread);
    expect(mockUserRepository.findUsersById).toBeCalledWith(mockRegisteredUser.id);
    expect(addComment).toStrictEqual(mockResponseAddComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: 'user-123',
    }));
  });
});
