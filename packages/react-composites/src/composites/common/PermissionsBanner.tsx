// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useMemo, useState } from 'react';
import { MessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import { permissionsBannerMessageBarStyle } from '../common/styles/PermissionsBanner.styles';

export const CAMERA_PERMISSION_DENIED = 'Camera use is blocked by your browser.';
export const MICROPHONE_PERMISSION_DENIED = 'Microphone use is blocked by your browser.';
export const CAMERA_AND_MICROPHONE_PERMISSION_DENIED = 'Camera and microphone use is blocked by your browser.';
const ALLOW_PERMISSIONS_INSTRUCTIONS =
  "Grant permission by clicking the lock in the address bar and selecting 'Allow'.";

/**
 * @private
 */
export interface PermissionsBannerProps {
  /**
   * If cameraPermission is true or undefined, no banner is shown for camera.
   */
  cameraPermissionGranted: boolean | undefined;
  /**
   * If microphonePermission is true or undefined, no banner is shown for microphone.
   */
  microphonePermissionGranted: boolean | undefined;
}

/**
 * Returns the appropriate banner message for given states. Returns empty string if no banner message should be
 * displayed.
 *
 * @param cameraPermissionGranted - If permission is granted for camera, undefined if no response to permission ask
 * @param microphonePermissionGranted - If permission is granted for microphone, undefined if no response to permission
 *   ask
 * @param dismissedCameraBanner - If camera banner was already dismissed
 * @param dismissedMicrophoneBanner - If microphone banner was already dismissed
 * @returns
 *
 */
export const getPermissionsBannerMessage = (
  cameraPermissionGranted: boolean | undefined,
  microphonePermissionGranted: boolean | undefined,
  dismissedCameraBanner: boolean,
  dismissedMicrophoneBanner: boolean
): string => {
  const showCameraMessage = cameraPermissionGranted !== undefined && !cameraPermissionGranted && !dismissedCameraBanner;
  const showMicrophoneMessage =
    microphonePermissionGranted !== undefined && !microphonePermissionGranted && !dismissedMicrophoneBanner;
  if (showCameraMessage && showMicrophoneMessage) {
    return CAMERA_AND_MICROPHONE_PERMISSION_DENIED;
  } else if (showCameraMessage) {
    return CAMERA_PERMISSION_DENIED;
  } else if (showMicrophoneMessage) {
    return MICROPHONE_PERMISSION_DENIED;
  } else {
    return '';
  }
};

/**
 * Shows a banner notifying user if camera or microphone permission is denied and also instructions on how to allow the
 * necessary permissions. If either camera or microphone permission is true or undefined then no banner for those items
 * are show. This banner will not show anything if the permission (undefined) has been requested but user has not
 * responded to it. Sample app/composite will always request permission so the case of permission not requested is
 * assumed to not happen by this component. If the banner was dismissed, it will be dismissed for the current state of
 * the props and stay dismissed even if permission change after dismissal.
 *
 * @param props {@link PermissionsBannerProps}
 *
 */
export const PermissionsBanner = (props: PermissionsBannerProps): JSX.Element => {
  const { cameraPermissionGranted, microphonePermissionGranted } = props;
  const [dismissedCameraBanner, setDismissedCameraBanner] = useState<boolean>(false);
  const [dismissedMicrophoneBanner, setDismissedMicrophoneBanner] = useState<boolean>(false);

  const bannerMessage = useMemo(() => {
    return getPermissionsBannerMessage(
      cameraPermissionGranted,
      microphonePermissionGranted,
      dismissedCameraBanner,
      dismissedMicrophoneBanner
    );
  }, [cameraPermissionGranted, microphonePermissionGranted, dismissedCameraBanner, dismissedMicrophoneBanner]);

  const dismissBanner = useCallback(() => {
    if (cameraPermissionGranted !== undefined && !cameraPermissionGranted) {
      setDismissedCameraBanner(true);
    }
    if (microphonePermissionGranted !== undefined && !microphonePermissionGranted) {
      setDismissedMicrophoneBanner(true);
    }
  }, [cameraPermissionGranted, microphonePermissionGranted]);

  return bannerMessage === '' ? (
    <></>
  ) : (
    <MessageBar
      styles={permissionsBannerMessageBarStyle}
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      actions={<MessageBarButton onClick={dismissBanner}>Dismiss</MessageBarButton>}
    >
      <b>{bannerMessage}</b>&nbsp;{ALLOW_PERMISSIONS_INSTRUCTIONS}
    </MessageBar>
  );
};
