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
import { CALLCONNECTION_ID_TO_CORRELATION_ID, handleTranscriptionEvent } from './lib/callAutomationUtils';
import startTranscription from './routes/startTranscription';
import fetchTranscript from './routes/fetchTranscript';
import startCallWithTranscription from './routes/startCallWithTranscription';
import callAutomationEvent from './routes/callAutomationEvent';
import connectRoomsCall from './routes/connectToRoomsCall';
import summarizeTranscript from './routes/summarizeTranscript';
import updateRemoteParticipants from './routes/updateRemoteParticipants';
import updateLocalParticipant from './routes/updateLocalParticipant';
import stopTranscriptionForCall from './routes/stopTranscription';
import fetchTranscriptState from './routes/fetchTranscriptState';

const app = express();
const clients: express.Response[] = []; // Store connected clients

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
 * route: /stopTranscription
 * purpose: Stop transcription for an established call
 */
app.use('/stopTranscription', cors(), stopTranscriptionForCall);

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
 * route:/fetchTranscriptionState
 * purpose: Fetch the transcription state for a call
 */
app.use('/fetchTranscriptionState', cors(), fetchTranscriptState);

/**
 * route: /summarizeTranscript
 * purpose: Sends transcript to AI summarization service
 */
app.use('/summarizeTranscript', cors(), summarizeTranscript);

/**
 * route: /updateRemoteParticipants
 * purpose: Update remote participants in the call
 */
app.use('/updateRemoteParticipants', cors(), updateRemoteParticipants);

/**
 * route: /updateLocalParticipant
 * purpose: Update local participant in the call
 */
app.use('/updateLocalParticipant', cors(), updateLocalParticipant);

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

app.post('/events', cors(), (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Add the client to the list of connected clients
  clients.push(res);

  // Remove the client when the connection is closed
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

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
    const decoder = new TextDecoder();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageData = JSON.parse(decoder.decode(message as any));
    console.log('Received message:', messageData);
    // if (messageData.type === 'ping') {
    //   ws.send(JSON.stringify({ type: 'pong' }));
    //   return;
    // } else if (messageData.type === 'join') {
    //   const transcriptionStatus = !!Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    //     CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(messageData.serverCallId)
    //   );
    //   sendEventToClients('TranscriptionStatus', {
    //     transcriptionStatus: transcriptionStatus,
    //     serverCallId: messageData.serverCallId
    //   });
    // } else
    if (
      ('kind' in messageData && messageData.kind === 'TranscriptionMetadata') ||
      ('kind' in messageData && messageData.kind === 'TranscriptionData')
    ) {
      transcriptionCorrelationId = handleTranscriptionEvent(message, transcriptionCorrelationId);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});

// Function to send events to all connected clients
export const sendEventToClients = (event: string, data: object): void => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.write(message));
};

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
