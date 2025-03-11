// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';
import WebSocket from 'ws';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import getEndpointUrl from './routes/getEndpointUrl';
import userConfig from './routes/userConfig';
import createThread from './routes/createThread';
import addUser from './routes/addUser';
import createRoom from './routes/createRoom';
import addUserToRoom from './routes/addUserToRoom';
import uploadToAzureBlobStorage from './routes/uploadToAzureBlobStorage';
import { getServerWebSocketPort } from './lib/envHelper';
import { connectRoomsCall, handleTranscriptionEvent, startTranscriptionForCall } from './lib/callAutomationUtils';
import startTranscription from './routes/startTranscription';
import fetchTranscript from './routes/fetchTranscript';
import startCallWithTranscription from './routes/startCallWithTranscription';
import callAutomationEvent from './routes/callAutomationEvent';

const app = express();

app.use(logger('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
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
 * route: /connectToRoom
 * purpose: Calling: connect to an existing room
 */
app.use('/connectRoomsCall', cors(), connectRoomsCall);
/**
 * route: /startTranscription
 * purpose: Start transcription for an established call
 */
app.use('/startTranscription', cors(), startTranscription);

/**
 * route: /fetchTranscript
 * purpose: Fetch an existing transcription
 */
app.use('/fetchTranscript', cors(), fetchTranscript);

/**
 * route: /startCallWithTranscription
 * purpose: Start a new group call with transcription
 */
app.use('/startCallWithTranscription', cors(), startCallWithTranscription);
/**
 * route: /callAutomationEvent
 * purpose: Call Automation: receive call automation events
 */
app.use('/callAutomationEvent', cors(), callAutomationEvent);

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

/**
 * route: wss://<host>/
 * purpose: WebSocket endpoint to receive transcription events
 *
 * Don't forget to secure this endpoint in production
 * https://learn.microsoft.com/en-us/azure/communication-services/how-tos/call-automation/secure-webhook-endpoint?pivots=programming-language-javascript
 */
const wss = new WebSocket.Server({ port: getServerWebSocketPort() });
wss.on('connection', (ws) => {
  let transcriptionCorrelationId: string | undefined;

  ws.on('open', () => {
    console.log('WebSocket opened');
  });

  ws.on('message', (message) => {
    console.log('/message received', message);
    transcriptionCorrelationId = handleTranscriptionEvent(message, transcriptionCorrelationId);
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
