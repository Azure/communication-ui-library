// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantRole } from '@azure/communication-calling';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterState,
  CallTranscription,
  createAzureCommunicationCallAdapterFromClient,
  createStatefulCallClient
} from '@azure/communication-react';
import { addUserToRoom } from './AppUtils';

export const fetchTranscript = async (callId: string): Promise<CallTranscription> => {
  const response = await fetch(`/fetchTranscript`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      callId
    })
  });
  if (!response.ok) {
    console.error('Failed to fetch transcript:', response);
    return [];
  }

  return ((await response.json()) as { transcript: CallTranscription }).transcript;
};

export const placeCall = async (callDetails: {
  userId: CommunicationUserIdentifier;
  token: CommunicationTokenCredential;
  displayName: string;
  roomId: string;
  role: ParticipantRole;
}): Promise<CallAdapter> => {
  await addUserToRoom(callDetails.userId.communicationUserId, callDetails.roomId, callDetails.role);

  const callClient = createStatefulCallClient({
    userId: callDetails.userId
  });

  const callAgent = await callClient.createCallAgent(callDetails.token, {
    displayName: callDetails.displayName
  });

  const callLocator = { roomId: callDetails.roomId };

  const adapter = await createAzureCommunicationCallAdapterFromClient(callClient, callAgent, callLocator);
  adapter.joinCall();

  return adapter;
};

export const connectToCallAutomation = async (
  callAdaterState: CallAdapterState,
  callAutomationStarted: boolean,
  setCallAutomationStarted: (active: boolean) => void
): Promise<void> => {
  if (
    callAdaterState.call?.info !== undefined &&
    callAdaterState.call?.state === 'Connected' &&
    callAutomationStarted === false
  ) {
    const serverCallID = await callAdaterState.call.info.getServerCallId();
    console.log('Server call ID:', serverCallID);
    const response = await fetch('/connectRoomsCall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serverCallId: serverCallID
      })
    });
    if (!response.ok) {
      throw new Error('Failed to start call with transcription');
    } else {
      setCallAutomationStarted(true);
    }
  }
};
