// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DiagnosticQuality } from '@azure/communication-calling';
import { useId } from '@fluentui/react-hooks';
import { _isInCall } from '@internal/calling-component-bindings';
import {
  ActiveErrorMessage,
  ErrorBar,
  OnRenderAvatarCallback,
  ParticipantMenuItemsCallback
} from '@internal/react-components';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(gallery-layouts) */
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
import { mutedNotificationSelector } from '../selectors/mutedNotificationSelector';
import { networkReconnectTileSelector } from '../selectors/networkReconnectTileSelector';
import { reduceCallControlsForMobile } from '../utils';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';
/* @conditional-compile-remove(capabilities) */
import { capabilitiesNotificationSelector } from '../selectors/capabilitiesNotificationSelector';

/**
 * @private
 */
export interface CallPageProps {
  mobileView: boolean;
  modalLayerHostId: string;
  callInvitationURL?: string;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  options?: CallCompositeOptions;
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;
  /* @conditional-compile-remove(gallery-layouts) */
  galleryLayout: VideoGalleryLayout;
}

/**
 * @private
 */
export const CallPage = (props: CallPageProps): JSX.Element => {
  const {
    callInvitationURL,
    onRenderAvatar,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options,
    mobileView,
    /* @conditional-compile-remove(gallery-layouts) */
    galleryLayout = 'floatingLocalVideo'
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
  /* @conditional-compile-remove(capabilities) */
  const capabilitiesNotificationBarProps = useSelector(capabilitiesNotificationSelector);

  const strings = useLocale().strings.call;

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = mobileView ? reduceCallControlsForMobile(options?.callControls) : options?.callControls;

  const drawerMenuHostId = useId('drawerMenuHost');

  /* @conditional-compile-remove(gallery-layouts) */
  const [userSetOverflowGalleryPosition, setUserSetOverflowGalleryPosition] = useState<'Responsive' | 'HorizontalTop'>(
    'Responsive'
  );
  /* @conditional-compile-remove(gallery-layouts) */
  const [userSetGalleryLayout, setUserSetGalleryLayout] = useState<VideoGalleryLayout>(galleryLayout);

  return (
    <CallArrangement
      id={drawerMenuHostId}
      complianceBannerProps={{ ...complianceBannerProps, strings }}
      errorBarProps={options?.errorBar !== false && errorBarProps}
      /* @conditional-compile-remove(capabilities) */
      capabilitiesNotificationBarProps={capabilitiesNotificationBarProps}
      mutedNotificationProps={mutedNotificationProps}
      callControlProps={{
        callInvitationURL: callInvitationURL,
        onFetchParticipantMenuItems: onFetchParticipantMenuItems,
        options: callControlOptions,
        increaseFlyoutItemSize: mobileView
      }}
      /* @conditional-compile-remove(one-to-n-calling) */
      onFetchAvatarPersonaData={onFetchAvatarPersonaData}
      mobileView={mobileView}
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() =>
        _isInCall(callStatus) ? (
          isNetworkHealthy(networkReconnectTileProps.networkReconnectValue) ? (
            <MediaGallery
              isMobile={mobileView}
              {...mediaGalleryProps}
              {...mediaGalleryHandlers}
              onRenderAvatar={onRenderAvatar}
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              /* @conditional-compile-remove(pinned-participants) */
              remoteVideoTileMenuOptions={options?.remoteVideoTileMenu}
              drawerMenuHostId={drawerMenuHostId}
              /* @conditional-compile-remove(click-to-call) */
              localVideoTileOptions={options?.localVideoTile}
              /* @conditional-compile-remove(gallery-layouts) */
              userSetOverflowGalleryPosition={userSetOverflowGalleryPosition}
              /* @conditional-compile-remove(gallery-layouts) */
              userSetGalleryLayout={userSetGalleryLayout}
            />
          ) : (
            <NetworkReconnectTile {...networkReconnectTileProps} />
          )
        ) : (
          <></>
        )
      }
      updateSidePaneRenderer={props.updateSidePaneRenderer}
      mobileChatTabHeader={props.mobileChatTabHeader}
      dataUiId={'call-page'}
      latestErrors={props.latestErrors}
      onDismissError={props.onDismissError}
      /* @conditional-compile-remove(gallery-layouts) */
      onUserSetOverflowGalleryPositionChange={setUserSetOverflowGalleryPosition}
      /* @conditional-compile-remove(gallery-layouts) */
      onUserSetGalleryLayoutChange={setUserSetGalleryLayout}
      /* @conditional-compile-remove(gallery-layouts) */
      userSetGalleryLayout={userSetGalleryLayout}
    />
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
