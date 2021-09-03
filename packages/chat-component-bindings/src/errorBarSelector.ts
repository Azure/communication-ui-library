// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getLatestErrors } from './baseSelectors';
import { ActiveError, ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';
import { ChatError, ChatErrors, ChatErrorTarget } from '@internal/chat-stateful-client';

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
export const errorBarSelector = createSelector([getLatestErrors], (latestErrors): { activeErrors: ActiveError[] } => {
  // The order in which the errors are returned is significant: The `ErrorBar` shows errors on the UI in that order.
  // There are several options for the ordering:
  //   - Sorted by when the errors happened (latest first / oldest first).
  //   - Stable sort by error type.
  //
  // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
  // have timestamps for errors.
  const activeErrors: ActiveError[] = [];
  let specificSendMessageErrorSeen = false;
  {
    const error = latestUnableToReachChatServiceError(latestErrors);
    if (error !== undefined) {
      activeErrors.push(error);
    }
  }
  {
    const error = latestAccessDeniedError(latestErrors);
    if (error !== undefined) {
      activeErrors.push(error);
    }
  }

  const sendMessageError = latestErrors['ChatThreadClient.sendMessage'];
  {
    const error = latestNotInThisThreadError(latestErrors);
    if (error !== undefined) {
      if (sendMessageError !== undefined) {
        activeErrors.push({
          type: 'sendMessageNotInThisThread',
          // Set the latest timestamp of all the errors that translated to an active error.
          timestamp: sendMessageError.timestamp > (error.timestamp ?? 0) ? sendMessageError.timestamp : error.timestamp
        });
        specificSendMessageErrorSeen = true;
      } else {
        activeErrors.push(error);
      }
    }
  }

  if (!specificSendMessageErrorSeen && sendMessageError !== undefined) {
    activeErrors.push({ type: 'sendMessageGeneric', timestamp: sendMessageError.timestamp });
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

const latestUnableToReachChatServiceError = (latestErrors: ChatErrors): ActiveError | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'unableToReachChatService', (error: ChatError): boolean => {
    return !!error && !!error.inner && error.inner['code'] === 'REQUEST_SEND_ERROR';
  });
};

const latestAccessDeniedError = (latestErrors: ChatErrors): ActiveError | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'accessDenied', (error: ChatError): boolean => {
    return !!error && !!error.inner && error.inner['statusCode'] === 401;
  });
};

const latestNotInThisThreadError = (latestErrors: ChatErrors): ActiveError | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'sendMessageNotInThisThread', (error: ChatError): boolean => {
    if (!error || !error.inner) {
      return false;
    }

    // Chat service returns 403 if a user has been removed from a thread.
    // Chat service returns either 400 or 404 if the thread ID is malformed, depending on how the thread ID is malformed.
    return [400, 403, 404].some((statusCode) => error.inner['statusCode'] === statusCode);
  });
};

const latestActiveErrorSatisfying = (
  errors: ChatErrors,
  activeErrorType: ErrorType,
  predicate: (error: ChatError) => boolean
): ActiveError | undefined => {
  const activeErrors: ActiveError[] = [];
  for (const target of accessErrorTargets) {
    const error = errors[target];
    if (predicate(error)) {
      activeErrors.push({ type: activeErrorType, timestamp: error.timestamp });
    }
  }

  if (activeErrors.length === 0) {
    return undefined;
  }
  // We're actually sure that both timestamps will always exist, because we set them above.
  activeErrors.sort((a: ActiveError, b: ActiveError) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0));
  return activeErrors[activeErrors.length - 1];
};
