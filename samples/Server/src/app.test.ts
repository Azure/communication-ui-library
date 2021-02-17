import request from 'supertest';
import app from './app';
import * as createUserTokenModule from './lib/createUserToken';
import { CommunicationUserToken } from '@azure/communication-administration';

// Setup mocks
const mockUserToken: CommunicationUserToken = {
  user: { communicationUserId: 'mock-token-user' },
  token: 'mock-token-value',
  expiresOn: new Date(0)
};

let createTokenSpy: jest.SpyInstance;

beforeAll(() => {
  createTokenSpy = jest
    .spyOn(createUserTokenModule, 'createUserTokenWithScope')
    .mockImplementation(async () => Promise.resolve(mockUserToken));
});

describe('app route tests', () => {
  test('/token should return a token with chat and voip scopes with GET and POST requests', async () => {
    const getResponse = await request(app).get('/token');
    expect(getResponse.status).toEqual(200);
    expect(getResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createTokenSpy).toHaveBeenLastCalledWith(['chat', 'voip']);
    createTokenSpy.mockClear();

    const postResponse = await request(app).post('/token');
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createTokenSpy).toHaveBeenLastCalledWith(['chat', 'voip']);
    createTokenSpy.mockClear();
  });

  test('/token?scope=chat,pstn should return a token with chat and pstn scopes with GET and POST requests', async () => {
    const getResponse = await request(app).get('/token?scope=chat,pstn');
    expect(getResponse.status).toEqual(200);
    expect(getResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createTokenSpy).toHaveBeenLastCalledWith(['chat', 'pstn']);
    createTokenSpy.mockClear();

    const postResponse = await request(app).post('/token').send({ scope: 'chat,pstn' });
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createTokenSpy).toHaveBeenLastCalledWith(['chat', 'pstn']);
    createTokenSpy.mockClear();
  });
});
