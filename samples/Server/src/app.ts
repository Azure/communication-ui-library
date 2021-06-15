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

app.use('/createThread', cors(), createThread);
app.use('/addUser', cors(), addUser);
app.use('/refreshToken', cors(), refreshToken);
app.use('/getEndpointUrl', cors(), getEndpointUrl);
app.use('/token', cors(), issueToken);
app.use('/isValidThread', cors(), isValidThread);
app.use('/userConfig', cors(), userConfig);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
