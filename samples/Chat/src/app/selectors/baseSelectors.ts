// © Microsoft Corporation. All rights reserved.

import { ChatClientState } from '@azure/acs-chat-declarative';
import { BaseSelectorProps } from '@azure/acs-chat-selector';
import { ChatParticipant } from '@azure/communication-chat';

export const getUserId = (state: ChatClientState): string => state.userId;

export const getTopicName = (state: ChatClientState, props: BaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.threadInfo?.topic || '';
};

export const getParticipants = (state: ChatClientState, props: BaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();
