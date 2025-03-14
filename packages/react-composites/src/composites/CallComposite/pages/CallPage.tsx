// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DiagnosticQuality } from '@azure/communication-calling';
import { useId } from '@fluentui/react-hooks';
import { _isInCall } from '@internal/calling-component-bindings';
import { ActiveErrorMessage, ErrorBar, ParticipantMenuItemsCallback } from '@internal/react-components';
import { CustomAvatarOptions, VideoTile } from '@internal/react-components';

import { ActiveNotification } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import React, { useMemo } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { AvatarPersona } from '../../common/AvatarPersona';
import { useLocale } from '../../localization';
import { CallCompositeOptions, DtmfDialPadOptions } from '../CallComposite';
import { CallArrangement } from '../components/CallArrangement';
import { MediaGallery } from '../components/MediaGallery';
import { NetworkReconnectTile } from '../components/NetworkReconnectTile';
import { useHandlers } from '../hooks/useHandlers';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { complianceBannerSelector } from '../selectors/complianceBannerSelector';
import { mediaGallerySelector } from '../selectors/mediaGallerySelector';
import { getRemoteParticipantsConnectedSelector } from '../selectors/mediaGallerySelector';
import { mutedNotificationSelector } from '../selectors/mutedNotificationSelector';
import { networkReconnectTileSelector } from '../selectors/networkReconnectTileSelector';
import { reduceCallControlsForMobile } from '../utils';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';

import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';
import { DtmfDialpadPage } from './DtmfDialpadPage';
import { showDtmfDialer } from '../utils/MediaGalleryUtils';
import { getTargetCallees } from '../selectors/baseSelectors';
import { Prompt, PromptProps } from '../components/Prompt';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { mergeStyles, Stack } from '@fluentui/react';

/**
 * @private
 */
export interface CallPageProps {
  mobileView: boolean;
  modalLayerHostId: string;
  callInvitationURL?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  options?: CallCompositeOptions;
  latestErrors: ActiveErrorMessage[] | ActiveNotification[];
  latestNotifications: ActiveNotification[];
  onDismissError: (error: ActiveErrorMessage | ActiveNotification) => void;
  onDismissNotification: (notification: ActiveNotification) => void;
  galleryLayout: VideoGalleryLayout;
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  onUserSetGalleryLayoutChange?: (layout: VideoGalleryLayout) => void;
  userSetOverflowGalleryPosition?: 'Responsive' | 'horizontalTop';
  onSetUserSetOverflowGalleryPosition?: (position: 'Responsive' | 'horizontalTop') => void;
  onCloseChatPane?: () => void;
  pinnedParticipants?: string[];
  setPinnedParticipants?: (pinnedParticipants: string[]) => void;
  compositeAudioContext?: AudioContext;
  disableAutoShowDtmfDialer?: boolean | DtmfDialPadOptions;
}

/**
 * @private
 */
