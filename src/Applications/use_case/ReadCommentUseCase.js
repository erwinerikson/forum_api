const ReadComment = require('../../Domains/comments/entities/ReadComment');

class ReadCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }
    
  async execute(useCasePayload) {
    const readComment = new ReadComment(useCasePayload);
    return this._commentRepository.readComment(readComment);
  }
}

module.exports = ReadCommentUseCase;
