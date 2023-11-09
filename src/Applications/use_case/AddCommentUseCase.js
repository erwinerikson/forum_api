const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
  }) {
    this.userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.findThreadsById(addComment.thread);
    await this.userRepository.findUsersById(addComment.owner);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
