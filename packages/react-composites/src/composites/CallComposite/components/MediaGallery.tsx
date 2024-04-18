// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { CSSProperties, useCallback, useMemo } from 'react';
import { useRef } from 'react';
import {
  VideoGallery,
  VideoStreamOptions,
  CustomAvatarOptions,
  Announcer,
  VideoTileContextualMenuProps,
  VideoTileDrawerMenuProps
} from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
import { _useContainerWidth, _useContainerHeight } from '@internal/react-components';
import { usePropsFor } from '../hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';
import { useHandlers } from '../hooks/useHandlers';
import { useSelector } from '../hooks/useSelector';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { LocalVideoCameraCycleButton } from '@internal/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useParticipantChangedAnnouncement } from '../utils/MediaGalleryUtils';
import { RemoteVideoTileMenuOptions } from '../CallComposite';
import { LocalVideoTileOptions } from '../CallComposite';
import { useAdapter } from '../adapter/CallAdapterProvider';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from './Prompt';
/* @conditional-compile-remove(spotlight) */
import { useLocalSpotlightCallbacksWithPrompt, useRemoteSpotlightCallbacksWithPrompt } from '../utils/spotlightUtils';

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
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  localVideoTileOptions?: boolean | LocalVideoTileOptions;
  userSetOverflowGalleryPosition?: 'Responsive' | 'horizontalTop';
  userSetGalleryLayout: VideoGalleryLayout;
  pinnedParticipants?: string[];
  setPinnedParticipants?: (pinnedParticipants: string[]) => void;
  /* @conditional-compile-remove(spotlight) */
  setIsPromptOpen: (isOpen: boolean) => void;
  /* @conditional-compile-remove(spotlight) */
  setPromptProps: (props: PromptProps) => void;
  /* @conditional-compile-remove(spotlight) */
  hideSpotlightButtons?: boolean;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const {
    pinnedParticipants = [],
    setPinnedParticipants,
    /* @conditional-compile-remove(spotlight) */ setIsPromptOpen,
    /* @conditional-compile-remove(spotlight) */ setPromptProps,
    /* @conditional-compile-remove(spotlight) */ hideSpotlightButtons
  } = props;

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const announcerString = useParticipantChangedAnnouncement();

  const adapter = useAdapter();
  const userRole = adapter.getState().call?.role;
  const isRoomsCall = adapter.getState().isRoomsCall;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);
  const containerAspectRatio = containerWidth && containerHeight ? containerWidth / containerHeight : 0;
  const reactionResources = adapter.getState().reactions;

  const layoutBasedOnTilePosition: VideoGalleryLayout = getVideoGalleryLayoutBasedOnLocalOptions(
    (props.localVideoTileOptions as LocalVideoTileOptions)?.position
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

  const remoteVideoTileMenuOptions: false | VideoTileContextualMenuProps | VideoTileDrawerMenuProps = useMemo(() => {
    return props.remoteVideoTileMenuOptions?.isHidden
      ? false
      : props.isMobile
      ? { kind: 'drawer', hostId: props.drawerMenuHostId }
      : { kind: 'contextual' };
  }, [props.remoteVideoTileMenuOptions?.isHidden, props.isMobile, props.drawerMenuHostId]);

  const overflowGalleryPosition = useMemo(() => {
    /* @conditional-compile-remove(overflow-top-composite) */
    if (props.userSetOverflowGalleryPosition === 'horizontalTop') {
      return props.userSetOverflowGalleryPosition;
    }
    return containerWidth && containerHeight && containerWidth / containerHeight >= 16 / 9
      ? 'verticalRight'
      : 'horizontalBottom';
  }, [
    /* @conditional-compile-remove(overflow-top-composite) */ props.userSetOverflowGalleryPosition,
    containerWidth,
    containerHeight
  ]);

  /* @conditional-compile-remove(spotlight) */
  const { onStartLocalSpotlight, onStopLocalSpotlight, onStartRemoteSpotlight, onStopRemoteSpotlight } =
    videoGalleryProps;

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

  const onPinParticipant = useMemo(() => {
    return setPinnedParticipants
      ? (userId: string) => {
          if (!pinnedParticipants.includes(userId)) {
            setPinnedParticipants(pinnedParticipants.concat(userId));
          }
        }
      : undefined;
  }, [setPinnedParticipants, pinnedParticipants]);

  const onUnpinParticipant = useMemo(() => {
    return setPinnedParticipants
      ? (userId: string) => {
          setPinnedParticipants(pinnedParticipants.filter((participantId) => participantId !== userId));
        }
      : undefined;
  }, [setPinnedParticipants, pinnedParticipants]);

  const VideoGalleryMemoized = useMemo(() => {
    const layoutBasedOnUserSelection = (): VideoGalleryLayout => {
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
        remoteVideoTileMenu={remoteVideoTileMenuOptions}
        overflowGalleryPosition={overflowGalleryPosition}
        localVideoTileSize={
          props.localVideoTileOptions === false || userRole === 'Consumer' || (isRoomsCall && userRole === 'Unknown')
            ? 'hidden'
            : props.isMobile && containerAspectRatio < 1
            ? '9:16'
            : '16:9'
        }
        pinnedParticipants={pinnedParticipants}
        onPinParticipant={onPinParticipant}
        onUnpinParticipant={onUnpinParticipant}
        reactionResources={reactionResources}
        /* @conditional-compile-remove(spotlight) */
        onStartLocalSpotlight={hideSpotlightButtons ? undefined : onStartLocalSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStopLocalSpotlight={hideSpotlightButtons ? undefined : onStopLocalSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStartRemoteSpotlight={hideSpotlightButtons ? undefined : onStartRemoteSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStopRemoteSpotlight={hideSpotlightButtons ? undefined : onStopRemoteSpotlightWithPrompt}
      />
    );
  }, [
    videoGalleryProps,
    props.isMobile,
    props.localVideoTileOptions,
    cameraSwitcherProps,
    onRenderAvatar,
    remoteVideoTileMenuOptions,
    overflowGalleryPosition,
    userRole,
    isRoomsCall,
    containerAspectRatio,

    props.userSetGalleryLayout,
    pinnedParticipants,
    onPinParticipant,
    onUnpinParticipant,
    layoutBasedOnTilePosition,
    reactionResources,
    /* @conditional-compile-remove(spotlight) */
    onStartLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStopLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStartRemoteSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStopRemoteSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    hideSpotlightButtons
  ]);

  return (
    <div ref={containerRef} style={mediaGalleryContainerStyles}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      {VideoGalleryMemoized}
    </div>
  );
};

const mediaGalleryContainerStyles: CSSProperties = { width: '100%', height: '100%' };

const getVideoGalleryLayoutBasedOnLocalOptions = (localTileOptions?: string): VideoGalleryLayout => {
  return localTileOptions === 'grid' ? 'default' : 'floatingLocalVideo';
};
