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

  it('should function processData comment', async () => {
    // Arrange
    const comment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
      is_delete: 1,
    }];
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
    // Mock
    const mockProcessData = jest.spyOn(readThreadUseCase, '_processData');

    // Action
    readThreadUseCase._processData(comment);

    expect(mockProcessData).toReturnWith([{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: '**komentar telah dihapus**',
    }]);
  });

  it('should function processData replies', async () => {
    // Arrange
    const replies = [{
      id: 'reply-123',
      comment: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      is_delete: 1,
    }];
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
    // Mock
    const mockProcessData = jest.spyOn(readThreadUseCase, '_processData');

    // Action
    readThreadUseCase._processData(replies);

    expect(mockProcessData).toReturnWith([{
      id: 'reply-123',
      comment: 'comment-123',
      content: '**balasan telah dihapus**',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    }]);
  });

  it('should function combineCommentReply', async () => {
    // Arrange
    const comment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2021-08-08T08:59:18.983Z',
        content: 'sebuah comment',
      },
    ];
    const replies = [
      {
        id: 'reply-123',
        comment: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
      },
      {
        id: 'reply-124',
        comment: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:18.983Z',
        username: 'dicoding',
      },
    ];
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
    // Mock
    const mockCombineCommentReply = jest.spyOn(readThreadUseCase, '_combineCommentReply');

    // Action
    readThreadUseCase._combineCommentReply(comment, replies);

    // Assert
    expect(mockCombineCommentReply).toReturnWith([
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
        replies: [
          {
            id: 'reply-123',
            content: 'sebuah balasan',
            date: '2021-08-08T07:59:18.982Z',
            username: 'dicoding',
          },
          {
            id: 'reply-124',
            content: 'sebuah balasan',
            date: '2021-08-08T07:59:18.983Z',
            username: 'dicoding',
          },
        ],
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2021-08-08T08:59:18.983Z',
        content: 'sebuah comment',
      },
    ]);
  });

  it('should function selectData no replies', async () => {
    // Arrange
    const threads = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const comment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    }];
    const replies = [];
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
    const comments = { ...comment, replies };
    const threadWhichComments = { ...threads, comments: comment };
    const threadWhichCommentsWhichReplies = { ...threads, comments };
    // Mock
    const mockSelectData = jest.spyOn(readThreadUseCase, '_selectData');

    // Action
    readThreadUseCase._selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies);
  
    // Assert
    expect(mockSelectData).toReturnWith({
      thread: {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:59:18.982Z',
            content: 'sebuah comment',
          },
        ],
      },
    });
  });

  it('should function selectData with replies', async () => {
    // Arrange
    const threads = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const comment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    };
    const replies = [{
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    }];
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
    const combineComment = { ...comment, replies };
    const comments = new Array(combineComment);
    const threadWhichComments = { ...threads, comments: comment };
    const threadWhichCommentsWhichReplies = { ...threads, comments };
    // Mock
    readThreadUseCase._combineCommentReply(comment, replies);
    const mockSelectData = jest.spyOn(readThreadUseCase, '_selectData');

    // Action
    readThreadUseCase._selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies);
  
    // Assert
    expect(mockSelectData).toReturnWith({
      thread: {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:59:18.982Z',
            content: 'sebuah comment',
            replies: [
              {
                id: 'reply-123',
                content: 'sebuah balasan',
                date: '2021-08-08T07:59:18.982Z',
                username: 'dicoding',
              },
            ],
          },
        ],
      },
    });
  });

  it('should orchestrating the read thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockResponseReadThread = [{
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    }];
    const mockResponseReadComment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
      is_delete: 0,
    };
    const mockResponseReadReply = [{
      id: 'reply-123',
      comment: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      is_delete: 0,
    }];
    const threads = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const comment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    };
    const replies = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const comments = { ...comment, replies };
    const threadWhichComments = { ...threads, comments: comment };
    const threadWhichCommentsWhichReplies = { ...threads, comments };
    const mockSelectData = {
      thread: (replies.length === 0) ? threadWhichComments : threadWhichCommentsWhichReplies,
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
    const mockProcessData = jest.spyOn(readThreadUseCase, '_processData');
    readThreadUseCase._processData(mockResponseReadComment);
    readThreadUseCase._processData(mockResponseReadReply);
    const mockCombineCommentReply = jest.spyOn(readThreadUseCase, '_combineCommentReply');
    readThreadUseCase._combineCommentReply(comment, replies);
    readThreadUseCase._selectData = jest.fn(() => Promise.resolve(mockSelectData));

    // Action
    const readThread = await readThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.readThread).toBeCalledWith(new ReadThread({ id: 'thread-123' }));
    expect(mockCommentRepository.readComment).toBeCalledWith(new ReadComment({ id: 'thread-123' }));
    expect(mockReplyRepository.readReply).toBeCalledWith(new ReadReply({ id: 'thread-123' }));
    expect(mockProcessData).toHaveBeenNthCalledWith(1, mockResponseReadComment);
    expect(mockProcessData).toHaveBeenNthCalledWith(2, mockResponseReadReply);
    expect(mockCombineCommentReply).toHaveBeenCalledWith(comment, replies);
    expect(readThreadUseCase._selectData).toHaveBeenCalled();
    expect(readThread).toStrictEqual({
      thread: {
        id: 'thread-123',
        body: 'sebuah body thread',
        title: 'sebuah thread',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        comments: {
          id: 'comment-123',
          content: 'sebuah comment',
          date: '2021-08-08T07:59:18.982Z',
          username: 'dicoding',
          replies: {
            id: 'reply-123',
            content: 'sebuah balasan',
            date: '2021-08-08T07:59:18.982Z',
            username: 'dicoding',
          },
        },
      },
    });
  });
});
