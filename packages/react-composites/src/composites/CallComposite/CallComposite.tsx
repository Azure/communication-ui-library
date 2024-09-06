// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInCall } from '@internal/calling-component-bindings';
import {
  ActiveErrorMessage,
  ErrorBar,
  ParticipantMenuItemsCallback,
  useTheme,
  VideoTilesOptions
} from '@internal/react-components';

import { ActiveNotification, NotificationStack } from '@internal/react-components';
import { CallSurveyImprovementSuggestions } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';
import { useLocale } from '../localization';
import { CommonCallAdapter, StartCallIdentifier } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallPage } from './pages/CallPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { NoticePage } from './pages/NoticePage';
import { useSelector } from './hooks/useSelector';
import { getEndedCall, getPage, getTargetCallees } from './selectors/baseSelectors';
import { LobbyPage } from './pages/LobbyPage';
import { TransferPage } from './pages/TransferPage';
import {
  leavingPageStyle,
  mainScreenContainerStyleDesktop,
  mainScreenContainerStyleMobile
} from './styles/CallComposite.styles';
import { CallControlOptions } from './types/CallControlOptions';

import { LayerHost, mergeStyles } from '@fluentui/react';
import { modalLayerHostStyle } from '../common/styles/ModalLocalAndRemotePIP.styles';
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
import { HoldPage } from './pages/HoldPage';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserPage } from './pages/UnsupportedBrowser';
import { CallSurvey } from '@azure/communication-calling';
import { ParticipantRole, PermissionConstraints } from '@azure/communication-calling';
import { MobileChatSidePaneTabHeaderProps } from '../common/TabHeader';
import { InjectedSidePaneProps, SidePaneProvider, SidePaneRenderer } from './components/SidePane/SidePaneProvider';
import {
  filterLatestNotifications,
  getEndedCallPageProps,
  trackNotificationAsDismissed,
  updateTrackedNotificationsWithActiveNotifications
} from './utils';

import { CachedComplianceNotificationProps, computeComplianceNotification } from './utils';
import { TrackedNotifications } from './types/ErrorTracking';
import { usePropsFor } from './hooks/usePropsFor';
import { deviceCountSelector } from './selectors/deviceCountSelector';
import { VideoGalleryLayout } from '@internal/react-components';
import { capabilitiesChangedInfoAndRoleSelector } from './selectors/capabilitiesChangedInfoAndRoleSelector';
import { useTrackedCapabilityChangedNotifications } from './utils/TrackCapabilityChangedNotifications';
import { useEndedCallConsoleErrors } from './utils/useConsoleErrors';
import { SurveyPage } from './pages/SurveyPage';
import { useAudio } from '../common/AudioProvider';

import { complianceBannerSelector } from './selectors/complianceBannerSelector';

/**
 * Props for {@link CallComposite}.
 *
 * @public
 */
export interface CallCompositeProps extends BaseCompositeProps<CallCompositeIcons> {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: CommonCallAdapter;
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL to invite new participants to the current call. If this is supplied, a button appears in the Participants
   * Button flyout menu.
   */
  callInvitationUrl?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallComposite}.
   */
  options?: CallCompositeOptions;
}

/* @conditional-compile-remove(call-readiness) */
/**
 * Device Checks.
 * Choose whether or not to block starting a call depending on camera and microphone permission options.
 *
 * @beta
 */
export interface DeviceCheckOptions {
  /**
   * Camera Permission prompts for your call.
   * 'required' - requires the permission to be allowed before permitting the user join the call.
   * 'optional' - permission can be disallowed and the user is still permitted to join the call.
   * 'doNotPrompt' - permission is not required and the user is not prompted to allow the permission.
   */
  camera: 'required' | 'optional' | 'doNotPrompt';
  /**
   * Microphone permission prompts for your call.
   * 'required' - requires the permission to be allowed before permitting the user join the call.
   * 'optional' - permission can be disallowed and the user is still permitted to join the call.
   * 'doNotPrompt' - permission is not required and the user is not prompted to allow the permission.
   */
  microphone: 'required' | 'optional' | 'doNotPrompt';
}

/**
 * Menu options for remote video tiles in {@link VideoGallery}.
 *
 * @public
 */
export interface RemoteVideoTileMenuOptions {
  /**
   * If set to true, remote video tiles in the VideoGallery will not have menu options
   *
   * @defaultValue false
   */
  isHidden?: boolean;
}

