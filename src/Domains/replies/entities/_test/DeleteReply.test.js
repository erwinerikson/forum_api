const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };
      
    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: true,
      comment: 'comment-123',
      reply: 1,
      owner: 'user-123',
    };
  
    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  
  it('should delete reply entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      reply: 'reply-123',
      owner: 'user-123',
    };
  
    // Action
    const deleteReply = new DeleteReply(payload);
  
    // Assert
    expect(deleteReply).toBeInstanceOf(DeleteReply);
    expect(deleteReply.thread).toEqual(payload.thread);
    expect(deleteReply.comment).toEqual(payload.comment);
    expect(deleteReply.reply).toEqual(payload.reply);
    expect(deleteReply.owner).toEqual(payload.owner);
  });
});
