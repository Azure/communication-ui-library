// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  OverlayModeTypes,
  Reaction,
  ReactionResources,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '../types';
/* @conditional-compile-remove(together-mode) */
import { VideoGalleryTogetherModeParticipantPosition } from '../types';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { ParticipantVideoTileOverlay } from './VideoGallery/ParticipantVideoTileOverlay';
import { RemoteContentShareReactionOverlay } from './VideoGallery/RemoteContentShareReactionOverlay';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeOverlay } from './TogetherModeOverlay';

/**
 * Reaction overlay component props
 *
 * Can be used with {@link VideoTile}.
 *
 * @internal
 */
export interface MeetingReactionOverlayProps {
  /**
   * Reaction rendering overlay type. i.e. single reaction rendering on grid-tile, screen share mode overlay
   */
  overlayMode: OverlayModeTypes;
  /**
   * Received reaction when overlay mode is grid-tile
   */
  reaction?: Reaction;
  /**
   * Reactions resources' url and metadata.
   */
  reactionResources: ReactionResources;
  /**
   * Local participant's reaction event that comes from participant object.
   */
  localParticipant?: VideoGalleryLocalParticipant;
  /**
   * Remote participant's reaction event.
   */
  remoteParticipants?: VideoGalleryRemoteParticipant[];

  /* @conditional-compile-remove(together-mode) */
  togetherModeSeatPositions?: VideoGalleryTogetherModeParticipantPosition;
}

/**
 * Emoji max size
 * @internal
 */
const DEFAULT_EMOJI_MAX_SIZE_PX = 70;

/**
 * Emoji min size
 * @internal
 */
const DEFAULT_EMOJI_MIN_SIZE_PX = 32;

/**
 * Emoji resize scale constant
 * @internal
 */
const REACTION_EMOJI_RESIZE_SCALE_CONSTANT = 3;

/**
 * Reaction overlay component
 *
 * Can be used with {@link VideoTile}.
 *
 * @internal
 */
export const MeetingReactionOverlay = (props: MeetingReactionOverlayProps): JSX.Element => {
  const {
    overlayMode,
    reaction,
    reactionResources,
    localParticipant,
    remoteParticipants,
    /* @conditional-compile-remove(together-mode) */ togetherModeSeatPositions
  } = props;
  const [emojiSizePx, setEmojiSizePx] = useState(0);
  const [divHeight, setDivHeight] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const videoTileRef = useRef<HTMLDivElement>(null);

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const domRect = entries.at(0)?.contentRect;
      const width = domRect !== undefined ? domRect.width : 0;
      const height = domRect !== undefined ? domRect.height : 0;
      const reactionEmojiCalcSize = Math.min(width, height) / REACTION_EMOJI_RESIZE_SCALE_CONSTANT;
      // we only want to set the persona size if it has changed
      if (reactionEmojiCalcSize !== emojiSizePx) {
        setEmojiSizePx(Math.max(Math.min(reactionEmojiCalcSize, DEFAULT_EMOJI_MAX_SIZE_PX), DEFAULT_EMOJI_MIN_SIZE_PX));
      }

      if (height !== divHeight) {
        setDivHeight(height);
      }

      if (width !== divWidth) {
        setDivWidth(width);
      }
    })
  );

  useLayoutEffect(() => {
    if (videoTileRef.current) {
      observer.current.observe(videoTileRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [videoTileRef]);

  if (overlayMode === 'grid-tiles') {
    return (
      <div ref={videoTileRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <ParticipantVideoTileOverlay
          emojiSize={emojiSizePx}
          reaction={reaction}
          reactionResources={reactionResources}
        />
      </div>
    );
  } else if (props.overlayMode === 'screen-share' || props.overlayMode === 'content-share') {
    return (
      <div ref={videoTileRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <RemoteContentShareReactionOverlay
          hostDivHeight={divHeight}
          hostDivWidth={divWidth}
          reactionResources={reactionResources}
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
        />
      </div>
    );
  } else if (props.overlayMode === 'together-mode') {
    /* @conditional-compile-remove(together-mode) */
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0'
        }}
      >
        <TogetherModeOverlay
          emojiSize={emojiSizePx}
          reactionResources={reactionResources}
          localParticipant={localParticipant ?? ({} as VideoGalleryLocalParticipant)}
          remoteParticipants={remoteParticipants ?? ([] as VideoGalleryRemoteParticipant[])}
          togetherModeSeatPositions={togetherModeSeatPositions ?? {}}
        />
      </div>
    );
    return <></>;
  } else {
    return <></>;
  }
};
