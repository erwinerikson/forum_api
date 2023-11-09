const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({
    userRepository,
    threadRepository,
  }) {
    this.userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    await this.userRepository.findUsersById(addThread.owner);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
