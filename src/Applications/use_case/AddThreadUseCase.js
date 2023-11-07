const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { credentialId, title, body } = useCasePayload;

    const addThread = new AddThread({ title, body, owner: credentialId });
    return this._threadRepository.addThread(addThread);
  }

  _verifyPayload(payload) {
    const { title, body } = payload;

    if (!title || !body) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_PAYLOAD');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
