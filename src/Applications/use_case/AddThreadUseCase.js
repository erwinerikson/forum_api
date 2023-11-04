const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({
    threadRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    console.log('ini AddThreadUseCase');
    console.log(useCasePayload);
    this._verifyPayload(useCasePayload);
    const { credentialId, title, body } = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(credentialId);
    await this._authenticationRepository.checkAvailabilityToken(credentialId);

    const { id } = await this._authenticationTokenManager.decodePayload(credentialId);

    const addThread = new AddThread({ title, body, owner: id });
    const result = await this._threadRepository.addThread(addThread);
    return result;
  }

  _verifyPayload(payload) {
    console.log('ini verifyPayload');
    console.log(payload);
    const { credentialId, title, body } = payload;

    if (!credentialId) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.REFRESH_TOKEN_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!title || !body) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_PAYLOAD');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
