// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getDiagnostics, getLatestErrors } from './baseSelectors';
import { ActiveError, ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';
import { CallErrors, CallErrorTarget } from '@internal/calling-stateful-client';

/**
 * Select the first 3 active errors from the state for the `ErrorBar` component.
 *
 * In case there are many errors, only the first three errors are returned to avoid
 * filling up the UI with too many errors.
 *
 * Invariants:
 *   - `ErrorType` is never repeated in the returned errors.
 *   - Errors are returned in a fixed order by `ErrorType`.
 */
export const errorBarSelector = createSelector(
  [getLatestErrors, getDiagnostics],
  (latestErrors: CallErrors, diagnostics): { activeErrors: ActiveError[] } => {
    // The order in which the errors are returned is significant: The `ErrorBar` shows errors on the UI in that order.
    // There are several options for the ordering:
    //   - Sorted by when the errors happened (latest first / oldest first).
    //   - Stable sort by error type.
    //
    // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
    // have timestamps for errors.
    const activeErrors: ActiveError[] = [];

    // Errors reported via diagnostics are more reliable than from API method failures, so process those first.
    if (diagnostics?.network.latest.networkReconnect?.value === 3) {
      activeErrors.push({ type: 'callingNetworkFailure' });
    }

    // Prefer to show errors with privacy implications.
    appendActiveErrorIfDefined(activeErrors, latestErrors, 'Call.stopVideo', 'stopVideoGeneric');
    appendActiveErrorIfDefined(activeErrors, latestErrors, 'Call.mute', 'muteGeneric');
    appendActiveErrorIfDefined(activeErrors, latestErrors, 'Call.stopScreenSharing', 'stopScreenShareGeneric');

    appendActiveErrorIfDefined(activeErrors, latestErrors, 'Call.startVideo', 'startVideoGeneric');
    appendActiveErrorIfDefined(activeErrors, latestErrors, 'Call.unmute', 'unmuteGeneric');

    // We only return the first few errors to avoid filling up the UI with too many `MessageBar`s.
    activeErrors.splice(maxErrorCount);
    return { activeErrors: activeErrors };
  }
);

const appendActiveErrorIfDefined = (
  activeErrors: ActiveError[],
  latestErrors: CallErrors,
  target: CallErrorTarget,
  activeErrorType: ErrorType
): void => {
  if (latestErrors[target] === undefined) {
    return;
  }
  activeErrors.push({
    type: activeErrorType,
    timestamp: latestErrors[target].timestamp
  });
};

const maxErrorCount = 3;
