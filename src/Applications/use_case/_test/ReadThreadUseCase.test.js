const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReadThreadUseCase = require('../ReadThreadUseCase');

describe('ReadThreadUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const useCasePayload = {};
            
    // Action & Assert
    await expect(readThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
    
  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const useCasePayload = {
      id: true,
    };
    
    // Action & Assert
    await expect(readThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the read thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockResponseReadThread = {
      id: 'thread-123',
      content: useCasePayload.title,
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    // Mocking
    mockThreadRepository.readThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadThread));
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const readReply = await readThreadUseCase.execute(useCasePayload);

    // Assert
    expect(readReply).toStrictEqual(mockResponseReadThread);
  });
});
