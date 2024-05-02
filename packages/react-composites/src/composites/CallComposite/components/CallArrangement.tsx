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
  ErrorBar,
  ErrorBarProps,
  useTheme
} from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
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
import { MutedNotification, MutedNotificationProps } from './MutedNotification';
import { CallAdapter } from '../adapter';
import { useSelector } from '../hooks/useSelector';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { CallControlOptions } from '../types/CallControlOptions';
import { PreparedMoreDrawer } from '../../common/Drawer/PreparedMoreDrawer';
import { getRemoteParticipants } from '../selectors/baseSelectors';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { getPage } from '../selectors/baseSelectors';
import { getCallStatus, getIsTeamsCall, getCaptionsStatus } from '../selectors/baseSelectors';
import { drawerContainerStyles } from '../styles/CallComposite.styles';
import { SidePane } from './SidePane/SidePane';
import { usePeoplePane } from './SidePane/usePeoplePane';

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
/* @conditional-compile-remove(spotlight) */
import { usePropsFor } from '../hooks/usePropsFor';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from './Prompt';
/* @conditional-compile-remove(spotlight) */
import {
  useLocalSpotlightCallbacksWithPrompt,
  useRemoteSpotlightCallbacksWithPrompt,
  useStopAllSpotlightCallbackWithPrompt
} from '../utils/spotlightUtils';
/* @conditional-compile-remove(acs-close-captions) */
import { getCaptionsKind } from '../selectors/baseSelectors';

/**
 * @private
 */
