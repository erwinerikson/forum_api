const ReadThread = require('../../Domains/threads/entities/ReadThread');
const ReadComment = require('../../Domains/comments/entities/ReadComment');
const ReadReply = require('../../Domains/replies/entities/ReadReply');

class ReadThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }
    
  async execute(useCasePayload) {
    const readThread = new ReadThread(useCasePayload);
    const readComment = new ReadComment(useCasePayload);
    const readReply = new ReadReply(useCasePayload);
    const threads = await this._threadRepository.readThread(readThread);
    const comment = await this._commentRepository.readComment(readComment);
    const replies = await this._replyRepository.readReply(readReply);

    this.processData(comment);
    this.processData(replies);

    const combine = this.combineCommentReply(comment, replies);

    const comments = { ...comment, replies };
    const threadWhichComments = { ...threads, comments: comment };
    const threadWhichCommentsWhichReplies = { ...threads, comments };

    const thread = this.selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies);
    return thread;
  }

  processData(data) {
    Object.values(data).forEach((item) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      (item.is_delete > 0) ? item.content = '**komentar telah dihapus**' : item.content;
      // eslint-disable-next-line no-param-reassign
      delete item.is_delete;
      return item;
    });

    return data;
  }

  selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies) {
    // eslint-disable-next-line max-len
    const selectData = { thread: (replies.length === 0) ? threadWhichComments : threadWhichCommentsWhichReplies };
    return selectData;
  }

  combineCommentReply(comment, replies) {
    Object.values(comment).forEach((itemComment) => {
      const commentId = itemComment.id;
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      this.processData(comment);
      // eslint-disable-next-line array-callback-return
      Object.values(replies).map((itemReply) => {
        this.processData(replies);
        if (commentId === itemReply.comment) {
          // eslint-disable-next-line no-param-reassign
          delete itemReply.comment;
          // eslint-disable-next-line no-param-reassign
          comment = { ...comment, replies };
        }
      });
    });
    return comment;
  }
}

module.exports = ReadThreadUseCase;
