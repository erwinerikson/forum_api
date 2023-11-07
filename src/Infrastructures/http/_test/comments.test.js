const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
        
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{id}/comments', () => {
    it('should response 401 Missing Authentication', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/{id}/comments',
        payload: {},
      }); 
  
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if payload incomplete', async () => {
      // Arrange
      const server = await createServer(container);
        
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena data tidak lengkap');
    });

    it('should response 400 if payload not string', async () => {
      // Arrange
      const server = await createServer(container);
          
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
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
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);
            
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          content: 'sebuah comment',
        },
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

    it('should return comment data correctly', async () => {
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
          
      // Action
      const responseJsonThread = JSON.parse(responseThread.payload);
      const threadId = responseJsonThread.data.addedThread.id;
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual('sebuah comment');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 Missing Authentication', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}',
        payload: {},
      }); 
  
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread or comment not found', async () => {
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
        url: '/threads/{threadId}/comments/{commentId}',
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

    it('should return thread id correctly', async () => {
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
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
