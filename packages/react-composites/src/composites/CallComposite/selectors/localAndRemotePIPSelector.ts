// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn, _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';
import { LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  getDeviceManager,
  getDisplayName,
  getDominantSpeakers,
  getLocalVideoStreams,
  getRemoteParticipants
} from './baseSelectors';
import { callStatusSelector } from './callStatusSelector';

/**
 * Picture in picture in picture needs to display the most-dominant remote speaker, as well as the local participant video.
 * @private
 */
export const localAndRemotePIPSelector = reselect.createSelector(
  [
    getDisplayName,
    callStatusSelector,
    getDeviceManager,
    getLocalVideoStreams,
    getRemoteParticipants,
    getDominantSpeakers
  ],
  (displayName, callStatus, deviceManager, localVideoStreams, remoteParticipants, dominantSpeakers) => {
    // Get local video stream details
    let localVideoStream: LocalVideoStreamState | undefined;
    if (_isInCall(callStatus.callStatus)) {
      localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
    } else if (_isPreviewOn(deviceManager)) {
      localVideoStream = deviceManager.unparentedViews[0];
    }

    // Get remote video stream details of the most dominant participant
    const covertedRemoteParticipants = _videoGalleryRemoteParticipantsMemo(remoteParticipants);
    const [dominantRemoteParticipantId] = dominantSpeakers ?? [];
    const dominantRemoteParticipant =
      covertedRemoteParticipants.find(
        (remoteParticipant) => remoteParticipant.userId === dominantRemoteParticipantId
      ) ?? covertedRemoteParticipants[0];

    return {
      localParticipant: {
        displayName,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.view?.isMirrored,
          renderElement: localVideoStream?.view?.target
        }
      },
      dominantRemoteParticipant
    };
  }
);
