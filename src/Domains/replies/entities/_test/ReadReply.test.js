const ReadReply = require('../ReadReply');

describe('a ReadReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new ReadReply(payload)).toThrowError('READ_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
    };

    // Action and Assert
    expect(() => new ReadReply(payload)).toThrowError('READ_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should read reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action
    const { id } = new ReadReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
  });
});