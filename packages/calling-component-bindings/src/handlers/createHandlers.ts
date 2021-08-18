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
import { Common, fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallErrorTargets,
  DeviceManagerState,
  newClearCallErrorsModifier,
  StatefulCallClient,
  StatefulDeviceManager
} from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { ErrorType, VideoStreamOptions } from '@internal/react-components';

export type DefaultCallingHandlers = {
  onStartLocalVideo: () => Promise<void>;
  onToggleCamera: (options?: VideoStreamOptions) => Promise<void>;
  onStartCall: (
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    options?: StartCallOptions
  ) => Call | undefined;
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
  onSelectSpeaker: (device: AudioDeviceInfo) => Promise<void>;
  onSelectCamera: (device: VideoDeviceInfo, options?: VideoStreamOptions) => Promise<void>;
  onToggleMicrophone: () => Promise<void>;
  onStartScreenShare: () => Promise<void>;
  onStopScreenShare: () => Promise<void>;
  onToggleScreenShare: () => Promise<void>;
  onHangUp: () => Promise<void>;
  onCreateLocalStreamView: (options?: VideoStreamOptions) => Promise<void>;
  onCreateRemoteStreamView: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  onParticipantRemove: (userId: string) => Promise<void>;
  onDisposeRemoteStreamView: (userId: string) => Promise<void>;
  onDisposeLocalStreamView: () => Promise<void>;
  onDismissErrors: (errorTypes: ErrorType[]) => void;
};

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

    const onToggleCamera = async (options?: VideoStreamOptions): Promise<void> => {
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
            // TODO: we need to remember which LocalVideoStream was used for LocalPreview and dispose that one. For now
            // assume any unparented view is a LocalPreview and stop all since those are only used for LocalPreview
            // currently.
            callClient.getState().deviceManager.unparentedViews.forEach(async (view) => {
              await callClient.disposeView(undefined, undefined, view);
            });
          } else {
            await callClient.createView(
              undefined,
              undefined,
              {
                source: selectedCamera,
                mediaStreamType: 'Video'
              },
              options
            );
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

    const onSelectCamera = async (device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> => {
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

        onDisposeLocalStreamView();

        deviceManager.selectCamera(device);
        await callClient.createView(
          undefined,
          undefined,
          {
            source: device,
            mediaStreamType: 'Video'
          },
          options
        );
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

      const callState = callClient.getState().calls[call.id];
      if (!callState) {
        return;
      }

      const localStream = callState.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
      if (!localStream) {
        return;
      }

      return callClient.createView(call.id, undefined, localStream, options);
    };

    const onCreateRemoteStreamView = async (
      userId: string,
      options = { scalingMode: 'Crop' } as VideoStreamOptions
    ): Promise<void> => {
      if (!call) return;
      const callState = callClient.getState().calls[call.id];
      if (!callState) throw new Error(`Call Not Found: ${call.id}`);

      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      const remoteVideoStream = Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');
      const screenShareStream = Object.values(participant.videoStreams).find(
        (i) => i.mediaStreamType === 'ScreenSharing'
      );

      if (remoteVideoStream && remoteVideoStream.isAvailable && !remoteVideoStream.view) {
        callClient.createView(call.id, participant.identifier, remoteVideoStream, options);
      }

      if (screenShareStream && screenShareStream.isAvailable && !screenShareStream.view) {
        // Hardcoded `scalingMode` since it is highly unlikely that CONTOSO would ever want to use a different scaling mode for screenshare.
        // Using `Crop` would crop the contents of screenshare and `Stretch` would warp it.
        // `Fit` is the only mode that maintains the integrity of the screen being shared.
        callClient.createView(call.id, participant.identifier, screenShareStream, { scalingMode: 'Fit' });
      }
    };

    const onDisposeRemoteStreamView = async (userId: string): Promise<void> => {
      if (!call) return;
      const callState = callClient.getState().calls[call.id];
      if (!callState) throw new Error(`Call Not Found: ${call.id}`);

      const participant = Object.values(callState.remoteParticipants).find(
        (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
      );

      if (!participant || !participant.videoStreams) {
        return;
      }

      const remoteVideoStream = Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');
      const screenShareStream = Object.values(participant.videoStreams).find(
        (i) => i.mediaStreamType === 'ScreenSharing'
      );

      if (remoteVideoStream && remoteVideoStream.view) {
        callClient.disposeView(call.id, participant.identifier, remoteVideoStream);
      }

      if (screenShareStream && screenShareStream.view) {
        callClient.disposeView(call.id, participant.identifier, screenShareStream);
      }
    };

    const onDisposeLocalStreamView = async (): Promise<void> => {
      const selectedCamera = callClient.getState().deviceManager.selectedCamera;
      // If preview is on, then stop current preview and then start new preview with new device
      if (selectedCamera) {
        // TODO: we need to remember which LocalVideoStream was used for LocalPreview and dispose that one. For now
        // assume any unparented view is a LocalPreview and stop all since those are only used for LocalPreview
        // currently.
        callClient.getState().deviceManager.unparentedViews.forEach(async (view) => {
          await callClient.disposeView(undefined, undefined, view);
        });
      }
    };

    const onParticipantRemove = async (userId: string): Promise<void> => {
      await call?.removeParticipant(fromFlatCommunicationIdentifier(userId));
    };

    const onDismissErrors = (errorTypes: ErrorType[]) => {
      const targets: Set<CallErrorTargets> = new Set();
      for (const errorType of errorTypes) {
        const target = statefulErrors[errorType];
        if (target !== undefined) {
          targets.add(target);
        }
      }
      callClient.modifyState(newClearCallErrorsModifier(Array.from(targets.values())));
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
      onStartLocalVideo,
      onDisposeRemoteStreamView,
      onDisposeLocalStreamView,
      onDismissErrors
    };
  }
);

const statefulErrors: { [key in ErrorType]: CallErrorTargets | undefined } = {
  muteGeneric: 'Call.mute',
  startScreenShareGeneric: 'Call.startScreenSharing',
  startVideoGeneric: 'Call.startVideo',
  stopScreenShareGeneric: 'Call.stopScreenSharing',
  stopVideoGeneric: 'Call.stopVideo',
  unmuteGeneric: 'Call.unmute',

  // Non-calling errors.
  accessDenied: undefined,
  sendMessageGeneric: undefined,
  sendMessageNotInThisThread: undefined,
  unableToReachChatService: undefined,
  userNotInThisThread: undefined
};

// TODO: extract into an util.
const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invokations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param callClient - StatefulCallClient returned from
 *   {@link @azure/communication-react#createStatefulCallClient}.
 * @param callAgent - Instance of {@link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@link @azure/communication-calling#Call}.
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
