const ReadComment = require('../ReadComment');

describe('a ReadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new ReadComment(payload)).toThrowError('READ_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
    };

    // Action and Assert
    expect(() => new ReadComment(payload)).toThrowError('READ_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should read comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };

    // Action
    const readComment = new ReadComment(payload);

    // Assert
    expect(readComment).toBeInstanceOf(ReadComment);
    expect(readComment.comment).toEqual(payload.comment);
  });
});
