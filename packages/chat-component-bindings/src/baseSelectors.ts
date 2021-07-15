// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatErrors, ChatMessageWithStatus } from '@internal/chat-stateful-client';
import { ChatParticipant, ChatMessageReadReceipt } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { MessageContentType } from '@internal/react-components';
export type ChatBaseSelectorProps = {
  threadId: string;
};

export const getSelectorProps = <T>(_: ChatClientState, props: T): T => props;
export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

export const getDisplayName = (state: ChatClientState): string => state.displayName;
export const getChatMessages = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatMessageWithStatus } => (props.threadId && state.threads[props.threadId]?.chatMessages) || {};

export const getReadReceipts = (state: ChatClientState, props: ChatBaseSelectorProps): ChatMessageReadReceipt[] =>
  (props.threadId && state.threads[props.threadId]?.readReceipts) || [];

export const getParticipants = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatParticipant } => (props.threadId && state.threads[props.threadId]?.participants) || {};

export const getIsLargeGroup = (state: ChatClientState, props: ChatBaseSelectorProps): boolean => {
  const participants = state.threads[props.threadId]?.participants;
  return !!participants && Object.values(participants).length > 20;
};

export const getLatestReadTime = (state: ChatClientState, props: ChatBaseSelectorProps): Date =>
  (props.threadId && state.threads[props.threadId]?.latestReadTime) || new Date(0);

export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads[props.threadId]?.properties?.topic || '';
};

export const getTypingIndicators = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): TypingIndicatorReceivedEvent[] => {
  return (props.threadId && state.threads[props.threadId]?.typingIndicators) || [];
};

export const sanitizedMessageContentType = (type: string): MessageContentType => {
  const lowerCaseType = type.toLowerCase();
  return lowerCaseType === 'text' || lowerCaseType === 'html' || lowerCaseType === 'richtext/html'
    ? lowerCaseType
    : 'unknown';
};

export const getLatestErrors = (state: ChatClientState): ChatErrors => state.latestErrors;
