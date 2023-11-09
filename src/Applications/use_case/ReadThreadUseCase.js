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
    const thread = await this._threadRepository.readThread(readThread);
    const comment = await this._commentRepository.readComment(readComment);
    const replies = await this._replyRepository.readReply(readReply);

    this._processData(comment);
    this._processData(replies);

    const comments = { ...comment, replies };
    const threadWhichComments = { ...thread, comments: comment };
    const threadWhichCommentsWhichReplies = { ...thread, comments };
    // eslint-disable-next-line max-len
    return { thread: (replies.length === 0) ? threadWhichComments : threadWhichCommentsWhichReplies };
  }

  _processData(data) {
    Object.values(data).forEach((item) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      (item.is_delete > 0) ? item.content = '**komentar telah dihapus**' : item.content;
      // eslint-disable-next-line no-param-reassign
      delete item.is_delete;
      return item;
    });

    return data;
  }
}

module.exports = ReadThreadUseCase;
