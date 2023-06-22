// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallWithChatAdapter } from './CallWithChatAdapter';
import { CallAdapter, CallAdapterState } from '../../CallComposite';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundImage, SelectedVideoBackgroundEffect } from '../../CallComposite';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  StartCallOptions
} from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { StartCaptionsOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions, DtmfTone } from '@azure/communication-calling';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
/* @conditional-compile-remove(PSTN-calls) */
import {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  isPhoneNumberIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(video-background-effects) */
import { BackgroundBlurConfig, BackgroundReplacementConfig } from '@azure/communication-calling-effects';

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
  public leaveCall = async (forEveryone?: boolean): Promise<void> =>
    await this.callWithChatAdapter.leaveCall(forEveryone);
  public startCall = (
    participants: string[] | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier[],
    options: StartCallOptions
  ): Call | undefined => {
    let communicationParticipants = participants;
    /* @conditional-compile-remove(PSTN-calls) */
    communicationParticipants = participants.map(_toCommunicationIdentifier);
    return this.callWithChatAdapter.startCall(communicationParticipants, options);
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
  /* @conditional-compile-remove(raise-hands) */
  public raiseHand = async (): Promise<void> => await this.callWithChatAdapter.raiseHand();
  /* @conditional-compile-remove(raise-hands) */
  public lowerHand = async (): Promise<void> => await this.callWithChatAdapter.lowerHand();
  /* @conditional-compile-remove(raise-hands) */
  public lowerHands = async (userIds: string[]): Promise<void> => await this.callWithChatAdapter.lowerHands(userIds);
  public removeParticipant = async (
    userId: string | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier
  ): Promise<void> => {
    let participant = userId;
    /* @conditional-compile-remove(PSTN-calls) */
    participant = _toCommunicationIdentifier(userId);
    await this.callWithChatAdapter.removeParticipant(participant);
  };
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
  public async addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(
    participant: PhoneNumberIdentifier | CommunicationUserIdentifier,
    options?: AddPhoneNumberOptions
  ): Promise<void> {
    if (isPhoneNumberIdentifier(participant) && options) {
      return this.callWithChatAdapter.addParticipant(participant as PhoneNumberIdentifier, options);
    } else {
      return this.callWithChatAdapter.addParticipant(participant as CommunicationUserIdentifier);
    }
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public allowUnsupportedBrowserVersion(): void {
    return this.callWithChatAdapter.allowUnsupportedBrowserVersion();
  }

  /* @conditional-compile-remove(PSTN-calls) */
  public sendDtmfTone = async (dtmfTone: DtmfTone): Promise<void> => {
    await this.callWithChatAdapter.sendDtmfTone(dtmfTone);
  };

  /* @conditional-compile-remove(close-captions) */
  public async startCaptions(options?: StartCaptionsOptions): Promise<void> {
    this.callWithChatAdapter.startCaptions(options);
  }

  /* @conditional-compile-remove(close-captions) */
  public async stopCaptions(): Promise<void> {
    this.callWithChatAdapter.stopCaptions();
  }

  /* @conditional-compile-remove(close-captions) */
  public async setCaptionLanguage(language: string): Promise<void> {
    this.callWithChatAdapter.setCaptionLanguage(language);
  }

  /* @conditional-compile-remove(close-captions) */
  public async setSpokenLanguage(language: string): Promise<void> {
    this.callWithChatAdapter.setSpokenLanguage(language);
  }

  /* @conditional-compile-remove(video-background-effects) */
  public async blurVideoBackground(backgroundBlurConfig?: BackgroundBlurConfig): Promise<void> {
    await this.callWithChatAdapter.blurVideoBackground(backgroundBlurConfig);
  }
  /* @conditional-compile-remove(video-background-effects) */
  public async replaceVideoBackground(backgroundReplacementConfig: BackgroundReplacementConfig): Promise<void> {
    await this.callWithChatAdapter.replaceVideoBackground(backgroundReplacementConfig);
  }
  /* @conditional-compile-remove(video-background-effects) */
  public async stopVideoBackgroundEffects(): Promise<void> {
    await this.callWithChatAdapter.stopVideoBackgroundEffects();
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void {
    return this.callWithChatAdapter.updateBackgroundPickerImages(backgroundImages);
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateSelectedVideoBackgroundEffect(selectedVideoBackground: SelectedVideoBackgroundEffect): void {
    return this.callWithChatAdapter.updateSelectedVideoBackgroundEffect(selectedVideoBackground);
  }
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
    latestErrors: callWithChatAdapterState.latestCallErrors,
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId: callWithChatAdapterState.alternateCallerId,
    /* @conditional-compile-remove(unsupported-browser) */
    environmentInfo: callWithChatAdapterState.environmentInfo,
    /* @conditional-compile-remove(video-background-effects) */
    videoBackgroundImages: callWithChatAdapterState.videoBackgroundImages,
    /* @conditional-compile-remove(video-background-effects) */
    selectedVideoBackgroundEffect: callWithChatAdapterState.selectedVideoBackgroundEffect
  };
}
