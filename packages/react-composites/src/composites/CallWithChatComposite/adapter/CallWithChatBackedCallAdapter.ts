// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallWithChatAdapter } from './CallWithChatAdapter';
import { CallAdapter, CallAdapterState } from '../../CallComposite';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  StartCallOptions
} from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier } from '@azure/communication-common';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Facade around the CallWithChatAdapter to satisfy the call adapter interface.
 *
 * @private
 */
export class CallWithChatBackedCallAdapter implements CallAdapter {
  private callWithChatAdapter: CallWithChatAdapter;

  // For onStateChange we must convert CallWithChat state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: CallAdapterState) => void, (state: CallWithChatAdapterState) => void> = new Map();

  constructor(callWithChatAdapter: CallWithChatAdapter) {
    this.callWithChatAdapter = callWithChatAdapter;
  }
  public on = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callWithChatAdapter.on('callError', listener);
      case 'participantsJoined':
        return this.callWithChatAdapter.on('callParticipantsJoined', listener);
      case 'participantsLeft':
        return this.callWithChatAdapter.on('callParticipantsLeft', listener);
      default:
        return this.callWithChatAdapter.on(event, listener);
    }
  };
  public off = (event: any, listener: any): void => {
    switch (event) {
      case 'error':
        return this.callWithChatAdapter.off('callError', listener);
      case 'participantsJoined':
        return this.callWithChatAdapter.off('callParticipantsJoined', listener);
      case 'participantsLeft':
        return this.callWithChatAdapter.off('callParticipantsLeft', listener);
      default:
        return this.callWithChatAdapter.off(event, listener);
    }
  };
  public onStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = (state: CallWithChatAdapterState): void => {
      handler(callAdapterStateFromCallWithChatAdapterState(state));
    };
    this.callWithChatAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.callWithChatAdapter.offStateChange(convertedHandler);
  };
  public getState = (): CallAdapterState =>
    callAdapterStateFromCallWithChatAdapterState(this.callWithChatAdapter.getState());
  public dispose = (): void => this.callWithChatAdapter.dispose();
  public joinCall = (microphoneOn?: boolean): Call | undefined => {
    return this.callWithChatAdapter.joinCall(microphoneOn);
  };
  public leaveCall = async (): Promise<void> => await this.callWithChatAdapter.leaveCall();
  public startCall = (participants: string[], options: StartCallOptions): Call | undefined => {
    return this.callWithChatAdapter.startCall(participants, options);
  };
  public setCamera = async (sourceId: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> =>
    await this.callWithChatAdapter.setCamera(sourceId, options);
  public setMicrophone = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.callWithChatAdapter.setMicrophone(sourceId);
  public setSpeaker = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.callWithChatAdapter.setSpeaker(sourceId);
  public askDevicePermission = async (constraints: PermissionConstraints): Promise<void> =>
    await this.callWithChatAdapter.askDevicePermission(constraints);
  public queryCameras = async (): Promise<VideoDeviceInfo[]> => await this.callWithChatAdapter.queryCameras();
  public queryMicrophones = async (): Promise<AudioDeviceInfo[]> => await this.callWithChatAdapter.queryMicrophones();
  public querySpeakers = async (): Promise<AudioDeviceInfo[]> => await this.callWithChatAdapter.querySpeakers();
  public startCamera = async (options?: VideoStreamOptions): Promise<void> =>
    await this.callWithChatAdapter.startCamera(options);
  public stopCamera = async (): Promise<void> => await this.callWithChatAdapter.stopCamera();
  public mute = async (): Promise<void> => await this.callWithChatAdapter.mute();
  public unmute = async (): Promise<void> => await this.callWithChatAdapter.unmute();
  public startScreenShare = async (): Promise<void> => await this.callWithChatAdapter.startScreenShare();
  public stopScreenShare = async (): Promise<void> => await this.callWithChatAdapter.stopScreenShare();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.callWithChatAdapter.removeParticipant(userId);
  public createStreamView = async (
    remoteUserId?: string,
    options?: VideoStreamOptions
  ): Promise<void | CreateVideoStreamViewResult> =>
    await this.callWithChatAdapter.createStreamView(remoteUserId, options);
  public disposeStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.callWithChatAdapter.disposeStreamView(remoteUserId, options);
  /* @conditional-compile-remove(PSTN-calls) */
  public holdCall = async (): Promise<void> => {
    await this.callWithChatAdapter.holdCall();
  };
  /* @conditional-compile-remove(PSTN-calls) */
  public resumeCall = async (): Promise<void> => {
    await this.callWithChatAdapter.resumeCall();
  };
  /* @conditional-compile-remove(PSTN-calls) */
  public addParticipant = async (
    participant: CommunicationIdentifier,
    options?: AddPhoneNumberOptions
  ): Promise<void> => {
    await this.callWithChatAdapter.addParticipant(participant, options);
  };
}

function callAdapterStateFromCallWithChatAdapterState(
  callWithChatAdapterState: CallWithChatAdapterState
): CallAdapterState {
  return {
    isLocalPreviewMicrophoneEnabled: callWithChatAdapterState.isLocalPreviewMicrophoneEnabled,
    page: callWithChatAdapterState.page,
    userId: callWithChatAdapterState.userId,
    displayName: callWithChatAdapterState.displayName,
    call: callWithChatAdapterState.call,
    devices: callWithChatAdapterState.devices,
    isTeamsCall: callWithChatAdapterState.isTeamsCall,
    latestErrors: callWithChatAdapterState.latestCallErrors
  };
}
