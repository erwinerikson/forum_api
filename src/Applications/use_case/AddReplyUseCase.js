const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
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
    const addReply = new AddReply(useCasePayload);
    const { thread, comment } = useCasePayload;
    await this._threadRepository.findThreadsById(thread);
    await this._commentRepository.findCommentsById(comment);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
