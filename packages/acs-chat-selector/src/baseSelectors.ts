// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatMessageWithStatus } from 'chat-stateful-client';
import { ChatParticipant, ChatMessageReadReceipt } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { FlatCommunicationIdentifier, toFlatCommunicationIdentifier } from 'acs-ui-common';
import { MessageContentType } from 'react-components';
export type ChatBaseSelectorProps = {
  threadId: string;
};

export const getSelectorProps = <T>(_: ChatClientState, props: T): T => props;
export const getUserId = (state: ChatClientState): FlatCommunicationIdentifier =>
  toFlatCommunicationIdentifier(state.userId);

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
): Map<FlatCommunicationIdentifier, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

export const getIsLargeGroup = (state: ChatClientState, props: ChatBaseSelectorProps): boolean => {
  const participants = state.threads.get(props.threadId)?.participants;
  return !!participants && participants.size > 20;
};

export const getLatestReadTime = (state: ChatClientState, props: ChatBaseSelectorProps): Date =>
  (props.threadId && state.threads.get(props.threadId)?.latestReadTime) || new Date(0);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.properties?.topic || '';
};

export const getTypingIndicators = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): TypingIndicatorReceivedEvent[] => {
  return (props.threadId && state.threads.get(props.threadId)?.typingIndicators) || [];
};

export const sanitizedMessageContentType = (type: string): MessageContentType => {
  const lowerCaseType = type.toLowerCase();
  return lowerCaseType === 'text' || lowerCaseType === 'html' || lowerCaseType === 'richtext/html'
    ? lowerCaseType
    : 'unknown';
};
