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
      id: 'comment-123',
    };

    // Action
    const { id } = new ReadComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
  });
});
