// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveErrorMessage, ErrorType } from '@internal/react-components';
import { TrackedErrors } from '../types/ErrorTracking';

/**
 * Take the set of active errors, and filter to only those that are newer than previously dismissed errors or have never been dismissed.
 *
 * @private
 */
export const filterLatestErrors = (
  activeErrors: ActiveErrorMessage[],
  trackedErrors: TrackedErrors
): ActiveErrorMessage[] => {
  const filteredErrors = activeErrors.filter((activeError) => {
    const trackedError = trackedErrors[activeError.type];
    return (
      !trackedError || !trackedError.lastDismissedAt || trackedError.lastDismissedAt < trackedError.mostRecentlyActive
    );
  });
  return filteredErrors;
};

/**
 * Maintain a record of the most recently active error for each error type.
 *
 * @private
 */
export const updateTrackedErrorsWithActiveErrors = (
  existingTrackedErrors: TrackedErrors,
  activeErrors: ActiveErrorMessage[]
): TrackedErrors => {
  const trackedErrors: TrackedErrors = {};

  // Only care about active errors. If errors are no longer active we do not track that they have been previously dismissed.
  for (const activeError of activeErrors) {
    const existingTrackedError = existingTrackedErrors[activeError.type];
    trackedErrors[activeError.type] = {
      mostRecentlyActive: activeError.timestamp ?? existingTrackedError?.mostRecentlyActive ?? new Date(Date.now()),
      lastDismissedAt: existingTrackedError?.lastDismissedAt
    };
  }

  return trackedErrors;
};

/**
 * Create a record for when the error was most recently dismissed for tracking dismissed errors.
 *
 * @private
 */
export const trackErrorAsDismissed = (errorType: ErrorType, trackedErrors: TrackedErrors): TrackedErrors => {
  const now = new Date(Date.now());
  const existingError = trackedErrors[errorType];

  return {
    ...trackedErrors,
    [errorType]: {
      ...(existingError || {}),
      lastDismissedAt: now
    }
  };
};
