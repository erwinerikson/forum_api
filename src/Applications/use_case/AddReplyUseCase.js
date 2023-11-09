const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this.userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.findThreadsById(addReply.thread);
    await this._commentRepository.findCommentsById(addReply.comment);
    await this.userRepository.findUsersById(addReply.owner);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
