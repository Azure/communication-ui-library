// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn, _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';
import { dominantRemoteParticipantSelector } from './dominantRemoteParticipantSelector';
import { getDisplayName } from './baseSelectors';
import { VideoGalleryRemoteParticipant } from '@internal/react-components';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const selectLocalAndRemotePIP = (
  displayName: string | undefined,
  dominantRemoteParticipant: VideoGalleryRemoteParticipant | undefined,
  localVideoStreamInfo: ReturnType<typeof localVideoSelector>
) => {
  return {
    localParticipant: {
      displayName,
      videoStream: localVideoStreamInfo
    },
    dominantRemoteParticipant
  };
};

/**
 * Picture in picture in picture needs to display the most-dominant remote speaker, as well as the local participant video.
 * @private
 */
export const localAndRemotePIPSelector = reselect.createSelector(
  [getDisplayName, dominantRemoteParticipantSelector, localVideoSelector],
  selectLocalAndRemotePIP
);
