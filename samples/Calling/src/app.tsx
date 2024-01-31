// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InitResult,
  createLocalStreamView,
  createRemoteStreamView,
  disposeLocalStreamView,
  initStatefulClient,
  startLocalVideo,
  stopLocalVideo
} from './utils';
import {
  CallClientState,
  LocalVideoStreamState,
  RemoteVideoStreamState,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';

export const App = (): JSX.Element => {
  const [callState, setCallState] = useState<string>();
  const [callId, setCallId] = useState('');
  const [muteState, setMuteState] = useState('');
  const [localVideoStreamState, setLocalVideoStreamState] = useState<LocalVideoStreamState>();
  const [remoteParticipantId, setRemoteParticipantId] = useState<string>(); // Supporting one for now
  const [remoteVideoStreamState, setRemoteVideoStreamState] = useState<RemoteVideoStreamState>(); // Supporting one for now
  const [initResult, setInitResult] = useState<InitResult>();
  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  // subscribe to call state changes
  useEffect(() => {
    if (!initResult) {
      return;
    }
    const stateChangeHandler = (state: CallClientState): void => {
      const statefulCall = state.calls[initResult.call.id];
      setCallId(initResult.call.id);
      setCallState(statefulCall.state);
      setMuteState(statefulCall.isMuted ? 'Muted' : 'Unmuted');
      const localStream =
        statefulCall.localVideoStreams &&
        Object.values(statefulCall.localVideoStreams).find((stream) => stream.mediaStreamType === 'Video');
      setLocalVideoStreamState(localStream);
      const firstRemoteParticipant = Object.values(statefulCall.remoteParticipants)[0];
      const remoteStream =
        firstRemoteParticipant &&
        Object.values(firstRemoteParticipant.videoStreams).find((stream) => stream.mediaStreamType === 'Video');
      setRemoteParticipantId(
        firstRemoteParticipant?.identifier
          ? toFlatCommunicationIdentifier(firstRemoteParticipant?.identifier)
          : undefined
      );
      setRemoteVideoStreamState(remoteStream);
      console.log('Call state changed', statefulCall);
    };
    initResult.statefulCallClient.onStateChange(stateChangeHandler);

    return () => {
      initResult.statefulCallClient.offStateChange(stateChangeHandler);
    };
  }, [initResult]);

  const stopVideo = useCallback(() => {
    initResult && stopLocalVideo(initResult.call);
  }, [initResult]);
  const startVideo = useCallback(() => {
    initResult && startLocalVideo(initResult?.statefulCallClient, initResult?.call, initResult?.deviceManager);
  }, [initResult]);
  const mute = useCallback(() => {
    initResult?.call.mute();
  }, [initResult]);
  const unmute = useCallback(() => {
    initResult?.call.unmute();
  }, [initResult]);
  const hangUp = useCallback(() => {
    initResult?.call.hangUp();
  }, [initResult]);

  useEffect(() => {
    if (initResult && localVideoStreamState && !localVideoStreamState.view) {
      createLocalStreamView(initResult.statefulCallClient, initResult.call);
    } else if (initResult && !localVideoStreamState) {
      disposeLocalStreamView(initResult.statefulCallClient, initResult.call);
    }
  }, [initResult, localVideoStreamState]);

  useEffect(() => {
    const container = localVideoContainerRef.current;
    if (localVideoStreamState?.view) {
      container?.appendChild(localVideoStreamState.view.target);
    } else if (!localVideoStreamState?.view && container?.firstChild) {
      container?.removeChild(container?.firstChild);
    }
  }, [localVideoStreamState?.view]);

  useEffect(() => {
    if (initResult && remoteVideoStreamState && !remoteVideoStreamState.view && remoteParticipantId) {
      createRemoteStreamView(initResult.statefulCallClient, initResult.call, remoteParticipantId);
    } else if (initResult && !remoteVideoStreamState) {
      disposeLocalStreamView(initResult.statefulCallClient, initResult.call);
    }
  }, [initResult, remoteVideoStreamState, remoteParticipantId]);

  useEffect(() => {
    const container = remoteVideoContainerRef.current;
    if (remoteVideoStreamState?.view) {
      container?.appendChild(remoteVideoStreamState.view.target);
    } else if (!remoteVideoStreamState?.view && container?.firstChild) {
      container?.removeChild(container?.firstChild);
    }
  }, [remoteVideoStreamState?.view]);

  if (!initResult) {
    return (
      <>
        <div>
          <button
            onClick={() => initStatefulClient({ onStateChange: setCallState }).then(setInitResult)}
            disabled={!!callState}
          >
            Start Call
          </button>
        </div>
        {callState && <div>{callState}</div>}
      </>
    );
  }

  return (
    <div>
      <div>CallState: {callState}</div>
      <div>CallId: {callId}</div>
      <div>Mute State: {muteState}</div>
      <div>Local Video Stream State: {localVideoStreamState ? 'On' : 'Off'}</div>
      <div>
        <button onClick={stopVideo}>Stop Video</button>
        <button onClick={startVideo}>Start Video</button>
        <button onClick={mute}>Mute</button>
        <button onClick={unmute}>Unmute</button>
        <button onClick={hangUp}>Hang up</button>
      </div>
      <div>Local Video Stream:</div>
      <div id="local-video-container" ref={localVideoContainerRef} />
      <div>Remote Video Streams:</div>
      <div id="remote-video-container" ref={remoteVideoContainerRef} />
    </div>
  );
};
