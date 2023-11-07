const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-123',
    };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_PAYLOAD');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-123',
      title: true,
      body: 'sebuah body thread',
    };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const mockResponseAddThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseAddThread));
    // Create the use case instace
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addThread).toStrictEqual(mockResponseAddThread);
  });
});