export interface CallArrangementProps {
  id?: string;
  complianceBannerProps: _ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps;
  onRenderGalleryContent: () => JSX.Element;
  dataUiId: string;
  mobileView: boolean;
  modalLayerHostId: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;
  onUserSetOverflowGalleryPositionChange?: (position: 'Responsive' | 'horizontalTop') => void;
  onUserSetGalleryLayoutChange?: (layout: VideoGalleryLayout) => void;
  userSetGalleryLayout?: VideoGalleryLayout;

  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  onCloseChatPane?: () => void;
  onSetDialpadPage?: () => void;
  dtmfDialerPresent?: boolean;
  /* @conditional-compile-remove(spotlight) */
  setIsPromptOpen?: (isOpen: boolean) => void;
  /* @conditional-compile-remove(spotlight) */
  setPromptProps?: (props: PromptProps) => void;
  /* @conditional-compile-remove(spotlight) */
  hideSpotlightButtons?: boolean;
}

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

  /* @conditional-compile-remove(spotlight) */
  const videoGalleryProps = usePropsFor(VideoGallery);

  /* @conditional-compile-remove(spotlight) */
  const { setPromptProps, setIsPromptOpen, hideSpotlightButtons } = props;

  /* @conditional-compile-remove(spotlight) */
  const {
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    spotlightedParticipants,
    maxParticipantsToSpotlight,
    localParticipant
  } = videoGalleryProps;

  /* @conditional-compile-remove(spotlight) */
  const { onStartLocalSpotlightWithPrompt, onStopLocalSpotlightWithPrompt } = useLocalSpotlightCallbacksWithPrompt(
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  /* @conditional-compile-remove(spotlight) */
  const { onStartRemoteSpotlightWithPrompt, onStopRemoteSpotlightWithPrompt } = useRemoteSpotlightCallbacksWithPrompt(
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  /* @conditional-compile-remove(spotlight) */
  const canRemoveSpotlight =
    adapter.getState().call?.capabilitiesFeature?.capabilities.removeParticipantsSpotlight.isPresent;
  /* @conditional-compile-remove(spotlight) */
  const stopAllSpotlight = useMemo(
    () => (canRemoveSpotlight ? () => adapter.stopAllSpotlight() : undefined),
    [canRemoveSpotlight, adapter]
  );

  /* @conditional-compile-remove(spotlight) */
  const { stopAllSpotlightWithPrompt } = useStopAllSpotlightCallbackWithPrompt(
    stopAllSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  const spotlightPeoplePaneProps = useMemo(() => {
    /* @conditional-compile-remove(spotlight) */
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
    /* @conditional-compile-remove(spotlight) */ hideSpotlightButtons,
    /* @conditional-compile-remove(spotlight) */ maxParticipantsToSpotlight,
    /* @conditional-compile-remove(spotlight) */ onStartLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */ onStartRemoteSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */ onStopLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */ onStopRemoteSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */ stopAllSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */ spotlightedParticipants
  ]);

  const { isPeoplePaneOpen, openPeoplePane, closePeoplePane } = usePeoplePane({
    ...peoplePaneProps,
    ...spotlightPeoplePaneProps
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
    props.latestErrors,
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

  const role = adapter.getState().call?.role;

  const canUnmute = role !== 'Consumer' ? true : false;

  let filteredLatestErrors: ActiveErrorMessage[] = props.errorBarProps !== false ? props.latestErrors : [];

  const isCameraOn = useSelector(localVideoSelector).isAvailable;

  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (role === 'Consumer' && props.errorBarProps) {
    filteredLatestErrors = filteredLatestErrors.filter(
      (e) => e.type !== 'callCameraAccessDenied' && e.type !== 'callCameraAccessDeniedSafari'
    );
  }

  const isVideoPaneOpen = useIsParticularSidePaneOpen(VIDEO_EFFECTS_SIDE_PANE_ID);

  if ((isVideoPaneOpen || !isCameraOn) && props.errorBarProps) {
    filteredLatestErrors = filteredLatestErrors.filter((e) => e.type !== 'unableToStartVideoEffect');
  }

  /* @conditional-compile-remove(acs-close-captions) */
  const isTeamsCaptions = useSelector(getCaptionsKind) === 'TeamsCaptions';
  const useTeamsCaptions =
    useSelector(getIsTeamsCall) || /* @conditional-compile-remove(acs-close-captions) */ isTeamsCaptions;
  const hasJoinedCall = useSelector(getCallStatus) === 'Connected';
  const isCaptionsOn = useSelector(getCaptionsStatus);
  const minMaxDragPosition = useMinMaxDragPosition(props.modalLayerHostId);
  const pipStyles = useMemo(() => getPipStyles(theme), [theme]);

  const verticalControlBar =
    props.mobileView && containerWidth && containerHeight && containerWidth / containerHeight > 1 ? true : false;

  // Filter out shareScreen capability notifications if on mobile
  const filteredCapabilitesChangedNotifications = props.mobileView
    ? props.capabilitiesChangedNotificationBarProps?.capabilitiesChangedNotifications.filter(
        (notification) => notification.capabilityName !== 'shareScreen'
      )
    : props.capabilitiesChangedNotificationBarProps?.capabilitiesChangedNotifications;

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
                  /* @conditional-compile-remove(spotlight) */
                  onStopLocalSpotlight={
                    !hideSpotlightButtons && localParticipant.spotlight ? onStopLocalSpotlightWithPrompt : undefined
                  }
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
              />
            </Stack>
          )}
          <Stack horizontal grow>
            <Stack.Item style={callCompositeContainerCSS}>
              <Stack.Item styles={callGalleryStyles} grow>
                <Stack verticalFill styles={mediaGalleryContainerStyles}>
                  <Stack.Item styles={notificationsContainerStyles}>
                    <Stack styles={bannerNotificationStyles}>
                      <_ComplianceBanner {...props.complianceBannerProps} />
                    </Stack>
                    {props.errorBarProps !== false && (
                      <Stack styles={bannerNotificationStyles}>
                        <ErrorBar
                          {...props.errorBarProps}
                          onDismissError={props.onDismissError}
                          activeErrorMessages={filteredLatestErrors}
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
                    {canUnmute && !!props.mutedNotificationProps && (
                      <MutedNotification {...props.mutedNotificationProps} />
                    )}
                  </Stack.Item>
                  {renderGallery && props.onRenderGalleryContent && props.onRenderGalleryContent()}
                  {true &&
                    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !isInLocalHold && (
                      <CaptionsBanner
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
