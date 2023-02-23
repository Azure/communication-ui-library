// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import {
  CameraAndMicrophoneSitePermissions,
  CameraSitePermissions,
  MicrophoneSitePermissions,
  _DrawerSurface
} from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { _ModalClone } from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import { drawerContainerStyles } from '../styles/CallComposite.styles';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { _isSafari } from '../utils';
/* @conditional-compile-remove(call-readiness) */
const DRAWER_HIGH_Z_BAND = 99; // setting z index to  99 so that it sit above all components

/* @conditional-compile-remove(call-readiness) */
/**
 * Modal that guides user through enabling their camera and mic access
 * @private
 */
export const CallReadinessModal = (props: {
  mobileView: boolean;
  modalLayerHostId: string;
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  };
  /* @conditional-compile-remove(unsupported-browser) */
  environmentInfo?: EnvironmentInfo;
  isPermissionsModalDismissed: boolean;
  setIsPermissionsModalDismissed: (boolean) => void;
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
}): JSX.Element => {
  const {
    mobileView,
    permissionsState,
    /* @conditional-compile-remove(unsupported-browser) */ environmentInfo,
    isPermissionsModalDismissed,
    setIsPermissionsModalDismissed,
    onPermissionsTroubleshootingClick
  } = props;
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  // On Safari browser with 2 options: don't allow/never for this website again, when don't allow is clicked, permissionAPI returns prompt and PermissionGranted from calling sdk returns false (the right value)
  const videoState: PermissionState = permissionsState.camera;
  const audioState: PermissionState = permissionsState.microphone;

  const showModal =
    videoState === 'denied' || videoState === 'prompt' || audioState === 'denied' || audioState === 'prompt';
  /* @conditional-compile-remove(unsupported-browser) */
  const isSafari = _isSafari(environmentInfo);

  const modal: undefined | (() => JSX.Element) = !showModal
    ? undefined
    : () => {
        // if both video and audio permission are not set
        if (videoState === 'prompt' && audioState === 'prompt') {
          return (
            <CameraAndMicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="request"
            />
          );
        }
        // if audio permission is set up but video is not
        else if (videoState === 'prompt') {
          return (
            <CameraSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
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
              kind="request"
            />
          );
        }
        // if video permission is set up but audio is not
        else if (audioState === 'prompt') {
          return (
            <MicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="request"
            />
          );
        }
        // if both video and audio are denied
        else if (videoState === 'denied' && audioState === 'denied') {
          return (
            <CameraAndMicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="denied"
            />
          );
        }
        // if only video is denied
        else if (videoState === 'denied') {
          return (
            <CameraSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
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
              kind="denied"
            />
          );
        }
        // if only audio is denied
        else {
          return (
            <MicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="denied"
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
      <_ModalClone
        styles={{
          root: { position: 'unset' },
          main: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
        }}
        layerProps={{ hostId: props.modalLayerHostId }}
        isOpen={isPermissionsModalDismissed}
        isBlocking={false}
        onDismiss={() => {
          setIsPermissionsModalDismissed(false);
        }}
        overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
      >
        {modal()}
      </_ModalClone>
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
  checkPermissionModalShowing: boolean;
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  };
  modalLayerHostId: string;
  /* @conditional-compile-remove(unsupported-browser) */
  environmentInfo?: EnvironmentInfo;
  isPermissionsModalDismissed: boolean;
  setIsPermissionsModalDismissed: (boolean) => void;
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
}): JSX.Element => {
  const {
    mobileView,
    checkPermissionModalShowing,
    permissionsState,
    /* @conditional-compile-remove(unsupported-browser) */ environmentInfo,
    isPermissionsModalDismissed,
    setIsPermissionsModalDismissed,
    onPermissionsTroubleshootingClick
  } = props;
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  const videoState = permissionsState.camera;
  const audioState = permissionsState.microphone;

  // When permissions are not set, do nothing here
  // When permissions are set to denied, show helper screen
  const showModal = videoState === 'denied' || audioState === 'denied';

  /* @conditional-compile-remove(unsupported-browser) */
  const isSafari = _isSafari(environmentInfo);

  const modal: undefined | (() => JSX.Element) = !showModal
    ? undefined
    : () => {
        if (videoState === 'denied' && audioState === 'denied') {
          return (
            <CameraAndMicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="denied"
            />
          );
        } else if (videoState === 'denied' && audioState === 'granted') {
          return (
            <CameraSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
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
              kind="denied"
            />
          );
        } else {
          return (
            <MicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="denied"
            />
          );
        }
      };

  if (mobileView) {
    return (
      <>
        {(checkPermissionModalShowing || audioState === 'prompt' || videoState === 'prompt') && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            <CameraAndMicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="check"
            />
          </_DrawerSurface>
        )}
        {isPermissionsModalDismissed && !checkPermissionModalShowing && modal !== undefined && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            {modal()}
          </_DrawerSurface>
        )}
      </>
    );
  } else {
    return (
      <>
        {(checkPermissionModalShowing || audioState === 'prompt' || videoState === 'prompt') && (
          <_ModalClone
            styles={{
              root: { position: 'unset' },
              main: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
            }}
            layerProps={{ hostId: props.modalLayerHostId }}
            isOpen={isPermissionsModalDismissed}
            isBlocking={false}
            onDismiss={() => {
              setIsPermissionsModalDismissed(false);
            }}
            overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
          >
            <CameraAndMicrophoneSitePermissions
              appName={'app'}
              /* @conditional-compile-remove(unsupported-browser) */
              browserHint={isSafari ? 'safari' : 'unset'}
              onTroubleshootingClick={
                onPermissionsTroubleshootingClick
                  ? () => {
                      onPermissionsTroubleshootingClick(permissionsState);
                    }
                  : undefined
              }
              kind="check"
            />
          </_ModalClone>
        )}

        {!checkPermissionModalShowing && modal !== undefined && (
          <_ModalClone
            styles={{
              root: { position: 'unset' },
              main: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
            }}
            layerProps={{ hostId: props.modalLayerHostId }}
            isOpen={isPermissionsModalDismissed}
            isBlocking={false}
            onDismiss={() => {
              setIsPermissionsModalDismissed(false);
            }}
            overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
          >
            {modal()}
          </_ModalClone>
        )}
      </>
    );
  }
};

/**
 * Placeholder for conditional compile
 * @private
 */
export const CallReadinessModalPlaceHolder = (): JSX.Element => {
  return <></>;
};
