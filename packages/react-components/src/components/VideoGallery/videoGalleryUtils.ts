// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../gallery';
import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../types';

type LayoutResult = {
  gridParticipants: VideoGalleryParticipant[];
  horizontalGalleryParticipants: VideoGalleryParticipant[];
};

const DEFAULT_MAX_REMOTE_VIDEOSTREAMS = 4;

const DEFAULT_MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * @private
 */
export const useFloatingLocalVideoLayout = (props: {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  maxRemoteVideoStreams?: number;
  maxAudioDominantSpeakers?: number;
  isScreenShareActive?: boolean;
}): LayoutResult => {
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const {
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEOSTREAMS,
    maxAudioDominantSpeakers = DEFAULT_MAX_AUDIO_DOMINANT_SPEAKERS,
    isScreenShareActive = false
  } = props;

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipants = remoteParticipants.filter((p) => p.state === ('Connecting' || 'Ringing'));
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipantsSet = new Set(callingParticipants.map((p) => p.userId));

  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants:
      remoteParticipants?.filter(
        (p) =>
          !visibleVideoParticipantsSet.has(p.userId) &&
          /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !callingParticipantsSet.has(
            p.userId
          )
      ) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: maxAudioDominantSpeakers
  });

  const getGridParticipants = useCallback((): VideoGalleryRemoteParticipant[] => {
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return visibleVideoParticipants.current.length > 0
      ? visibleVideoParticipants.current
      : visibleAudioParticipants.current.concat(callingParticipants);
    return visibleVideoParticipants.current.length > 0
      ? visibleVideoParticipants.current
      : visibleAudioParticipants.current;
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants
  ]);

  const gridParticipants = getGridParticipants();

  const getHorizontalGalleryRemoteParticipants = useCallback((): VideoGalleryRemoteParticipant[] => {
    if (isScreenShareActive) {
      // If screen sharing is active, assign video and audio participants as horizontal gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleVideoParticipants.current.concat(visibleAudioParticipants.current.concat(callingParticipants));
      return visibleVideoParticipants.current.concat(visibleAudioParticipants.current);
    } else {
      // If screen sharing is not active, then assign all video tiles as grid tiles.
      // If there are no video tiles, then assign audio tiles as grid tiles.
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleVideoParticipants.current.length > 0
        ? visibleAudioParticipants.current.concat(callingParticipants)
        : [];
      return visibleVideoParticipants.current.length > 0 ? visibleAudioParticipants.current : [];
    }
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants,
    isScreenShareActive
  ]);

  const horizontalGalleryParticipants = getHorizontalGalleryRemoteParticipants();

  return { gridParticipants, horizontalGalleryParticipants };
};
