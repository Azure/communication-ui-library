// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeclarativeCallClient, StatefulDeviceManager } from '@azure/acs-calling-declarative';
import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  LocalVideoStream,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { CreateViewOptions } from '../types/VideoGallery';
import { getUserId } from '../utils/participant';

export type DefaultHandlers = ReturnType<typeof createDefaultHandlers>;

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

const createDefaultHandlers = memoizeOne(
  (
    callClient: DeclarativeCallClient,
    callAgent: CallAgent | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    call: Call | undefined
  ) => {
    const onStartLocalVideo = async (): Promise<void> => {
      const callId = call?.id;
      let videoDeviceInfo = callClient.state.deviceManager.selectedCamera;
      if (!videoDeviceInfo) {
        const cameras = await deviceManager?.getCameras();
        videoDeviceInfo = cameras && cameras.length > 0 ? cameras[0] : undefined;
        videoDeviceInfo && deviceManager?.selectCamera(videoDeviceInfo);
      }
      if (!callId || !videoDeviceInfo) return;
      const stream = new LocalVideoStream(videoDeviceInfo);
      if (call && !call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
        await call.startVideo(stream);
        await callClient.startRenderVideo(callId, stream);
      }
    };

    const onStopLocalVideo = async (stream: LocalVideoStream): Promise<void> => {
      const callId = call?.id;
      if (!callId) return;
      if (call && call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
        callClient.stopRenderVideo(callId, stream);
        await call.stopVideo(stream);
      }
    };

    const onToggleCamera = async (): Promise<void> => {
      const stream = call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
      if (stream) {
        await onStopLocalVideo(stream);
      } else {
        await onStartLocalVideo();
      }
    };

    const onStartCall = (
      participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
      options?: StartCallOptions
    ): Call | undefined => {
      return callAgent ? callAgent.startCall(participants, options) : undefined;
    };

    const onSelectMicrophone = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) return;
      return deviceManager.selectMicrophone(device);
    };

    const onSelectSpeaker = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) return;
      return deviceManager.selectSpeaker(device);
    };

    const onSelectCamera = async (device: VideoDeviceInfo): Promise<void> => {
      if (!call || !deviceManager) return;
      deviceManager.selectCamera(device);
      const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
      return stream?.switchSource(device);
    };

    const onToggleMicrophone = (): Promise<void> | void => {
      return call?.isMuted ? call?.unmute() : call?.mute();
    };

    const onStartScreenShare = (): Promise<void> | void => call?.startScreenSharing();

    const onStopScreenShare = (): Promise<void> | void => call?.stopScreenSharing();

    const onToggleScreenShare = (): Promise<void> | void =>
      call?.isScreenSharingOn ? onStopScreenShare() : onStartScreenShare();

    const onHangUp = async (): Promise<void> => await call?.hangUp();

    const onBeforeRenderLocalVideoTile = async (options?: CreateViewOptions): Promise<void> => {
      console.log('onBeforeRenderLocalVideoTile', options, call);
      if (!call || call.localVideoStreams.length < 1) return;
      const localStream = call.localVideoStreams[0];
      if (!localStream) return;
      callClient.startRenderVideo(call.id, call.localVideoStreams[0], options);
    };

    const onBeforeRenderRemoteVideoTile = async (userId: string, options?: CreateViewOptions): Promise<void> => {
      console.log('onBeforeRenderRemoteVideoTile', options);
      if (!call) return;
      const callState = callClient.state.calls.get(call.id);
      if (!callState) throw new Error(`Call Not Found: ${call.id}`);

      const streams = Array.from(callState.remoteParticipants.values()).find(
        (participant) => getUserId(participant.identifier) === userId
      )?.videoStreams;

      let remoteVideoStream;
      let screenShareStream;

      streams &&
        Array.from(streams?.values()).forEach((item) => {
          if (item.mediaStreamType === 'Video') {
            remoteVideoStream = item;
          }
          if (item.mediaStreamType === 'ScreenSharing') {
            screenShareStream = item;
          }
        });

      if (remoteVideoStream && remoteVideoStream?.isAvailable && !remoteVideoStream.videoStreamRendererView) {
        callClient.startRenderVideo(call.id, remoteVideoStream, options);
      }

      if (screenShareStream && screenShareStream.isAvailable && !screenShareStream.videoStreamRendererView) {
        callClient.startRenderVideo(call.id, screenShareStream, options);
      }
    };

    return {
      onHangUp,
      onSelectCamera,
      onSelectMicrophone,
      onSelectSpeaker,
      onStartCall,
      onToggleCamera,
      onToggleMicrophone,
      onToggleScreenShare,
      onBeforeRenderLocalVideoTile,
      onBeforeRenderRemoteVideoTile
    };
  }
);

/**
 * Type guard for common properties between two types.
 */
export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? P : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties<A, B>>;

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invokations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param declarativeCallClient - DeclarativeCallClient returned from
 *   {@Link @azure/acs-calling-declarative#callClientDeclaratify}.
 * @param callAgent - Instance of {@Link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@Link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@Link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 * @returns
 */
export const createDefaultHandlersForComponent = <Props>(
  declarativeCallClient: DeclarativeCallClient,
  callAgent: CallAgent | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: Call | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => createDefaultHandlers(declarativeCallClient, callAgent, deviceManager, call);
