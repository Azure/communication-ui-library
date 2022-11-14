// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useState } from 'react';
import { useAdaptedSelector } from '../hooks/useAdaptedSelector';
import { useHandlers } from '../hooks/useHandlers';
import { LocalDeviceSettings } from '../components/LocalDeviceSettings';
import { StartCallButton } from '../components/StartCallButton';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { useSelector } from '../hooks/useSelector';
import { DevicesButton, ErrorBar } from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import {
  CameraDomainPermissions,
  MicrophoneDomainPermissions,
  CameraAndMicrophoneDomainPermissions,
  _DrawerSurface,
  _DrawerSurfaceStyles
} from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions, _Permissions } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { Modal } from '@fluentui/react';
import { LocalPreview } from '../components/LocalPreview';
import {
  callDetailsStyleDesktop,
  callDetailsStyleMobile,
  configurationStackTokensDesktop,
  configurationStackTokensMobile,
  configurationContainerStyleDesktop,
  configurationContainerStyleMobile,
  selectionContainerStyle,
  startCallButtonContainerStyleDesktop,
  startCallButtonContainerStyleMobile,
  startCallButtonStyleMobile,
  titleContainerStyleDesktop,
  titleContainerStyleMobile,
  callDetailsContainerStylesDesktop
} from '../styles/CallConfiguration.styles';
import { useLocale } from '../../localization';
import { bannerNotificationStyles } from '../styles/CallPage.styles';
import { usePropsFor } from '../hooks/usePropsFor';
import { useAdapter } from '../adapter/CallAdapterProvider';
/* @conditional-compile-remove(call-readiness) */
import { DevicePermissionRestrictions } from '../CallComposite';
import { ConfigurationpageErrorBar } from '../components/ConfigurationpageErrorBar';
/* @conditional-compile-remove(call-readiness) */
import { drawerContainerStyles } from '../styles/CallComposite.styles';
/* @conditional-compile-remove(call-readiness) */
import { getDevicePermissionState } from '../utils';

/* @conditional-compile-remove(call-readiness) */
const DRAWER_HIGH_Z_BAND = 99; // setting z index to  99 so that it sit above all components

/**
 * @private
 */
export interface ConfigurationPageProps {
  mobileView: boolean;
  startCallHandler(): void;
  /* @conditional-compile-remove(call-readiness) */
  devicePermissions?: DevicePermissionRestrictions;
  /* @conditional-compile-remove(call-readiness) */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(call-readiness) */
  callReadinessOptedIn?: boolean;
}

/**
 * @private
 */
