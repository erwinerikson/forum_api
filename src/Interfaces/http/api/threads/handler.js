const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ReadThreadUseCase = require('../../../../Applications/use_case/ReadThreadUseCase');
const ReadCommentUseCase = require('../../../../Applications/use_case/ReadCommentUseCase');
const ReadReplyUseCase = require('../../../../Applications/use_case/ReadReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({ credentialId, ...request.payload });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const readThreadUseCase = this._container.getInstance(ReadThreadUseCase.name);
    const readCommentUseCase = this._container.getInstance(ReadCommentUseCase.name);
    const readReplyUseCase = this._container.getInstance(ReadReplyUseCase.name);
    const thread = await readThreadUseCase.execute(request.params);
    const comment = await readCommentUseCase.execute(request.params);
    const replies = await readReplyUseCase.execute(request.params);

    comment.forEach((item) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      (item.is_delete > 0) ? item.content = '**komentar telah dihapus**' : item.content;
      // eslint-disable-next-line no-param-reassign
      delete item.is_delete;
      return item;
    });

    replies.forEach((item) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      (item.is_delete > 0) ? item.content = '**komentar telah dihapus**' : item.content;
      // eslint-disable-next-line no-param-reassign
      delete item.is_delete;
      return item;
    });

    const comments = { ...comment, replies };
    const threadWhichComments = { ...thread, comments: comment };
    const threadWhichCommentsWhichReplies = { ...thread, comments };

    const response = h.response({
      status: 'success',
      data: {
        thread: (replies.length === 0) ? threadWhichComments : threadWhichCommentsWhichReplies,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
