// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatBaseSelectorProps, getLatestErrors } from './baseSelectors';
import { ActiveErrorMessage, ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';
import { ChatClientState, ChatError, ChatErrors, ChatErrorTarget } from '@internal/chat-stateful-client';

/**
 * Selector type for {@link ErrorBar} component.
 *
 * @public
 */
export type ErrorBarSelector = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
) => {
  activeErrorMessages: ActiveErrorMessage[];
};

/**
 * Select the first fiew active errors from the state for the {@link ErrorBar} component.
 *
 * In case there are many errors, only a few top errors are returned to avoid
 * filling up the UI with too many errors.
 *
 * Invariants:
 *   - {@link ErrorType} is never repeated in the returned errors.
 *   - Errors are returned in a fixed order by {@link ErrorType}.
 *
 * @public
 */
export const errorBarSelector: ErrorBarSelector = createSelector(
  [getLatestErrors],
  (latestErrors): { activeErrorMessages: ActiveErrorMessage[] } => {
    // The order in which the errors are returned is significant: The `ErrorBar` shows errors on the UI in that order.
    // There are several options for the ordering:
    //   - Sorted by when the errors happened (latest first / oldest first).
    //   - Stable sort by error type.
    //
    // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
    // have timestamps for errors.
    const activeErrorMessages: ActiveErrorMessage[] = [];
    let specificSendMessageErrorSeen = false;
    {
      const error = latestUnableToReachChatServiceError(latestErrors);
      if (error !== undefined) {
        activeErrorMessages.push(error);
      }
    }
    {
      const error = latestAccessDeniedError(latestErrors);
      if (error !== undefined) {
        activeErrorMessages.push(error);
      }
    }

    const sendMessageError = latestErrors['ChatThreadClient.sendMessage'];
    {
      const error = latestNotInThisThreadError(latestErrors);
      if (error !== undefined) {
        if (sendMessageError !== undefined) {
          activeErrorMessages.push({
            type: 'sendMessageNotInThisThread',
            // Set the latest timestamp of all the errors that translated to an active error.
            timestamp:
              sendMessageError.timestamp > (error.timestamp ?? 0) ? sendMessageError.timestamp : error.timestamp
          });
          specificSendMessageErrorSeen = true;
        } else {
          activeErrorMessages.push(error);
        }
      }
    }

    if (!specificSendMessageErrorSeen && sendMessageError !== undefined) {
      activeErrorMessages.push({ type: 'sendMessageGeneric', timestamp: sendMessageError.timestamp });
    }

    // We only return the first few errors to avoid filling up the UI with too many `MessageBar`s.
    activeErrorMessages.splice(maxErrorCount);
    return { activeErrorMessages: activeErrorMessages };
  }
);

const maxErrorCount = 3;

const accessErrorTargets: ChatErrorTarget[] = [
  'ChatThreadClient.getProperties',
  'ChatThreadClient.listMessages',
  'ChatThreadClient.listParticipants',
  'ChatThreadClient.sendMessage',
  'ChatThreadClient.sendTypingNotification'
];

const latestUnableToReachChatServiceError = (latestErrors: ChatErrors): ActiveErrorMessage | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'unableToReachChatService', (error: ChatError): boolean => {
    return !!error && !!error.innerError && error.innerError['code'] === 'REQUEST_SEND_ERROR';
  });
};

const latestAccessDeniedError = (latestErrors: ChatErrors): ActiveErrorMessage | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'accessDenied', (error: ChatError): boolean => {
    return !!error && !!error.innerError && error.innerError['statusCode'] === 401;
  });
};

const latestNotInThisThreadError = (latestErrors: ChatErrors): ActiveErrorMessage | undefined => {
  return latestActiveErrorSatisfying(latestErrors, 'userNotInThisThread', (error: ChatError): boolean => {
    if (!error || !error.innerError) {
      return false;
    }

    // Chat service returns 403 if a user has been removed from a thread.
    // Chat service returns either 400 or 404 if the thread ID is malformed, depending on how the thread ID is malformed.
    return [400, 403, 404].some((statusCode) => error.innerError['statusCode'] === statusCode);
  });
};

const latestActiveErrorSatisfying = (
  errors: ChatErrors,
  activeErrorType: ErrorType,
  predicate: (error: ChatError) => boolean
): ActiveErrorMessage | undefined => {
  const activeErrorMessages: ActiveErrorMessage[] = [];
  for (const target of accessErrorTargets) {
    const error = errors[target];
    if (predicate(error)) {
      activeErrorMessages.push({ type: activeErrorType, timestamp: error.timestamp });
    }
  }

  if (activeErrorMessages.length === 0) {
    return undefined;
  }
  // We're actually sure that both timestamps will always exist, because we set them above.
  activeErrorMessages.sort(
    (a: ActiveErrorMessage, b: ActiveErrorMessage) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
  );
  return activeErrorMessages[activeErrorMessages.length - 1];
};
