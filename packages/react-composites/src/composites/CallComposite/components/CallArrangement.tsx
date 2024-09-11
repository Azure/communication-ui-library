// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButton, mergeStyles, Stack } from '@fluentui/react';
import { _isInCall, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import {
  _ComplianceBanner,
  _ComplianceBannerProps,
  _DrawerMenu,
  _DrawerMenuItemProps,
  _useContainerHeight,
  _useContainerWidth,
  ActiveErrorMessage,
  ErrorBarProps,
  useTheme
} from '@internal/react-components';
import { ActiveNotification, NotificationStack } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import { VideoGallery } from '@internal/react-components';
import React, { useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { CaptionsBanner } from '../../common/CaptionsBanner';
import { containerDivStyles } from '../../common/ContainerRectProps';
import { compositeMinWidthRem } from '../../common/styles/Composite.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallControls, CallControlsProps } from '../components/CallControls';
import { CommonCallControlBar } from '../../common/ControlBar/CommonCallControlBar';
import {
  callArrangementContainerStyles,
  notificationsContainerStyles,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  galleryParentContainerStyles,
  bannerNotificationStyles,
  CONTROL_BAR_Z_INDEX,
  DRAWER_Z_INDEX
} from '../styles/CallPage.styles';

import { notificationStackStyles } from '../styles/CallPage.styles';
import { MutedNotificationProps } from './MutedNotification';
import { CallAdapter } from '../adapter';
import { useSelector } from '../hooks/useSelector';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { CallControlOptions } from '../types/CallControlOptions';
import { PreparedMoreDrawer } from '../../common/Drawer/PreparedMoreDrawer';
import { getIsTeamsMeeting, getRemoteParticipants } from '../selectors/baseSelectors';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { getPage } from '../selectors/baseSelectors';
import { getCallStatus, getCaptionsStatus } from '../selectors/baseSelectors';
import { drawerContainerStyles } from '../styles/CallComposite.styles';
import { SidePane } from './SidePane/SidePane';
import { usePeoplePane } from './SidePane/usePeoplePane';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useMeetingPhoneInfoPane } from './SidePane/useMeetingPhoneInfo';
/* @conditional-compile-remove(teams-meeting-conference) */
import { getTeamsMeetingCoordinates } from '../selectors/baseSelectors';

import {
  useVideoEffectsPane,
  VIDEO_EFFECTS_SIDE_PANE_ID,
  VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM
} from './SidePane/useVideoEffectsPane';
import { isDisabled } from '../utils';
import { SidePaneRenderer, useIsSidePaneOpen } from './SidePane/SidePaneProvider';

import { useIsParticularSidePaneOpen } from './SidePane/SidePaneProvider';
import { ModalLocalAndRemotePIP } from '../../common/ModalLocalAndRemotePIP';
import { getPipStyles } from '../../common/styles/ModalLocalAndRemotePIP.styles';
import { useMinMaxDragPosition } from '../../common/utils';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { CommonCallControlOptions } from '../../common/types/CommonCallControlOptions';

import { localVideoSelector } from '../../CallComposite/selectors/localVideoStreamSelector';

import {
  CapabilitiesChangedNotificationBar,
  CapabilitiesChangeNotificationBarProps
} from './CapabilitiesChangedNotificationBar';
import { useLocale } from '../../localization';
import { usePropsFor } from '../hooks/usePropsFor';
import { PromptProps } from './Prompt';
import {
  useLocalSpotlightCallbacksWithPrompt,
  useRemoteSpotlightCallbacksWithPrompt,
  useStopAllSpotlightCallbackWithPrompt
} from '../utils/spotlightUtils';
/* @conditional-compile-remove(acs-close-captions) */
import { getCaptionsKind, getIsTeamsCall } from '../selectors/baseSelectors';
/* @conditional-compile-remove(soft-mute) */
import { useHandlers } from '../hooks/useHandlers';
/* @conditional-compile-remove(soft-mute) */
import { MoreDrawer } from '../../common/Drawer/MoreDrawer';
/* @conditional-compile-remove(breakout-rooms) */
import { useCompositeStringsForNotificationStackStrings } from '../hooks/useCompositeStringsForNotificationStack';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoomsBanner } from './BreakoutRoomsBanner';

