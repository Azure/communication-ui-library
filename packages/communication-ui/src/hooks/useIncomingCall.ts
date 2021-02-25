// © Microsoft Corporation. All rights reserved.

import { AcceptCallOptions, Call } from '@azure/communication-calling';
import { useCallContext, useIncomingCallsContext } from '../providers';

export type UseIncomingCallType = {
  accept: (incomingCall: Call, acceptCallOptions?: AcceptCallOptions) => Promise<void>;
  reject: (incomingCall: Call) => Promise<void>;
  incomingCalls: Call[];
};

export const useIncomingCall = (): UseIncomingCallType => {
  const { incomingCalls } = useIncomingCallsContext();
  const { setCall, localVideoStream, setScreenShareStream, screenShareStream } = useCallContext();

  /** Accept an incoming calls and set it as the active call. */
  const accept = async (incomingCall: Call, acceptCallOptions?: AcceptCallOptions): Promise<void> => {
    if (!incomingCall) {
      throw new Error('incomingCall is null or undefined');
    }

    const videoOptions = acceptCallOptions?.videoOptions || {
      localVideoStreams: localVideoStream ? [localVideoStream] : undefined
    };

    await incomingCall.accept({ videoOptions });
    setCall(incomingCall);

    // Listen to Remote Participant screen share stream
    // Should we move this logic to CallProvider ?
    incomingCall.remoteParticipants.forEach((participant) => {
      participant.on('videoStreamsUpdated', (e) => {
        e.added.forEach((addedStream) => {
          if (addedStream.type === 'Video') return;
          addedStream.on('availabilityChanged', () => {
            if (addedStream.isAvailable) {
              setScreenShareStream({ stream: addedStream, user: participant });
            } else {
              // Prevents race condition when participant A turns on screen sharing
              // and participant B turns off screen sharing at the same time.
              // Ensures that the screen sharing stream is turned off only when
              // the current screen sharing participant turns it off.
              if (screenShareStream?.user.identifier === participant.identifier) {
                setScreenShareStream(undefined);
              }
            }
          });
          if (addedStream.isAvailable) {
            setScreenShareStream({ stream: addedStream, user: participant });
          }
        });
      });
    });
  };

  /** Reject an incoming call and remove it from `incomingCalls`. */
  const reject = async (incomingCall: Call): Promise<void> => {
    if (!incomingCall) {
      throw new Error('incomingCall is null or undefined');
    }
    await incomingCall.reject();
  };

  return { accept, reject, incomingCalls };
};
