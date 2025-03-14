// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAdapterState, CallTranscription } from '@azure/communication-react';

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

export const connectToCallAutomation = async (
  callAdaterState: CallAdapterState,
  callAutomationStarted: boolean
): Promise<boolean> => {
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
    }
    return true;
  }
  return false;
};
