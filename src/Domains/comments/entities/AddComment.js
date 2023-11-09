class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
  
    const { content, thread, owner } = payload;
  
    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }
  
  _verifyPayload(payload) {
    const { content, thread } = payload;

    if (!content || !thread) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  
    if (typeof content !== 'string' || typeof thread !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
  
module.exports = AddComment;
