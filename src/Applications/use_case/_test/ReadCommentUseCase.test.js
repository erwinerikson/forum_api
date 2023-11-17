const ReadComment = require('../../../Domains/comments/entities/ReadComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReadCommentUseCase = require('../ReadCommentUseCase');

describe('ReadCommentUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const readCommentUseCase = new ReadCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {};
        
    // Action & Assert
    await expect(readCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const readCommentUseCase = new ReadCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    const useCasePayload = {
      id: true,
    };

    // Action & Assert
    await expect(readCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('READ_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the read comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };

    const mockResponseReadComment = [
      {
        id: 'comment-321',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah content',
        is_delete: 0,
      },
    ];

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    // Create the use case instace
    const readCommentUseCase = new ReadCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    // Mocking
    mockCommentRepository.readComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadComment));

    // Action
    const readComment = await readCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.readComment).toBeCalledWith(new ReadComment({
      id: 'thread-123',
    }));
    expect(readComment).toStrictEqual([
      {
        id: 'comment-321',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah content',
        is_delete: 0,
      },
    ]);
  });
});
