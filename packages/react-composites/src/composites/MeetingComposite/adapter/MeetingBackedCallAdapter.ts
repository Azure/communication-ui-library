// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAndChatAdapter } from './MeetingAdapter';
import { CallAdapter, CallAdapterState } from '../../CallComposite';
import { VideoStreamOptions } from '@internal/react-components';
import { AudioDeviceInfo, VideoDeviceInfo, Call, PermissionConstraints } from '@azure/communication-calling';
import { CallAndChatAdapterState } from '../state/MeetingAdapterState';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Facade around the MeetingAdapter to satisfy the call adapter interface.
 *
 * @private
 */
export class CallAndChatBackedCallAdapter implements CallAdapter {
  private callAndChatAdapter: CallAndChatAdapter;

  // For onStateChange we must convert CallAndChat state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: CallAdapterState) => void, (state: CallAndChatAdapterState) => void> = new Map();

  constructor(callAndChatAdapter: CallAndChatAdapter) {
    this.callAndChatAdapter = callAndChatAdapter;
  }
  public on = (event: any, listener: any): void => this.callAndChatAdapter.on(event, listener);
  public off = (event: any, listener: any): void => this.callAndChatAdapter.off(event, listener);
  public onStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = (state: CallAndChatAdapterState): void => {
      handler(callAdapterStateFromCallAndChatAdapterState(state));
    };
    this.callAndChatAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.callAndChatAdapter.offStateChange(convertedHandler);
  };
  public getState = (): CallAdapterState =>
    callAdapterStateFromCallAndChatAdapterState(this.callAndChatAdapter.getState());
  public dispose = (): void => this.callAndChatAdapter.dispose();
  public joinCall = (microphoneOn?: boolean): Call | undefined => {
    return this.callAndChatAdapter.joinCall(microphoneOn);
  };
  public leaveCall = async (): Promise<void> => await this.callAndChatAdapter.leaveCall();
  public startCall = (participants: string[]): Call | undefined => {
    return this.callAndChatAdapter.startCall(participants);
  };
  public setCamera = async (sourceId: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> =>
    await this.callAndChatAdapter.setCamera(sourceId, options);
  public setMicrophone = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.callAndChatAdapter.setMicrophone(sourceId);
  public setSpeaker = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.callAndChatAdapter.setSpeaker(sourceId);
  public askDevicePermission = async (constraints: PermissionConstraints): Promise<void> =>
    await this.callAndChatAdapter.askDevicePermission(constraints);
  public queryCameras = async (): Promise<VideoDeviceInfo[]> => await this.callAndChatAdapter.queryCameras();
  public queryMicrophones = async (): Promise<AudioDeviceInfo[]> => await this.callAndChatAdapter.queryMicrophones();
  public querySpeakers = async (): Promise<AudioDeviceInfo[]> => await this.callAndChatAdapter.querySpeakers();
  public startCamera = async (options?: VideoStreamOptions): Promise<void> =>
    await this.callAndChatAdapter.startCamera(options);
  public stopCamera = async (): Promise<void> => await this.callAndChatAdapter.stopCamera();
  public mute = async (): Promise<void> => await this.callAndChatAdapter.mute();
  public unmute = async (): Promise<void> => await this.callAndChatAdapter.unmute();
  public startScreenShare = async (): Promise<void> => await this.callAndChatAdapter.startScreenShare();
  public stopScreenShare = async (): Promise<void> => await this.callAndChatAdapter.stopScreenShare();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.callAndChatAdapter.removeParticipant(userId);
  public createStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.callAndChatAdapter.createStreamView(remoteUserId, options);
  public disposeStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.callAndChatAdapter.disposeStreamView(remoteUserId, options);
}

function callAdapterStateFromCallAndChatAdapterState(
  callAndChatAdapterState: CallAndChatAdapterState
): CallAdapterState {
  return {
    isLocalPreviewMicrophoneEnabled: callAndChatAdapterState.isLocalPreviewMicrophoneEnabled,
    page: callAndChatAdapterState.page,
    userId: callAndChatAdapterState.userId,
    displayName: callAndChatAdapterState.displayName,
    call: callAndChatAdapterState.call,
    devices: callAndChatAdapterState.devices,
    isTeamsCall: callAndChatAdapterState.isTeamsCall,
    latestErrors: {} //@TODO: latest errors not supported in CallAndChatComposite yet.
  };
}
