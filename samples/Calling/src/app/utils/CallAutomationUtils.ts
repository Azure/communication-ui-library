// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RemoteParticipant } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapter, CallAdapterState, CommonCallAdapter, RemoteParticipantState } from '@azure/communication-react';

export type SummarizeResult = {
  recap: string;
  chapters: {
    chapterTitle: string;
    narrative: string;
  }[];
};

export type CallTranscription = {
  text: string;
  confidence: number;
  participant: CommunicationUserIdentifier;
  resultState: 'intermediate' | 'final';
}[];

export const fetchTranscript = async (serverCallId: string): Promise<CallTranscription> => {
  const response = await fetch(`/fetchTranscript`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId
    })
  });
  if (!response.ok) {
    console.error('Failed to fetch transcript:', response);
    return [];
  }

  return ((await response.json()) as { transcript: CallTranscription }).transcript;
};

export const startTranscription = async (
  serverCallId: string,
  transcriptionOptions?: {
    locale?: string;
  }
): Promise<boolean> => {
  console.log('Starting transcription for call:', serverCallId);
  const response = await fetch('/startTranscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId,
      options: transcriptionOptions
    })
  });
  if (!response.ok) {
    console.error('Failed to start transcription:', response);
    return false;
  }
  console.log('Started transcription:', transcriptionOptions);
  return true;
};

export const stopTranscription = async (serverCallId: string): Promise<boolean> => {
  console.log('Stopping transcription for call:', serverCallId);

  const response = await fetch('/stopTranscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      serverCallId
    })
  });
  if (!response.ok) {
    console.error('Failed to stop transcription:', response);
    return false;
  }
  console.log('Stopped transcription');
  return true;
};

export const connectToCallAutomation = async (callAdaterState: CallAdapterState): Promise<boolean> => {
  if (callAdaterState.call?.info !== undefined && callAdaterState.call?.state === 'Connected') {
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
    const serverCallId = await adapter.getState().call?.info?.getServerCallId();
    if (!serverCallId) {
      console.error('Call ID not found');
      throw new Error('Call ID not found');
    }

    const response = await fetch('/summarizeTranscript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ serverCallId: serverCallId })
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

/**
 * updateRemoteParticipants - This function is used to update the remote participants in the call. to be
 * stored in the server to be used in the transcription and summary.
 * @param callAdapter - The call adapter instance.
 */
export const updateRemoteParticipants = async (
  remoteParticipants: RemoteParticipant[],
  callId: string
): Promise<void> => {
  if (!remoteParticipants) {
    console.warn('no remote participants found');
    return;
  }
  const remoteParticipantsDisplayInfo = remoteParticipants.map((participant: RemoteParticipantState) => {
    if ('communicationUserId' in participant.identifier) {
      return {
        communicationUserId: participant.identifier.communicationUserId,
        displayName: participant.displayName
      };
    } else {
      return {};
    }
  });

  const response = await fetch('/updateRemoteParticipants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      callCorrelationId: callId,
      remoteParticipants: remoteParticipantsDisplayInfo
    })
  });
  if (!response.ok) {
    console.error('Failed to update remote participants:', response);
  }
  console.log('Updated remote participants:', remoteParticipantsDisplayInfo);
};

export const updateLocalParticipant = async (callAdapter: CallAdapter): Promise<void> => {
  const localParticipant = {
    communicationUserId: (callAdapter.getState().userId as CommunicationUserIdentifier).communicationUserId,
    displayName: callAdapter.getState().displayName
  };
  if (!localParticipant) {
    console.warn('no local participant found');
    return;
  }
  const localParticipantDisplayInfo = {
    communicationUserId: localParticipant.communicationUserId,
    displayName: localParticipant.displayName
  };

  const response = await fetch('/updateLocalParticipant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      callCorrelationId: callAdapter.getState().call?.id,
      localParticipant: localParticipantDisplayInfo
    })
  });
  if (!response.ok) {
    console.error('Failed to update local participant:', response);
  }
  console.log('Updated local participant:', localParticipantDisplayInfo);
};
