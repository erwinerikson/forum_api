const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };
      
    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: true,
      comment: 'comment-123',
      owner: 'user-123',
    };
  
    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  
  it('should delete comment entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };
  
    // Action
    const deleteComment = new DeleteComment(payload);
  
    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.thread).toEqual(payload.thread);
    expect(deleteComment.comment).toEqual(payload.comment);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
