const ReadThread = require('../../../Domains/threads/entities/ReadThread');
const ReadComment = require('../../../Domains/comments/entities/ReadComment');
const ReadReply = require('../../../Domains/replies/entities/ReadReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReadThreadUseCase = require('../ReadThreadUseCase');

describe('ReadThreadUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };

    const mockResponseReadComment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    };

    const mockResponseReadReply = {
      id: 'thread-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    // Create the use case instace
    const readThreadUseCase = new ReadThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    // Mocking
    mockThreadRepository.readThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadThread));
    mockCommentRepository.readComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadComment));
    mockReplyRepository.readReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadReply));
    readThreadUseCase._processData = jest.fn()
      .mockImplementation(() => Promise.resolve(mockResponseReadComment));

    // Action
    const readThread = await readThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.readThread).toBeCalledWith(new ReadThread({
      id: 'thread-123',
    }));
    expect(mockCommentRepository.readComment).toBeCalledWith(new ReadComment({
      id: 'thread-123',
    }));
    expect(mockReplyRepository.readReply).toBeCalledWith(new ReadReply({
      id: 'thread-123',
    }));
    expect(readThreadUseCase._processData).toBeCalledWith({
      content: 'sebuah comment',
      date: '2021-08-08T07:59:18.982Z',
      id: 'comment-123',
      username: 'dicoding', 
    });
    expect(readThread).toStrictEqual({
      thread: {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        comments: {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:59:18.982Z',
          content: 'sebuah comment',
          replies: {
            id: 'thread-123',
            content: 'sebuah balasan',
            date: '2021-08-08T07:59:18.982Z',
            username: 'dicoding',
          },
        },
      },
    });
  });
});