/**
 * @private
 */
export interface CallArrangementProps {
  id?: string;
  complianceBannerProps: _ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  showErrorNotifications: boolean;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps;
  onRenderGalleryContent: () => JSX.Element;
  dataUiId: string;
  mobileView: boolean;
  modalLayerHostId: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  latestErrors: ActiveErrorMessage[] | ActiveNotification[];
  latestNotifications?: ActiveNotification[];
  onDismissError: (error: ActiveErrorMessage | ActiveNotification) => void;

  onDismissNotification?: (notification: ActiveNotification) => void;
  onUserSetOverflowGalleryPositionChange?: (position: 'Responsive' | 'horizontalTop') => void;
  onUserSetGalleryLayoutChange?: (layout: VideoGalleryLayout) => void;
  userSetGalleryLayout?: VideoGalleryLayout;

  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  onCloseChatPane?: () => void;
  onSetDialpadPage?: () => void;
  dtmfDialerPresent?: boolean;

  setIsPromptOpen?: (isOpen: boolean) => void;

  setPromptProps?: (props: PromptProps) => void;

  hideSpotlightButtons?: boolean;
  pinnedParticipants?: string[];
  setPinnedParticipants?: (pinnedParticipants: string[]) => void;
  doNotShowCameraAccessNotifications?: boolean;
  captionsOptions?: {
    height: 'full' | 'default';
  };
}

/**
 * @private
 * Maximum number of remote video tiles that can be pinned
 */
export const MAX_PINNED_REMOTE_VIDEO_TILES = 4;

/**
 * @private
 */
