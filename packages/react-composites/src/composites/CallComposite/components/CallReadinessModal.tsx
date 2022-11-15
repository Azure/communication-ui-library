// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(call-readiness) */
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Modal } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import {
  CameraAndMicrophoneDomainPermissions,
  CameraDomainPermissions,
  MicrophoneDomainPermissions,
  _DrawerSurface
} from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { drawerContainerStyles } from '../styles/CallComposite.styles';

/* @conditional-compile-remove(call-readiness) */
const DRAWER_HIGH_Z_BAND = 99; // setting z index to  99 so that it sit above all components

/* @conditional-compile-remove(call-readiness) */
/**
 * Modal that guides user through enabling their camera and mic access
 * @private
 */
export const CallReadinessModal = (props: {
  mobileView: boolean;
  audioState: PermissionState;
  videoState: PermissionState;
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  };
  isPermissionsModalDismissed: boolean;
  setIsPermissionsModalDismissed: (boolean) => void;
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
}): JSX.Element => {
  const {
    mobileView,
    audioState,
    videoState,
    permissionsState,
    isPermissionsModalDismissed,
    setIsPermissionsModalDismissed,
    onPermissionsTroubleshootingClick
  } = props;
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  console.log(videoState, audioState);
  const showModal =
    videoState === 'denied' || videoState === 'prompt' || audioState === 'denied' || audioState === 'prompt';

  const modal: undefined | (() => JSX.Element) = !showModal
    ? undefined
    : () => {
        // if both video and audio permission are not set
        if (videoState === 'prompt' && audioState === 'prompt') {
          return (
            <CameraAndMicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="request"
            />
          );
        }
        // if audio permission is set up but video is not
        else if (videoState === 'prompt') {
          return (
            <CameraDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              onContinueAnywayClick={() => {
                setIsPermissionsModalDismissed(false);
              }}
              type="request"
            />
          );
        }
        // if video permission is set up but audio is not
        else if (audioState === 'prompt') {
          return (
            <MicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="request"
            />
          );
        }
        // if both video and audio are denied
        else if (videoState === 'denied' && audioState === 'denied') {
          return (
            <CameraAndMicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="denied"
            />
          );
        }
        // if only video is denied
        else if (videoState === 'denied') {
          return (
            <CameraDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              onContinueAnywayClick={() => {
                setIsPermissionsModalDismissed(false);
              }}
              type="denied"
            />
          );
        }
        // if only audio is denied
        else {
          return (
            <MicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="denied"
            />
          );
        }
      };

  if (mobileView && modal !== undefined) {
    return (
      <>
        {isPermissionsModalDismissed && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            {modal()}
          </_DrawerSurface>
        )}
      </>
    );
  } else if (!mobileView && modal !== undefined) {
    return (
      <Modal
        isOpen={isPermissionsModalDismissed}
        isBlocking={false}
        onDismiss={() => {
          setIsPermissionsModalDismissed(false);
        }}
        overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
      >
        {modal()}
      </Modal>
    );
  } else {
    return <></>;
  }
};

/* @conditional-compile-remove(call-readiness) */
/**
 * Modal that guides user through enabling their camera and mic access
 * This is used when permission API is not supported
 * @private
 */
export const CallReadinessModalFallBack = (props: {
  mobileView: boolean;
  cameraPermissionGranted: boolean | undefined;
  microphonePermissionGranted: boolean | undefined;
  checkPermissionModalShowing: boolean;
  permissionDeniedModalShowing: boolean;
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  };
  isPermissionsModalDismissed: boolean;
  setIsPermissionsModalDismissed: (boolean) => void;
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
}): JSX.Element => {
  const {
    mobileView,
    cameraPermissionGranted,
    microphonePermissionGranted,
    checkPermissionModalShowing,
    permissionDeniedModalShowing,
    permissionsState,
    isPermissionsModalDismissed,
    setIsPermissionsModalDismissed,
    onPermissionsTroubleshootingClick
  } = props;
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  // When permissions are not set, value is undefined, do nothing here
  // When permissions are set to denied, value is false, show helper screen
  const showModal = cameraPermissionGranted === false || microphonePermissionGranted === false;

  const modal: undefined | (() => JSX.Element) = !showModal
    ? undefined
    : () => {
        if (cameraPermissionGranted === false && microphonePermissionGranted === false) {
          return (
            <CameraAndMicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="denied"
            />
          );
        } else if (cameraPermissionGranted === false && microphonePermissionGranted) {
          return (
            <CameraDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              onContinueAnywayClick={() => {
                setIsPermissionsModalDismissed(false);
              }}
              type="denied"
            />
          );
        } else {
          return (
            <MicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="denied"
            />
          );
        }
      };

  if (mobileView) {
    return (
      <>
        {(checkPermissionModalShowing ||
          microphonePermissionGranted === undefined ||
          cameraPermissionGranted === undefined) && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            <CameraAndMicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="check"
            />
          </_DrawerSurface>
        )}
        {isPermissionsModalDismissed && permissionDeniedModalShowing && modal !== undefined && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            {modal()}
          </_DrawerSurface>
        )}
      </>
    );
  } else {
    return (
      <>
        {(checkPermissionModalShowing ||
          microphonePermissionGranted === undefined ||
          cameraPermissionGranted === undefined) && (
          <Modal
            isOpen={isPermissionsModalDismissed}
            isBlocking={false}
            onDismiss={() => {
              setIsPermissionsModalDismissed(false);
            }}
            overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
          >
            <CameraAndMicrophoneDomainPermissions
              appName={'app'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              type="check"
            />
          </Modal>
        )}

        {permissionDeniedModalShowing && modal !== undefined && (
          <Modal
            isOpen={isPermissionsModalDismissed}
            isBlocking={false}
            onDismiss={() => {
              setIsPermissionsModalDismissed(false);
            }}
            overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
          >
            {modal()}
          </Modal>
        )}
      </>
    );
  }
};
