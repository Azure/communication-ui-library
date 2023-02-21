// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, MessageBarType } from '@fluentui/react';
import { ActiveErrorMessage, ErrorType } from './ErrorBar';

/**
 * @private
 *
 * @param fileName
 * @param length
 * @returns string
 */
export const truncatedFileName = (fileName: string, length: number): string => {
  return fileName.substring(0, length).trimEnd() + (fileName.length > length ? '... ' : '');
};

/**
 * @private
 *
 * @param fileName
 * @returns string
 */
export const extension = (fileName: string): string => fileName.split('.').pop() || '';

/**
 * @private
 */
export interface DismissedError {
  type: ErrorType;
  dismissedAt: Date;
  activeSince?: Date;
}

/**
 * @private
 * @param dismissedErrors
 * @param toDismiss
 * @returns DismissedError[]
 * Always returns a new Array so that the state variable is updated, trigerring a render.
 */
export const dismissError = (dismissedErrors: DismissedError[], toDismiss: ActiveErrorMessage): DismissedError[] => {
  const now = new Date(Date.now());
  for (const error of dismissedErrors) {
    if (error.type === toDismiss.type) {
      // Bump the timestamp for latest dismissal of this error to now.
      error.dismissedAt = now;
      error.activeSince = toDismiss.timestamp;
      return Array.from(dismissedErrors);
    }
  }

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedErrors,
    {
      type: toDismiss.type,
      dismissedAt: now,
      activeSince: toDismiss.timestamp
    }
  ];
};

/**
 * @private
 * @param activeErrorMessages
 * @param dismissedErrors
 * @returns DismissedError[]
 *  Returns a new Array if and only if contents change, to avoid re-rendering when nothing was dropped.
 */
export const dropDismissalsForInactiveErrors = (
  activeErrorMessages: ActiveErrorMessage[],
  dismissedErrors: DismissedError[]
): DismissedError[] => {
  const active = new Map();
  for (const message of activeErrorMessages) {
    active.set(message.type, message);
  }

  // For an error such that:
  // * It was previously active, and dismissed.
  // * It did not have a timestamp associated with it.
  // * It is no longer active.
  //
  // We remove it from dismissals. When it becomes active again next time, it will be shown again on the UI.
  const shouldDeleteDismissal = (dismissed: DismissedError): boolean =>
    dismissed.activeSince === undefined && active.get(dismissed.type) === undefined;

  if (dismissedErrors.some((dismissed) => shouldDeleteDismissal(dismissed))) {
    return dismissedErrors.filter((dismissed) => !shouldDeleteDismissal(dismissed));
  }
  return dismissedErrors;
};

/**
 * @private
 * @param activeErrorMessages
 * @param dismissedErrors
 * @returns ActiveErrorMessage[]
 */
export const errorsToShow = (
  activeErrorMessages: ActiveErrorMessage[],
  dismissedErrors: DismissedError[],
  mountTimestamp?: Date
): ActiveErrorMessage[] => {
  const dismissed: Map<ErrorType, DismissedError> = new Map();
  for (const error of dismissedErrors) {
    dismissed.set(error.type, error);
  }

  return activeErrorMessages.filter((error) => {
    if (mountTimestamp && error.timestamp && mountTimestamp > error.timestamp) {
      // Error has a timestamp and it is older than when the component was mounted.
      return false;
    }

    const dismissal = dismissed.get(error.type);
    if (!dismissal) {
      // This error was never dismissed.
      return true;
    }
    if (!error.timestamp) {
      // No timestamp associated with the error. In this case, the existence of a dismissal is enough to suppress the error.
      return false;
    }
    // Error has an associated timestamp, so compare with last dismissal.
    return error.timestamp > dismissal.dismissedAt;
  });
};

/**
 * @private
 * @param errorType
 * @returns MessageBarType
 */
export const messageBarType = (errorType: ErrorType): MessageBarType => {
  switch (errorType) {
    case 'callNetworkQualityLow':
    case 'callNoSpeakerFound':
    case 'callNoMicrophoneFound':
    case 'callMicrophoneAccessDenied':
    case 'callMicrophoneAccessDeniedSafari':
    case 'callMicrophoneMutedBySystem':
    case 'callMicrophoneUnmutedBySystem':
    case 'callMacOsMicrophoneAccessDenied':
    case 'callLocalVideoFreeze':
    case 'callCameraAccessDenied':
    case 'callCameraAccessDeniedSafari':
    case 'callCameraAlreadyInUse':
    case 'callVideoStoppedBySystem':
    case 'callVideoRecoveredBySystem':
    case 'callMacOsCameraAccessDenied':
    case 'callMacOsScreenShareAccessDenied':
    case 'startScreenSharingGeneric':
      return MessageBarType.warning;
    default:
      return MessageBarType.error;
  }
};

/**
 * @private
 * @param errorType
 * @returns IIconProps | undefined
 */
export const messageBarIconProps = (errorType: ErrorType): IIconProps | undefined => {
  const iconName = customIconName[errorType];
  return iconName ? { iconName } : undefined;
};

/**
 * @private
 */
export const customIconName: Partial<{ [key in ErrorType]: string }> = {
  callNetworkQualityLow: 'ErrorBarCallNetworkQualityLow',
  callNoSpeakerFound: 'ErrorBarCallNoSpeakerFound',
  callNoMicrophoneFound: 'ErrorBarCallNoMicrophoneFound',
  callMicrophoneAccessDenied: 'ErrorBarCallMicrophoneAccessDenied',
  callMicrophoneAccessDeniedSafari: 'ErrorBarCallMicrophoneAccessDenied',
  callMicrophoneMutedBySystem: 'ErrorBarCallMicrophoneMutedBySystem',
  callMicrophoneUnmutedBySystem: 'ErrorBarCallMicrophoneUnmutedBySystem',
  callMacOsMicrophoneAccessDenied: 'ErrorBarCallMacOsMicrophoneAccessDenied',
  callLocalVideoFreeze: 'ErrorBarCallLocalVideoFreeze',
  callCameraAccessDenied: 'ErrorBarCallCameraAccessDenied',
  callCameraAccessDeniedSafari: 'ErrorBarCallCameraAccessDenied',
  callCameraAlreadyInUse: 'ErrorBarCallCameraAlreadyInUse',
  callVideoStoppedBySystem: 'ErrorBarCallVideoStoppedBySystem',
  callVideoRecoveredBySystem: 'ErrorBarCallVideoRecoveredBySystem',
  callMacOsCameraAccessDenied: 'ErrorBarCallMacOsCameraAccessDenied'
};

/**
 * @private
 */
export const isValidString = (string: string | undefined): string is string => {
  return !!string && string.length > 0;
};
