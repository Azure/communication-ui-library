// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../../../types/CommunicationUiError';
import { useCallContext } from '../providers/CallProvider';
import { areStreamsEqual } from '../utils/SDKUtils';

export type useLocalVideoType = {
  startLocalVideo: (videoDeviceInfo: VideoDeviceInfo) => Promise<void>;
  stopLocalVideo: (localVideoStream: LocalVideoStream | undefined) => Promise<void>;
};

export default (): useLocalVideoType => {
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
        throw new CommunicationUiError({
          message: 'Failed to start local video: local video renderer is busy',
          code: CommunicationUiErrorCode.START_VIDEO_ERROR
        });
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
      } catch (error) {
        // Ensure flag is released before throwing error.
        setLocalVideoRendererBusy(false);
        throw new CommunicationUiError({
          message: 'Failed to start local video',
          code: CommunicationUiErrorCode.START_VIDEO_ERROR,
          error: error
        });
      }
    },
    [isLocalVideoRendererBusy, setLocalVideoRendererBusy, call, setLocalVideoStream, setLocalVideoOn]
  );

  const stopLocalVideo = useCallback(
    async (stream: LocalVideoStream | undefined): Promise<void> => {
      if (!stream || isLocalVideoRendererBusy) {
        throw new CommunicationUiError({
          message: `Failed to stop local video: ${stream ? 'local video renderer is busy' : 'stream is not valid'}`,
          code: CommunicationUiErrorCode.STOP_VIDEO_ERROR
        });
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
      } catch (error) {
        // Ensure flag is released before throwing error.
        setLocalVideoRendererBusy(false);
        throw new CommunicationUiError({
          message: 'Failed to stop local video',
          code: CommunicationUiErrorCode.STOP_VIDEO_ERROR,
          error: error
        });
      }
    },
    [isLocalVideoRendererBusy, setLocalVideoRendererBusy, call, setLocalVideoStream, setLocalVideoOn]
  );

  return {
    startLocalVideo,
    stopLocalVideo
  };
};
