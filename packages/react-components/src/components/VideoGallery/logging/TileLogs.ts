// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useRef } from 'react';
import { ParticipantState } from '../../../types';
import { generateDeepDiff, logEvent } from '../../utils/logger';
import type { VideoGalleryLayout } from '../../VideoGallery';

/** @private */
export const useVideoGalleryLayoutLogger = (props: {
  dominantSpeakers: string[] | undefined;
  pinnedParticipants: string[] | undefined;
  remoteParticipants: RemoteParticipantLogInfo[] | undefined;
  localParticipant: ParticipantLogInfo | undefined;
  layout: VideoGalleryLayout;
  overflowLayout: 'HorizontalBottom' | 'VerticalRight';
  isNarrow: boolean;
  gridTiles: TileLogInfo[] | undefined;
  horizontalTiles: TileLogInfo[] | undefined;
  verticalTiles: TileLogInfo[] | undefined;
  floatingTile: TileLogInfo | undefined;
}): void => {
  const {
    layout,
    overflowLayout,
    isNarrow,
    dominantSpeakers,
    pinnedParticipants,
    remoteParticipants,
    localParticipant,
    gridTiles,
    horizontalTiles,
    verticalTiles,
    floatingTile
  } = props;

  const previousLogData = useRef<VideoGalleryLayoutUpdatedLogInfo>();

  useEffect(() => {
    const newLogData: VideoGalleryLayoutUpdatedLogInfo = {
      layoutProps: {
        layout,
        overflowLayout,
        isNarrow
      },
      inputs: {
        dominantSpeakers,
        pinnedParticipants,
        remoteParticipants,
        localParticipant
      },
      outTiles: {
        gridTiles,
        horizontalTiles,
        verticalTiles,
        floatingTile
      }
    };

    const logDataDelta = generateDeepDiff(previousLogData.current, newLogData) as VideoGalleryLayoutUpdatedLogInfo;

    console.log('VideoGalleryLayoutUpdated', logDataDelta);

    logEvent({
      name: 'VideoGalleryLayoutUpdated',
      message: 'VideoGalleryLayoutUpdated',
      level: 'info',
      data: logDataDelta
    });

    previousLogData.current = newLogData;
  }, [
    layout,
    overflowLayout,
    isNarrow,
    dominantSpeakers,
    pinnedParticipants,
    remoteParticipants,
    localParticipant,
    gridTiles,
    horizontalTiles,
    verticalTiles,
    floatingTile
  ]);
};

/**
 * Type definition for what should be logged when the video gallery layout is updated.
 *
 * @private
 */
export type VideoGalleryLayoutUpdatedLogInfo = {
  layoutProps: Record<string, unknown>;
  inputs: Record<string, ParticipantLogInfo | RemoteParticipantLogInfo[] | string[] | undefined>;
  outTiles: Record<string, TileLogInfo[] | TileLogInfo | undefined>;
};

/**
 * Type definition for what should be logged for a video gallery participant.
 *
 * @private
 */
export type ParticipantLogInfo = {
  userId: string;
  isMuted: boolean;
  isScreenSharing: boolean;
  isVideoAvailable: boolean;
  isVideoReceiving: boolean;
  hasVideoElement: boolean;
};

/**
 * Type definition for what should be logged for a video gallery remote participant.
 *
 * @private
 */
export type RemoteParticipantLogInfo = ParticipantLogInfo & {
  isSpeaking: boolean | undefined;
  isScreenShareAvailable: boolean;
  isScreenShareReceiving: boolean;
  hasScreenShareElement: boolean;
  participantState: ParticipantState | undefined;
};

/**
 * Type definition for what should be logged for a tile.
 *
 * @private
 */
export type TileLogInfo = {
  /** Id of the user the tile was created for */
  userId: string;
  tileKind: 'local' | 'remote';
  tileContent: 'video' | 'screen' | 'none';
  isMuted: boolean;
};

/**
 * Type definition for what should be logged when a tile is successfully displaying video content.
 *
 * @private
 */
export type TileVideoActiveLog = TileLogInfo & {
  tileContent: 'video';
  isVideoActive: true;
};

/**
 * Type definition for what should be logged when a tile has stopped displaying video content.
 *
 * @remakrs
 * This should only be logged when the tile was previously displaying video content.
 *
 * @private
 */
export type TileVideoStoppedLog = TileLogInfo & {
  tileContent: 'video';
  isVideoActive: false;
};
