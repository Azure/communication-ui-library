// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
import { useRef } from 'react';
import { VideoGallery, VideoStreamOptions, CustomAvatarOptions, Announcer } from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
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
/* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
import { LocalVideoTileOptions } from '../CallComposite';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../adapter/CallAdapterProvider';

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
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  isMobile?: boolean;
  drawerMenuHostId?: string;
  /* @conditional-compile-remove(pinned-participants) */
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  /* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
  localVideoTileOptions?: boolean | LocalVideoTileOptions;
  /* @conditional-compile-remove(gallery-layouts) */
  userSetOverflowGalleryPosition?: 'Responsive' | 'horizontalTop';
  /* @conditional-compile-remove(gallery-layouts) */
  userSetGalleryLayout: VideoGalleryLayout;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const announcerString = useParticipantChangedAnnouncement();

  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const userRole = adapter.getState().call?.role;
  /* @conditional-compile-remove(rooms) */
  const isRoomsCall = adapter.getState().isRoomsCall;

  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerRef = useRef<HTMLDivElement>(null);
  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerWidth = _useContainerWidth(containerRef);
  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerHeight = _useContainerHeight(containerRef);
  /* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
  const containerAspectRatio = containerWidth && containerHeight ? containerWidth / containerHeight : 0;

  const layoutBasedOnTilePosition: VideoGalleryLayout = localVideoTileLayoutTrampoline(
    /* @conditional-compile-remove(click-to-call) */ (props.localVideoTileOptions as LocalVideoTileOptions)?.position
  );

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
            {options?.coinSize && (
              <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
            )}
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
  const overflowGalleryPosition = useMemo(() => {
    /* @conditional-compile-remove(gallery-layouts) */
    if (props.userSetOverflowGalleryPosition === 'horizontalTop') {
      return props.userSetOverflowGalleryPosition;
    }
    return containerWidth && containerHeight && containerWidth / containerHeight >= 16 / 9
      ? 'verticalRight'
      : 'horizontalBottom';
  }, [
    /* @conditional-compile-remove(gallery-layouts) */ props.userSetOverflowGalleryPosition,
    containerWidth,
    containerHeight
  ]);

  const VideoGalleryMemoized = useMemo(() => {
    const layoutBasedOnUserSelection = (): VideoGalleryLayout => {
      /* @conditional-compile-remove(gallery-layouts) */
      return props.localVideoTileOptions ? layoutBasedOnTilePosition : props.userSetGalleryLayout;
      return layoutBasedOnTilePosition;
    };

    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOptions={localVideoViewOptions}
        remoteVideoViewOptions={remoteVideoViewOptions}
        styles={VideoGalleryStyles}
        layout={layoutBasedOnUserSelection()}
        showCameraSwitcherInLocalPreview={props.isMobile}
        localVideoCameraCycleButtonProps={cameraSwitcherProps}
        onRenderAvatar={onRenderAvatar}
        /* @conditional-compile-remove(pinned-participants) */
        remoteVideoTileMenu={remoteVideoTileMenuOptions}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryPosition={overflowGalleryPosition}
        /* @conditional-compile-remove(rooms) */
        localVideoTileSize={
          props.localVideoTileOptions === false || userRole === 'Consumer' || (isRoomsCall && userRole === 'Unknown')
            ? 'hidden'
            : props.isMobile && containerAspectRatio < 1
            ? '9:16'
            : '16:9'
        }
      />
    );
  }, [
    videoGalleryProps,
    props.isMobile,
    /* @conditional-compile-remove(rooms) */
    props.localVideoTileOptions,
    cameraSwitcherProps,
    onRenderAvatar,
    /* @conditional-compile-remove(pinned-participants) */
    remoteVideoTileMenuOptions,
    /* @conditional-compile-remove(vertical-gallery) */
    overflowGalleryPosition,
    /* @conditional-compile-remove(rooms) */
    userRole,
    /* @conditional-compile-remove(rooms) */
    isRoomsCall,
    /* @conditional-compile-remove(vertical-gallery) */
    containerAspectRatio,
    /* @conditional-compile-remove(gallery-layouts) */
    props.userSetGalleryLayout,
    layoutBasedOnTilePosition
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

const localVideoTileLayoutTrampoline = (
  /* @conditional-compile-remove(click-to-call) */ localTileOptions?: string
): VideoGalleryLayout => {
  /* @conditional-compile-remove(click-to-call) */
  return localTileOptions === 'grid' ? 'default' : 'floatingLocalVideo';
  return 'floatingLocalVideo';
};
