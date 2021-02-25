// © Microsoft Corporation. All rights reserved.

import { Call, CallState, RemoteParticipant } from '@azure/communication-calling';
import { useCallingContext, useCallContext } from '../providers';
import { ParticipantStream } from '../types/ParticipantStream';
import { useEffect } from 'react';
import { getACSId } from '../utils';

export type UseCallAgentType = {
  call: Call | undefined;
  setCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  callState: CallState;
  setCallState: React.Dispatch<React.SetStateAction<CallState>>;
  participants: RemoteParticipant[];
  setParticipants: React.Dispatch<React.SetStateAction<RemoteParticipant[]>>;
  screenShareStream: ParticipantStream | undefined;
};

export default (): void => {
  const { callAgent } = useCallingContext();
  const {
    call,
    setCall,
    screenShareStream,
    setScreenShareStream,
    setCallState,
    setParticipants,
    setLocalScreenShare
  } = useCallContext();

  useEffect(() => {
    const subscribeToParticipant = (participant: RemoteParticipant, call: Call): void => {
      const userId = getACSId(participant.identifier);
      participant.on('participantStateChanged', () => {
        console.log('participant stateChanged', userId, participant.state);
        setParticipants([...call.remoteParticipants.values()]);
      });

      participant.on('isSpeakingChanged', () => {
        // TODO: Temporarily commented out as because isSpeakingChanged event fires very often in a large group call
        //       which causes a lot of flickering due to re-rendering. Since the isSpeaking feature is not yet
        //       implemented we comment this out until its needed. We also need some system change so only the component
        //       whose is affected by this event updates and not update all components.
        // setParticipants([...call.remoteParticipants.values()]);
      });

      participant.on('isMutedChanged', () => {
        // TODO: Previously we were updating the UI with latest isMuted value due to a side effect of isSpeakingChanged
        //       being called so as isSpeakingChanged is temporarily commented out, we need to add this. This will cause
        //       a flicker when remote participants mute/unmute themselves as we re-render all the tiles. We need to
        //       fix this in the future so only components who are affected by the event update and not all components.
        setParticipants([...call.remoteParticipants.values()]);
      });

      participant.on('videoStreamsUpdated', (e): void => {
        e.added.forEach((addedStream) => {
          if (addedStream.type === 'Video') {
            return;
          }
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
    };

    const onCallsUpdated = (e: { added: Call[]; removed: Call[] }): void => {
      e.added.forEach((addedCall) => {
        if (call && addedCall.isIncoming) {
          addedCall.reject();
          return;
        }

        setCall(addedCall);
        addedCall.on('callStateChanged', (): void => {
          setCallState(addedCall.state);
        });
        addedCall.on('remoteParticipantsUpdated', (ev): void => {
          ev.added.forEach((addedRemoteParticipant) => {
            console.log('participantAdded', getACSId(addedRemoteParticipant.identifier));
            setParticipants([...addedCall.remoteParticipants.values()]);
            subscribeToParticipant(addedRemoteParticipant, addedCall);
          });

          // we don't use the actual value we are just going to reset the remoteParticipants based on the call
          if (ev.removed.length > 0) {
            console.log('participantRemoved');
            setParticipants([...addedCall.remoteParticipants.values()]);
          }
        });
        const rp = [...addedCall.remoteParticipants.values()];
        rp.forEach((v) => subscribeToParticipant(v, addedCall));
        setParticipants(rp);
        setCallState(addedCall.state);
      });
      e.removed.forEach((removedCall) => {
        console.log('callRemoved', removedCall.id);
        if (call && call === removedCall) {
          setCall(undefined);
          setCallState('None');
          setParticipants([]);
          setScreenShareStream(undefined);
          setLocalScreenShare(false);
        }
      });
    };

    callAgent?.on('callsUpdated', onCallsUpdated);
    return () => {
      callAgent?.off('callsUpdated', onCallsUpdated);
    };
  }, [call, callAgent, setCallState, setParticipants, setScreenShareStream, setCall, setLocalScreenShare]);
};