export const CallArrangement = (props: CallArrangementProps): JSX.Element => {
  const containerClassName = useMemo(() => {
    return props.mobileView ? containerStyleMobile : containerStyleDesktop;
  }, [props.mobileView]);

  const theme = useTheme();
  const callGalleryStyles = useMemo(
    () => galleryParentContainerStyles(theme.palette.neutralLighterAlt),
    [theme.palette.neutralLighterAlt]
  );

  const peopleButtonRef = useRef<IButton>(null);
  const cameraButtonRef = useRef<IButton>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);

  const isInLobby = _isInLobbyOrConnecting(useSelector(callStatusSelector).callStatus);

  const { updateSidePaneRenderer } = props;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const isInLocalHold = useSelector(getPage) === 'hold';

  const adapter = useAdapter();

  const [participantActioned, setParticipantActioned] = useState<string>();
  const remoteParticipants = useSelector(getRemoteParticipants);
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);
  useEffect(() => {
    const participantIsActionedButIsNotPresent =
      participantActioned && remoteParticipants?.[participantActioned] === undefined;
    if (participantIsActionedButIsNotPresent) {
      setDrawerMenuItems([]);
    }
  }, [participantActioned, remoteParticipants]);

  /* @conditional-compile-remove(teams-meeting-conference) */
  const conferencePhoneInfo = useSelector(getTeamsMeetingCoordinates);

  /* @conditional-compile-remove(teams-meeting-conference) */
  const meetingPhoneInfoPaneProps = {
    updateSidePaneRenderer,
    mobileView: props.mobileView,
    conferencePhoneInfo: conferencePhoneInfo
  };

  const peoplePaneProps = useMemo(
    () => ({
      updateSidePaneRenderer,
      setDrawerMenuItems,
      inviteLink: props.callControlProps.callInvitationURL,
      onFetchAvatarPersonaData: props.onFetchAvatarPersonaData,
      onFetchParticipantMenuItems: props.callControlProps?.onFetchParticipantMenuItems,
      mobileView: props.mobileView,
      peopleButtonRef,
      setParticipantActioned
    }),
    [
      updateSidePaneRenderer,
      props.callControlProps.callInvitationURL,
      props.callControlProps?.onFetchParticipantMenuItems,
      props.onFetchAvatarPersonaData,
      props.mobileView,
      peopleButtonRef,
      setParticipantActioned
    ]
  );

  const locale = useLocale();
  const role = adapter.getState().call?.role;
  const videoGalleryProps = usePropsFor(VideoGallery);
  /* @conditional-compile-remove(soft-mute) */
  const muteAllHandlers = useHandlers(MoreDrawer);
  const { setPromptProps, setIsPromptOpen, hideSpotlightButtons } = props;
  const {
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    /* @conditional-compile-remove(soft-mute) */
    onMuteParticipant,
    spotlightedParticipants,
    maxParticipantsToSpotlight,
    localParticipant
  } = videoGalleryProps;

  /* @conditional-compile-remove(teams-meeting-conference) */
  const [showTeamsMeetingConferenceModal, setShowTeamsMeetingConferenceModal] = useState(false);
  /* @conditional-compile-remove(teams-meeting-conference) */
  const toggleTeamsMeetingConferenceModal = useCallback((): void => {
    setShowTeamsMeetingConferenceModal(!showTeamsMeetingConferenceModal);
  }, [showTeamsMeetingConferenceModal]);

  /* @conditional-compile-remove(teams-meeting-conference) */
  const { isMeetingPhoneInfoPaneOpen, openMeetingPhoneInfoPane, closeMeetingPhoneInfoPane } = useMeetingPhoneInfoPane({
    ...meetingPhoneInfoPaneProps
  });

  /* @conditional-compile-remove(teams-meeting-conference) */
  const toggleMeetingPhoneInfoPane = useCallback(() => {
    if (isMeetingPhoneInfoPaneOpen) {
      closeMeetingPhoneInfoPane();
    } else {
      openMeetingPhoneInfoPane();
    }
  }, [closeMeetingPhoneInfoPane, isMeetingPhoneInfoPaneOpen, openMeetingPhoneInfoPane]);

  /* @conditional-compile-remove(teams-meeting-conference) */
  const onMeetingPhoneInfoClicked = useCallback(() => {
    setShowDrawer(false);
    toggleMeetingPhoneInfoPane();
  }, [toggleMeetingPhoneInfoPane]);

  const { pinnedParticipants, setPinnedParticipants } = props;
  const onPinParticipant = useCallback(
    (userId: string) => {
      if (pinnedParticipants && pinnedParticipants.length >= MAX_PINNED_REMOTE_VIDEO_TILES) {
        return;
      }
      if (pinnedParticipants && setPinnedParticipants && !pinnedParticipants.includes(userId)) {
        setPinnedParticipants(pinnedParticipants.concat(userId));
      }
    },
    [pinnedParticipants, setPinnedParticipants]
  );

  const onUnpinParticipant = useCallback(
    (userId: string) => {
      if (pinnedParticipants && setPinnedParticipants) {
        setPinnedParticipants(pinnedParticipants.filter((participantId) => participantId !== userId));
      }
    },
    [setPinnedParticipants, pinnedParticipants]
  );

  const pinPeoplePaneProps = useMemo(() => {
    return {
      pinnedParticipants: pinnedParticipants,
      onPinParticipant: onPinParticipant,
      onUnpinParticipant: onUnpinParticipant,
      disablePinMenuItem: pinnedParticipants && pinnedParticipants.length >= MAX_PINNED_REMOTE_VIDEO_TILES
    };
  }, [onPinParticipant, onUnpinParticipant, pinnedParticipants]);

  const { onStartLocalSpotlightWithPrompt, onStopLocalSpotlightWithPrompt } = useLocalSpotlightCallbacksWithPrompt(
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  const { onStartRemoteSpotlightWithPrompt, onStopRemoteSpotlightWithPrompt } = useRemoteSpotlightCallbacksWithPrompt(
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  const canRemoveSpotlight =
    adapter.getState().call?.capabilitiesFeature?.capabilities.removeParticipantsSpotlight.isPresent;
  const stopAllSpotlight = useMemo(
    () => (canRemoveSpotlight ? () => adapter.stopAllSpotlight() : undefined),
    [canRemoveSpotlight, adapter]
  );

  const { stopAllSpotlightWithPrompt } = useStopAllSpotlightCallbackWithPrompt(
    stopAllSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  const onMuteParticipantPeoplePaneProps = useMemo(() => {
    /* @conditional-compile-remove(soft-mute) */
    return {
      onMuteParticipant: ['Unknown', 'Organizer', 'Presenter', 'Co-organizer'].includes(role ?? '')
        ? onMuteParticipant
        : undefined,
      onMuteAllRemoteParticipants: ['Unknown', 'Organizer', 'Presenter', 'Co-organizer'].includes(role ?? '')
        ? muteAllHandlers.onMuteAllRemoteParticipants
        : undefined
    };
    return {};
  }, [
    /* @conditional-compile-remove(soft-mute) */ onMuteParticipant,
    /* @conditional-compile-remove(soft-mute) */ role,
    /* @conditional-compile-remove(soft-mute) */ muteAllHandlers.onMuteAllRemoteParticipants
  ]);

  const spotlightPeoplePaneProps = useMemo(() => {
    return {
      spotlightedParticipantUserIds: spotlightedParticipants,
      onStartLocalSpotlight: hideSpotlightButtons ? undefined : onStartLocalSpotlightWithPrompt,
      onStopLocalSpotlight: hideSpotlightButtons ? undefined : onStopLocalSpotlightWithPrompt,
      onStartRemoteSpotlight: hideSpotlightButtons ? undefined : onStartRemoteSpotlightWithPrompt,
      onStopRemoteSpotlight: hideSpotlightButtons ? undefined : onStopRemoteSpotlightWithPrompt,
      onStopAllSpotlight: hideSpotlightButtons ? undefined : stopAllSpotlightWithPrompt,
      maxParticipantsToSpotlight
    };
    return {};
  }, [
    hideSpotlightButtons,
    maxParticipantsToSpotlight,
    onStartLocalSpotlightWithPrompt,
    onStartRemoteSpotlightWithPrompt,
    onStopLocalSpotlightWithPrompt,
    onStopRemoteSpotlightWithPrompt,
    stopAllSpotlightWithPrompt,
    spotlightedParticipants
  ]);

  const { isPeoplePaneOpen, openPeoplePane, closePeoplePane } = usePeoplePane({
    ...peoplePaneProps,
    ...spotlightPeoplePaneProps,
    ...onMuteParticipantPeoplePaneProps,
    ...pinPeoplePaneProps
  });
  const togglePeoplePane = useCallback(() => {
    if (isPeoplePaneOpen) {
      closePeoplePane();
    } else {
      openPeoplePane();
    }
  }, [closePeoplePane, isPeoplePaneOpen, openPeoplePane]);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  useEffect(() => {
    if (isInLocalHold) {
      // close side pane on local hold
      updateSidePaneRenderer(undefined);
    }
  }, [updateSidePaneRenderer, isInLocalHold, isPeoplePaneOpen, closePeoplePane]);

  const isSidePaneOpen = useIsSidePaneOpen();

  const [renderGallery, setRenderGallery] = useState<boolean>(!isSidePaneOpen && props.mobileView);

  useEffect(() => {
    if (isSidePaneOpen && props.mobileView) {
      setRenderGallery(false);
    } else {
      setRenderGallery(true);
    }
  }, [props.mobileView, isSidePaneOpen]);

  const modalStrings = { dismissModalAriaLabel: locale.strings.call.dismissModalAriaLabel };

  const isMobileWithActivePane = props.mobileView && isSidePaneOpen;

  const callCompositeContainerCSS = useMemo((): React.CSSProperties => {
    return {
      display: isMobileWithActivePane ? 'none' : 'flex',
      minWidth: props.mobileView ? 'unset' : `${compositeMinWidthRem}rem`,
      width: '100%',
      height: '100%',
      position: 'relative'
    };
  }, [isMobileWithActivePane, props.mobileView]);

  const onResolveVideoEffectDependency = adapter.getState().onResolveVideoEffectDependency;

  const { openVideoEffectsPane } = useVideoEffectsPane(
    props.updateSidePaneRenderer,
    props.mobileView,
    props.latestErrors as ActiveErrorMessage[],
    props.onDismissError,
    cameraButtonRef
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const onMoreButtonClicked = useCallback(() => {
    setShowDrawer(true);
  }, []);
  const closeDrawer = useCallback(() => {
    setShowDrawer(false);
  }, []);
  const onMoreDrawerPeopleClicked = useCallback(() => {
    setShowDrawer(false);
    togglePeoplePane();
  }, [togglePeoplePane]);

  const drawerContainerStylesValue = useMemo(() => drawerContainerStyles(DRAWER_Z_INDEX), []);

  let filteredLatestErrorNotifications: ActiveNotification[] = props.showErrorNotifications
    ? (props.latestErrors as ActiveNotification[])
    : [];

  const isCameraOn = useSelector(localVideoSelector).isAvailable;

  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (role === 'Consumer' && (props.errorBarProps || props.showErrorNotifications)) {
    filteredLatestErrorNotifications = filteredLatestErrorNotifications.filter(
      (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
    );
  }

  if (props.doNotShowCameraAccessNotifications) {
    filteredLatestErrorNotifications = filteredLatestErrorNotifications.filter(
      (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
    );
  }

  const isVideoPaneOpen = useIsParticularSidePaneOpen(VIDEO_EFFECTS_SIDE_PANE_ID);

  if ((isVideoPaneOpen || !isCameraOn) && (props.errorBarProps || props.showErrorNotifications)) {
    filteredLatestErrorNotifications = filteredLatestErrorNotifications.filter(
      (e) => e.type !== 'unableToStartVideoEffect'
    );
  }

  /* @conditional-compile-remove(acs-close-captions) */
  const isTeamsCaptions = useSelector(getCaptionsKind) === 'TeamsCaptions';
  const isTeamsMeeting = useSelector(getIsTeamsMeeting);
  /* @conditional-compile-remove(acs-close-captions) */
  const isTeamsCall = useSelector(getIsTeamsCall);
  const useTeamsCaptions =
    isTeamsMeeting ||
    /* @conditional-compile-remove(acs-close-captions) */ isTeamsCall ||
    /* @conditional-compile-remove(acs-close-captions) */ isTeamsCaptions;
  const hasJoinedCall = useSelector(getCallStatus) === 'Connected';
  const isCaptionsOn = useSelector(getCaptionsStatus);
  const minMaxDragPosition = useMinMaxDragPosition(props.modalLayerHostId);
  const pipStyles = useMemo(() => getPipStyles(theme), [theme]);

  const galleryContainerStyles = useMemo(() => {
    return {
      ...mediaGalleryContainerStyles,
      ...(props?.captionsOptions?.height === 'full' ? { root: { postion: 'absolute' } } : {})
    };
  }, [props?.captionsOptions?.height]);

  if (isTeamsMeeting) {
    filteredLatestErrorNotifications
      .filter((notification) => notification.type === 'teamsMeetingCallNetworkQualityLow')
      .forEach((notification) => {
        notification.onClickPrimaryButton = props.mobileView
          ? toggleMeetingPhoneInfoPane
          : toggleTeamsMeetingConferenceModal;
      });
  }

  const verticalControlBar =
    props.mobileView && containerWidth && containerHeight && containerWidth / containerHeight > 1 ? true : false;

  // Filter out shareScreen capability notifications if on mobile
  const filteredCapabilitesChangedNotifications = props.mobileView
    ? props.capabilitiesChangedNotificationBarProps?.capabilitiesChangedNotifications.filter(
        (notification) => notification.capabilityName !== 'shareScreen'
      )
    : props.capabilitiesChangedNotificationBarProps?.capabilitiesChangedNotifications;

  /* @conditional-compile-remove(breakout-rooms) */
  const notificationStackStrings = useCompositeStringsForNotificationStackStrings(locale);

  let latestNotifications = props.latestNotifications;
  /* @conditional-compile-remove(breakout-rooms) */
  // Filter out breakout room notification that prompts user to join breakout room when in mobile view. We will
  // replace it with a non-dismissible banner
  latestNotifications = props.mobileView
    ? (latestNotifications ?? []).filter((notification) => notification.type !== 'assignedBreakoutRoomOpenedPromptJoin')
    : latestNotifications;

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)} id={props.id}>
      <Stack verticalFill horizontalAlign="stretch" className={containerClassName} data-ui-id={props.dataUiId}>
        <Stack
          reversed
          horizontal={verticalControlBar}
          grow
          styles={callArrangementContainerStyles(verticalControlBar)}
        >
          {props.callControlProps?.options !== false && !isMobileWithActivePane && (
            <Stack
              verticalAlign={'center'}
              className={mergeStyles({
                zIndex: CONTROL_BAR_Z_INDEX,
                padding: verticalControlBar ? '0.25rem' : 'unset'
              })}
            >
              {isLegacyCallControlEnabled(props.callControlProps?.options) ? (
                <CallControls
                  {...props.callControlProps}
                  containerWidth={containerWidth}
                  containerHeight={containerHeight}
                  isMobile={props.mobileView}
                  /* @conditional-compile-remove(one-to-n-calling) */
                  peopleButtonChecked={isPeoplePaneOpen}
                  /* @conditional-compile-remove(one-to-n-calling) */
                  onPeopleButtonClicked={togglePeoplePane}
                  displayVertical={verticalControlBar}
                />
              ) : (
                <CommonCallControlBar
                  {...props.callControlProps}
                  callControls={props.callControlProps.options}
                  callAdapter={adapter as CallAdapter}
                  mobileView={props.mobileView}
                  disableButtonsForLobbyPage={isInLobby}
                  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                  disableButtonsForHoldScreen={isInLocalHold}
                  peopleButtonChecked={isPeoplePaneOpen}
                  onPeopleButtonClicked={togglePeoplePane}
                  onMoreButtonClicked={onMoreButtonClicked}
                  isCaptionsSupported={
                    (useTeamsCaptions && hasJoinedCall) ||
                    /* @conditional-compile-remove(acs-close-captions) */ hasJoinedCall
                  }
                  useTeamsCaptions={useTeamsCaptions}
                  isCaptionsOn={isCaptionsOn}
                  onClickVideoEffects={onResolveVideoEffectDependency ? openVideoEffectsPane : undefined}
                  displayVertical={verticalControlBar}
                  onUserSetOverflowGalleryPositionChange={props.onUserSetOverflowGalleryPositionChange}
                  onUserSetGalleryLayout={props.onUserSetGalleryLayoutChange}
                  userSetGalleryLayout={props.userSetGalleryLayout}
                  onSetDialpadPage={props.onSetDialpadPage}
                  dtmfDialerPresent={props.dtmfDialerPresent}
                  peopleButtonRef={peopleButtonRef}
                  cameraButtonRef={cameraButtonRef}
                  onStopLocalSpotlight={
                    !hideSpotlightButtons && localParticipant.spotlight ? onStopLocalSpotlightWithPrompt : undefined
                  }
                  /* @conditional-compile-remove(teams-meeting-conference) */
                  onToggleTeamsMeetingConferenceModal={toggleTeamsMeetingConferenceModal}
                  /* @conditional-compile-remove(teams-meeting-conference) */
                  teamsMeetingConferenceModalPresent={showTeamsMeetingConferenceModal}
                />
              )}
            </Stack>
          )}
          {props.callControlProps?.options !== false && showDrawer && (
            <Stack styles={drawerContainerStylesValue}>
              <PreparedMoreDrawer
                callControls={props.callControlProps.options}
                onLightDismiss={closeDrawer}
                onPeopleButtonClicked={onMoreDrawerPeopleClicked}
                /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                disableButtonsForHoldScreen={isInLocalHold}
                isCaptionsSupported={
                  (useTeamsCaptions && hasJoinedCall) ||
                  /* @conditional-compile-remove(acs-close-captions) */ hasJoinedCall
                }
                useTeamsCaptions={useTeamsCaptions}
                onUserSetGalleryLayout={props.onUserSetGalleryLayoutChange}
                userSetGalleryLayout={props.userSetGalleryLayout}
                onSetDialpadPage={props.onSetDialpadPage}
                dtmfDialerPresent={props.dtmfDialerPresent}
                reactionResources={adapter.getState().reactions}
                /* @conditional-compile-remove(teams-meeting-conference) */
                onClickMeetingPhoneInfo={onMeetingPhoneInfoClicked}
              />
            </Stack>
          )}
          <Stack horizontal grow>
            <Stack.Item style={callCompositeContainerCSS}>
              <Stack.Item styles={callGalleryStyles} grow>
                <Stack verticalFill styles={galleryContainerStyles}>
                  <Stack.Item styles={notificationsContainerStyles}>
                    {
                      /* @conditional-compile-remove(breakout-rooms) */
                      props.mobileView && <BreakoutRoomsBanner locale={locale} adapter={adapter} />
                    }
                    {props.showErrorNotifications && (
                      <Stack styles={notificationStackStyles} horizontalAlign="center" verticalAlign="center">
                        <NotificationStack
                          onDismissNotification={props.onDismissError}
                          activeNotifications={filteredLatestErrorNotifications}
                        />
                      </Stack>
                    )}
                    {latestNotifications && (
                      <Stack styles={notificationStackStyles} horizontalAlign="center" verticalAlign="center">
                        <NotificationStack
                          activeNotifications={latestNotifications}
                          onDismissNotification={props.onDismissNotification}
                          /* @conditional-compile-remove(breakout-rooms) */
                          strings={notificationStackStrings}
                        />
                      </Stack>
                    )}
                    {props.capabilitiesChangedNotificationBarProps &&
                      props.capabilitiesChangedNotificationBarProps.capabilitiesChangedNotifications.length > 0 && (
                        <Stack styles={bannerNotificationStyles}>
                          <CapabilitiesChangedNotificationBar
                            {...props.capabilitiesChangedNotificationBarProps}
                            capabilitiesChangedNotifications={filteredCapabilitesChangedNotifications ?? []}
                          />
                        </Stack>
                      )}
                  </Stack.Item>
                  {renderGallery && props.onRenderGalleryContent && props.onRenderGalleryContent()}
                  {true &&
                    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !isInLocalHold && (
                      <CaptionsBanner
                        captionsOptions={props.captionsOptions}
                        isMobile={props.mobileView}
                        onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
                        useTeamsCaptions={useTeamsCaptions}
                      />
                    )}
                </Stack>
              </Stack.Item>
            </Stack.Item>
            <SidePane
              mobileView={props.mobileView}
              maxWidth={isVideoPaneOpen ? `${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem` : undefined}
              minWidth={isVideoPaneOpen ? `${VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM}rem` : undefined}
              updateSidePaneRenderer={props.updateSidePaneRenderer}
              onPeopleButtonClicked={
                props.mobileView && !shouldShowPeopleTabHeaderButton(props.callControlProps.options)
                  ? undefined
                  : togglePeoplePane
              }
              disablePeopleButton={
                typeof props.callControlProps.options !== 'boolean' &&
                isDisabled(props.callControlProps.options?.participantsButton)
              }
              onChatButtonClicked={props.mobileChatTabHeader?.onClick}
              disableChatButton={props.mobileChatTabHeader?.disabled}
              showAddPeopleButton={!!props.callControlProps.callInvitationURL}
            />
            {props.mobileView && (
              <ModalLocalAndRemotePIP
                modalLayerHostId={props.modalLayerHostId}
                hidden={!isSidePaneOpen}
                styles={pipStyles}
                strings={modalStrings}
                minDragPosition={minMaxDragPosition.minDragPosition}
                maxDragPosition={minMaxDragPosition.maxDragPosition}
                onDismissSidePane={() => {
                  closePeoplePane();
                  if (props.onCloseChatPane) {
                    props.onCloseChatPane();
                  }
                }}
              />
            )}
            {drawerMenuItems.length > 0 && (
              <Stack styles={drawerContainerStyles()}>
                <_DrawerMenu onLightDismiss={() => setDrawerMenuItems([])} items={drawerMenuItems} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

const isLegacyCallControlEnabled = (options?: boolean | CallControlOptions): boolean => {
  return !!options && options !== true && options?.legacyControlBarExperience === true;
};

const shouldShowPeopleTabHeaderButton = (callControls?: boolean | CommonCallControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.participantsButton !== false && callControls.peopleButton !== false;
};
