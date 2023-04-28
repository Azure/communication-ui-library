// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(vertical-gallery) */
import { useRef } from 'react';
import {
  VideoGallery,
  VideoStreamOptions,
  OnRenderAvatarCallback,
  CustomAvatarOptions,
  Announcer
} from '@internal/react-components';
/* @conditional-compile-remove(vertical-gallery) */
import { _useContainerWidth, _useContainerHeight } from '@internal/react-components';
/* @conditional-compile-remove(pinned-participants) */
import { VideoTileContextualMenuProps, VideoTileDrawerMenuProps } from '@internal/react-components';
import { usePropsFor } from '../hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { useHandlers } from '../hooks/useHandlers';
import { useSelector } from '../hooks/useSelector';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { LocalVideoCameraCycleButton } from '@internal/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useParticipantChangedAnnouncement } from '../utils/MediaGalleryUtils';
/* @conditional-compile-remove(pinned-participants) */
import { RemoteVideoTileMenuOptions } from '../CallComposite';

const VideoGalleryStyles = {
  root: {
    height: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

const localVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const remoteVideoViewOptions = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

/**
 * @private
 */
export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  isMobile?: boolean;
  drawerMenuHostId?: string;
  /* @conditional-compile-remove(pinned-participants) */
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const announcerString = useParticipantChangedAnnouncement();

  /* @conditional-compile-remove(vertical-gallery) */
  const containerRef = useRef<HTMLDivElement>(null);
  /* @conditional-compile-remove(vertical-gallery) */
  const containerWidth = _useContainerWidth(containerRef);
  /* @conditional-compile-remove(vertical-gallery) */
  const containerHeight = _useContainerHeight(containerRef);

  const cameraSwitcherProps = useMemo(() => {
    return {
      ...cameraSwitcherCallback,
      ...cameraSwitcherCameras
    };
  }, [cameraSwitcherCallback, cameraSwitcherCameras]);

  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return (
        <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
          <Stack styles={{ root: { margin: 'auto', maxHeight: '100%' } }}>
            <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
          </Stack>
        </Stack>
      );
    },
    [props.onFetchAvatarPersonaData]
  );

  useLocalVideoStartTrigger(!!props.isVideoStreamOn);

  /* @conditional-compile-remove(pinned-participants) */
  const remoteVideoTileMenuOptions: false | VideoTileContextualMenuProps | VideoTileDrawerMenuProps = useMemo(() => {
    return props.remoteVideoTileMenuOptions?.isHidden
      ? false
      : props.isMobile
      ? { kind: 'drawer', hostId: props.drawerMenuHostId }
      : { kind: 'contextual' };
  }, [props.remoteVideoTileMenuOptions?.isHidden, props.isMobile, props.drawerMenuHostId]);

  /* @conditional-compile-remove(vertical-gallery) */
  const overflowGalleryPosition = useMemo(
    () =>
      containerWidth && containerHeight && containerWidth / containerHeight >= 16 / 9
        ? 'VerticalRight'
        : 'HorizontalBottom',
    [containerWidth, containerHeight]
  );

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOptions={localVideoViewOptions}
        remoteVideoViewOptions={remoteVideoViewOptions}
        styles={VideoGalleryStyles}
        layout="floatingLocalVideo"
        showCameraSwitcherInLocalPreview={props.isMobile}
        localVideoCameraCycleButtonProps={cameraSwitcherProps}
        onRenderAvatar={onRenderAvatar}
        /* @conditional-compile-remove(pinned-participants) */
        remoteVideoTileMenuOptions={remoteVideoTileMenuOptions}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryPosition={overflowGalleryPosition}
        localVideoTileMode={'hidden'}
      />
    );
  }, [
    videoGalleryProps,
    props.isMobile,
    onRenderAvatar,
    cameraSwitcherProps,
    /* @conditional-compile-remove(pinned-participants) */ remoteVideoTileMenuOptions,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition
  ]);

  return (
    <div /* @conditional-compile-remove(vertical-gallery) */ ref={containerRef} style={mediaGalleryContainerStyles}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      {VideoGalleryMemoized}
    </div>
  );
};

/**
 * @private
 *
 * `shouldTransition` is an extra predicate that controls whether this hooks actually transitions the call.
 * The rule of hooks disallows calling the hook conditionally, so this predicate can be used to make the decision.
 */
export const useLocalVideoStartTrigger = (isLocalVideoAvailable: boolean, shouldTransition?: boolean): void => {
  // Once a call is joined, we need to transition the local preview camera setting into the call.
  // This logic is needed on any screen that we might join a call from:
  // - The Media gallery
  // - The lobby page
  // - The networkReconnect interstitial that may show at the start of a call.
  //
  // @TODO: Can we simply have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  useEffect(() => {
    if (shouldTransition !== false) {
      if (isPreviewCameraOn && !isLocalVideoAvailable && !isButtonStatusSynced) {
        mediaGalleryHandlers.onStartLocalVideo();
      }
      setIsButtonStatusSynced(true);
    }
  }, [shouldTransition, isButtonStatusSynced, isPreviewCameraOn, isLocalVideoAvailable, mediaGalleryHandlers]);
};

const mediaGalleryContainerStyles: CSSProperties = { width: '100%', height: '100%' };
