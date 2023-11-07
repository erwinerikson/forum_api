const ReadThread = require('../../Domains/threads/entities/ReadThread');

class ReadThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }
    
  async execute(useCasePayload) {
    const read = new ReadThread(useCasePayload);
    return this._threadRepository.readThread(read);
  }
}

module.exports = ReadThreadUseCase;
