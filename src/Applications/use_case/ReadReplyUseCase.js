const ReadReply = require('../../Domains/replies/entities/ReadReply');

class ReadReplyUseCase {
  constructor({
    replyRepository,
  }) {
    this._replyRepository = replyRepository;
  }
    
  async execute(useCasePayload) {
    const readReply = new ReadReply(useCasePayload);
    return this._replyRepository.readReply(readReply);
  }
}

module.exports = ReadReplyUseCase;
