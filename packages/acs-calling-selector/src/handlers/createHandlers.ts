// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallAgent,
  Call,
  StartCallOptions,
  VideoDeviceInfo,
  AudioDeviceInfo,
  LocalVideoStream,
  CreateViewOptions
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import {
  DeclarativeCallClient,
  RemoteVideoStream,
  LocalVideoStream as StatefulLocalVideoStream,
  StatefulDeviceManager
} from 'calling-stateful-client';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';

export type DefaultCallingHandlers = ReturnType<typeof createDefaultCallingHandlers>;

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

export const createDefaultCallingHandlers = memoizeOne(
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

    const onPreviewStartVideo = async (stream: StatefulLocalVideoStream): Promise<void> => {
      await callClient.startRenderVideo(undefined, stream);
    };

    const onPreviewStopVideo = async (stream: StatefulLocalVideoStream): Promise<void> => {
      await callClient.stopRenderVideo(undefined, stream);
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
      if (!deviceManager) return;
      deviceManager.selectCamera(device);
      if (call) {
        const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
        return stream?.switchSource(device);
      }
    };

    const onToggleMicrophone = async (): Promise<void> => {
      return call?.isMuted ? await call?.unmute() : await call?.mute();
    };

    const onStartScreenShare = async (): Promise<void> => await call?.startScreenSharing();

    const onStopScreenShare = async (): Promise<void> => await call?.stopScreenSharing();

    const onToggleScreenShare = async (): Promise<void> =>
      call?.isScreenSharingOn ? await onStopScreenShare() : await onStartScreenShare();

    const onHangUp = async (): Promise<void> => await call?.hangUp();

    const onRenderView = async (
      stream: StatefulLocalVideoStream | RemoteVideoStream,
      options: CreateViewOptions
    ): Promise<void> => {
      const callId = call?.id;
      if (!callId) return;
      await callClient.startRenderVideo(callId, stream, options);
    };

    const onParticipantRemove = (userId: string): void => {
      call?.removeParticipant({ communicationUserId: userId });
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
      onRenderView,
      onParticipantRemove,
      onPreviewStartVideo,
      onPreviewStopVideo
    };
  }
);

/**
 * Type guard for common properties between two types.
 */
export type CommonProperties1<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? P : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties1<A, B>>;

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invokations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param declarativeCallClient - DeclarativeCallClient returned from
 *   {@Link calling-stateful-client#callClientDeclaratify}.
 * @param callAgent - Instance of {@Link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@Link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@Link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 * @returns
 */
export const createDefaultCallingHandlersForComponent = <Props>(
  declarativeCallClient: DeclarativeCallClient,
  callAgent: CallAgent | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: Call | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<DefaultCallingHandlers, Props> => {
  return createDefaultCallingHandlers(declarativeCallClient, callAgent, deviceManager, call);
};
