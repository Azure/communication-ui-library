// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from '@azure/acs-chat-declarative';
import { BaseSelectorProps, communicationIdentifierToString } from '@azure/acs-chat-selector';
import { ChatParticipant } from '@azure/communication-chat';

export const getUserId = (state: ChatClientState): string => communicationIdentifierToString(state.userId);

export const getTopicName = (state: ChatClientState, props: BaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.properties?.topic || '';
};

export const getParticipants = (state: ChatClientState, props: BaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();
