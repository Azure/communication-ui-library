// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallAutomationClient,
  CallLocator,
  StreamingData,
  TranscriptionData,
  TranscriptionMetadata
} from '@azure/communication-call-automation';
import {
  getCallAutomationCallbackUrl,
  getServerWebSocketUrl,
  getCognitionAPIEndpoint,
  getResourceConnectionString
} from './envHelper';
import { ConversationSummaryInput } from './summarizationHelper';

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
  CALLCONNECTION_ID_TO_CORRELATION_ID[(await callConnection.getCallConnectionProperties()).callConnectionId] = {
    correlationId: (await callConnection.getCallConnectionProperties()).correlationId
  };
};

export const startTranscriptionForCall = async (callConnectionId: string): Promise<void> => {
  console.log('Starting transcription for call:', callConnectionId);
  const callConnection = await getCallAutomationClient().getCallConnection(callConnectionId);

  return await callConnection.getCallMedia().startTranscription();
};

export const TRANSCRIPTION_STORE: { [key: string]: Partial<CallTranscription> } = {};
/**
 * Used to map between the call connection id and the correlation id from both transcription and
 * call automation events.
 */
export const CALLCONNECTION_ID_TO_CORRELATION_ID: { [key: string]: { correlationId?: string; callId?: string } } = {};

export const getTranscriptionData = (callId: string): CallTranscription | undefined => {
  const connectionId = Object.keys(CALLCONNECTION_ID_TO_CORRELATION_ID).find(
    (key) => CALLCONNECTION_ID_TO_CORRELATION_ID[key].callId === callId
  );
  const correlationId = CALLCONNECTION_ID_TO_CORRELATION_ID[connectionId]?.correlationId;
  return TRANSCRIPTION_STORE[correlationId] as CallTranscription;
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

  return eventData.correlationId;
};

export const handleTranscriptionDataEvent = (eventData: TranscriptionData, eventId: string): void => {
  console.log('--------------------------------------------');
  console.log('Transcription Data');
  console.log('TEXT:-->' + eventData.text);
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
    author: 'Participant', // TODO: get displayName by having the server collect and store the chosen display name
    text: data.text
  }));

  return formattedTranscription;
};
