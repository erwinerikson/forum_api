const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {};
            
    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: true,
      reply: 1,
      owner: 'user-123',
    };

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      reply: 'reply-123',
      owner: 'user-123',
    };

    const useCasePayloadFindOwner = {
      id: 'reply-123',
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const mockResponseDeleteReply = {
      status: 'success',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    // Mocking
    mockThreadRepository.findThreadsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockCommentRepository.findCommentsById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.comment));
    mockReplyRepository.findRepliesById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.reply));
    mockReplyRepository.findRepliesByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayloadFindOwner));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseDeleteReply));

    // Action
    const deleteReply = await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(deleteReply).toStrictEqual(mockResponseDeleteReply);
    expect(mockThreadRepository.findThreadsById).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.findCommentsById).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.findRepliesById).toBeCalledWith(useCasePayload.reply);
    expect(mockReplyRepository.findRepliesByOwner).toBeCalledWith(useCasePayloadFindOwner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(new DeleteReply({
      thread: 'thread-123',
      comment: 'comment-123',
      reply: 'reply-123',
      owner: 'user-123',
    }));
  });
});
