// © Microsoft Corporation. All rights reserved.
import {
  CallAgent,
  DeviceManager,
  Call,
  StartCallOptions,
  HangUpOptions,
  VideoDeviceInfo,
  AudioDeviceInfo,
  LocalVideoStream,
  CreateViewOptions
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import { DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#CallClient}.
 */
export type CallClientHandlers = ReturnType<typeof createCallClientDefaultHandlers>;

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#CallAgent}.
 */
export type CallAgentHandlers = ReturnType<typeof createCallAgentDefaultHandlers>;

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#DeviceManager}.
 */
export type DeviceManagerHandlers = ReturnType<typeof createDeviceManagerDefaultHandlers>;

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#Call}.
 */
export type CallHandlers = ReturnType<typeof createCallDefaultHandlers>;

export const createCallClientDefaultHandlers = memoizeOne((callClient: DeclarativeCallClient) => {
  const onStartLocalVideo = (
    callId: string,
    videoDeviceInfo: VideoDeviceInfo,
    options: CreateViewOptions
  ): Promise<void> => {
    const stream = new LocalVideoStream(videoDeviceInfo);
    return callClient.startRenderVideo(callId, stream, options);
  };

  const onStopLocalVideo = (callId: string): Promise<void> | void => {
    const call = callClient.state.calls.get(callId);
    const stream = call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
    if (!stream) return;
    return callClient.stopRenderVideo(callId, stream);
  };

  const onToggleVideo = (callId: string, videoDeviceInfo, options): Promise<void> | void => {
    const call = callClient.state.calls.get(callId);
    const stream = call?.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
    if (stream) {
      return onStopLocalVideo(callId);
    } else {
      return onStartLocalVideo(callId, videoDeviceInfo, options);
    }
  };

  return {
    getDeviceManager: () => callClient.getDeviceManager(),
    onStartLocalVideo,
    onStopLocalVideo,
    onToggleVideo
  };
});

export const createCallAgentDefaultHandlers = memoizeOne((callAgent: CallAgent) => {
  return {
    onStartCall: (
      participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
      options?: StartCallOptions
    ): Call => callAgent.startCall(participants, options)
  };
});

export const createDeviceManagerDefaultHandlers = memoizeOne((deviceManager: DeviceManager) => {
  return {
    getCameras: (): Promise<VideoDeviceInfo[]> => deviceManager.getCameras(),
    getMicrophones: (): Promise<AudioDeviceInfo[]> => deviceManager.getMicrophones(),
    getSpeakers: (): Promise<AudioDeviceInfo[]> => deviceManager.getSpeakers(),
    onSelectMicrophone: (audioDeviceInfo) => deviceManager.selectMicrophone(audioDeviceInfo),
    onSelectSpeaker: (audioDeviceInfo) => deviceManager.selectSpeaker(audioDeviceInfo)
  };
});

export const createCallDefaultHandlers = memoizeOne((call: Call) => {
  const onSelectCamera = (videoDeviceInfo: VideoDeviceInfo): Promise<void> | undefined => {
    const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
    return stream?.switchSource(videoDeviceInfo);
  };

  const onStartScreenShare = (): Promise<void> => {
    return call.startScreenSharing();
  };

  const onStopScreenShare = (): Promise<void> => {
    return call.stopScreenSharing();
  };

  return {
    onHangUp: (options?: HangUpOptions): Promise<void> => call.hangUp(options),
    onMute: (): Promise<void> => call.mute(),
    onUnmute: (): Promise<void> => call.unmute(),
    onSelectCamera,
    onStartScreenShare,
    onStopScreenShare,
    toggleMicrophone: (): Promise<void> => (call.isMuted ? call.unmute() : call.mute())
  };
});

/**
 * Type guard for common properties between two types.
 */
export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
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
export const createDefaultHandlersForComponent = memoizeOne(
  <Props>(
    declarativeCallClient: DeclarativeCallClient,
    callAgent: CallAgent | undefined,
    deviceManager: DeviceManager | undefined,
    call: Call | undefined,
    _: (props: Props) => ReactElement | null
  ):
    | Common<CallClientHandlers & CallAgentHandlers & DeviceManagerHandlers & CallHandlers, Props>
    | Common<CallClientHandlers, Props> => {
    const callClientHandlers = createCallClientDefaultHandlers(declarativeCallClient);
    const callAgentHandlers = callAgent ? createCallAgentDefaultHandlers(callAgent) : undefined;
    const deviceManagerHandlers = deviceManager ? createDeviceManagerDefaultHandlers(deviceManager) : undefined;
    const callHandlers = call ? createCallDefaultHandlers(call) : undefined;
    return {
      ...callClientHandlers,
      ...callAgentHandlers,
      ...deviceManagerHandlers,
      ...callHandlers
    };
  }
);