/**
 * Options for the local video tile in the Call composite.
 *
 * @public
 */
export interface LocalVideoTileOptions {
  /**
   * Position of the local video tile. If unset will render the local tile in the floating local position.
   *
   * @defaultValue 'floating'
   * @remarks 'grid' - local video tile will be rendered in the grid view of the videoGallery.
   * 'floating' - local video tile will be rendered in the floating position and will observe overflow gallery
   * local video tile rules and be docked in the bottom corner.
   * This does not affect the Configuration screen or the side pane Picture in Picture in Picture view.
   */
  position?: 'grid' | 'floating';
}
/**
 * Optional features of the {@link CallComposite}.
 *
 * @public
 */
export type CallCompositeOptions = {
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   * Hide or show the error bar.
   * @defaultValue true
   */
  errorBar?: boolean;
  /**
   * Hide or Customize the control bar element.
   * Can be customized by providing an object of type {@link @azure/communication-react#CallControlOptions}.
   * @defaultValue true
   */
  callControls?: boolean | CallControlOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Device permissions check options for your call.
   * Here you can choose what device permissions you prompt the user for,
   * as well as what device permissions must be accepted before starting a call.
   */
  deviceChecks?: DeviceCheckOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * unable to grant your site the required permissions for the call.
   *
   * @example
   * ```ts
   * onPermissionsTroubleshootingClick: () =>
   *  window.open('https://contoso.com/permissions-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'further troubleshooting' link.
   */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * having network issues when connecting to the call.
   *
   * @example
   * ```ts
   * onNetworkingTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/network-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'network troubleshooting' link.
   */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Callback you may provide to supply users with a provided page to showcase supported browsers by ACS.
   *
   * @example
   * ```ts
   * onBrowserTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/browser-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a unsupported browser page.
   */
  onEnvironmentInfoTroubleshootingClick?: () => void;
  /**
   * Remote participant video tile menu options
   */
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  /**
   * Options for controlling the local video tile.
   *
   * @remarks if 'false' the local video tile will not be rendered.
   */
  localVideoTile?: boolean | LocalVideoTileOptions;
  /**
   * Options for controlling video tile.
   */
  videoTilesOptions?: VideoTilesOptions;
  /**
   * Whether to auto show the DTMF Dialer when the call starts in supported scenarios.
   * - Teams Voice Application like Call queue or Auto Attendant
   * - PSTN Calls
   * @defaultValue false
   */
  disableAutoShowDtmfDialer?: boolean;
  /**
   * Options for controlling the starting layout of the composite's video gallery
   */
  galleryOptions?: {
    /**
     * Layout for the gallery when the call starts
     */
    layout?: VideoGalleryLayout;
  };
  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Disable call survey at the end of a call.
     * @defaultValue false
     */
    disableSurvey?: boolean;
    /**
     * Optional callback to redirect users to custom screens when survey is done, note that default end call screen will be shown if this callback is not provided
     * This callback can be used to redirect users to different screens depending on survey state, whether it is submitted, skipped or has a problem when submitting the survey
     */
    onSurveyClosed?: (surveyState: 'sent' | 'skipped' | 'error', surveyError?: string) => void;
    /**
     * Optional callback to handle survey data including free form text response
     * Note that free form text response survey option is only going to be enabled when this callback is provided
     * User will need to handle all free form text response on their own
     */
    onSurveySubmitted?: (
      callId: string,
      surveyId: string,
      /**
       * This is the survey results containing star survey data and API tag survey data.
       * This part of the result will always be sent to the calling sdk
       * This callback provides user with the ability to gain access to survey data
       */
      submittedSurvey: CallSurvey,
      /**
       * This is the survey results containing free form text
       * This part of the result will not be handled by composites
       * User will need to collect and handle this information 100% on their own
       * Free form text survey is not going to show in the UI if onSurveySubmitted is not populated
       */
      improvementSuggestions: CallSurveyImprovementSuggestions
    ) => Promise<void>;
  };
  /**
   * Options for setting additional customizations related to personalized branding.
   */
  branding?: {
    /**
     * Logo displayed on the configuration page.
     */
    logo?: {
      /**
       * URL for the logo image.
       *
       * @remarks
       * Recommended size is 80x80 pixels.
       */
      url: string;
      /**
       * Alt text for the logo image.
       */
      alt?: string;
      /**
       * The logo can be displayed as a circle.
       *
       * @defaultValue 'unset'
       */
      shape?: 'unset' | 'circle';
    };
    /**
     * Background image displayed on the configuration page.
     */
    backgroundImage?: {
      /**
       * URL for the background image.
       *
       * @remarks
       * Background image should be larger than 576x567 pixels and smaller than 2048x2048 pixels pixels.
       */
      url: string;
    };
  };
  /**
   * Options for settings related to spotlight.
   */
  spotlight?: {
    /**
     * Flag to hide the menu buttons to start and stop spotlight for remote participants and the local participant.
     * @defaultValue false
     */
    hideSpotlightButtons?: boolean;
  };
};

type MainScreenProps = {
  mobileView: boolean;
  modalLayerHostId: string;
  callInvitationUrl?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
  overrideSidePane?: InjectedSidePaneProps;
  onSidePaneIdChange?: (sidePaneId: string | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  onCloseChatPane?: () => void;
};

const isShowing = (overrideSidePane?: InjectedSidePaneProps): boolean => {
  return !!overrideSidePane?.isActive;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const adapter = useAdapter();
  const { camerasCount, microphonesCount } = useSelector(deviceCountSelector);
  const hasCameras = camerasCount > 0;
  const hasMicrophones = microphonesCount > 0;

  useEffect(() => {
    (async () => {
      const constrain = getQueryOptions({
        role: adapter.getState().call?.role
      });
      /* @conditional-compile-remove(call-readiness) */
      {
        constrain.audio = props.options?.deviceChecks?.microphone === 'doNotPrompt' ? false : constrain.audio;
        constrain.video = props.options?.deviceChecks?.camera === 'doNotPrompt' ? false : constrain.video;
      }
      await adapter.askDevicePermission(constrain);
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [
    adapter,
    /* @conditional-compile-remove(call-readiness) */
    props.options?.deviceChecks,
    // Ensure we re-ask for permissions if the number of devices goes from 0 -> n during a call
    // as we cannot request permissions when there are no devices.
    hasCameras,
    hasMicrophones
  ]);

  const { callInvitationUrl, onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const page = useSelector(getPage);
  const endedCall = useSelector(getEndedCall);

  const [sidePaneRenderer, setSidePaneRenderer] = React.useState<SidePaneRenderer | undefined>();
  const [injectedSidePaneProps, setInjectedSidePaneProps] = React.useState<InjectedSidePaneProps>();
  const [userSetGalleryLayout, setUserSetGalleryLayout] = useState<VideoGalleryLayout>(
    props.options?.galleryOptions?.layout ?? 'floatingLocalVideo'
  );
  const [userSetOverflowGalleryPosition, setUserSetOverflowGalleryPosition] = useState<'Responsive' | 'horizontalTop'>(
    'Responsive'
  );

  const overridePropsRef = useRef<InjectedSidePaneProps | undefined>(props.overrideSidePane);
  useEffect(() => {
    setInjectedSidePaneProps(props.overrideSidePane);
    // When the injected side pane is opened, clear the previous side pane active state.
    // this ensures when the injected side pane is "closed", the previous side pane is not "re-opened".
    if (!isShowing(overridePropsRef.current) && isShowing(props.overrideSidePane)) {
      setSidePaneRenderer(undefined);
    }
    overridePropsRef.current = props.overrideSidePane;
  }, [props.overrideSidePane]);

  const onSidePaneIdChange = props.onSidePaneIdChange;
  useEffect(() => {
    onSidePaneIdChange?.(sidePaneRenderer?.id);
  }, [sidePaneRenderer?.id, onSidePaneIdChange]);

  // When the call ends ensure the side pane is set to closed to prevent the side pane being open if the call is re-joined.
  useEffect(() => {
    const closeSidePane = (): void => {
      setSidePaneRenderer(undefined);
    };
    adapter.on('callEnded', closeSidePane);
    return () => {
      adapter.off('callEnded', closeSidePane);
    };
  }, [adapter]);

  const compositeAudioContext = useAudio();

  const capabilitiesChangedInfoAndRole = useSelector(capabilitiesChangedInfoAndRoleSelector);

  const capabilitiesChangedNotificationBarProps =
    useTrackedCapabilityChangedNotifications(capabilitiesChangedInfoAndRole);

  // Track the last dismissed errors of any error kind to prevent errors from re-appearing on subsequent page navigation
  // This works by tracking the most recent timestamp of any active error type.
  // And then tracking when that error type was last dismissed.
  const activeErrors = usePropsFor(ErrorBar).activeErrorMessages;

  const activeInCallErrors = usePropsFor(NotificationStack).activeErrorMessages;

  const activeNotifications = usePropsFor(NotificationStack).activeNotifications;

  const complianceProps = useSelector(complianceBannerSelector);

  const cachedProps = useRef<CachedComplianceNotificationProps>({
    latestBooleanState: {
      callTranscribeState: false,
      callRecordState: false
    },
    latestStringState: {
      callTranscribeState: 'off',
      callRecordState: 'off'
    },
    lastUpdated: Date.now()
  });

  const complianceNotification: ActiveNotification | undefined = useMemo(() => {
    return computeComplianceNotification(complianceProps, cachedProps);
  }, [complianceProps, cachedProps]);

  useEffect(() => {
    if (complianceNotification) {
      activeNotifications.forEach((notification, index) => {
        if (
          [
            'recordingStarted',
            'transcriptionStarted',
            'recordingStopped',
            'transcriptionStopped',
            'recordingAndTranscriptionStarted',
            'recordingAndTranscriptionStopped',
            'recordingStoppedStillTranscribing',
            'transcriptionStoppedStillRecording'
          ].includes(activeNotifications[index].type)
        ) {
          activeNotifications.splice(index, 1);
        }
      });
      activeNotifications.push(complianceNotification);
    }
    setTrackedNotifications((prev) => updateTrackedNotificationsWithActiveNotifications(prev, activeNotifications));
  }, [complianceNotification, activeNotifications]);

  const [trackedErrors, setTrackedErrors] = useState<TrackedNotifications>({} as TrackedNotifications);

  const [trackedInCallErrors, setTrackedInCallErrors] = useState<TrackedNotifications>({} as TrackedNotifications);

  const [trackedNotifications, setTrackedNotifications] = useState<TrackedNotifications>({} as TrackedNotifications);

  useEffect(() => {
    setTrackedErrors((prev) => updateTrackedNotificationsWithActiveNotifications(prev, activeErrors));

    setTrackedInCallErrors((prev) => updateTrackedNotificationsWithActiveNotifications(prev, activeInCallErrors));
  }, [activeErrors, activeInCallErrors]);

  const onDismissError = useCallback((error: ActiveErrorMessage | ActiveNotification) => {
    setTrackedErrors((prev) => trackNotificationAsDismissed(error.type, prev));

    setTrackedInCallErrors((prev) => trackNotificationAsDismissed(error.type, prev));
  }, []);

  const onDismissNotification = useCallback((notification: ActiveNotification) => {
    setTrackedNotifications((prev) => trackNotificationAsDismissed(notification.type, prev));
  }, []);
  const latestErrors = useMemo(
    () => filterLatestNotifications(activeErrors, trackedErrors),
    [activeErrors, trackedErrors]
  );

  const latestInCallErrors = useMemo(
    () => filterLatestNotifications(activeInCallErrors, trackedInCallErrors),
    [activeInCallErrors, trackedInCallErrors]
  ) as ActiveNotification[];

  const latestNotifications = useMemo(() => {
    const result = filterLatestNotifications(activeNotifications, trackedNotifications);
    // sort notifications by timestamp from earliest to latest
    result.sort(
      (a, b) => (a.timestamp ?? new Date(Date.now())).getTime() - (b.timestamp ?? new Date(Date.now())).getTime()
    );
    return result;
  }, [activeNotifications, trackedNotifications]) as ActiveNotification[];

  const callees = useSelector(getTargetCallees) as StartCallIdentifier[];
  const locale = useLocale();
  const palette = useTheme().palette;
  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = adapter.getState().alternateCallerId;
  const leavePageStyle = useMemo(() => leavingPageStyle(palette), [palette]);
  let pageElement: JSX.Element | undefined;
  const [pinnedParticipants, setPinnedParticipants] = useState<string[]>([]);
  switch (page) {
    case 'configuration':
      pageElement = (
        <ConfigurationPage
          mobileView={props.mobileView}
          startCallHandler={(): void => {
            if (callees) {
              adapter.startCall(
                callees,
                /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
                  ? { alternateCallerId: { phoneNumber: alternateCallerId } }
                  : {}
              );
            } else {
              adapter.joinCall({
                microphoneOn: 'keep',
                cameraOn: 'keep'
              });
            }
          }}
          updateSidePaneRenderer={setSidePaneRenderer}
          latestErrors={latestErrors as ActiveErrorMessage[]}
          onDismissError={onDismissError}
          modalLayerHostId={props.modalLayerHostId}
          /* @conditional-compile-remove(call-readiness) */
          deviceChecks={props.options?.deviceChecks}
          /* @conditional-compile-remove(call-readiness) */
          onPermissionsTroubleshootingClick={props.options?.onPermissionsTroubleshootingClick}
          /* @conditional-compile-remove(call-readiness) */
          onNetworkingTroubleShootingClick={props.options?.onNetworkingTroubleShootingClick}
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
          logo={props.options?.branding?.logo}
          backgroundImage={props.options?.branding?.backgroundImage}
        />
      );
      break;
    case 'accessDeniedTeamsMeeting':
      pageElement = (
        <NoticePage
          iconName="NoticePageAccessDeniedTeamsMeeting"
          title={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedTitle}
          moreDetails={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails}
          dataUiId={'access-denied-teams-meeting-page'}
        />
      );
      break;
    case 'removedFromCall':
      pageElement = (
        <NoticePage
          iconName="NoticePageRemovedFromCall"
          title={locale.strings.call.removedFromCallTitle}
          moreDetails={locale.strings.call.removedFromCallMoreDetails}
          dataUiId={'removed-from-call-page'}
        />
      );
      break;
    case 'joinCallFailedDueToNoNetwork':
      pageElement = (
        <NoticePage
          iconName="NoticePageJoinCallFailedDueToNoNetwork"
          title={locale.strings.call.failedToJoinCallDueToNoNetworkTitle}
          moreDetails={locale.strings.call.failedToJoinCallDueToNoNetworkMoreDetails}
          dataUiId={'join-call-failed-due-to-no-network-page'}
        />
      );
      break;
    case 'leaving':
      pageElement = (
        <NoticePage
          title={locale.strings.call.leavingCallTitle ?? 'Leaving...'}
          dataUiId={'leaving-page'}
          pageStyle={leavePageStyle}
          disableStartCallButton={true}
        />
      );
      break;
    case 'badRequest': {
      const { title, moreDetails, disableStartCallButton, iconName } = getEndedCallPageProps(locale, endedCall);
      pageElement = (
        <NoticePage
          iconName={iconName}
          title={title}
          moreDetails={callees ? '' : moreDetails}
          dataUiId={'left-call-page'}
          disableStartCallButton={disableStartCallButton}
        />
      );
      break;
    }
    case 'leftCall': {
      const { title, moreDetails, disableStartCallButton, iconName } = getEndedCallPageProps(locale, endedCall);
      if (!props.options?.surveyOptions?.disableSurvey) {
        pageElement = (
          <SurveyPage
            dataUiId={'left-call-page'}
            surveyOptions={props.options?.surveyOptions}
            iconName={iconName}
            title={title}
            moreDetails={moreDetails}
            disableStartCallButton={disableStartCallButton}
            mobileView={props.mobileView}
          />
        );
        break;
      }
      pageElement = (
        <NoticePage
          iconName={iconName}
          title={title}
          moreDetails={callees ? '' : moreDetails}
          dataUiId={'left-call-page'}
          disableStartCallButton={disableStartCallButton}
        />
      );

      break;
    }
    case 'lobby':
      pageElement = (
        <LobbyPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          latestErrors={latestInCallErrors}
          latestNotifications={latestNotifications}
          onDismissError={onDismissError}
          onDismissNotification={onDismissNotification}
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
        />
      );
      break;
    case 'transferring':
      pageElement = (
        <TransferPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          latestErrors={latestInCallErrors}
          latestNotifications={latestNotifications}
          onDismissError={onDismissError}
          onDismissNotification={onDismissNotification}
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
        />
      );
      break;
    case 'call':
      pageElement = (
        <CallPage
          callInvitationURL={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          onCloseChatPane={props.onCloseChatPane}
          latestErrors={latestInCallErrors}
          latestNotifications={latestNotifications}
          onDismissError={onDismissError}
          onDismissNotification={onDismissNotification}
          galleryLayout={userSetGalleryLayout}
          onUserSetGalleryLayoutChange={setUserSetGalleryLayout}
          onSetUserSetOverflowGalleryPosition={setUserSetOverflowGalleryPosition}
          userSetOverflowGalleryPosition={userSetOverflowGalleryPosition}
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
          pinnedParticipants={pinnedParticipants}
          setPinnedParticipants={setPinnedParticipants}
          compositeAudioContext={compositeAudioContext}
          disableAutoShowDtmfDialer={props.options?.disableAutoShowDtmfDialer}
        />
      );
      break;
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    case 'hold':
      pageElement = (
        <>
          {
            <HoldPage
              mobileView={props.mobileView}
              modalLayerHostId={props.modalLayerHostId}
              options={props.options}
              updateSidePaneRenderer={setSidePaneRenderer}
              mobileChatTabHeader={props.mobileChatTabHeader}
              latestErrors={latestInCallErrors}
              latestNotifications={latestNotifications}
              onDismissError={onDismissError}
              onDismissNotification={onDismissNotification}
              capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
            />
          }
        </>
      );
      break;
  }

  useEndedCallConsoleErrors(endedCall);

  /* @conditional-compile-remove(unsupported-browser) */
  switch (page) {
    case 'unsupportedEnvironment':
      pageElement = (
        <>
          {
            /* @conditional-compile-remove(unsupported-browser) */
            <UnsupportedBrowserPage
              onTroubleshootingClick={props.options?.onEnvironmentInfoTroubleshootingClick}
              environmentInfo={adapter.getState().environmentInfo}
            />
          }
        </>
      );
      break;
  }

  if (!pageElement) {
    throw new Error('Invalid call composite page');
  }

  return (
    <SidePaneProvider sidePaneRenderer={sidePaneRenderer} overrideSidePane={injectedSidePaneProps}>
      {pageElement}
    </SidePaneProvider>
  );
};

/**
 * A customizable UI composite for calling experience.
 *
 * @remarks Call composite min width/height are as follow:
 * - mobile: 17.5rem x 21rem (280px x 336px, with default rem at 16px)
 * - desktop: 30rem x 22rem (480px x 352px, with default rem at 16px)
 *
 * @public
 */
export const CallComposite = (props: CallCompositeProps): JSX.Element => <CallCompositeInner {...props} />;

/**
 * @private
 */
export interface InternalCallCompositeProps {
  overrideSidePane?: InjectedSidePaneProps;
  onSidePaneIdChange?: (sidePaneId: string | undefined) => void;
  onCloseChatPane?: () => void;
  // legacy property to avoid breaking change
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
}

/** @private */
export const CallCompositeInner = (props: CallCompositeProps & InternalCallCompositeProps): JSX.Element => {
  const {
    adapter,
    callInvitationUrl,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options,
    formFactor = 'desktop'
  } = props;

  const mobileView = formFactor === 'mobile';

  const modalLayerHostId = useId('modalLayerhost');
  const mainScreenContainerClassName = useMemo(() => {
    return mobileView ? mainScreenContainerStyleMobile : mainScreenContainerStyleDesktop;
  }, [mobileView]);

  return (
    <div className={mainScreenContainerClassName}>
      <BaseProvider {...props}>
        <CallAdapterProvider adapter={adapter}>
          <MainScreen
            callInvitationUrl={callInvitationUrl}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            mobileView={mobileView}
            modalLayerHostId={modalLayerHostId}
            options={options}
            onSidePaneIdChange={props.onSidePaneIdChange}
            overrideSidePane={props.overrideSidePane}
            mobileChatTabHeader={props.mobileChatTabHeader}
            onCloseChatPane={props.onCloseChatPane}
          />
          {
            // This layer host is for ModalLocalAndRemotePIP in SidePane. This LayerHost cannot be inside the SidePane
            // because when the SidePane is hidden, ie. style property display is 'none', it takes up no space. This causes problems when dragging
            // the Modal because the draggable bounds thinks it has no space and will always return to its initial position after dragging.
            // Additionally, this layer host cannot be in the Call Arrangement as it needs to be rendered before useMinMaxDragPosition() in
            // common/utils useRef is called.
            // Warning: this is fragile and works because the call arrangement page is only rendered after the call has connected and thus this
            // LayerHost will be guaranteed to have rendered (and subsequently mounted in the DOM). This ensures the DOM element will be available
            // before the call to `document.getElementById(modalLayerHostId)` is made.
            <LayerHost id={modalLayerHostId} className={mergeStyles(modalLayerHostStyle)} />
          }
        </CallAdapterProvider>
      </BaseProvider>
    </div>
  );
};

const getQueryOptions = (options: { role?: ParticipantRole }): PermissionConstraints => {
  if (options.role === 'Consumer') {
    return {
      video: false,
      audio: true
    };
  }
  return { video: true, audio: true };
};
