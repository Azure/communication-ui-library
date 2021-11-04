// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallingBaseSelectorProps, getDeviceManager, getDiagnostics, getLatestErrors } from './baseSelectors';
import { ActiveErrorMessage, ErrorType } from '@internal/react-components';
import { createSelector } from 'reselect';
import { CallClientState, CallErrors, CallErrorTarget } from '@internal/calling-stateful-client';
import { DiagnosticQuality } from '@azure/communication-calling';

/**
 * Selector type for {@link ErrorBar} component.
 *
 * @public
 */
export type ErrorBarSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  activeErrorMessages: ActiveErrorMessage[];
};

/**
 * Select the first 3 active errors from the state for the `ErrorBar` component.
 *
 * In case there are many errors, only the first three errors are returned to avoid
 * filling up the UI with too many errors.
 *
 * Invariants:
 *   - `ErrorType` is never repeated in the returned errors.
 *   - Errors are returned in a fixed order by `ErrorType`.
 *
 * @public
 */
export const errorBarSelector: ErrorBarSelector = createSelector(
  [getLatestErrors, getDiagnostics, getDeviceManager],
  (latestErrors: CallErrors, diagnostics, deviceManager): { activeErrorMessages: ActiveErrorMessage[] } => {
    // The order in which the errors are returned is significant: The `ErrorBar` shows errors on the UI in that order.
    // There are several options for the ordering:
    //   - Sorted by when the errors happened (latest first / oldest first).
    //   - Stable sort by error type.
    //
    // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
    // have timestamps for errors.
    const activeErrorMessages: ActiveErrorMessage[] = [];

    // Errors reported via diagnostics are more reliable than from API method failures, so process those first.
    if (
      diagnostics?.network.latest.networkReceiveQuality?.value === DiagnosticQuality.Bad ||
      diagnostics?.network.latest.networkReceiveQuality?.value == DiagnosticQuality.Poor
    ) {
      activeErrorMessages.push({ type: 'callNetworkQualityLow' });
    }
    if (diagnostics?.media.latest.noSpeakerDevicesEnumerated) {
      activeErrorMessages.push({ type: 'callNoSpeakerFound' });
    }
    if (diagnostics?.media.latest.noMicrophoneDevicesEnumerated) {
      activeErrorMessages.push({ type: 'callNoMicrophoneFound' });
    }
    if (deviceManager.deviceAccess?.audio === false || diagnostics?.media.latest.microphoneNotFunctioning) {
      activeErrorMessages.push({ type: 'callMicrophoneAccessDenied' });
    }
    if (diagnostics?.media.latest.microphoneMuteUnexpectedly) {
      activeErrorMessages.push({ type: 'callMicrophoneMutedBySystem' });
    }
    if (diagnostics?.media.latest.microphonePermissionDenied) {
      activeErrorMessages.push({ type: 'callMacOsMicrophoneAccessDenied' });
    }

    if (deviceManager.deviceAccess?.video === false) {
      activeErrorMessages.push({ type: 'callCameraAccessDenied' });
    } else {
      if (diagnostics?.media.latest.cameraFreeze) {
        activeErrorMessages.push({ type: 'callCameraAlreadyInUse' });
      }
    }

    if (diagnostics?.media.latest.cameraPermissionDenied) {
      activeErrorMessages.push({ type: 'callMacOsCameraAccessDenied' });
    }
    if (diagnostics?.media.latest.screenshareRecordingDisabled) {
      activeErrorMessages.push({ type: 'callMacOsScreenShareAccessDenied' });
    }

    // Prefer to show errors with privacy implications.
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.stopVideo', 'stopVideoGeneric');
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.mute', 'muteGeneric');
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.stopScreenSharing', 'stopScreenShareGeneric');

    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.startVideo', 'startVideoGeneric');
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.unmute', 'unmuteGeneric');

    // We only return the first few errors to avoid filling up the UI with too many `MessageBar`s.
    activeErrorMessages.splice(maxErrorCount);
    return { activeErrorMessages: activeErrorMessages };
  }
);

const appendActiveErrorIfDefined = (
  activeErrorMessages: ActiveErrorMessage[],
  latestErrors: CallErrors,
  target: CallErrorTarget,
  activeErrorType: ErrorType
): void => {
  if (latestErrors[target] === undefined) {
    return;
  }
  activeErrorMessages.push({
    type: activeErrorType,
    timestamp: latestErrors[target].timestamp
  });
};

const maxErrorCount = 3;
