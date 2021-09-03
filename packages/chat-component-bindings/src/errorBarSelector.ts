// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getLatestErrors } from './baseSelectors';
import { ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';
import { ChatErrors, ChatErrorTarget } from '@internal/chat-stateful-client';

/**
 * Select the first fiew active errors from the state for the `ErrorBar` component.
 *
 * In case there are many errors, only a few top errors are returned to avoid
 * filling up the UI with too many errors.
 *
 * Invariants:
 *   - `ErrorType` is never repeated in the returned errors.
 *   - Errors are returned in a fixed order by `ErrorType`.
 */
export const errorBarSelector = createSelector([getLatestErrors], (latestErrors): { activeErrors: ErrorType[] } => {
  // The order in which the errors are returned is significant: The `ErrorBar` shows errors on the UI in that order.
  // There are several options for the ordering:
  //   - Sorted by when the errors happened (latest first / oldest first).
  //   - Stable sort by error type.
  //
  // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
  // have timestamps for errors.
  const activeErrors: ErrorType[] = [];
  let specificSendMessageErrorSeen = false;
  if (hasUnableToReachChatServiceError(latestErrors)) {
    activeErrors.push('unableToReachChatService');
  }
  if (hasAccessDeniedError(latestErrors)) {
    activeErrors.push('accessDenied');
  }
  if (hasNotInThisThreadError(latestErrors)) {
    if (latestErrors['ChatThreadClient.sendMessage'] !== undefined) {
      activeErrors.push('sendMessageNotInThisThread');
      specificSendMessageErrorSeen = true;
    } else {
      activeErrors.push('userNotInThisThread');
    }
  }
  if (!specificSendMessageErrorSeen && latestErrors['ChatThreadClient.sendMessage'] !== undefined) {
    activeErrors.push('sendMessageGeneric');
  }

  // We only return the first few errors to avoid filling up the UI with too many `MessageBar`s.
  activeErrors.splice(maxErrorCount);
  return { activeErrors: activeErrors };
});

const maxErrorCount = 3;

const accessErrorTargets: ChatErrorTarget[] = [
  'ChatThreadClient.getProperties',
  'ChatThreadClient.listMessages',
  'ChatThreadClient.listParticipants',
  'ChatThreadClient.sendMessage',
  'ChatThreadClient.sendTypingNotification'
];

const hasUnableToReachChatServiceError = (latestErrors: ChatErrors): boolean => {
  for (const target of accessErrorTargets) {
    const error = latestErrors[target]?.inner;
    if (error !== undefined && error['code'] === 'REQUEST_SEND_ERROR') {
      return true;
    }
  }
  return false;
};

const hasAccessDeniedError = (latestErrors: ChatErrors): boolean => {
  for (const target of accessErrorTargets) {
    const error = latestErrors[target]?.inner;
    if (error !== undefined && error['statusCode'] === 401) {
      return true;
    }
  }
  return false;
};

const hasNotInThisThreadError = (latestErrors: ChatErrors): boolean => {
  for (const target of accessErrorTargets) {
    const error = latestErrors[target]?.inner;
    // Chat service returns 403 if a user has been removed from a thread.
    // Chat service returns either 401 or 403 if the thread ID is malformed, depending on how the thread ID is malformed.
    if (error !== undefined && (error['statusCode'] === 400 || error['statusCode'] === 403)) {
      return true;
    }
  }
  return false;
};
