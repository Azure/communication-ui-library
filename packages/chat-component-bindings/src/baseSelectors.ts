// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClientState, ChatErrors, ChatMessageWithStatus } from '@internal/chat-stateful-client';
import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

/**
 * Common props for selectors for {@link ChatClientState}.
 *
 * @public
 */
export type ChatBaseSelectorProps = {
  threadId: string;
};

/**
 * @private
 */
export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

/**
 * @private
 */
export const getDisplayName = (state: ChatClientState): string => state.displayName;

/**
 * @private
 */
export const getChatMessages = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatMessageWithStatus } => (props.threadId && state.threads[props.threadId]?.chatMessages) || {};

/**
 * @private
 */
export const getParticipants = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): { [key: string]: ChatParticipant } => (props.threadId && state.threads[props.threadId]?.participants) || {};

/**
 * @private
 */
export const getReadReceipts = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): ChatMessageReadReceipt[] | undefined => {
  return state.threads[props?.threadId]?.readReceipts;
};

/**
 * @private
 */
export const getIsLargeGroup = (state: ChatClientState, props: ChatBaseSelectorProps): boolean => {
  const participants = state.threads[props.threadId]?.participants;
  return !!participants && Object.values(participants).length > 20;
};

/**
 * @private
 */
export const getLatestReadTime = (state: ChatClientState, props: ChatBaseSelectorProps): Date =>
  (props.threadId && state.threads[props.threadId]?.latestReadTime) || new Date(0);

/**
 * @private
 */
export const getTypingIndicators = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
): TypingIndicatorReceivedEvent[] => {
  return (props.threadId && state.threads[props.threadId]?.typingIndicators) || [];
};

/**
 * @private
 */
export const getLatestErrors = (state: ChatClientState): ChatErrors => state.latestErrors;
