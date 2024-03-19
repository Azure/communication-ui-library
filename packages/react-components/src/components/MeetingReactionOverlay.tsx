// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import {
  OverlayModeTypes,
  Reaction,
  ReactionResources,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '../types';
/* @conditional-compile-remove(reaction) */
import React, { useLayoutEffect, useRef, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { ParticipantVideoTileOverlay } from './VideoGallery/ParticipantVideoTileOverlay';
/* @conditional-compile-remove(reaction) */
import { RemoteContentShareReactionOverlay } from './VideoGallery/RemoteContentShareReactionOverlay';

/* @conditional-compile-remove(reaction) */
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
}

// Emoji max size
const DEFAULT_EMOJI_MAX_SIZE_PX = 100;
// Emoji min size
const DEFAULT_EMOJI_MIN_SIZE_PX = 32;

/* @conditional-compile-remove(reaction) */
export const MeetingReactionOverlay = (props: MeetingReactionOverlayProps): JSX.Element => {
  const { overlayMode, reaction, reactionResources, localParticipant, remoteParticipants } = props;
  const [emojiSize, setEmojiSize] = useState(1);
  const [divHeight, setDivHeight] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const videoTileRef = useRef<HTMLDivElement>(null);

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      const personaCalcSize = Math.min(width, height) / 3;
      // we only want to set the persona size if it has changed
      if (personaCalcSize !== emojiSize) {
        setEmojiSize(Math.max(Math.min(personaCalcSize, DEFAULT_EMOJI_MAX_SIZE_PX), DEFAULT_EMOJI_MIN_SIZE_PX));
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

  // Check for image resource validity and if not throw warning or error here.

  if (overlayMode === 'grid-tiles') {
    return (
      <div ref={videoTileRef} style={{ width: '100%', height: '100%' }}>
        <ParticipantVideoTileOverlay emojiSize={emojiSize} reaction={reaction} reactionResources={reactionResources} />
      </div>
    );
  } else if (props.overlayMode === 'screen-share' || props.overlayMode === 'content-share') {
    return (
      <div ref={videoTileRef} style={{ width: '100%', height: '100%' }}>
        <RemoteContentShareReactionOverlay
          hostDivHeight={divHeight}
          hostDivWidth={divWidth}
          reactionResources={reactionResources}
          localParticipant={localParticipant}
          remoteParticipants={remoteParticipants}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
};
