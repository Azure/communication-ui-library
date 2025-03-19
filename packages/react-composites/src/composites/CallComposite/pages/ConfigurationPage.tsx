// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useRef } from 'react';
import { useState } from 'react';
import { useAdaptedSelector } from '../hooks/useAdaptedSelector';
import { useHandlers } from '../hooks/useHandlers';
import { LocalDeviceSettings } from '../components/LocalDeviceSettings';
import { StartCallButton } from '../components/StartCallButton';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { useSelector } from '../hooks/useSelector';
import {
  ActiveErrorMessage,
  CameraButton,
  DevicesButton,
  ErrorBar,
  VideoStreamOptions,
  _useContainerHeight,
  _useContainerWidth,
  useTheme
} from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Image, mergeStyles, Panel, PanelType, Stack } from '@fluentui/react';
import {
  callDetailsContainerStyles,
  configurationCenteredContent,
  configurationSectionStyle,
  deviceConfigurationStackTokens,
  fillWidth,
  logoStyles,
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
  configurationContainerStyle,
  selectionContainerStyle,
  startCallButtonContainerStyleDesktop,
  startCallButtonContainerStyleMobile,
  startCallButtonStyleMobile,
  titleContainerStyleDesktop,
  titleContainerStyleMobile
} from '../styles/CallConfiguration.styles';
import { useLocale } from '../../localization';
import { bannerNotificationStyles } from '../styles/CallPage.styles';
import { usePropsFor } from '../hooks/usePropsFor';
/* @conditional-compile-remove(call-readiness) */
import { DeviceCheckOptions } from '../CallComposite';
import { ConfigurationPageErrorBar } from '../components/ConfigurationPageErrorBar';
import { _isSafari } from '../utils';
/* @conditional-compile-remove(call-readiness) */
import { getDevicePermissionState } from '../utils';
/* @conditional-compile-remove(call-readiness) */
import { CallReadinessModal, CallReadinessModalFallBack } from '../components/CallReadinessModal';

import { VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM, useVideoEffectsPane } from '../components/SidePane/useVideoEffectsPane';
import { SidePane } from '../components/SidePane/SidePane';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';

import { useIsParticularSidePaneOpen } from '../components/SidePane/SidePaneProvider';

import { localVideoSelector } from '../../CallComposite/selectors/localVideoStreamSelector';

