// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DiagnosticQuality } from '@azure/communication-calling';
import { useId } from '@fluentui/react-hooks';
import { _isInCall } from '@internal/calling-component-bindings';
import { ActiveErrorMessage, ErrorBar, ParticipantMenuItemsCallback } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import React from 'react';
import { useState } from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { useLocale } from '../../localization';
import { CallCompositeOptions } from '../CallComposite';
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
/* @conditional-compile-remove(spotlight) */
import { Prompt, PromptProps } from '../components/Prompt';

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
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;
  galleryLayout: VideoGalleryLayout;
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  onUserSetGalleryLayoutChange?: (layout: VideoGalleryLayout) => void;
  userSetOverflowGalleryPosition?: 'Responsive' | 'horizontalTop';
  onSetUserSetOverflowGalleryPosition?: (position: 'Responsive' | 'horizontalTop') => void;
  onCloseChatPane?: () => void;
  pinnedParticipants?: string[];
  setPinnedParticipants?: (pinnedParticipants: string[]) => void;
  compositeAudioContext?: AudioContext;
  disableAutoShowDtmfDialer?: boolean;
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
    pinnedParticipants,
    setPinnedParticipants,
    compositeAudioContext,
    disableAutoShowDtmfDialer = false
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
  const renderDtmfDialerFromStart = showDtmfDialer(callees, remoteParticipantsConnected);
  const [dtmfDialerPresent, setDtmfDialerPresent] = useState<boolean>(
    renderDtmfDialerFromStart && disableAutoShowDtmfDialer
  );

  const strings = useLocale().strings.call;

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = mobileView ? reduceCallControlsForMobile(options?.callControls) : options?.callControls;

  const drawerMenuHostId = useId('drawerMenuHost');
  /* @conditional-compile-remove(spotlight) */
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(spotlight) */
  const [promptProps, setPromptProps] = useState<PromptProps>();

  const onRenderGalleryContentTrampoline = (): JSX.Element => {
    if (dtmfDialerPresent) {
      return (
        <DtmfDialpadPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={props.updateSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          latestErrors={props.latestErrors}
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
          pinnedParticipants={pinnedParticipants}
          setPinnedParticipants={setPinnedParticipants}
          /* @conditional-compile-remove(spotlight) */
          setIsPromptOpen={setIsPromptOpen}
          /* @conditional-compile-remove(spotlight) */
          setPromptProps={setPromptProps}
          /* @conditional-compile-remove(spotlight) */
          hideSpotlightButtons={options?.spotlight?.hideSpotlightButtons}
          videoTilesOptions={options?.videoTilesOptions}
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
              <NetworkReconnectTile {...networkReconnectTileProps} />
            )
          ) : (
            <></>
          )
        }
        updateSidePaneRenderer={props.updateSidePaneRenderer}
        mobileChatTabHeader={props.mobileChatTabHeader}
        onCloseChatPane={onCloseChatPane}
        dataUiId={'call-page'}
        latestErrors={props.latestErrors}
        onDismissError={props.onDismissError}
        onUserSetOverflowGalleryPositionChange={onSetUserSetOverflowGalleryPosition}
        onUserSetGalleryLayoutChange={onUserSetGalleryLayoutChange}
        userSetGalleryLayout={galleryLayout}
        capabilitiesChangedNotificationBarProps={props.capabilitiesChangedNotificationBarProps}
        onSetDialpadPage={() => setDtmfDialerPresent(!dtmfDialerPresent)}
        dtmfDialerPresent={dtmfDialerPresent}
        /* @conditional-compile-remove(spotlight) */
        setIsPromptOpen={setIsPromptOpen}
        /* @conditional-compile-remove(spotlight) */
        setPromptProps={setPromptProps}
        /* @conditional-compile-remove(spotlight) */
        hideSpotlightButtons={options?.spotlight?.hideSpotlightButtons}
      />
      {
        /* @conditional-compile-remove(spotlight) */
        <Prompt isOpen={isPromptOpen} onDismiss={() => setIsPromptOpen(false)} {...promptProps} />
      }
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
