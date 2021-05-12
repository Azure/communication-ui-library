// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from 'chat-stateful-client';
import { ChatBaseSelectorProps, communicationIdentifierToString } from '@azure/acs-chat-selector';
import { ChatParticipant } from '@azure/communication-chat';

export const getUserId = (state: ChatClientState): string => communicationIdentifierToString(state.userId);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.properties?.topic || '';
};

export const getParticipants = (state: ChatClientState, props: ChatBaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();