export const ConfigurationPage = (props: ConfigurationPageProps): JSX.Element => {
  const {
    startCallHandler,
    mobileView,
    /* @conditional-compile-remove(call-readiness) */ devicePermissions,
    /* @conditional-compile-remove(call-readiness) */ onPermissionsTroubleshootingClick,
    /* @conditional-compile-remove(call-readiness) */ onNetworkingTroubleShootingClick,
    /* @conditional-compile-remove(call-readiness) */ callReadinessOptedIn = false
  } = props;

  const options = useAdaptedSelector(getCallingSelector(DevicesButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);
  /* @conditional-compile-remove(call-readiness) */
  // use permission API to get video and audio permission state
  const [videoState, setVideoState] = useState<PermissionState | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  const [audioState, setAudioState] = useState<PermissionState | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  getDevicePermissionState(setVideoState, setAudioState);

  let errorBarProps = usePropsFor(ErrorBar);
  const adapter = useAdapter();
  const deviceState = adapter.getState().devices;

  let disableStartCallButton = !microphonePermissionGranted || deviceState.microphones?.length === 0;
  /* @conditional-compile-remove(rooms) */
  const rolePermissions = _usePermissions();

  /* @conditional-compile-remove(rooms) */
  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (!rolePermissions.cameraButton) {
    errorBarProps = {
      ...errorBarProps,
      activeErrorMessages: errorBarProps.activeErrorMessages.filter((e) => e.type !== 'callCameraAccessDenied')
    };
  }
  /* @conditional-compile-remove(rooms) */
  if (!rolePermissions.microphoneButton) {
    // If user's role permissions do not allow access to the microphone button then DO NOT disable the start call button
    // because microphone device permission is not needed for the user's role
    disableStartCallButton = false;
  }

  /* @conditional-compile-remove(call-readiness) */
  // Overrides role permissions if CallCompositeOptions devicePermissions are set
  if (devicePermissions) {
    if (
      ['doNotPrompt', 'optional'].includes(devicePermissions.camera) &&
      ['doNotPrompt', 'optional'].includes(devicePermissions.microphone)
    ) {
      disableStartCallButton = false;
    } else if (devicePermissions.camera === 'required') {
      disableStartCallButton = !cameraPermissionGranted || deviceState.cameras?.length === 0;
    }
  }

  const locale = useLocale();
  const title = (
    <Stack.Item className={mobileView ? titleContainerStyleMobile : titleContainerStyleDesktop}>
      {locale.strings.call.configurationPageTitle}
    </Stack.Item>
  );

  const callDescription = locale.strings.call.configurationPageCallDetails && (
    <Stack.Item className={mobileView ? callDetailsStyleMobile : callDetailsStyleDesktop}>
      {locale.strings.call.configurationPageCallDetails}
    </Stack.Item>
  );

  let mobileWithPreview = mobileView;
  /* @conditional-compile-remove(rooms) */
  mobileWithPreview = mobileWithPreview && rolePermissions.cameraButton;

  /* @conditional-compile-remove(call-readiness) */
  const permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  } = {
    // fall back to using cameraPermissionGranted and microphonePermissionGranted if permission API is not supported
    camera: videoState ?? (cameraPermissionGranted ? 'granted' : 'denied'),
    microphone: audioState ?? (microphonePermissionGranted ? 'granted' : 'denied')
  };
  /* @conditional-compile-remove(call-readiness) */
  const networkErrors = errorBarProps.activeErrorMessages.filter((message) => message.type === 'callNetworkQualityLow');
  /* @conditional-compile-remove(call-readiness) */
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  /* @conditional-compile-remove(call-readiness) */
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  /* @conditional-compile-remove(call-readiness) */
  const [isModalShowing, setIsModalShowing] = useState(false);

  // When permission API is not available, we want to show screen saying checking for access (disappears on its own)
  // then based on permission setting, we show permission denied or nothing
  /* @conditional-compile-remove(call-readiness) */
  const [checkPermissionModalShowing, setCheckPermissionModalShowing] = useState(true);
  /* @conditional-compile-remove(call-readiness) */
  const [permissionDeniedModalShowing, setPermissionDeniedModalShowing] = useState(false);
  /* @conditional-compile-remove(call-readiness) */
  setTimeout(() => {
    setCheckPermissionModalShowing(false);
    setPermissionDeniedModalShowing(true);
  }, 2000);

  return (
    <Stack className={mobileView ? configurationContainerStyleMobile : configurationContainerStyleDesktop}>
      <Stack styles={bannerNotificationStyles}>
        <ConfigurationpageErrorBar
          /* @conditional-compile-remove(call-readiness) */
          // show trouble shooting error bar when encountering network error/ permission error
          showTroubleShootingErrorBar={
            !cameraPermissionGranted || !microphonePermissionGranted || networkErrors.length > 0
          }
          /* @conditional-compile-remove(call-readiness) */
          permissionsState={permissionsState}
          /* @conditional-compile-remove(call-readiness) */
          onNetworkingTroubleShootingClick={onNetworkingTroubleShootingClick}
          /* @conditional-compile-remove(call-readiness) */
          onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
          errorBarProps={errorBarProps}
          /* @conditional-compile-remove(call-readiness) */
          callReadinessOptedIn={callReadinessOptedIn}
        />
      </Stack>

      {callReadinessOptedIn && videoState && audioState && (
        /* @conditional-compile-remove(call-readiness) */
        <>
          {callReadinessModal(
            mobileView,
            audioState,
            videoState,
            permissionsState,
            isModalShowing,
            setIsModalShowing,
            onPermissionsTroubleshootingClick
          )}
        </>
      )}


      {
        /* @conditional-compile-remove(call-readiness) */ callReadinessOptedIn &&
          (videoState === undefined || audioState === undefined) && (
            <>
              {callReadinessModalFallBack(
                mobileView,
                cameraPermissionGranted,
                microphonePermissionGranted,
                checkPermissionModalShowing,
                permissionDeniedModalShowing,
                permissionsState,
                isModalShowing,
                setIsModalShowing,
                onPermissionsTroubleshootingClick
              )}
            </>
          )
      }

      <Stack
        grow
        horizontal={!mobileWithPreview}
        horizontalAlign={mobileWithPreview ? 'stretch' : 'center'}
        verticalAlign="center"
        tokens={mobileWithPreview ? configurationStackTokensMobile : configurationStackTokensDesktop}
      >
        {mobileWithPreview && (
          <Stack.Item>
            {title}
            {callDescription}
          </Stack.Item>
        )}
        {localPreviewTrampoline(
          mobileWithPreview,
          /* @conditional-compile-remove(rooms) */ !rolePermissions.cameraButton
        )}
        <Stack className={mobileView ? undefined : selectionContainerStyle}>
          {!mobileWithPreview && (
            <>
              <Stack.Item styles={callDetailsContainerStylesDesktop}>
                {title}
                {callDescription}
              </Stack.Item>
              <LocalDeviceSettings
                {...options}
                {...localDeviceSettingsHandlers}
                // fall back to using cameraPermissionGranted and microphonePermissionGranted if permission API is not supported
                cameraPermissionGranted={videoState ? videoState === 'granted' : cameraPermissionGranted}
                microphonePermissionGranted={audioState ? audioState === 'granted' : microphonePermissionGranted}
                /* @conditional-compile-remove(call-readiness) */
                callReadinessOptedIn={callReadinessOptedIn}
                /* @conditional-compile-remove(call-readiness) */
                onClickEnableDevicePermission={() => {
                  setIsModalShowing(true);
                }}
              />
            </>
          )}
          <Stack
            styles={mobileWithPreview ? startCallButtonContainerStyleMobile : startCallButtonContainerStyleDesktop}
          >
            <StartCallButton
              className={mobileWithPreview ? startCallButtonStyleMobile : undefined}
              onClick={startCallHandler}
              disabled={disableStartCallButton}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const localPreviewTrampoline = (mobileView: boolean, doNotShow?: boolean): JSX.Element | undefined => {
  /* @conditional-compile-remove(rooms) */
  if (doNotShow) {
    return undefined;
  }
  return <LocalPreview mobileView={mobileView} showDevicesButton={mobileView} />;
};

/* @conditional-compile-remove(call-readiness) */
// This is called when permission api is not available
const callReadinessModalFallBack = (
  mobileView: boolean,
  cameraPermissionGranted: boolean | undefined,
  microphonePermissionGranted: boolean | undefined,
  checkPermissionModalShowing: boolean,
  permissionDeniedModalShowing: boolean,
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  },
  isModalShowing: boolean,
  setIsModalShowing: (boolean) => void,
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void
): JSX.Element => {
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  // When permissions are not set, value is undefined, do nothing here
  // When permissions are set to denied, value is false, show helper screen
  const modal = (): JSX.Element | undefined => {
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
            setIsModalShowing(false);
          }}
          type="denied"
        />
      );
    } else if (cameraPermissionGranted && microphonePermissionGranted === false) {
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
    } else {
      return undefined;
    }
  };
  if (mobileView) {
    return (
      <>
        {checkPermissionModalShowing && (
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
        {isModalShowing && permissionDeniedModalShowing && modal() !== undefined && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            {modal()}
          </_DrawerSurface>
        )}
      </>
    );
  } else {
    return (
      <>
        {checkPermissionModalShowing && (
          <Modal
            isOpen={isModalShowing}
            isBlocking={false}
            onDismiss={() => {
              setIsModalShowing(false);
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

        {permissionDeniedModalShowing && modal() !== undefined && (
          <Modal
            isOpen={isModalShowing}
            isBlocking={false}
            onDismiss={() => {
              setIsModalShowing(false);
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

/* @conditional-compile-remove(call-readiness) */
const callReadinessModal = (
  mobileView: boolean,
  audioState: PermissionState,
  videoState: PermissionState,
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  },
  isModalShowing: boolean,
  setIsModalShowing: (boolean) => void,
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void
): JSX.Element => {
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };

  const modal = (): JSX.Element | undefined => {
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
            setIsModalShowing(false);
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
            setIsModalShowing(false);
          }}
          type="denied"
        />
      );
    }
    // if only audio is denied
    else if (audioState === 'denied') {
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
    // if neither state is denied or prompt, we don't need to return anything
    else {
      return undefined;
    }
  };

  if (mobileView && modal() !== undefined) {
    return (
      <>
        {isModalShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerContainerStyles(DRAWER_HIGH_Z_BAND)}>
            {modal()}
          </_DrawerSurface>
        )}
      </>
    );
  } else if (!mobileView && modal() !== undefined) {
    return (
      <Modal
        isOpen={isModalShowing}
        isBlocking={false}
        onDismiss={() => {
          setIsModalShowing(false);
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
