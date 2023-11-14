/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

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

    this._processData(comment);
    this._processData(replies);

    const comments = this._combineCommentReply(comment, replies);

    const threadWhichComments = { ...threads, comments: comment };
    const threadWhichCommentsWhichReplies = { ...threads, comments };

    return this._selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies);
  }

  _processData(data) {
    Object.values(data).forEach((item) => {
      if (item.is_delete > 0) {
        (item.id.slice(0, 8) === 'comment-') ? item.content = '**komentar telah dihapus**' : item.content = '**balasan telah dihapus**';
      }
      delete item.is_delete;
      return item;
    });
    return data;
  }

  _selectData(replies, threadWhichComments, threadWhichCommentsWhichReplies) {
    const selectData = { thread: (replies.length === 0) ? threadWhichComments : threadWhichCommentsWhichReplies };
    return selectData;
  }

  _combineCommentReply(comment, replies) {
    const dataComment = [];
    Object.values(comment).forEach((itemComment) => {
      const commentId = itemComment.id;
      Object.values(replies).forEach((itemReply) => {
        if (commentId === itemReply.comment) {
          const comments = itemComment;
          delete itemReply.comment;
          comment = { ...comments, replies };
        } else {
          dataComment.push(itemComment);
        }
      });
    });
    // Clean dataComment
    const uniqueComment = new Set(dataComment);
    const backDataComment = [...uniqueComment];
    comment = new Array(comment);
    Object.values(backDataComment).forEach((dtComment) => {
      comment.push(dtComment);
    });
    return comment;
  }
}

module.exports = ReadThreadUseCase;
