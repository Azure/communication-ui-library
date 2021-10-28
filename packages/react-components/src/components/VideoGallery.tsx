// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenu,
  IDragOptions,
  Modal,
  Stack,
  concatStyleSets,
  Icon,
  Text,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import React, { CSSProperties, useCallback, useMemo, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import {
  BaseCustomStylesProps,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  gridStyle,
  videoGalleryContainerStyle,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_STYLE,
  LARGE_HORIZONTAL_GALLERY_TILE_STYLE,
  horizontalGalleryStyle,
  videoGalleryOuterDivStyle,
  videoWithNoRoundedBorderStyle,
  loadingStyle,
  videoStreamStyle,
  screenSharingContainer,
  screenSharingNotificationContainer,
  screenSharingNotificationIconContainer,
  screenSharingNotificationIconStyle,
  screenSharingNotificationTextStyle
} from './styles/VideoGallery.styles';
import { VideoTile } from './VideoTile';
import { RemoteVideoTile } from './RemoteVideoTile';
import { useContainerWidth, isNarrowWidth } from './utils/responsive';
import { ResponsiveHorizontalGallery } from './ResponsiveHorizontalGallery';
import { useLocale } from '../localization';

const emptyStyles = {};
const FLOATING_TILE_HOST_ID = 'UILibraryFloatingTileHost';

// Currently the Calling JS SDK supports up to 4 remote video streams
const MAX_VIDEO_PARTICIPANTS_TILES = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * All strings that may be shown on the UI in the {@link VideoGallery}.
 *
 * @public
 */
export interface ScreenShareStrings {
  screenSharingMessage: string;
}

/**
 * Props for {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <VideoGallery styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
  /** Layout of the video tiles. */
  layout?: 'default' | 'floatingLocalVideo';
  /** Local video particpant */
  localParticipant: VideoGalleryLocalParticipant;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Local video view options */
  localVideoViewOption?: VideoStreamOptions;
  /** Remote videos view options */
  remoteVideoViewOption?: VideoStreamOptions;
  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;

  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue `true`
   */
  showMuteIndicator?: boolean;
  screenShareParticipant?: VideoGalleryRemoteParticipant;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * VideoGallery represents a {@link GridLayout} of video tiles for a specific call.
 * It displays a {@link VideoTile} for the local user as well as for each remote participants who joined the call.
 *
 * @public
 */
export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const {
    localParticipant,
    remoteParticipants = [],
    localVideoViewOption,
    remoteVideoViewOption,
    dominantSpeakers,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onCreateLocalStreamView,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    screenShareParticipant
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();
  const locale = useLocale();

  const shouldFloatLocalVideo = !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isNarrow = isNarrowWidth(containerWidth);
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: MAX_VIDEO_PARTICIPANTS_TILES
  }).slice(0, MAX_VIDEO_PARTICIPANTS_TILES);

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));
  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => !visibleVideoParticipantsSet.has(p.userId)) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  const isScreenShareAvailable =
    screenShareParticipant &&
    screenShareParticipant.screenShareStream &&
    screenShareParticipant.screenShareStream.isAvailable;

  // If there are no video participants, we assign all audio participants as grid participants and assign
  // an empty array as horizontal gallery partipants to avoid rendering the horizontal gallery.
  const gridParticipants =
    isScreenShareAvailable || localParticipant?.isScreenSharingOn
      ? []
      : visibleVideoParticipants.current.length > 0
      ? visibleVideoParticipants.current
      : visibleAudioParticipants.current;
  const horizontalGalleryParticipants =
    isScreenShareAvailable || localParticipant?.isScreenSharingOn
      ? visibleVideoParticipants.current.concat(visibleAudioParticipants.current)
      : visibleVideoParticipants.current.length > 0
      ? visibleAudioParticipants.current
      : [];

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    const localVideoTileStyles = shouldFloatLocalVideo ? floatingLocalVideoTileStyle : {};

    const localVideoTileStylesThemed = concatStyleSets(localVideoTileStyles, {
      root: { borderRadius: theme.effects.roundedCorner4 }
    });

    if (localVideoStream && !localVideoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }

    return (
      <VideoTile
        userId={localParticipant.userId}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream.renderElement} />
          ) : undefined
        }
        displayName={localParticipant?.displayName}
        styles={localVideoTileStylesThemed}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={localParticipant.isMuted}
        showMuteIndicator={showMuteIndicator}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localParticipant,
    localParticipant.isScreenSharingOn,
    localParticipant.videoStream,
    localParticipant.videoStream?.renderElement,
    onCreateLocalStreamView,
    onRenderLocalVideoTile,
    onRenderAvatar,
    shouldFloatLocalVideo
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, style?: CSSProperties) => {
      const remoteVideoStream = participant.videoStream;
      return (
        <RemoteVideoTile
          key={participant.userId}
          userId={participant.userId}
          onCreateRemoteStreamView={onCreateRemoteStreamView}
          onDisposeRemoteStreamView={onDisposeRemoteStreamView}
          isAvailable={remoteVideoStream?.isAvailable}
          renderElement={remoteVideoStream?.renderElement}
          remoteVideoViewOption={remoteVideoViewOption}
          isMuted={participant.isMuted}
          isSpeaking={participant.isSpeaking}
          displayName={participant.displayName}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
          style={style}
        />
      );
    },
    [onCreateRemoteStreamView, onDisposeRemoteStreamView, remoteVideoViewOption, onRenderAvatar, showMuteIndicator]
  );

  const gridTiles = onRenderRemoteVideoTile
    ? gridParticipants.map((participant) => onRenderRemoteVideoTile(participant))
    : gridParticipants.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant);
      });

  if (!shouldFloatLocalVideo && localParticipant) {
    gridTiles.push(
      <Stack data-ui-id={ids.videoGallery} horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && localVideoTile}
      </Stack>
    );
  }

  const horizontalGalleryTiles = onRenderRemoteVideoTile
    ? horizontalGalleryParticipants.map((participant) => onRenderRemoteVideoTile(participant))
    : horizontalGalleryParticipants.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(
          participant,
          isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_STYLE : LARGE_HORIZONTAL_GALLERY_TILE_STYLE
        );
      });

  const localScreenSharingNotification = useMemo((): JSX.Element | undefined => {
    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return undefined;
    }

    return (
      <Stack horizontalAlign={'center'} verticalAlign={'center'} className={screenSharingContainer}>
        <Stack
          horizontalAlign={'center'}
          verticalAlign={'center'}
          className={screenSharingNotificationContainer(theme)}
          tokens={{ childrenGap: '1rem' }}
        >
          <Stack horizontal verticalAlign={'center'} className={screenSharingNotificationIconContainer}>
            <Icon iconName="ControlButtonScreenShareStart" className={screenSharingNotificationIconStyle(theme)} />
          </Stack>
          <Text className={screenSharingNotificationTextStyle} aria-live={'polite'}>
            {locale.strings.screenShare.screenSharingMessage}
          </Text>
        </Stack>
      </Stack>
    );
  }, [localParticipant, theme, locale.strings.screenShare.screenSharingMessage]);

  const localScreenShareStreamComponent = useMemo(() => {
    return (
      <VideoTile
        displayName={localParticipant?.displayName}
        isMuted={localParticipant?.isMuted}
        onRenderPlaceholder={() => <></>}
      >
        {localScreenSharingNotification}
      </VideoTile>
    );
  }, [localParticipant?.displayName, localParticipant?.isMuted, localScreenSharingNotification]);

  const screenShareStreamComponent = useMemo(() => {
    if (!isScreenShareAvailable) {
      return;
    }
    const screenShareStream = screenShareParticipant?.screenShareStream;
    const videoStream = screenShareParticipant?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    const videoStyles = screenShareParticipant?.isSpeaking ? videoWithNoRoundedBorderStyle : {};

    return (
      <VideoTile
        displayName={screenShareParticipant?.displayName}
        isMuted={screenShareParticipant?.isMuted}
        isSpeaking={screenShareParticipant?.isSpeaking}
        renderElement={
          screenShareStream?.renderElement ? (
            <StreamMedia styles={videoStyles} videoStreamElement={screenShareStream?.renderElement} />
          ) : undefined
        }
        onRenderPlaceholder={onRenderPlaceholder}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      />
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, screenShareParticipant]);

  return (
    <div id={FLOATING_TILE_HOST_ID} ref={containerRef} className={videoGalleryOuterDivStyle}>
      {shouldFloatLocalVideo && (
        <Modal
          isOpen={true}
          isModeless={true}
          dragOptions={DRAG_OPTIONS}
          styles={floatingLocalVideoModalStyle(theme, isNarrow)}
          layerProps={{ hostId: FLOATING_TILE_HOST_ID }}
        >
          {localParticipant && localVideoTile}
        </Modal>
      )}
      <Stack styles={videoGalleryContainerStyle}>
        {isScreenShareAvailable ? (
          screenShareStreamComponent
        ) : localParticipant?.isScreenSharingOn ? (
          localScreenShareStreamComponent
        ) : (
          <GridLayout styles={styles ?? emptyStyles}>{gridTiles}</GridLayout>
        )}
        {horizontalGalleryParticipants && horizontalGalleryParticipants.length > 0 && (
          <ResponsiveHorizontalGallery
            containerStyles={horizontalGalleryStyle(shouldFloatLocalVideo, isNarrow)}
            childWidthRem={
              isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
            }
            buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
            gapWidthRem={HORIZONTAL_GALLERY_GAP}
          >
            {horizontalGalleryTiles}
          </ResponsiveHorizontalGallery>
        )}
      </Stack>
    </div>
  );
};

// A non-undefined display name is needed for this render, and that is coming from VideoTile props below
const onRenderPlaceholder: OnRenderAvatarCallback = (userId, options): JSX.Element => (
  <div className={loadingStyle}>
    <Spinner label={`Loading ${options?.text}'s screen`} size={SpinnerSize.xSmall} />
  </div>
);
