const ReadReply = require('../../../Domains/replies/entities/ReadReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReadReplyUseCase = require('../ReadReplyUseCase');

describe('ReadReplyUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const readReplyUseCase = new ReadReplyUseCase({
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {};
        
    // Action & Assert
    await expect(readReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const readReplyUseCase = new ReadReplyUseCase({
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {
      id: true,
    };

    // Action & Assert
    await expect(readReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the read reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
    };

    const mockResponseReadReply = [
      {
        id: 'reply-321',
        comment: 'comment-321',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        is_delete: 0,
      },
    ];

    // creating dependency of use case
    const mockReplyRepository = new ReplyRepository();
    // Mocking
    mockReplyRepository.readReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadReply));
    // Create the use case instace
    const readReplyUseCase = new ReadReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const readReply = await readReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.readReply).toBeCalledWith(new ReadReply({
      id: 'reply-123',
    }));
    expect(readReply).toStrictEqual([
      {
        id: 'reply-321',
        comment: 'comment-321',
        content: 'sebuah reply',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        is_delete: 0,
      },
    ]);
  });
});
