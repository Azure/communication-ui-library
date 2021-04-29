// © Microsoft Corporation. All rights reserved.
import * as reselect from 'reselect';
import { getCall } from './baseSelectors';

export const videoGallerySelector = reselect.createSelector([getCall], (call) => {
  return {
    isMuted: call?.isMuted,
    isScreenSharingOn: call?.isScreenSharingOn,
    localVideoStreams: call?.localVideoStreams,
    remoteParticipants: call?.remoteParticipants
  };
});
