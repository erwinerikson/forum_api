class ReadReply {
  constructor(payload) {
    this._verifyPayload(payload);
      
    const { id } = payload;
      
    this.id = id;
  }
      
  _verifyPayload({ id }) {
    if (!id) {
      throw new Error('READ_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
      
    if (typeof id !== 'string') {
      throw new Error('READ_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
      
module.exports = ReadReply;
