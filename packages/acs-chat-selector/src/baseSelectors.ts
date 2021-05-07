// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatMessageWithStatus, TypingIndicator } from '@azure/acs-chat-declarative';
import { ChatParticipant, ChatMessageReadReceipt } from '@azure/communication-chat';
export type BaseSelectorProps = {
  threadId: string;
};

export const getSelectorProps = <T>(_: ChatClientState, props: T): T => props;
export const getUserId = (state: ChatClientState): string => state.userId;

export const getDisplayName = (state: ChatClientState): string => state.displayName;
export const getChatMessages = (state: ChatClientState, props: BaseSelectorProps): Map<string, ChatMessageWithStatus> =>
  (props.threadId && state.threads.get(props.threadId)?.chatMessages) || new Map();

export const getReadReceipts = (state: ChatClientState, props: BaseSelectorProps): ChatMessageReadReceipt[] =>
  (props.threadId && state.threads.get(props.threadId)?.readReceipts) || [];

export const getParticipants = (state: ChatClientState, props: BaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

export const getIsLargeGroup = (state: ChatClientState, props: BaseSelectorProps): boolean => {
  const participants = state.threads.get(props.threadId)?.participants;
  return !!participants && participants.size > 20;
};

export const getLatestReadTime = (state: ChatClientState, props: BaseSelectorProps): Date =>
  (props.threadId && state.threads.get(props.threadId)?.latestReadTime) || new Date(0);

export const getCoolPeriod = (state: ChatClientState, props: BaseSelectorProps): Date =>
  (props.threadId && state.threads.get(props.threadId)?.coolPeriod) || new Date(0);

export const getTopicName = (state: ChatClientState, props: BaseSelectorProps): string => {
  return state.threads.get(props.threadId)?.threadInfo?.topic || '';
};

export const getTypingIndicators = (state: ChatClientState, props: BaseSelectorProps): TypingIndicator[] => {
  return (props.threadId && state.threads.get(props.threadId)?.typingIndicators) || [];
};
