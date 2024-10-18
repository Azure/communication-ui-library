// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IIconProps, MessageBarType } from '@fluentui/react';
import { ActiveErrorMessage, ErrorType } from './ErrorBar';
import { _SupportedSpokenLanguage } from '../types';
import { ActiveNotification, NotificationType } from './NotificationStack';

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
 */
export interface DismissedNotification {
  type: NotificationType;
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

  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedErrors,
    {
      type: toDismiss.type,
      // the error time could be sometimes later than the button click time, which cause the dismiss not working
      // so we set the dismiss time to the later one
      dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
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
 * @param dismissedNotifications
 * @param toDismiss
 * @returns DismissedNotification[]
 * Always returns a new Array so that the state variable is updated, trigerring a render.
 */
export const dismissNotification = (
  dismissedNotifications: DismissedNotification[],
  toDismiss: ActiveNotification
): DismissedNotification[] => {
  const now = new Date(Date.now());
  for (const notification of dismissedNotifications) {
    if (notification.type === toDismiss.type) {
      // Bump the timestamp for latest dismissal of this error to now.
      notification.dismissedAt = now;
      notification.activeSince = toDismiss.timestamp;
      return Array.from(dismissedNotifications);
    }
  }

  const toDismissTimestamp = toDismiss.timestamp ?? now;

  // Record that this error was dismissed for the first time right now.
  return [
    ...dismissedNotifications,
    {
      type: toDismiss.type,
      // the error time could be sometimes later than the button click time, which cause the dismiss not working
      // so we set the dismiss time to the later one
      dismissedAt: now > toDismissTimestamp ? now : toDismissTimestamp,
      activeSince: toDismiss.timestamp
    }
  ];
};

/**
 * @private
 * @param activeNotifications
 * @param dismissedNotifications
 * @returns DismissedError[]
 *  Returns a new Array if and only if contents change, to avoid re-rendering when nothing was dropped.
 */
export const dropDismissalsForInactiveNotifications = (
  activeNotifications: ActiveNotification[],
  dismissedNotifications: DismissedNotification[]
): DismissedNotification[] => {
  const active = new Map();
  for (const message of activeNotifications) {
    active.set(message.type, message);
  }

  // For an error such that:
  // * It was previously active, and dismissed.
  // * It did not have a timestamp associated with it.
  // * It is no longer active.
  //
  // We remove it from dismissals. When it becomes active again next time, it will be shown again on the UI.
  const shouldDeleteDismissal = (dismissed: DismissedNotification): boolean =>
    dismissed.activeSince === undefined && active.get(dismissed.type) === undefined;

  if (dismissedNotifications.some((dismissed) => shouldDeleteDismissal(dismissed))) {
    return dismissedNotifications.filter((dismissed) => !shouldDeleteDismissal(dismissed));
  }
  return dismissedNotifications;
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
 * @param activeNotifications
 * @param dismissedNotifications
 * @returns ActiveNotification[]
 */
export const notificationsToShow = (
  activeNotifications: ActiveNotification[],
  dismissedNotifications: DismissedNotification[],
  mountTimestamp?: Date
): ActiveNotification[] => {
  const dismissed: Map<NotificationType, DismissedNotification> = new Map();
  for (const notification of dismissedNotifications) {
    dismissed.set(notification.type, notification);
  }

  return activeNotifications.filter((notification) => {
    if (mountTimestamp && notification.timestamp && mountTimestamp > notification.timestamp) {
      // Notification has a timestamp and it is older than when the component was mounted.
      return false;
    }

    const dismissal = dismissed.get(notification.type);
    if (!dismissal) {
      // This error was never dismissed.
      return true;
    }
    if (!notification.timestamp) {
      // No timestamp associated with the error. In this case, the existence of a dismissal is enough to suppress the error.
      return false;
    }
    // Error has an associated timestamp, so compare with last dismissal.
    return notification.timestamp > dismissal.dismissedAt;
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
    case 'startScreenShareGeneric':
    case 'cameraFrozenForRemoteParticipants':
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
 * @param NotificationType
 * @returns IIconProps | undefined
 */
export const NotificationIconProps = (notificationType: NotificationType): IIconProps | undefined => {
  const iconName = customNotificationIconName[notificationType];
  return iconName ? { iconName } : undefined;
};

/**
 * @private
 */
export const customNotificationIconName: Partial<{ [key in NotificationType]: string }> = {
  callNetworkQualityLow: 'ErrorBarCallNetworkQualityLow',
  teamsMeetingCallNetworkQualityLow: 'ErrorBarCallNetworkQualityLow',
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
  callMacOsCameraAccessDenied: 'ErrorBarCallMacOsCameraAccessDenied',
  mutedByRemoteParticipant: 'ErrorBarMutedByRemoteParticipant',
  speakingWhileMuted: 'ErrorBarCallMicrophoneMutedBySystem',
  recordingStarted: 'NotificationBarRecording',
  transcriptionStarted: 'NotificationBarRecording',
  recordingStopped: 'NotificationBarRecording',
  transcriptionStopped: 'NotificationBarRecording',
  recordingAndTranscriptionStarted: 'NotificationBarRecording',
  recordingAndTranscriptionStopped: 'NotificationBarRecording',
  recordingStoppedStillTranscribing: 'NotificationBarRecording',
  transcriptionStoppedStillRecording: 'NotificationBarRecording',
  /* @conditional-compile-remove(breakout-rooms) */
  assignedBreakoutRoomOpened: 'NotificationBarBreakoutRoomOpened',
  /* @conditional-compile-remove(breakout-rooms) */
  assignedBreakoutRoomOpenedPromptJoin: 'NotificationBarBreakoutRoomPromptJoin',
  /* @conditional-compile-remove(breakout-rooms) */
  assignedBreakoutRoomChanged: 'NotificationBarBreakoutRoomChanged',
  /* @conditional-compile-remove(breakout-rooms) */
  breakoutRoomJoined: 'NotificationBarBreakoutRoomJoined',
  /* @conditional-compile-remove(breakout-rooms) */
  breakoutRoomClosingSoon: 'NotificationBarBreakoutRoomClosingSoon'
};

/**
 * @private
 */
export const isValidString = (string: string | undefined): string is string => {
  return !!string && string.length > 0;
};

/**
 * Chunk an array into rows of a given size.
 * @private
 */
export function chunk<T>(options: T[], itemsPerRow: number): T[][] {
  const rows: T[][] = [];
  let currentRow: T[] = [];
  for (const option of options) {
    currentRow.push(option);
    if (currentRow.length === itemsPerRow) {
      rows.push(currentRow);
      currentRow = [];
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  return rows;
}

/**
 * @private
 */
export const defaultSpokenLanguage: _SupportedSpokenLanguage = 'en-us';

/**
 * @private
 */
const SAFARI_COMPOSITION_KEYCODE = 229;
/**
 * Determine if the press of the enter key is from a composition session or not (Safari only)
 *
 * @private
 */
export const isEnterKeyEventFromCompositionSession = (e: KeyboardEvent): boolean =>
  // Uses KeyCode 229 and which code 229 to determine if the press of the enter key is from a composition session or not (Safari only)
  e.isComposing || e.keyCode === SAFARI_COMPOSITION_KEYCODE || e.which === SAFARI_COMPOSITION_KEYCODE;

/**
 * @private
 */
export const nullToUndefined = <T>(value: T | null): T | undefined => (value === null ? undefined : value);
