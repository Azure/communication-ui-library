// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jest/index.d.ts" />

import request from 'supertest';
import * as identity from '../src/lib/identityClient';
import app from './app';
import { CommunicationUserToken } from '@azure/communication-identity';

// Setup mocks
const mockUserToken: CommunicationUserToken = {
  user: { communicationUserId: 'mock-token-user' },
  token: 'mock-token-value',
  expiresOn: new Date(0)
};

let createUserAndTokenSpy: jest.SpyInstance;

beforeAll(() => {
  createUserAndTokenSpy = jest.spyOn(identity, 'createUserAndToken').mockImplementation(async () => mockUserToken);
});

describe('app route tests', () => {
  test('/token should return a token with chat and voip scopes with GET and POST requests', async () => {
    const getResponse = await request(app).get('/token');
    expect(getResponse.status).toEqual(200);
    expect(getResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(['chat', 'voip']);
    createUserAndTokenSpy.mockClear();

    const postResponse = await request(app).post('/token');
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(['chat', 'voip']);
    createUserAndTokenSpy.mockClear();
  });

  test('/token?scope=chat,pstn should return a token with chat and pstn scopes with GET and POST requests', async () => {
    const getResponse = await request(app).get('/token?scope=chat,pstn');
    expect(getResponse.status).toEqual(200);
    expect(getResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(['chat', 'pstn']);
    createUserAndTokenSpy.mockClear();

    const postResponse = await request(app).post('/token').send({ scope: 'chat,pstn' });
    expect(postResponse.status).toEqual(200);
    expect(postResponse.text).toEqual(JSON.stringify(mockUserToken));
    expect(createUserAndTokenSpy).toHaveBeenLastCalledWith(['chat', 'pstn']);
    createUserAndTokenSpy.mockClear();
  });
});
