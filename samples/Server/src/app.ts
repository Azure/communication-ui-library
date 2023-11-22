// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import getEndpointUrl from './routes/getEndpointUrl';
import userConfig from './routes/userConfig';
import createThread from './routes/createThread';
import addUser from './routes/addUser';
import createRoom from './routes/createRoom';
import addUserToRoom from './routes/addUserToRoom';
import uploadToAzureBlobStorage from './routes/uploadToAzureBlobStorage';

const app = express();

app.use(logger('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'build')));

/**
 * route: /createThread
 * purpose: Chat: create a new chat thread
 */
app.use('/createThread', cors(), createThread);

/**
 * route: /addUser
 * purpose: Chat: add the user to the chat thread
 */
app.use('/addUser', cors(), addUser);

/**
 * route: /refreshToken
 * purpose: Chat,Calling: get a new token
 */
app.use('/refreshToken', cors(), refreshToken);

/**
 * route: /getEndpointUrl
 * purpose: Chat,Calling: get the endpoint url of ACS resource
 */
app.use('/getEndpointUrl', cors(), getEndpointUrl);

/**
 * route: /token
 * purpose: Chat,Calling: get ACS token with the given scope
 */
app.use('/token', cors(), issueToken);

/**
 * route: /userConfig
 * purpose: Chat: to add user details to userconfig for chat thread
 */
app.use('/userConfig', cors(), userConfig);

/**
 * route: /createRoom
 * purpose: Calling: create a new room
 */
app.use('/createRoom', cors(), createRoom);

/**
 * route: /addUserToRoom
 * purpose: Calling: add user to room with the given role
 */
app.use('/addUserToRoom', cors(), addUserToRoom);

/**
 * route: /getLogUploadData
 * purpose: Get tokens and endpoints for uploading logs to Azure Blob Storage
 */
app.use('/uploadToAzureBlobStorage', cors(), uploadToAzureBlobStorage);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
