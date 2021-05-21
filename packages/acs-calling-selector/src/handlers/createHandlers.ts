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
import { Common, fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from 'acs-ui-common';
import { DeviceManagerState, StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { VideoStreamOptions } from 'react-components';

// @ts-ignore
import { CommonProperties } from 'acs-ui-common';

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
      let videoDeviceInfo = callClient.getState().deviceManager.selectedCamera;
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
        await call.stopVideo(stream);
        await callClient.disposeView(callId, undefined, {
          source: stream.source,
          mediaStreamType: stream.mediaStreamType
        });
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
        const selectedCamera = callClient.getState().deviceManager.selectedCamera;
        if (selectedCamera) {
          const previewOn = isPreviewOn(callClient.getState().deviceManager);
          if (previewOn) {
            await callClient.disposeView(undefined, undefined, {
              source: selectedCamera,
              mediaStreamType: 'Video'
            });
          } else {
            await callClient.createView(undefined, undefined, {
              source: selectedCamera,
              mediaStreamType: 'Video'
            });
          }
        }
      }
    };

    // FIXME: onStartCall API should use string, not the underlying SDK types.
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
        const previewOn = isPreviewOn(callClient.getState().deviceManager);

        if (!previewOn) {
          deviceManager.selectCamera(device);
          return;
        }

        const selectedCamera = callClient.getState().deviceManager.selectedCamera;
        // If preview is on, then stop current preview and then start new preview with new device
        if (selectedCamera) {
          await callClient.disposeView(undefined, undefined, {
            source: selectedCamera,
            mediaStreamType: 'Video'
          });
        }
        deviceManager.selectCamera(device);
        await callClient.createView(undefined, undefined, {
          source: device,
          mediaStreamType: 'Video'
        });
      }
    };

    const onToggleMicrophone = async (): Promise<void> => {
      if (!call) {
        throw new Error(`Please invoke onToggleMicrophone after call is started`);
      }
      return call.isMuted ? await call.unmute() : await call.mute();
    };

    const onStartScreenShare = async (): Promise<void> => await call?.startScreenSharing();

    const onStopScreenShare = async (): Promise<void> => await call?.stopScreenSharing();

    const onToggleScreenShare = async (): Promise<void> =>
      call?.isScreenSharingOn ? await onStopScreenShare() : await onStartScreenShare();

    const onHangUp = async (): Promise<void> => await call?.hangUp();

    const onCreateLocalStreamView = async (options?: VideoStreamOptions): Promise<void> => {
      if (!call || call.localVideoStreams.length === 0) {
        return;
      }

      const callState = callClient.getState().calls.get(call.id);
      if (!callState) {
        return;
      }

      const localStream = callState.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
      if (!localStream) {
        return;
      }

      return callClient.createView(call.id, undefined, localStream, options);
    };

    const onCreateRemoteStreamView = async (userId: string, options?: VideoStreamOptions): Promise<void> => {
      if (!call) return;
      const callState = callClient.getState().calls.get(call.id);
      if (!callState) throw new Error(`Call Not Found: ${call.id}`);

      const participant = Array.from(callState.remoteParticipants.values()).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      const remoteVideoStream = Array.from(participant.videoStreams.values()).find(
        (i) => i.mediaStreamType === 'Video'
      );
      const screenShareStream = Array.from(participant.videoStreams.values()).find(
        (i) => i.mediaStreamType === 'ScreenSharing'
      );

      if (remoteVideoStream && remoteVideoStream.isAvailable && !remoteVideoStream.view) {
        callClient.createView(call.id, participant.identifier, remoteVideoStream, options);
      }

      if (screenShareStream && screenShareStream.isAvailable && !screenShareStream.view) {
        callClient.createView(call.id, participant.identifier, screenShareStream, options);
      }
    };

    const onParticipantRemove = (userId: string): void => {
      call?.removeParticipant(fromFlatCommunicationIdentifier(userId));
    };

    return {
      onHangUp,
      onSelectCamera,
      onSelectMicrophone,
      onSelectSpeaker,
      onStartCall,
      onStartScreenShare,
      onStopScreenShare,
      onToggleCamera,
      onToggleMicrophone,
      onToggleScreenShare,
      onCreateLocalStreamView,
      onCreateRemoteStreamView,
      onParticipantRemove,
      onStartLocalVideo
    };
  }
);

// TODO: extract into an util.
const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.values().next().value?.view !== undefined;
};

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
