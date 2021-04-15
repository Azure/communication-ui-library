// © Microsoft Corporation. All rights reserved.

import { LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import { useEffect, useRef, useState } from 'react';
import { useCallContext, useCallingContext } from '../../../providers';
import { GalleryParticipant } from '../../../types/GalleryParticipant';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../../../utils/TypeConverter';

export type MediaGallery1To1ContainerProps = {
  /** Determines the local participant label and avatar. */
  localParticipantName?: string;
  /** Determines the remote participant in the media gallery. */
  remoteParticipant: GalleryParticipant | undefined;
  /** Local Video Stream (Not a video stream element) */
  localVideoStream: LocalVideoStream | undefined;
};

// On video calls the displayNameChanged event happens very late and ends up being after the remote participant is
// already rendered with the userId. We need to listen for this event and trigger a re-render after displayNameChanged.
class DisplayNameChangedSubscriber {
  private _participant: RemoteParticipant;
  private _setRemoteParticipant: (remoteParticipant: GalleryParticipant) => void;

  constructor(participant: RemoteParticipant, setRemoteParticipant: (remoteParticipant: GalleryParticipant) => void) {
    this._participant = participant;
    this._setRemoteParticipant = setRemoteParticipant;
    this._participant.on('displayNameChanged', this.onDisplayNameChanged);
  }

  private onDisplayNameChanged = (): void => {
    this._setRemoteParticipant(convertSdkRemoteParticipantToGalleryParticipant(this._participant));
  };

  public unsubscribe = (): void => {
    this._participant.off('displayNameChanged', this.onDisplayNameChanged);
  };
}

export const MapToMediaGallery1To1Props = (): MediaGallery1To1ContainerProps => {
  const { call, localVideoStream } = useCallContext();
  const { displayName } = useCallingContext();
  const [remoteParticipant, setRemoteParticipant] = useState<GalleryParticipant | undefined>();
  const displayNameChangedSubscriber = useRef<DisplayNameChangedSubscriber | undefined>(undefined);

  useEffect(() => {
    if (call && call.remoteParticipants.length > 0) {
      setRemoteParticipant(convertSdkRemoteParticipantToGalleryParticipant(call.remoteParticipants[0]));
      displayNameChangedSubscriber.current = new DisplayNameChangedSubscriber(
        call.remoteParticipants[0],
        setRemoteParticipant
      );
    }
    return () => {
      if (displayNameChangedSubscriber.current) {
        displayNameChangedSubscriber.current.unsubscribe();
      }
    };
  }, [call]);

  return {
    localParticipantName: displayName,
    remoteParticipant: remoteParticipant,
    localVideoStream: localVideoStream
  };
};
