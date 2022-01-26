// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import getEndpointUrl from './routes/getEndpointUrl';
import isValidThread from './routes/isValidThread';
import userConfig from './routes/userConfig';
import createThread from './routes/createThread';
import addUser from './routes/addUser';

const app = express();

app.use(logger('tiny'));
app.use(express.json());
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
 * route: /isValidThread
 * purpose: Chat: check if thread is valid
 */
app.use('/isValidThread', cors(), isValidThread);

/**
 * route: /userConfig
 * purpose: Chat: to add user details to userconfig for chat thread
 */
app.use('/userConfig', cors(), userConfig);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
