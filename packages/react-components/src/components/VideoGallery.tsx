// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, ContextualMenu, IDragOptions, IStyle, LayerHost, mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { GridLayoutStyles } from '.';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import {
  BaseCustomStyles,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  CreateVideoStreamViewResult
} from '../types';
import { GridLayout } from './GridLayout';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { _RemoteVideoTile } from './RemoteVideoTile';
import { ResponsiveHorizontalGallery } from './ResponsiveHorizontalGallery';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  layerHostStyle,
  localVideoTileContainerStyle,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle,
  localVideoTileOuterPaddingPX,
  SMALL_FLOATING_MODAL_SIZE_PX,
  LARGE_FLOATING_MODAL_SIZE_PX
} from './styles/VideoGallery.styles';
import { isNarrowWidth, _useContainerHeight, _useContainerWidth } from './utils/responsive';
import { LocalScreenShare } from './VideoGallery/LocalScreenShare';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { useId } from '@fluentui/react-hooks';
import { LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
import { localVideoTileWithControlsContainerStyle, LOCAL_VIDEO_TILE_ZINDEX } from './styles/VideoGallery.styles';
import { _ICoordinates, _ModalClone } from './ModalClone/ModalClone';
import { _formatString } from '@internal/acs-ui-common';
import { _LocalVideoTile } from './LocalVideoTile';

// Currently the Calling JS SDK supports up to 4 remote video streams
const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * All strings that may be shown on the UI in the {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryStrings {
  /** String to notify that local user is sharing their screen */
  screenIsBeingSharedMessage: string;
  /** String to show when remote screen share stream is loading */
  screenShareLoadingMessage: string;
  /** String for local video label. Default is "You" */
  localVideoLabel: string;
  /** String for local video camera switcher */
  localVideoCameraSwitcherLabel: string;
  /** String for announcing the local video tile can be moved by keyboard controls */
  localVideoMovementLabel: string;
  /** String for announcing the selected camera */
  localVideoSelectedDescription: string;
  /** placeholder text for participants who does not have a display name*/
  displayNamePlaceholder: string;
}

/**
 * @public
 */
export type VideoGalleryLayout = 'default' | 'floatingLocalVideo';

/**
 * {@link VideoGallery} Component Styles.
 * @public
 */
export interface VideoGalleryStyles extends BaseCustomStyles {
  /** Styles for the grid layout */
  gridLayout?: GridLayoutStyles;
  /** Styles for the horizontal gallery  */
  horizontalGallery?: HorizontalGalleryStyles;
  /** Styles for the local video  */
  localVideo?: IStyle;
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
  styles?: VideoGalleryStyles;
  /** Layout of the video tiles. */
  layout?: VideoGalleryLayout;
  /** Local video particpant */
  localParticipant: VideoGalleryLocalParticipant;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Local video view options */
  localVideoViewOptions?: VideoStreamOptions;
  /** Remote videos view options */
  remoteVideoViewOptions?: VideoStreamOptions;
  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue `true`
   */
  showMuteIndicator?: boolean;
  /** Optional strings to override in component  */
  strings?: Partial<VideoGalleryStrings>;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams?: number;
  /**
   * Camera control information for button to switch cameras.
   */
  localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * List of pinned participant userIds.
   */
  pinnedParticipants?: string[];
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * This callback will be called when a participant video tile is pinned.
   */
  onPinParticipant?: (userId: string) => void;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * This callback will be called when a participant video tile is un-pinned.
   */
  onUnpinParticipant?: (userId: string) => void;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

// Manually override the max position used to keep the modal in the bounds of its container.
// This is a workaround for: https://github.com/microsoft/fluentui/issues/20122
// Because our modal starts in the bottom right corner, we can say that this is the max (i.e. rightmost and bottomost)
// position the modal can be dragged to.
const modalMaxDragPosition = { x: localVideoTileOuterPaddingPX, y: localVideoTileOuterPaddingPX };

/**
 * VideoGallery represents a layout of video tiles for a specific call.
 * It displays a {@link VideoTile} for the local user as well as for each remote participant who has joined the call.
 *
 * @public
 */
export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const {
    localParticipant,
    remoteParticipants = [],
    localVideoViewOptions,
    remoteVideoViewOptions,
    dominantSpeakers,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onCreateLocalStreamView,
    onDisposeLocalStreamView,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS,
    showCameraSwitcherInLocalPreview,
    localVideoCameraCycleButtonProps
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();
  const localeStrings = useLocale().strings.videoGallery;
  const strings = { ...localeStrings, ...props.strings };

  // We keep track of the pinned participants in the video gallery instead of relying on the stateful client.
  // Another option is to make this array a prop as well and leave it to users to manage the array of pinned user IDs.
  // This provides more flexibility and the ability to pin users across multiple video galleries over the network.
  const [pinnedParticipants, setPinnedParticipants] = React.useState<Set<string>>(new Set());

  const shouldFloatLocalVideo = !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);
  const shouldFloatNonDraggableLocalVideo = !!(showCameraSwitcherInLocalPreview && shouldFloatLocalVideo);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);
  const isNarrow = containerWidth ? isNarrowWidth(containerWidth) : false;
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const visibleCallingParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const modalWidth = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.width : LARGE_FLOATING_MODAL_SIZE_PX.width;
  const modalHeight = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.height : LARGE_FLOATING_MODAL_SIZE_PX.height;
  // The minimum drag position is the top left of the video gallery. i.e. the modal (PiP) should not be able
  // to be dragged offscreen and these are the top and left bounds of that calculation.
  const modalMinDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      containerWidth && containerHeight
        ? {
            // We use -containerWidth/Height because our modal is positioned to start in the bottom right,
            // hence (0,0) is the bottom right of the video gallery.
            x: -containerWidth + modalWidth + localVideoTileOuterPaddingPX,
            y: -containerHeight + modalHeight + localVideoTileOuterPaddingPX
          }
        : undefined,
    [containerHeight, containerWidth, modalHeight, modalWidth]
  );

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  visibleCallingParticipants.current = remoteParticipants?.filter((p) => p.state === ('Connecting' || 'Ringing')) ?? [];

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const visibleCallingParticipantsSet = new Set(visibleCallingParticipants.current.map((p) => p.userId));

  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants:
      remoteParticipants?.filter(
        (p) =>
          !visibleVideoParticipantsSet.has(p.userId) &&
          /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !visibleCallingParticipantsSet.has(
            p.userId
          )
      ) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element => {
    if (onRenderLocalVideoTile) {
      return onRenderLocalVideoTile(localParticipant);
    }

    const localVideoTileStyles = concatStyleSets(
      shouldFloatLocalVideo ? floatingLocalVideoTileStyle : {},
      {
        root: { borderRadius: theme.effects.roundedCorner4 }
      },
      styles?.localVideo
    );

    const initialsName = !localParticipant.displayName ? strings.displayNamePlaceholder : localParticipant.displayName;

    return (
      <Stack key="local-video-tile-key" tabIndex={0} aria-label={strings.localVideoMovementLabel} role={'dialog'}>
        <_LocalVideoTile
          userId={localParticipant.userId}
          onCreateLocalStreamView={onCreateLocalStreamView}
          onDisposeLocalStreamView={onDisposeLocalStreamView}
          isAvailable={localParticipant?.videoStream?.isAvailable}
          isMuted={localParticipant.isMuted}
          renderElement={localParticipant?.videoStream?.renderElement}
          displayName={isNarrow ? '' : strings.localVideoLabel}
          initialsName={initialsName}
          localVideoViewOptions={localVideoViewOptions}
          onRenderAvatar={onRenderAvatar}
          showLabel={!(shouldFloatLocalVideo && isNarrow)}
          showMuteIndicator={showMuteIndicator}
          showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview}
          localVideoCameraCycleButtonProps={localVideoCameraCycleButtonProps}
          localVideoCameraSwitcherLabel={strings.localVideoCameraSwitcherLabel}
          localVideoSelectedDescription={strings.localVideoSelectedDescription}
          styles={localVideoTileStyles}
        />
      </Stack>
    );
  }, [
    isNarrow,
    localParticipant,
    localVideoCameraCycleButtonProps,
    localVideoViewOptions,
    onCreateLocalStreamView,
    onDisposeLocalStreamView,
    onRenderAvatar,
    onRenderLocalVideoTile,
    shouldFloatLocalVideo,
    showCameraSwitcherInLocalPreview,
    showMuteIndicator,
    strings.localVideoCameraSwitcherLabel,
    strings.localVideoLabel,
    strings.localVideoMovementLabel,
    strings.localVideoSelectedDescription,
    strings.displayNamePlaceholder,
    styles?.localVideo,
    theme.effects.roundedCorner4
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => {
      const remoteVideoStream = participant.videoStream;
      return (
        <_RemoteVideoTile
          key={participant.userId}
          {...participant}
          onCreateRemoteStreamView={isVideoParticipant ? onCreateRemoteStreamView : undefined}
          onDisposeRemoteStreamView={isVideoParticipant ? onDisposeRemoteStreamView : undefined}
          isAvailable={isVideoParticipant ? remoteVideoStream?.isAvailable : false}
          isReceiving={isVideoParticipant ? remoteVideoStream?.isReceiving : false}
          renderElement={isVideoParticipant ? remoteVideoStream?.renderElement : undefined}
          remoteVideoViewOptions={isVideoParticipant ? remoteVideoViewOptions : undefined}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={participant.state}
          isPinned={pinnedParticipants.has(participant.userId)}
          onPinParticipant={() => {
            setPinnedParticipants((prev) => new Set([...prev, participant.userId]));
            props.onPinParticipant?.(participant.userId);
          }}
          onUnpinParticipant={() => {
            setPinnedParticipants((prev) => new Set(Array.from(prev).filter((id) => id !== participant.userId)));
            props.onUnpinParticipant?.(participant.userId);
          }}
        />
      );
    },
    [onCreateRemoteStreamView, onDisposeRemoteStreamView, remoteVideoViewOptions, onRenderAvatar, showMuteIndicator]
  );

  const videoTiles = onRenderRemoteVideoTile
    ? visibleVideoParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleVideoParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, true);
      });

  const audioTiles = onRenderRemoteVideoTile
    ? visibleAudioParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleAudioParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, false);
      });

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingTiles = onRenderRemoteVideoTile
    ? visibleCallingParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleCallingParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, false);
      });
  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);
  const screenShareActive = screenShareParticipant || localParticipant?.isScreenSharingOn;

  const createGridTiles = (): JSX.Element[] => {
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return videoTiles.length > 0 ? videoTiles : audioTiles.concat(callingTiles);
    return videoTiles.length > 0 ? videoTiles : audioTiles;
  };
  const gridTiles = createGridTiles();

  const createHorizontalGalleryTiles = (): JSX.Element[] => {
    if (screenShareActive) {
      // If screen sharing is active, assign video and audio participants as horizontal gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return videoTiles.concat(audioTiles.concat(callingTiles));
      return videoTiles.concat(audioTiles);
    } else {
      // If screen sharing is not active, then assign all video tiles as grid tiles.
      // If there are no video tiles, then assign audio tiles as grid tiles.
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return videoTiles.length > 0 ? audioTiles.concat(callingTiles) : [];
      return videoTiles.length > 0 ? audioTiles : [];
    }
  };
  const horizontalGalleryTiles = createHorizontalGalleryTiles();

  if (!shouldFloatLocalVideo && localParticipant) {
    gridTiles.push(localVideoTile);
  }

  const localScreenShareStreamComponent = <LocalScreenShare localParticipant={localParticipant} />;

  const remoteScreenShareComponent = screenShareParticipant && (
    <RemoteScreenShare
      {...screenShareParticipant}
      renderElement={screenShareParticipant.screenShareStream?.renderElement}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
      onDisposeRemoteStreamView={onDisposeRemoteStreamView}
      isReceiving={screenShareParticipant.screenShareStream?.isReceiving}
    />
  );

  const horizontalGalleryPresent = horizontalGalleryTiles && horizontalGalleryTiles.length > 0;
  const layerHostId = useId('layerhost');

  return (
    <div
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={mergeStyles(videoGalleryOuterDivStyle, styles?.root)}
    >
      {shouldFloatLocalVideo &&
        !shouldFloatNonDraggableLocalVideo &&
        localParticipant &&
        (horizontalGalleryPresent ? (
          <Stack className={mergeStyles(localVideoTileContainerStyle(theme, isNarrow))}>{localVideoTile}</Stack>
        ) : (
          <_ModalClone
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={floatingLocalVideoModalStyle(theme, isNarrow)}
            layerProps={{ hostId: layerHostId }}
            maxDragPosition={modalMaxDragPosition}
            minDragPosition={modalMinDragPosition}
          >
            {localVideoTile}
          </_ModalClone>
        ))}
      {
        // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
        shouldFloatNonDraggableLocalVideo && localParticipant && remoteParticipants.length > 0 && (
          <Stack
            className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, isNarrow), {
              boxShadow: theme.effects.elevation8,
              zIndex: LOCAL_VIDEO_TILE_ZINDEX
            })}
          >
            {localVideoTile}
          </Stack>
        )
      }
      <Stack horizontal={false} styles={videoGalleryContainerStyle}>
        {screenShareParticipant ? (
          remoteScreenShareComponent
        ) : localParticipant?.isScreenSharingOn ? (
          localScreenShareStreamComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {horizontalGalleryPresent && (
          <div style={{ paddingTop: '0.5rem' }}>
            <ResponsiveHorizontalGallery
              key="responsive-horizontal-gallery"
              containerStyles={horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow)}
              horizontalGalleryStyles={concatStyleSets(horizontalGalleryStyle(isNarrow), styles?.horizontalGallery)}
              childWidthRem={
                isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
              }
              buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
              gapWidthRem={HORIZONTAL_GALLERY_GAP}
            >
              {horizontalGalleryTiles}
            </ResponsiveHorizontalGallery>
          </div>
        )}

        <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      </Stack>
    </div>
  );
};
