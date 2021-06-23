// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatBaseSelectorProps, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { ChatParticipant } from '@azure/communication-chat';

export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads[props.threadId]?.properties?.topic || '';
};

export const getParticipants = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatParticipant } => (props.threadId && state.threads[props.threadId]?.participants) || {};
