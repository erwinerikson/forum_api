const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
        
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /replies', () => {
    it('should response 401 Missing Authentication', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments/{commentId}/replies',
        payload: {},
      }); 
  
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if bad payload', async () => {
      // Arrange
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const server = await createServer(container);
    
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments/{commentId}/replies',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
    
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena data tidak lengkap');
    });

    it('should response 400 if payload not string', async () => {
      // Arrange
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const server = await createServer(container);
            
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments/{commentId}/replies',
        payload: {
          content: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
          
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should return reply data correctly', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      // authentication
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseJsonAuthentication.data;
      // Thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);
      const threadId = responseJsonThread.data.addedThread.id;
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const commentId = responseJsonComment.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toEqual('sebuah balasan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 Missing Authentication', async () => {
      // Arrange
      const server = await createServer(container);
    
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        payload: {},
      }); 
    
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread, comment or reply not found', async () => {
      // Arrange
      const server = await createServer(container);
              
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
            
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should return threadId, commentId, replyId correctly', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      // authentication
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseJsonAuthentication = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseJsonAuthentication.data;
      // Thread
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonThread = JSON.parse(responseThread.payload);
      const threadId = responseJsonThread.data.addedThread.id;
      // Comment
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonComment = JSON.parse(responseComment.payload);
      const commentId = responseJsonComment.data.addedComment.id;
      // Reply
      const responseReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJsonReply = JSON.parse(responseReply.payload);
      const replyId = responseJsonReply.data.addedReply.id;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
