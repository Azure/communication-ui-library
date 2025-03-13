// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAdapter, CallAdapterState, CallTranscription, CommonCallAdapter } from '@azure/communication-react';

export type SummarizeResult = {
  recap: string;
  chapters: {
    chapterTitle: string;
    narrative: string;
  }[];
};

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

export const getCallSummaryFromServer = async (adapter: CommonCallAdapter): Promise<SummarizeResult> => {
  console.log('Getting summary from server...');

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callId = adapter.getState().call?.id;
    if (!callId) {
      console.error('Call ID not found');
      throw new Error('Call ID not found');
    }

    const response = await fetch('/summarizeTranscript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ callId })
    });
    console.log('/summarizeTranscript response', response);

    if (!response.ok) {
      alert('Summarization request failed');
      console.error('Response Failed: ', response.statusText);
      throw new Error('Summarization request failed');
    }

    const result = await response.json();
    console.log('Summary result:', result);
    return result as SummarizeResult;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
};