export const CallPage = (props: CallPageProps): JSX.Element => {
  const {
    callInvitationURL,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options,
    mobileView,
    galleryLayout = 'floatingLocalVideo',
    onUserSetGalleryLayoutChange,
    userSetOverflowGalleryPosition = 'Responsive',
    onSetUserSetOverflowGalleryPosition,
    onCloseChatPane,
    pinnedParticipants = [],
    setPinnedParticipants,
    compositeAudioContext,
    disableAutoShowDtmfDialer = { dialerBehavior: 'autoShow' },
    latestNotifications,
    onDismissNotification
  } = props;

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus } = useSelector(callStatusSelector);
  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);
  const errorBarProps = usePropsFor(ErrorBar);
  const mutedNotificationProps = useSelector(mutedNotificationSelector);
  const networkReconnectTileProps = useSelector(networkReconnectTileSelector);
  const remoteParticipantsConnected = useSelector(getRemoteParticipantsConnectedSelector);
  const callees = useSelector(getTargetCallees);
  const renderDtmfDialerFromStart = showDtmfDialer(callees, remoteParticipantsConnected, disableAutoShowDtmfDialer);
  const [dtmfDialerPresent, setDtmfDialerPresent] = useState<boolean>(renderDtmfDialerFromStart);

  const strings = useLocale().strings.call;

  const pinnedParticipantsChecked = useMemo(
    () =>
      pinnedParticipants.filter((pinnedParticipant) =>
        remoteParticipantsConnected.find(
          (remoteParticipant) => toFlatCommunicationIdentifier(remoteParticipant.identifier) === pinnedParticipant
        )
      ),
    [pinnedParticipants, remoteParticipantsConnected]
  );

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = mobileView ? reduceCallControlsForMobile(options?.callControls) : options?.callControls;

  const drawerMenuHostId = useId('drawerMenuHost');
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false);
  const [promptProps, setPromptProps] = useState<PromptProps>();

  const page = useSelector((state) => state.page);
  const userId = useSelector((state) => state.userId);
  const displayName = useSelector((state) => state.displayName);

  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return (
        <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
          <Stack styles={{ root: { margin: 'auto', maxHeight: '100%' } }}>
            {options?.coinSize && (
              <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
            )}
          </Stack>
        </Stack>
      );
    },
    [props.onFetchAvatarPersonaData]
  );

  let galleryContentWhenNotInCall = <></>;
  if (!_isInCall(callStatus) && page === 'returningFromBreakoutRoom') {
    galleryContentWhenNotInCall = (
      <VideoTile
        userId={toFlatCommunicationIdentifier(userId)}
        displayName={displayName}
        initialsName={displayName}
        onRenderPlaceholder={onRenderAvatar}
      />
    );
  }

  const onRenderGalleryContentTrampoline = (): JSX.Element => {
    if (dtmfDialerPresent) {
      return (
        <DtmfDialpadPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={props.updateSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          latestErrors={props.latestErrors as ActiveErrorMessage[]}
          onDismissError={props.onDismissError}
          capabilitiesChangedNotificationBarProps={props.capabilitiesChangedNotificationBarProps}
          onSetDialpadPage={() => setDtmfDialerPresent(!dtmfDialerPresent)}
          dtmfDialerPresent={dtmfDialerPresent}
          compositeAudioContext={compositeAudioContext}
        />
      );
    } else {
      return (
        <MediaGallery
          isMobile={mobileView}
          {...mediaGalleryProps}
          {...mediaGalleryHandlers}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          remoteVideoTileMenuOptions={options?.remoteVideoTileMenuOptions}
          drawerMenuHostId={drawerMenuHostId}
          localVideoTileOptions={options?.localVideoTile}
          userSetOverflowGalleryPosition={userSetOverflowGalleryPosition}
          userSetGalleryLayout={galleryLayout}
          pinnedParticipants={pinnedParticipantsChecked}
          setPinnedParticipants={setPinnedParticipants}
          setIsPromptOpen={setIsPromptOpen}
          setPromptProps={setPromptProps}
          hideSpotlightButtons={options?.spotlight?.hideSpotlightButtons}
          videoTilesOptions={options?.videoTilesOptions}
          captionsOptions={options?.captionsBanner}
          localScreenShareView={options?.galleryOptions?.localScreenShareView}
        />
      );
    }
  };

  return (
    <>
      <CallArrangement
        id={drawerMenuHostId}
        complianceBannerProps={{ ...complianceBannerProps, strings }}
        errorBarProps={options?.errorBar !== false && errorBarProps}
        showErrorNotifications={options?.errorBar ?? true}
        mutedNotificationProps={mutedNotificationProps}
        callControlProps={{
          callInvitationURL: callInvitationURL,
          onFetchParticipantMenuItems: onFetchParticipantMenuItems,
          options: callControlOptions,
          increaseFlyoutItemSize: mobileView
        }}
        onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        mobileView={mobileView}
        modalLayerHostId={props.modalLayerHostId}
        onRenderGalleryContent={() =>
          _isInCall(callStatus) ? (
            isNetworkHealthy(networkReconnectTileProps.networkReconnectValue) ? (
              onRenderGalleryContentTrampoline()
            ) : (
              <NetworkReconnectTile {...networkReconnectTileProps} isMobile={mobileView} />
            )
          ) : (
            galleryContentWhenNotInCall
          )
        }
        updateSidePaneRenderer={props.updateSidePaneRenderer}
        mobileChatTabHeader={props.mobileChatTabHeader}
        onCloseChatPane={onCloseChatPane}
        dataUiId={'call-page'}
        latestErrors={props.latestErrors}
        latestNotifications={latestNotifications}
        onDismissError={props.onDismissError}
        onDismissNotification={onDismissNotification}
        onUserSetOverflowGalleryPositionChange={onSetUserSetOverflowGalleryPosition}
        onUserSetGalleryLayoutChange={onUserSetGalleryLayoutChange}
        userSetGalleryLayout={galleryLayout}
        capabilitiesChangedNotificationBarProps={props.capabilitiesChangedNotificationBarProps}
        onSetDialpadPage={() => setDtmfDialerPresent(!dtmfDialerPresent)}
        dtmfDialerPresent={dtmfDialerPresent}
        setIsPromptOpen={setIsPromptOpen}
        setPromptProps={setPromptProps}
        hideSpotlightButtons={options?.spotlight?.hideSpotlightButtons}
        pinnedParticipants={pinnedParticipantsChecked}
        setPinnedParticipants={setPinnedParticipants}
        /* @conditional-compile-remove(call-readiness) */
        doNotShowCameraAccessNotifications={props.options?.deviceChecks?.camera === 'doNotPrompt'}
        captionsOptions={options?.captionsBanner}
        dtmfDialerOptions={disableAutoShowDtmfDialer}
      />
      {<Prompt isOpen={isPromptOpen} onDismiss={() => setIsPromptOpen(false)} {...promptProps} />}
    </>
  );
};

/**
 * @private
 */
export const isNetworkHealthy = (value: DiagnosticQuality | boolean | undefined): boolean => {
  // We know that the value is actually of type DiagnosticQuality for this diagnostic.
  // We ignore any boolen values, considering the network to still be healthy.
  // Thus, only DiagnosticQuality.Poor or .Bad indicate network problems.
  return value === true || value === false || value === undefined || value === DiagnosticQuality.Good;
};
