// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInCall, _isPreviewOn, _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';
import { dominantRemoteParticipantSelector } from './dominantRemoteParticipantSelector';
import { getDisplayName } from './baseSelectors';
import { getLocalParticipantRaisedHand } from './baseSelectors';
/* @conditional-compile-remove(spotlight) */
import { getFirstSpotlightedRemoteParticipant } from './getFirstSpotlightedRemoteParticipantSelector';

/**
 * Picture in picture in picture needs to display the most-dominant remote speaker, as well as the local participant video.
 * @private
 */
export const localAndRemotePIPSelector = reselect.createSelector(
  [
    getDisplayName,
    dominantRemoteParticipantSelector,
    localVideoSelector,
    getLocalParticipantRaisedHand,
    /* @conditional-compile-remove(spotlight) */ getFirstSpotlightedRemoteParticipant
  ],
  (
    displayName,
    dominantRemoteParticipant,
    localVideoStreamInfo,
    raisedHand,
    /* @conditional-compile-remove(spotlight) */ firstSpotlightedRemoteParticipant
  ) => {
    return {
      localParticipant: {
        displayName,
        videoStream: localVideoStreamInfo,
        raisedHand: raisedHand
      },
      dominantRemoteParticipant,
      /* @conditional-compile-remove(spotlight) */ firstSpotlightedRemoteParticipant
    };
  }
);
