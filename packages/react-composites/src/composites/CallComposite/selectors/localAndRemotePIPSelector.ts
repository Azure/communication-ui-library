// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn, _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';
import { dominantRemoteParticipantSelector } from './dominantRemoteParticipantSelector';
import { getDisplayName } from './baseSelectors';
/* @conditional-compile-remove(raise-hand) */
import { getLocalParticipantRaisedHand } from './baseSelectors';

/**
 * Picture in picture in picture needs to display the most-dominant remote speaker, as well as the local participant video.
 * @private
 */
export const localAndRemotePIPSelector = reselect.createSelector(
  [
    getDisplayName,
    dominantRemoteParticipantSelector,
    localVideoSelector,
    /* @conditional-compile-remove(raise-hand) */ getLocalParticipantRaisedHand
  ],
  (displayName, dominantRemoteParticipant, localVideoStreamInfo, raisedHand) => {
    return {
      localParticipant: {
        displayName,
        videoStream: localVideoStreamInfo,
        /* @conditional-compile-remove(raise-hand) */
        raisedHand: raisedHand
      },
      dominantRemoteParticipant
    };
  }
);
