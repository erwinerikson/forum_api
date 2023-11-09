const AddReply = require('../../../Domains/replies/entities/AddReply');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {
      owner: 'user-123',
    };
    
    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {
      content: true,
      thread: 'thread-123',
      comment: 1,
      owner: 'user-123',
    };

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add reply action correctly', async () => {
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
      content: 'sebuah balasan',
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockResponseAddReply = {
      id: 'reply-123',
      content: useCasePayload.title,
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });
    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
    mockCommentRepository.findCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.comment));
    mockUserRepository.findUsersById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser.id));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseAddReply));

    // Action
    const addReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayloadUser.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayloadUser.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayloadUser.username,
      password: 'encrypted_password',
      fullname: useCasePayloadUser.fullname,
    }));
    expect(mockThreadRepository.findThreadsById).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.findCommentsById).toBeCalledWith(useCasePayload.comment);
    expect(mockUserRepository.findUsersById).toBeCalledWith(mockRegisteredUser.id);
    expect(addReply).toStrictEqual(mockResponseAddReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: 'sebuah balasan',
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    }));
  });
});
