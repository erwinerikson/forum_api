const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
    };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      title: true,
      body: 'sebuah body thread',
    };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add thread action correctly', async () => {
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
      owner: 'user-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const mockResponseAddThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockThreadRepository = new ThreadRepository();
    // Create the use case instace
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });
    const addThreadUseCase = new AddThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    await getUserUseCase.execute(useCasePayloadUser);
    mockUserRepository.findUsersById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser.id));
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseAddThread));

    // Action
    const addThread = await addThreadUseCase.execute(new AddThread(useCasePayload));

    // Assert
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayloadUser.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayloadUser.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayloadUser.username,
      password: 'encrypted_password',
      fullname: useCasePayloadUser.fullname,
    }));
    expect(mockUserRepository.findUsersById).toBeCalledWith(mockRegisteredUser.id);
    expect(addThread).toStrictEqual(mockResponseAddThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: 'user-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    }));
  });
});
