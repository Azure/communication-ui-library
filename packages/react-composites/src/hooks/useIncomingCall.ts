// © Microsoft Corporation. All rights reserved.

import { AcceptCallOptions, IncomingCall } from '@azure/communication-calling';
import { useCallContext, useIncomingCallsContext } from '../providers';

export type UseIncomingCallType = {
  accept: (incomingCall: IncomingCall, acceptCallOptions?: AcceptCallOptions) => Promise<void>;
  reject: (incomingCall: IncomingCall) => Promise<void>;
  incomingCalls: IncomingCall[];
};

export const useIncomingCall = (): UseIncomingCallType => {
  const { incomingCalls, setIncomingCalls } = useIncomingCallsContext();
  const { setCall, localVideoStream, setScreenShareStream, screenShareStream } = useCallContext();

  /** Accept an incoming calls and set it as the active call. */
  const accept = async (incomingCall: IncomingCall, acceptCallOptions?: AcceptCallOptions): Promise<void> => {
    if (!incomingCall) {
      throw new Error('incomingCall is null or undefined');
    }

    const videoOptions = acceptCallOptions?.videoOptions || {
      localVideoStreams: localVideoStream ? [localVideoStream] : undefined
    };

    const call = await incomingCall.accept({ videoOptions });
    setCall(call);

    // Remove the accepted incomingCall from incomingCalls
    const incomingCallsFiltered: IncomingCall[] = [];
    for (const incomingCallCandidate of incomingCalls) {
      if (incomingCallCandidate !== incomingCall) {
        incomingCallsFiltered.push(incomingCallCandidate);
      }
    }
    setIncomingCalls(incomingCallsFiltered);

    // Listen to Remote Participant screen share stream
    // Should we move this logic to CallProvider ?
    call.remoteParticipants.forEach((participant) => {
      participant.on('videoStreamsUpdated', (e) => {
        e.added.forEach((addedStream) => {
          if (addedStream.mediaStreamType === 'Video') return;
          addedStream.on('isAvailableChanged', () => {
            if (addedStream.isAvailable) {
              setScreenShareStream({ stream: addedStream, user: participant });
            } else {
              // Prevents race condition when participant A turns on screen sharing
              // and participant B turns off screen sharing at the same time.
              // Ensures that the screen sharing stream is turned off only when
              // the current screen sharing participant turns it off.
              if (!screenShareStream || screenShareStream?.stream?.id === addedStream.id) {
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
  const reject = async (incomingCall: IncomingCall): Promise<void> => {
    if (!incomingCall) {
      throw new Error('incomingCall is null or undefined');
    }
    await incomingCall.reject();
  };

  return { accept, reject, incomingCalls };
};
