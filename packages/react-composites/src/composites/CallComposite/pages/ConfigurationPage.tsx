// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo } from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useState } from 'react';
import { useAdaptedSelector } from '../hooks/useAdaptedSelector';
import { useHandlers } from '../hooks/useHandlers';
import { LocalDeviceSettings } from '../components/LocalDeviceSettings';
import { StartCallButton } from '../components/StartCallButton';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { useSelector } from '../hooks/useSelector';
import { ActiveErrorMessage, DevicesButton, ErrorBar } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Panel, PanelType, Stack } from '@fluentui/react';
import {
  fillWidth,
  panelFocusProps,
  panelStyles,
  startCallButtonStyleDesktop
} from '../styles/CallConfiguration.styles';
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
import { DeviceCheckOptions } from '../CallComposite';
import { ConfigurationPageErrorBar } from '../components/ConfigurationPageErrorBar';
/* @conditional-compile-remove(call-readiness) */
import { getDevicePermissionState } from '../utils';
/* @conditional-compile-remove(call-readiness) */
import { CallReadinessModal, CallReadinessModalFallBack } from '../components/CallReadinessModal';
/* @conditional-compile-remove(video-background-effects) */
import { VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM, useVideoEffectsPane } from '../components/SidePane/useVideoEffectsPane';
import { SidePane } from '../components/SidePane/SidePane';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';
/* @conditional-compile-remove(video-background-effects) */
import { useIsParticularSidePaneOpen } from '../components/SidePane/SidePaneProvider';
/* @conditional-compile-remove(video-background-effects) */
import { localVideoSelector } from '../../CallComposite/selectors/localVideoStreamSelector';
/* @conditional-compile-remove(capabilities) */
import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';

/**
 * @private
 */
export interface ConfigurationPageProps {
  mobileView: boolean;
  startCallHandler(): void;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;
  modalLayerHostId: string;
  /* @conditional-compile-remove(call-readiness) */
  deviceChecks?: DeviceCheckOptions;
  /* @conditional-compile-remove(call-readiness) */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(capabilities) */
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
}

/**
 * @private
 */
