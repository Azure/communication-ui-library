// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier, isPhoneNumberIdentifier } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { VideoGalleryRemoteParticipant, VideoTile } from '@internal/react-components';
import React from 'react';

/**
 * props for the TransientRemoteVideoTile
 * @beta
 */
export type TransientVideoTileProps = {
  /** Remtoe participant for the video tile */
  participant: VideoGalleryRemoteParticipant;
};
/**
 * video tile to display the transient states of a remote participant.
 * @beta
 */
export const TransientRemoteVideoTile = (props: TransientVideoTileProps): JSX.Element => {
  const { participant } = props;
  const participantType: CommunicationIdentifier = fromFlatCommunicationIdentifier(participant.userId);
  const isPSTNUser: boolean = isPhoneNumberIdentifier(participantType);
  const prettyState = (): string => {
    if (isPSTNUser && participant.state === ('Ringing' || 'Connecting')) {
      return 'Calling...';
    } else {
      // we might want to use other strings for ACS users when they are being added to a call.
      return participant.state;
    }
  };

  return (
    <VideoTile displayName={participant.displayName} userId={participant.userId}>
      {/* we want to show the state of the participant inside the video tile */}
      <span>{prettyState}</span>
    </VideoTile>
  );
};
