const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ReadThreadUseCase = require('../../../../Applications/use_case/ReadThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({ owner, ...request.payload });

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
    const data = await readThreadUseCase.execute(request.params);

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
