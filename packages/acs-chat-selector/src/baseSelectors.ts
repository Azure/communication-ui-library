// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatClientState,
  ChatMessageWithStatus,
  CommunicationIdentifierAsKey,
  getCommunicationIdentifierAsKey
} from 'chat-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';
import { ChatParticipant, ChatMessageReadReceipt } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
export type ChatBaseSelectorProps = {
  threadId: string;
};

export const getSelectorProps = <T>(_: ChatClientState, props: T): T => props;
export const getUserId = (state: ChatClientState): string => communicationIdentifierToString(state.userId);

export const getDisplayName = (state: ChatClientState): string => state.displayName;
export const getChatMessages = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): Map<string, ChatMessageWithStatus> =>
  (props.threadId && state.threads.get(props.threadId)?.chatMessages) || new Map();

export const getReadReceipts = (state: ChatClientState, props: ChatBaseSelectorProps): ChatMessageReadReceipt[] =>
  (props.threadId && state.threads.get(props.threadId)?.readReceipts) || [];

export const getParticipants = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): Map<CommunicationIdentifierAsKey, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

export const getIsLargeGroup = (state: ChatClientState, props: ChatBaseSelectorProps): boolean => {
  const participants = state.threads.get(props.threadId)?.participants;
  return !!participants && participants.size > 20;
};

export const getLatestReadTime = (state: ChatClientState, props: ChatBaseSelectorProps): Date =>
  (props.threadId && state.threads.get(props.threadId)?.latestReadTime) || new Date(0);

export const getCoolPeriod = (state: ChatClientState, props: ChatBaseSelectorProps): Date =>
  (props.threadId && state.threads.get(props.threadId)?.coolPeriod) || new Date(0);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.properties?.topic || '';
};

export const getTypingIndicators = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): TypingIndicatorReceivedEvent[] => {
  return (props.threadId && state.threads.get(props.threadId)?.typingIndicators) || [];
};

// Bridge IDs to strings used in the pure components.
//
// The stateful client stores ACS ids as objects and the pure components use plain strings.
// All instances of IDs must be translated uniformly by the selectors.
export const communicationIdentifierToString = (i: CommunicationIdentifier | undefined): string => {
  return i ? getCommunicationIdentifierAsKey(i) : '';
};
