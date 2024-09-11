// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatAdapter } from './CallWithChatAdapter';
import { CallAdapter, CallAdapterState } from '../../CallComposite';

import { VideoBackgroundImage, VideoBackgroundEffect } from '../../CallComposite';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  StartCallOptions
} from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier, isPhoneNumberIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(one-to-n-calling) */
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  JoinCallOptions,
  StartCallIdentifier,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from '../../CallComposite/adapter/CallAdapter';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';

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
  public joinCall = (options?: boolean | JoinCallOptions): Call | undefined => {
    if (typeof options === 'boolean') {
      return this.callWithChatAdapter.joinCall(options);
    } else {
      return this.callWithChatAdapter.joinCall(options);
    }
  };
  public leaveCall = async (forEveryone?: boolean): Promise<void> =>
    await this.callWithChatAdapter.leaveCall(forEveryone);

  public startCall = (participants: (string | StartCallIdentifier)[], options: StartCallOptions): Call | undefined => {
    if (participants.every((participant: string | StartCallIdentifier) => typeof participant === 'string')) {
      return this.callWithChatAdapter.startCall(participants as string[], options);
    } else {
      return this.callWithChatAdapter.startCall(participants as StartCallIdentifier[], options);
    }
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
  public raiseHand = async (): Promise<void> => await this.callWithChatAdapter.raiseHand();
  public lowerHand = async (): Promise<void> => await this.callWithChatAdapter.lowerHand();
  public onReactionClick = async (reaction: Reaction): Promise<void> =>
    await this.callWithChatAdapter.onReactionClick(reaction);
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
  public disposeScreenShareStreamView(remoteUserId: string): Promise<void> {
    return this.callWithChatAdapter.disposeScreenShareStreamView(remoteUserId);
  }
  public disposeRemoteVideoStreamView(remoteUserId: string): Promise<void> {
    return this.callWithChatAdapter.disposeRemoteVideoStreamView(remoteUserId);
  }
  public disposeLocalVideoStreamView(): Promise<void> {
    return this.callWithChatAdapter.disposeLocalVideoStreamView();
  }
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

  public sendDtmfTone = async (dtmfTone: DtmfTone): Promise<void> => {
    await this.callWithChatAdapter.sendDtmfTone(dtmfTone);
  };

  public async startCaptions(options?: StartCaptionsAdapterOptions): Promise<void> {
    await this.callWithChatAdapter.startCaptions(options);
  }

  public async stopCaptions(options?: StopCaptionsAdapterOptions): Promise<void> {
    await this.callWithChatAdapter.stopCaptions(options);
  }

  public async setCaptionLanguage(language: string): Promise<void> {
    await this.callWithChatAdapter.setCaptionLanguage(language);
  }

  public async setSpokenLanguage(language: string): Promise<void> {
    await this.callWithChatAdapter.setSpokenLanguage(language);
  }

  public async startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void> {
    await this.callWithChatAdapter.startVideoBackgroundEffect(videoBackgroundEffect);
  }

  public async stopVideoBackgroundEffects(): Promise<void> {
    await this.callWithChatAdapter.stopVideoBackgroundEffects();
  }

  public updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void {
    return this.callWithChatAdapter.updateBackgroundPickerImages(backgroundImages);
  }

  public updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void {
    return this.callWithChatAdapter.updateSelectedVideoBackgroundEffect(selectedVideoBackground);
  }

  /* @conditional-compile-remove(DNS) */
  public async startNoiseSuppressionEffect(): Promise<void> {
    return this.callWithChatAdapter.startNoiseSuppressionEffect();
  }

  /* @conditional-compile-remove(DNS) */
  public async stopNoiseSuppressionEffect(): Promise<void> {
    return this.callWithChatAdapter.stopNoiseSuppressionEffect();
  }

  public async submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    return this.callWithChatAdapter.submitSurvey(survey);
  }

  public async startSpotlight(userIds?: string[]): Promise<void> {
    return this.callWithChatAdapter.startSpotlight(userIds);
  }

  public async stopSpotlight(userIds?: string[]): Promise<void> {
    return this.callWithChatAdapter.stopSpotlight(userIds);
  }

  public async stopAllSpotlight(): Promise<void> {
    return this.callWithChatAdapter.stopAllSpotlight();
  }

  /* @conditional-compile-remove(soft-mute) */
  public async muteParticipant(userId: string): Promise<void> {
    return this.callWithChatAdapter.muteParticipant(userId);
  }

  /* @conditional-compile-remove(soft-mute) */
  public async muteAllRemoteParticipants(): Promise<void> {
    return this.callWithChatAdapter.muteAllRemoteParticipants();
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public async returnFromBreakoutRoom(): Promise<void> {
    return this.callWithChatAdapter.returnFromBreakoutRoom();
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
    isTeamsMeeting: callWithChatAdapterState.isTeamsMeeting,
    isRoomsCall: false,
    latestErrors: callWithChatAdapterState.latestCallErrors,
    /* @conditional-compile-remove(breakout-rooms) */
    latestNotifications: callWithChatAdapterState.latestCallNotifications,
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId: callWithChatAdapterState.alternateCallerId,
    /* @conditional-compile-remove(unsupported-browser) */
    environmentInfo: callWithChatAdapterState.environmentInfo,

    videoBackgroundImages: callWithChatAdapterState.videoBackgroundImages,

    onResolveVideoEffectDependency: callWithChatAdapterState.onResolveVideoEffectDependency,
    /* @conditional-compile-remove(DNS) */
    onResolveDeepNoiseSuppressionDependency: callWithChatAdapterState.onResolveDeepNoiseSuppressionDependency,
    /* @conditional-compile-remove(DNS) */
    deepNoiseSuppressionOnByDefault: callWithChatAdapterState.deepNoiseSuppressionOnByDefault,
    /* @conditional-compile-remove(DNS) */
    hideDeepNoiseSuppressionButton: callWithChatAdapterState.hideDeepNoiseSuppressionButton,
    selectedVideoBackgroundEffect: callWithChatAdapterState.selectedVideoBackgroundEffect,
    reactions: callWithChatAdapterState.reactions
  };
}
