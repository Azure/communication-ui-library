// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(spotlight) */
import { RemoteParticipantState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(spotlight) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(spotlight) */
import { getRemoteParticipants, getSpotlightedParticipants } from './baseSelectors';
/* @conditional-compile-remove(spotlight) */
import { _updateUserDisplayNames, _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(spotlight) */
/**
 * Get the first remote participant that is spotlighted if any
 *
 * @private
 */
export const getFirstSpotlightedRemoteParticipant = reselect.createSelector(
  [getRemoteParticipants, getSpotlightedParticipants],
  (remoteParticipants, spotlightedParticipants) => {
    const spotlightedParticipantUserIds = spotlightedParticipants
      ? spotlightedParticipants.map((p) => toFlatCommunicationIdentifier(p.identifier))
      : [];
    const firstSpotlightedRemoteParticipant = remoteParticipants
      ? findFirstSpotlightedRemoteParticipant(remoteParticipants, spotlightedParticipantUserIds)
      : undefined;
    return firstSpotlightedRemoteParticipant;
  }
);

/* @conditional-compile-remove(spotlight) */
const findFirstSpotlightedRemoteParticipant = (
  remoteParticipants: { [keys: string]: RemoteParticipantState },
  spotlightedParticipantUserIds: string[]
): RemoteParticipantState | undefined => {
  const remoteParticipantIds = Object.keys(remoteParticipants);
  const spotlightedRemoteParticipantUserIds = spotlightedParticipantUserIds.filter((p) =>
    remoteParticipantIds.includes(p)
  );

  return spotlightedRemoteParticipantUserIds[0]
    ? remoteParticipants[spotlightedRemoteParticipantUserIds[0]]
    : undefined;
};
