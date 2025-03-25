// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallAutomationClient,
  CallLocator,
  StreamingData,
  TranscriptionData,
  TranscriptionMetadata,
  TranscriptionOptions
} from '@azure/communication-call-automation';
import {
  getCallAutomationCallbackUrl,
  getServerWebSocketUrl,
  getCognitionAPIEndpoint,
  getResourceConnectionString
} from './envHelper';
import { ConversationSummaryInput } from './summarizationHelper';
import { CommunicationUserIdentifier } from '@azure/communication-common';

export interface CallTranscription {
  metadata: TranscriptionMetadata;
  data: TranscriptionData[];
}

let callAutomationClient: CallAutomationClient | undefined = undefined;
export const getCallAutomationClient = (): CallAutomationClient =>
  callAutomationClient ?? (callAutomationClient = new CallAutomationClient(getResourceConnectionString()));
export const connectRoomsCallWithTranscription = async (roomId: string): Promise<void> => {
  const transcriptionOptions = {
    transportUrl: getServerWebSocketUrl(),
    transportType: 'websocket',
    locale: 'en-US',
    startTranscription: true
  };

  const options = {
    callIntelligenceOptions: {
      cognitiveServicesEndpoint: getCognitionAPIEndpoint()
    },
    transcriptionOptions: transcriptionOptions
  };

  const callbackUri = getCallAutomationCallbackUrl();

  /**
   * Call automation needs to create the call.
   */

  const automationClient = getCallAutomationClient();
  const roomsLocator: CallLocator = { kind: 'roomCallLocator', id: roomId };
  const connectedCallResult = await automationClient.connectCall(roomsLocator, callbackUri, options);
  console.log((await connectedCallResult.callConnection.getCallConnectionProperties()).serverCallId);
  startTranscriptionForCall((await connectedCallResult.callConnection.getCallConnectionProperties()).serverCallId);
};

/**
 * This is how we attach call automation to the call. We want to not start transcription here. but
 * will start it later when the call connects.
 * @param serverCallId - this can be fetched from the client call object with the handler in the '
 * Call info object.
 */
export const connectRoomsCall = async (serverCallId: string): Promise<void> => {
  const transcriptionOptions = {
    transportUrl: getServerWebSocketUrl(),
    transportType: 'websocket',
    locale: 'en-US',
    startTranscription: false
  };

  const connectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
  );

  /**
   * Check if the call automation client and connection for the call already exists. If it does, we don't need to create a new one.
   */
  if (connectionId) {
    console.log('Call connection for call already exists:', connectionId);
    return;
  }

  const options = {
    callIntelligenceOptions: {
      cognitiveServicesEndpoint: getCognitionAPIEndpoint()
    },
    transcriptionOptions: transcriptionOptions
  };
  const res = await getCallAutomationClient().connectCall(
    {
      kind: 'serverCallLocator',
      id: serverCallId
    },
    getCallAutomationCallbackUrl(),
    options
  );
  console.log('Connect call result', res);
  const callConnection = res.callConnection;
  console.log('Call connection', callConnection);
};

export const startTranscriptionForCall = async (
  callConnectionId: string,
  options?: TranscriptionOptions
): Promise<void> => {
  console.log('Starting transcription for call:', callConnectionId);
  console.log(CALLCONNECTION_ID_TO_CORRELATION_ID);
  const callConnection = await getCallAutomationClient().getCallConnection(callConnectionId);

  return await callConnection.getCallMedia().startTranscription(options);
};

export const stopTranscriptionForCall = async (callConnectionId: string): Promise<void> => {
  console.log('Stopping transcription for call:', callConnectionId);
  console.log(CALLCONNECTION_ID_TO_CORRELATION_ID);
  const callConnection = await getCallAutomationClient().getCallConnection(callConnectionId);
  return await callConnection.getCallMedia().stopTranscription();
};

/**
 * We should be storing this based on the connectionId and not the correlationId
 * We should re-write all the fetches based on the callId to use the serverCallId. This is
 * because all of the clients that join can have different callId's and we need to make sure we are
 * pulling the correct transcription data.
 */
export const TRANSCRIPTION_STORE: { [key: string]: Partial<CallTranscription> } = {};
/**
 * Used to map between the call connection id and the correlation id from both transcription and
 * call automation events.
 */
export const CALLCONNECTION_ID_TO_CORRELATION_ID: { [key: string]: { correlationId?: string; serverCallId?: string } } =
  {};

/**
 * used to store the remote participants in the call
 * This object is keyed off the callId and contains the communicationUserId and displayName of the remote participants
 *
 * Keeps track of all participants who have ever joined the call so we can show their display name in the transcription and summary.
 */
export const REMOTE_PARTICIPANTS_IN_CALL: { [key: string]: { communicationUserId: string; displayName: string }[] } =
  {};