export const ConfigurationPage = (props: ConfigurationPageProps): JSX.Element => {
  const {
    startCallHandler,
    mobileView,
    modalLayerHostId,
    /* @conditional-compile-remove(call-readiness) */ deviceChecks,
    /* @conditional-compile-remove(call-readiness) */ onPermissionsTroubleshootingClick,
    /* @conditional-compile-remove(call-readiness) */ onNetworkingTroubleShootingClick
  } = props;

  const options = useAdaptedSelector(getCallingSelector(DevicesButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);
  /* @conditional-compile-remove(call-readiness) */
  // use permission API to get video and audio permission state
  const [videoState, setVideoState] = useState<PermissionState | 'unsupported' | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  const [audioState, setAudioState] = useState<PermissionState | 'unsupported' | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  getDevicePermissionState(setVideoState, setAudioState);

  const errorBarProps = usePropsFor(ErrorBar);
  const adapter = useAdapter();
  const deviceState = adapter.getState().devices;
  /* @conditional-compile-remove(unsupported-browser) */
  const environmentInfo = adapter.getState().environmentInfo;

  let disableStartCallButton = !microphonePermissionGranted || deviceState.microphones?.length === 0;
  /* @conditional-compile-remove(rooms) */
  const role = adapter.getState().call?.role;

  /* @conditional-compile-remove(video-background-effects) */
  const isCameraOn = useSelector(localVideoSelector).isAvailable;

  let filteredLatestErrors: ActiveErrorMessage[] = props.latestErrors;

  /* @conditional-compile-remove(rooms) */
  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (role !== 'Consumer') {
    filteredLatestErrors = filteredLatestErrors.filter(
      (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
    );
  }

  /* @conditional-compile-remove(video-background-effects) */
  if ((useIsParticularSidePaneOpen('videoeffects') || !isCameraOn) && errorBarProps) {
    filteredLatestErrors = filteredLatestErrors.filter((e) => e.type !== 'unableToStartVideoEffect');
  }

  /* @conditional-compile-remove(rooms) */
  if (role === 'Consumer') {
    // If user's role permissions do not allow access to the microphone button then DO NOT disable the start call button
    // because microphone device permission is not needed for the user's role
    disableStartCallButton = false;
  }

  /* @conditional-compile-remove(call-readiness) */
  // Overrides role permissions if CallCompositeOptions deviceChecks are set
  if (deviceChecks) {
    if (
      ['doNotPrompt', 'optional'].includes(deviceChecks.camera) &&
      ['doNotPrompt', 'optional'].includes(deviceChecks.microphone)
    ) {
      disableStartCallButton = false;
    } else if (deviceChecks.camera === 'required') {
      disableStartCallButton = !cameraPermissionGranted || deviceState.cameras?.length === 0;
    }
  }

  const locale = useLocale();
  const title = (
    <Stack.Item
      className={mobileView ? titleContainerStyleMobile : titleContainerStyleDesktop}
      role="heading"
      aria-level={1}
    >
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
  mobileWithPreview = mobileWithPreview && role !== 'Consumer';

  /* @conditional-compile-remove(call-readiness) */
  const permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  } = {
    // fall back to using cameraPermissionGranted and microphonePermissionGranted if permission API is not supported
    camera:
      videoState && videoState !== 'unsupported'
        ? cameraPermissionGranted !== false
          ? videoState
          : 'denied'
        : cameraPermissionGranted !== false
        ? cameraPermissionGranted
          ? 'granted'
          : 'prompt'
        : 'denied',
    microphone:
      audioState && audioState !== 'unsupported'
        ? microphonePermissionGranted !== false
          ? audioState
          : 'denied'
        : microphonePermissionGranted !== false
        ? microphonePermissionGranted
          ? 'granted'
          : 'prompt'
        : 'denied'
  };
  /* @conditional-compile-remove(call-readiness) */
  const networkErrors = errorBarProps.activeErrorMessages.filter((message) => message.type === 'callNetworkQualityLow');

  /* @conditional-compile-remove(call-readiness) */
  const [isPermissionsModalDismissed, setIsPermissionsModalDismissed] = useState(true);

  // When permission API is not available, we want to show screen saying checking for access (disappears on its own)
  // then based on permission setting, we show permission denied or nothing
  /* @conditional-compile-remove(call-readiness) */
  const [minimumFallbackTimerElapsed, setMinimumFallbackTimerElapsed] = useState(false);
  /* @conditional-compile-remove(call-readiness) */
  setTimeout(() => {
    setMinimumFallbackTimerElapsed(true);
  }, 2000);
  /* @conditional-compile-remove(call-readiness) */
  const forceShowingCheckPermissions = !minimumFallbackTimerElapsed;

  /* @conditional-compile-remove(video-background-effects) */
  const { toggleVideoEffectsPane, closeVideoEffectsPane, isVideoEffectsPaneOpen } = useVideoEffectsPane(
    props.updateSidePaneRenderer,
    mobileView,
    props.latestErrors,
    props.onDismissError
  );

  const startCall = useCallback(async () => {
    /* @conditional-compile-remove(video-background-effects) */
    closeVideoEffectsPane();
    startCallHandler();
  }, [startCallHandler, /* @conditional-compile-remove(video-background-effects) */ closeVideoEffectsPane]);

  const panelLayerProps = useMemo(
    () => ({
      hostId: modalLayerHostId
    }),
    [modalLayerHostId]
  );

  const filteredErrorBarProps = useMemo(
    () => ({
      ...errorBarProps,
      activeErrorMessages: filteredLatestErrors
    }),
    [errorBarProps, filteredLatestErrors]
  );

  return (
    <Stack className={mobileView ? configurationContainerStyleMobile : configurationContainerStyleDesktop}>
      <Stack styles={bannerNotificationStyles}>
        <ConfigurationPageErrorBar
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
          errorBarProps={filteredErrorBarProps}
          onDismissError={props.onDismissError}
        />
      </Stack>
      {
        /* @conditional-compile-remove(call-readiness) */
        // show the following screen if permission API is availible (not unsupported) and videoState, audioState is assigned values
        videoState && videoState !== 'unsupported' && audioState && audioState !== 'unsupported' && (
          <CallReadinessModal
            modalLayerHostId={modalLayerHostId}
            mobileView={mobileView}
            /* @conditional-compile-remove(unsupported-browser) */
            environmentInfo={environmentInfo}
            permissionsState={permissionsState}
            isPermissionsModalDismissed={isPermissionsModalDismissed}
            setIsPermissionsModalDismissed={setIsPermissionsModalDismissed}
            onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
          />
        )
      }

      {
        /* @conditional-compile-remove(call-readiness) */
        // show the following screen if permission API is not availible (unsupported) and videoState, audioState is assigned values
        videoState && audioState && (videoState === 'unsupported' || audioState === 'unsupported') && (
          <CallReadinessModalFallBack
            /* @conditional-compile-remove(call-readiness) */
            modalLayerHostId={modalLayerHostId}
            mobileView={mobileView}
            checkPermissionModalShowing={forceShowingCheckPermissions}
            permissionsState={permissionsState}
            isPermissionsModalDismissed={isPermissionsModalDismissed}
            /* @conditional-compile-remove(unsupported-browser) */
            environmentInfo={environmentInfo}
            setIsPermissionsModalDismissed={setIsPermissionsModalDismissed}
            onPermissionsTroubleshootingClick={onPermissionsTroubleshootingClick}
          />
        )
      }

      <Stack verticalFill grow horizontal className={fillWidth}>
        <Stack
          className={fillWidth}
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
          {localPreviewTrampoline(mobileWithPreview, /* @conditional-compile-remove(rooms) */ !!(role === 'Consumer'))}
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
                  cameraPermissionGranted={cameraPermissionGrantedTrampoline(
                    cameraPermissionGranted,
                    /* @conditional-compile-remove(call-readiness) */ videoState
                  )}
                  microphonePermissionGranted={micPermissionGrantedTrampoline(
                    microphonePermissionGranted,
                    /* @conditional-compile-remove(call-readiness) */ audioState
                  )}
                  /* @conditional-compile-remove(call-readiness) */
                  onClickEnableDevicePermission={() => {
                    setIsPermissionsModalDismissed(true);
                  }}
                  /* @conditional-compile-remove(video-background-effects) */
                  onClickVideoEffects={toggleVideoEffectsPane}
                />
              </>
            )}
            <Stack
              styles={mobileWithPreview ? startCallButtonContainerStyleMobile : startCallButtonContainerStyleDesktop}
            >
              <StartCallButton
                className={mobileWithPreview ? startCallButtonStyleMobile : startCallButtonStyleDesktop}
                onClick={startCall}
                disabled={disableStartCallButton}
              />
            </Stack>
          </Stack>
        </Stack>
        <Panel
          /* @conditional-compile-remove(video-background-effects) */
          isOpen={isVideoEffectsPaneOpen}
          hasCloseButton={false}
          isBlocking={false}
          isHiddenOnDismiss={false}
          styles={panelStyles}
          focusTrapZoneProps={panelFocusProps}
          layerProps={panelLayerProps}
          type={PanelType.custom}
          /* @conditional-compile-remove(video-background-effects) */
          customWidth={`${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem`}
        >
          <SidePane mobileView={props.mobileView} updateSidePaneRenderer={props.updateSidePaneRenderer} />
        </Panel>
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

const cameraPermissionGrantedTrampoline = (
  cameraPermissionGranted: boolean | undefined,
  videoState?: PermissionState | 'unsupported' | undefined
): boolean | undefined => {
  /* @conditional-compile-remove(call-readiness) */
  return videoState && videoState !== 'unsupported' ? videoState === 'granted' : cameraPermissionGranted;

  return cameraPermissionGranted;
};

const micPermissionGrantedTrampoline = (
  microphonePermissionGranted: boolean | undefined,
  audioState?: PermissionState | 'unsupported' | undefined
): boolean | undefined => {
  /* @conditional-compile-remove(call-readiness) */
  return audioState && audioState !== 'unsupported' ? audioState === 'granted' : microphonePermissionGranted;

  return microphonePermissionGranted;
};
