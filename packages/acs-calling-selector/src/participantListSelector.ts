// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from '@azure/acs-calling-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { getCall, getUserId, getDisplayName } from './baseSelectors';
// @ts-ignore

export const participantListSelector = reselect.createSelector(
  [getUserId, getDisplayName, getCall],
  (
    userId,
    displayName,
    call
  ): {
    userId: string;
    displayName?: string;
    remoteParticipants?: callingDeclarative.RemoteParticipant[];
    isScreenSharingOn: boolean;
    isMuted: boolean;
  } => {
    return {
      userId: userId,
      displayName: displayName,
      remoteParticipants: call && call?.remoteParticipants ? Array.from(call?.remoteParticipants.values()) : [],
      isScreenSharingOn: call?.isScreenSharingOn ?? false,
      isMuted: call?.isMuted ?? false
    };
  }
);