/**
 * used to store the local participant in the call
 * This is keyed off the callId and contains the communicationUserId and displayName of the local participant
 *
 * This is important because the server can track the user across multiple calls if they change their display name so we can show
 * the correct display name in the transcription and summary.
 */
export const LOCAL_PARTICIPANT: { [key: string]: { communicationUserId?: string; displayName?: string } } = {};

export const getTranscriptionData = (serverCallId: string): CallTranscription | undefined => {
  console.log('Getting transcription data for call:', serverCallId);
  const connectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
  );
  const correlationId = CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.correlationId;
  return TRANSCRIPTION_STORE[correlationId] as CallTranscription;
};

/**
 * Check if transcription has started for the call
 */
export const checkIfTranscriptionStarted = (serverCallId: string): boolean => {
  console.log('Checking if transcription started for call:', serverCallId);
  const connectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find((key) =>
    CALLCONNECTION_ID_TO_CORRELATION_ID[key].serverCallId.includes(serverCallId)
  );
  if (!connectionId) {
    return false;
  }
  const correlationId = CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.correlationId;
  return !!TRANSCRIPTION_STORE[correlationId];
};

/**
 * @returns id to correlate future transcription data
 */
export const handleTranscriptionEvent = (packetData: unknown, packetId: string | undefined): string | undefined => {
  const decoder = new TextDecoder();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stringJson = decoder.decode(packetData as any);
  const parsedData = StreamingData.parse(stringJson);

  if ('locale' in parsedData) {
    const id = handleTranscriptionMetadataEvent(parsedData);
    return id;
  }
  if ('text' in parsedData && packetId) {
    handleTranscriptionDataEvent(parsedData, packetId);
  }

  return packetId;
};

/**
 * @returns id to correlate future transcription data
 */
export const handleTranscriptionMetadataEvent = (eventData: TranscriptionMetadata): string => {
  console.log('--------------------------------------------');
  console.log('Transcription Metadata');
  console.log('CALL CONNECTION ID:-->' + eventData.callConnectionId);
  console.log('CORRELATION ID:-->' + eventData.correlationId);
  console.log('LOCALE:-->' + eventData.locale);
  console.log('SUBSCRIPTION ID:-->' + eventData.subscriptionId);
  console.log('--------------------------------------------');

  TRANSCRIPTION_STORE[eventData.correlationId] = {
    metadata: eventData
  };

  /**
   * Set the correlation ID for the call from the transcription event
   * This is the id that we will use to fetch the transcription data later.
   */
  CALLCONNECTION_ID_TO_CORRELATION_ID[eventData.callConnectionId] = {
    serverCallId: CALLCONNECTION_ID_TO_CORRELATION_ID[eventData.callConnectionId]?.serverCallId,
    correlationId: eventData.correlationId
  };

  return eventData.correlationId;
};

export const handleTranscriptionDataEvent = (eventData: TranscriptionData, eventId: string): void => {
  console.log('--------------------------------------------');
  console.log('Transcription Data');
  console.log('TEXT:-->' + eventData.text);
  console.log('CALL CORELLATION ID: -->' + eventId);
  console.log('FORMAT:-->' + eventData.format);
  console.log('CONFIDENCE:-->' + eventData.confidence);
  console.log('OFFSET IN TICKS:-->' + eventData.offsetInTicks);
  console.log('DURATION IN TICKS:-->' + eventData.durationInTicks);
  console.log('RESULT STATE:-->' + eventData.resultState);
  if ('phoneNumber' in eventData.participant) {
    console.log('PARTICIPANT:-->' + eventData.participant.phoneNumber);
  }
  if ('communicationUserId' in eventData.participant) {
    console.log('PARTICIPANT:-->' + eventData.participant.communicationUserId);
  }
  eventData.words.forEach((element) => {
    console.log('TEXT:-->' + element.text);
    console.log('DURATION IN TICKS:-->' + element.durationInTicks);
    console.log('OFFSET IN TICKS:-->' + element.offsetInTicks);
  });
  console.log('--------------------------------------------');

  if (TRANSCRIPTION_STORE[eventId]) {
    if (!TRANSCRIPTION_STORE[eventId].data) {
      TRANSCRIPTION_STORE[eventId].data = [];
    }
    TRANSCRIPTION_STORE[eventId].data.push(eventData);
  }
};

/**
 * function to format the transcription data for summarization
 * @param transcription - the transcription data to format
 * @returns transcription data formatted for summarization
 */
export const formatTranscriptionForSummarization = async (
  transcription: CallTranscription
): Promise<ConversationSummaryInput> => {
  const formattedTranscription: ConversationSummaryInput = transcription.data.map((data) => ({
    author: (data.participant as CommunicationUserIdentifier).communicationUserId, // TODO: get displayName by having the server collect and store the chosen display name
    text: data.text
  }));

  return formattedTranscription;
};