import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';
import { SvgWithWordWrapping } from '../components/SvgWithWordWrapping';
import { getMicrophones, getRole } from '../selectors/baseSelectors';
import { getEnvironmentInfo } from '../selectors/baseSelectors';
/* @conditional-compile-remove(call-readiness) */
import { getCameras } from '../selectors/baseSelectors';
import { VideoDeviceInfo } from '@azure/communication-calling';

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

  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  logo?: {
    url: string;
    alt?: string;
    shape?: 'unset' | 'circle';
  };
  backgroundImage?: {
    url: string;
  };
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

  const theme = useTheme();

  const options = useAdaptedSelector(getCallingSelector(DevicesButton, false));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);
  /* @conditional-compile-remove(call-readiness) */
  // use permission API to get video and audio permission state
  const [videoState, setVideoState] = useState<PermissionState | 'unsupported' | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  const [audioState, setAudioState] = useState<PermissionState | 'unsupported' | undefined>(undefined);
  /* @conditional-compile-remove(call-readiness) */
  getDevicePermissionState(setVideoState, setAudioState);

  const configContainerRef = useRef<HTMLDivElement>(null);

  const configWidth = _useContainerWidth(configContainerRef);

  /**
   * We want to stack the two sections (preview and devices) when the container is less than 450 wide.
   * We lose size calculation when the container is less than 450 wide, so we stack the two sections.
   */
  const stackConfig = !!configWidth && configWidth < 450;
  const errorBarProps = usePropsFor(ErrorBar);
  const microphones = useSelector(getMicrophones);
  const environmentInfo = useSelector(getEnvironmentInfo);

  let disableStartCallButton = !microphonePermissionGranted || microphones?.length === 0;
  const role = useSelector(getRole);

  const isCameraOn = useSelector(localVideoSelector).isAvailable;
  const [cameraLoading, setCameraLoading] = useState(false);
  const switchCamera = useCallback(
    async (device: VideoDeviceInfo, options?: VideoStreamOptions) => {
      // Only set camera to be loading if we are switching source while the camera is on
      setCameraLoading(isCameraOn);
      try {
        await localDeviceSettingsHandlers.onSelectCamera(device, options);
      } finally {
        setCameraLoading(false);
      }
    },
    [localDeviceSettingsHandlers, isCameraOn]
  );
  const { onToggleCamera } = usePropsFor(CameraButton);
  const toggleCamera = useCallback(
    async (options?: VideoStreamOptions | undefined) => {
      // Only set camera to loading if we are turning on the camera (i.e. the camera was off)
      setCameraLoading(!isCameraOn);
      try {
        await onToggleCamera(options);
      } finally {
        setCameraLoading(false);
      }
    },
    [isCameraOn, onToggleCamera]
  );

  let filteredLatestErrors: ActiveErrorMessage[] = props.latestErrors;

  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (role !== 'Consumer') {
    filteredLatestErrors = filteredLatestErrors.filter(
      (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
    );
  }

  if ((useIsParticularSidePaneOpen('videoeffects') || !isCameraOn) && errorBarProps) {
    filteredLatestErrors = filteredLatestErrors.filter((e) => e.type !== 'unableToStartVideoEffect');
  }

  if (role === 'Consumer') {
    // If user's role permissions do not allow access to the microphone button then DO NOT disable the start call button
    // because microphone device permission is not needed for the user's role
    disableStartCallButton = false;
  }

  /* @conditional-compile-remove(call-readiness) */
  const cameras = useSelector(getCameras);

  /* @conditional-compile-remove(call-readiness) */
  // Overrides role permissions if CallCompositeOptions deviceChecks are set
  if (deviceChecks) {
    if (
      ['doNotPrompt', 'optional'].includes(deviceChecks.camera) &&
      ['doNotPrompt', 'optional'].includes(deviceChecks.microphone)
    ) {
      disableStartCallButton = false;
    } else if (deviceChecks.camera === 'required') {
      disableStartCallButton = !cameraPermissionGranted || cameras?.length === 0;
    }
  }

  const locale = useLocale();
  const title =
    locale.strings.call.configurationPageTitle.length > 0 ? (
      <Stack.Item className={mobileView ? titleContainerStyleMobile(theme) : titleContainerStyleDesktop(theme)}>
        <SvgWithWordWrapping
          width={mobileView ? 325 : 445}
          lineHeightPx={16 * 1.5}
          bufferHeightPx={16}
          text={locale.strings.call.configurationPageTitle}
          role="heading"
        />
      </Stack.Item>
    ) : (
      <></>
    );

  const callDescription = locale.strings.call.configurationPageCallDetails && (
    <Stack.Item className={mobileView ? callDetailsStyleMobile(theme) : callDetailsStyleDesktop(theme)}>
      {locale.strings.call.configurationPageCallDetails}
    </Stack.Item>
  );

  const mobileWithPreview = mobileView && role !== 'Consumer';

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

  const { toggleVideoEffectsPane, closeVideoEffectsPane, isVideoEffectsPaneOpen } = useVideoEffectsPane(
    props.updateSidePaneRenderer,
    mobileView,
    props.latestErrors,
    props.onDismissError
  );

  const startCall = useCallback(async () => {
    closeVideoEffectsPane();
    startCallHandler();
  }, [startCallHandler, closeVideoEffectsPane]);

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

  const containerStyles = useMemo(
    () => configurationContainerStyle(!mobileView, props.backgroundImage?.url),
    [mobileView, props.backgroundImage?.url]
  );

  return (
    <div ref={configContainerRef} className={mergeStyles(containerStyles)}>
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
            doNotPromptCamera={deviceChecks?.camera === 'doNotPrompt'}
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
          className={configurationCenteredContent(mobileWithPreview, !!props.logo)}
          verticalAlign={stackConfig && !mobileView ? undefined : 'center'}
          verticalFill={mobileWithPreview}
          tokens={mobileWithPreview ? configurationStackTokensMobile : configurationStackTokensDesktop}
        >
          <Stack.Item styles={callDetailsContainerStyles}>
            <Logo logo={props.logo} />
            {title}
            {callDescription}
          </Stack.Item>
          <Stack
            horizontal={configHorizontal(mobileWithPreview, mobileView, stackConfig)}
            horizontalAlign={mobileWithPreview ? 'stretch' : 'center'}
            verticalFill={mobileWithPreview}
            tokens={deviceConfigurationStackTokens}
          >
            {role !== 'Consumer' && (
              <LocalPreview
                mobileView={mobileWithPreview}
                showDevicesButton={mobileView}
                onToggleCamera={toggleCamera}
                cameraLoading={cameraLoading && !isCameraOn}
              />
            )}
            <Stack styles={mobileView ? undefined : configurationSectionStyle}>
              {!mobileWithPreview && (
                <Stack className={mobileView ? undefined : selectionContainerStyle(theme, _isSafari(environmentInfo))}>
                  <LocalDeviceSettings
                    {...options}
                    {...localDeviceSettingsHandlers}
                    onSelectCamera={switchCamera}
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
                    onClickVideoEffects={toggleVideoEffectsPane}
                  />
                </Stack>
              )}
              <Stack
                styles={mobileWithPreview ? startCallButtonContainerStyleMobile : startCallButtonContainerStyleDesktop}
                horizontalAlign={mobileWithPreview ? 'stretch' : 'end'}
              >
                <StartCallButton
                  className={mobileWithPreview ? startCallButtonStyleMobile : startCallButtonStyleDesktop}
                  onClick={startCall}
                  disabled={disableStartCallButton}
                  hideIcon={true}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Panel
          isOpen={isVideoEffectsPaneOpen}
          hasCloseButton={false}
          isBlocking={false}
          isHiddenOnDismiss={false}
          styles={panelStyles}
          focusTrapZoneProps={panelFocusProps}
          layerProps={panelLayerProps}
          type={PanelType.custom}
          customWidth={`${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem`}
        >
          <SidePane
            ariaLabel={isVideoEffectsPaneOpen ? locale.strings.call.videoEffectsPaneAriaLabel : undefined}
            mobileView={props.mobileView}
            updateSidePaneRenderer={props.updateSidePaneRenderer}
            maxWidth={`${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem`}
            minWidth={`${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem`}
          />
        </Panel>
      </Stack>
    </div>
  );
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

const Logo = (props: { logo?: { url: string; alt?: string; shape?: 'unset' | 'circle' } }): JSX.Element => {
  if (!props.logo) {
    return <></>;
  }
  return <Image styles={logoStyles(props.logo.shape)} src={props.logo.url} alt={props.logo.alt} />;
};

const configHorizontal = (mobileWithPreview: boolean, isMobile: boolean, configTooNarrow: boolean): boolean => {
  if (configTooNarrow && !isMobile) {
    return false;
  }
  return !mobileWithPreview;
};
