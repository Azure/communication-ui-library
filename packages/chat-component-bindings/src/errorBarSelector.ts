// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getLatestErrors } from './baseSelectors';
import { ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';

/**
 * Select active errors from the state for the `ErrorBar` component.
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
  if (latestErrors['ChatThreadClient.sendMessage'] !== undefined) {
    return { activeErrors: ['sendMessageGeneric'] };
  }
  return { activeErrors: [] };
});
