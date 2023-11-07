const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
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
    const deleteReply = new DeleteReply(useCasePayload);
    const {
      thread, comment, reply: id, owner,
    } = useCasePayload;
    await this._threadRepository.findThreadsById(thread);
    await this._commentRepository.findCommentsById(comment);
    await this._replyRepository.findRepliesById(id);
    await this._replyRepository.findRepliesByOwner({
      thread, comment, id, owner,
    });
    return this._replyRepository.deleteReply(deleteReply);
  }
}
  
module.exports = DeleteReplyUseCase;
