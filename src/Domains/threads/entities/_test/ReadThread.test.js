const ReadThread = require('../ReadThread');

describe('a ReadThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new ReadThread(payload)).toThrowError('READ_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
    };

    // Action and Assert
    expect(() => new ReadThread(payload)).toThrowError('READ_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should read thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
    };

    // Action
    const { id } = new ReadThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
  });
});
