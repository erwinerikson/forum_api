const AddThread = require('../../../Domains/threads/entities/AddThread');
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
    const useCasePayload = {
      owner: 'user-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const expectedAddedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    // Create the use case instace
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    // Action
    const addThread = await addThreadUseCase.execute(new AddThread(useCasePayload));

    // Assert
    expect(addThread).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: 'user-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    }));
  });
});
