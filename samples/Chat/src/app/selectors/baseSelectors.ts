// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { ChatClientState } from 'chat-stateful-client';
import { ChatBaseSelectorProps } from 'chat-component-bindings';
import { ChatParticipant } from '@azure/communication-chat';

export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.properties?.topic || '';
};

export const getParticipants = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatParticipant } => (props.threadId && state.threads.get(props.threadId)?.participants) || {};
