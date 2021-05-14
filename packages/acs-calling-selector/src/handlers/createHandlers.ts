// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  LocalVideoStream,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import { DeviceManager, StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { VideoStreamOptions } from 'react-components';
import { getACSId } from '../utils/getACSId';

export type DefaultCallingHandlers = ReturnType<typeof createDefaultCallingHandlers>;

export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

export const createDefaultCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
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
      }
    };

    const onStopLocalVideo = async (stream: LocalVideoStream): Promise<void> => {
      const callId = call?.id;
      if (!callId) return;
      if (call && call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
        await callClient.stopRenderVideo(callId, stream);
        await call.stopVideo(stream);
      }
    };

    const onToggleCamera = async (): Promise<void> => {
      if (call) {
        const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
        if (stream) {
          await onStopLocalVideo(stream);
        } else {
          await onStartLocalVideo();
        }
      } else {
        if (callClient.state.deviceManager.selectedCamera) {
          const previewOn = isPreviewOn(callClient.state.deviceManager);
          if (previewOn) {
            await callClient.stopRenderVideo(undefined, {
              source: callClient.state.deviceManager.selectedCamera,
              mediaStreamType: 'Video'
            });
          } else {
            await callClient.startRenderVideo(undefined, {
              source: callClient.state.deviceManager.selectedCamera,
              mediaStreamType: 'Video'
            });
          }
        }
      }
    };

    const onStartCall = (
      participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
      options?: StartCallOptions
    ): Call | undefined => {
      return callAgent ? callAgent.startCall(participants, options) : undefined;
    };

    const onSelectMicrophone = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      return deviceManager.selectMicrophone(device);
    };

    const onSelectSpeaker = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      return deviceManager.selectSpeaker(device);
    };

    const onSelectCamera = async (device: VideoDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      if (call) {
        deviceManager.selectCamera(device);
        const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
        return stream?.switchSource(device);
      } else {
        const previewOn = isPreviewOn(callClient.state.deviceManager);

        if (!previewOn) {
          deviceManager.selectCamera(device);
          return;
        }

        // If preview is on, then stop current preview and then start new preview with new device
        if (callClient.state.deviceManager.selectedCamera) {
          await callClient.stopRenderVideo(undefined, {
            source: callClient.state.deviceManager.selectedCamera,
            mediaStreamType: 'Video'
          });
        }
        deviceManager.selectCamera(device);
        await callClient.startRenderVideo(undefined, {
          source: device,
          mediaStreamType: 'Video'
        });
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

    const onCreateLocalStreamView = async (options?: VideoStreamOptions): Promise<void> => {
      if (!call || call.localVideoStreams.length === 0) return;
      const localStream = call.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
      if (!localStream) return;
      callClient.startRenderVideo(call.id, localStream, options);
    };

    const onCreateRemoteStreamView = async (userId: string, options?: VideoStreamOptions): Promise<void> => {
      if (!call) return;
      const callState = callClient.state.calls.get(call.id);
      if (!callState) throw new Error(`Call Not Found: ${call.id}`);

      const streams = Array.from(callState.remoteParticipants.values()).find(
        (participant) => getACSId(participant.identifier) === userId
      )?.videoStreams;

      if (!streams) return;

      const remoteVideoStream = Array.from(streams?.values()).find((i) => i.mediaStreamType === 'Video');
      const screenShareStream = Array.from(streams?.values()).find((i) => i.mediaStreamType === 'ScreenSharing');

      if (remoteVideoStream && remoteVideoStream.isAvailable && !remoteVideoStream.videoStreamRendererView) {
        callClient.startRenderVideo(call.id, remoteVideoStream, options);
      }

      if (screenShareStream && screenShareStream.isAvailable && !screenShareStream.videoStreamRendererView) {
        callClient.startRenderVideo(call.id, screenShareStream, options);
      }
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
      onCreateLocalStreamView,
      onCreateRemoteStreamView,
      onParticipantRemove
    };
  }
);

const isPreviewOn = (deviceManager: DeviceManager): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};

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
 * @param callClient - StatefulCallClient returned from
 *   {@Link calling-stateful-client#createStatefulCallClient}.
 * @param callAgent - Instance of {@Link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@Link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@Link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 * @returns
 */
export const createDefaultCallingHandlersForComponent = <Props>(
  callClient: StatefulCallClient,
  callAgent: CallAgent | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: Call | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<DefaultCallingHandlers, Props> => {
  return createDefaultCallingHandlers(callClient, callAgent, deviceManager, call);
};
