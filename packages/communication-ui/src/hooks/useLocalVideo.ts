// © Microsoft Corporation. All rights reserved.
import { LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { useCallback } from 'react';
import { useCallContext } from '../providers';
import { areStreamsEqual } from '../utils';

export type UseCameraType = {
  startLocalVideo: (videoDeviceInfo: VideoDeviceInfo) => Promise<void>;
  stopLocalVideo: (localVideoStream: LocalVideoStream | undefined) => Promise<void>;
};

export default (): UseCameraType => {
  const {
    call,
    setLocalVideoStream,
    isLocalVideoRendererBusy,
    setLocalVideoRendererBusy,
    setLocalVideoOn
  } = useCallContext();

  const startLocalVideo = useCallback(
    async (videoDeviceInfo: VideoDeviceInfo): Promise<void> => {
      if (isLocalVideoRendererBusy) {
        throw new Error(`Failed to start local video: local video renderer is busy`);
      }
      const stream = new LocalVideoStream(videoDeviceInfo);

      // Set flag to busy while video is being started.
      setLocalVideoRendererBusy(true);

      try {
        // Only start video in the call if the video hasn't already been started.
        if (call && !call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
          await call.startVideo(stream);
        }
        setLocalVideoRendererBusy(false);
        setLocalVideoStream(stream);
        setLocalVideoOn(true);
      } catch (e) {
        // Ensure flag is released before throwing error.
        setLocalVideoRendererBusy(false);
        throw new Error(`Failed to start local video: ${e}`);
      }
    },
    [isLocalVideoRendererBusy, setLocalVideoRendererBusy, call, setLocalVideoStream, setLocalVideoOn]
  );

  const stopLocalVideo = useCallback(
    async (stream: LocalVideoStream | undefined): Promise<void> => {
      if (!stream || isLocalVideoRendererBusy) {
        throw new Error(
          `Failed to stop local video: ${stream ? 'local video renderer is busy' : 'stream is not valid'}`
        );
      }

      // Set flag to busy while video is being started.
      setLocalVideoRendererBusy(true);

      try {
        // Only stop video in the call if the video currently exists in the call.
        if (call && call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
          await call?.stopVideo(stream);
        }
        setLocalVideoRendererBusy(false);
        setLocalVideoStream(undefined);
        setLocalVideoOn(false);
      } catch (e) {
        // Ensure flag is released before throwing error.
        setLocalVideoRendererBusy(false);
        throw new Error(`Failed to stop local video: ${e}`);
      }
    },
    [isLocalVideoRendererBusy, setLocalVideoRendererBusy, call, setLocalVideoStream, setLocalVideoOn]
  );

  return {
    startLocalVideo,
    stopLocalVideo
  };
};
