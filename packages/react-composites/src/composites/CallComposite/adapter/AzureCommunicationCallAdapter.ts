// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { compositeLogger } from '../../../Logger';
import { _isInCall, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import {
  CallClientState,
  CallError,
  CallState,
  createStatefulCallClient,
  StatefulCallClient,
  StatefulDeviceManager,
  TeamsCall,
  TeamsCallAgent as BetaTeamsCallAgent,
  _isACSCall,
  _isTeamsCall
} from '@internal/calling-stateful-client';
/* @conditional-compile-remove(call-transfer) */
import { AcceptedTransfer } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(teams-identity-support) */
import { _isTeamsCallAgent } from '@internal/calling-stateful-client';
import { CallCommon } from '@internal/calling-stateful-client';
import {
  AudioOptions,
  CallAgent,
  GroupCallLocator,
  TeamsMeetingLinkLocator,
  LocalVideoStream as SDKLocalVideoStream,
  AudioDeviceInfo,
  VideoDeviceInfo,
  RemoteParticipant,
  PermissionConstraints,
  PropertyChangedEvent,
  StartCallOptions,
  VideoOptions,
  Call
} from '@azure/communication-calling';
/* @conditional-compile-remove(call-transfer) */
import { AcceptTransferOptions, LocalVideoStream, TransferRequestedEventArgs } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { StartCaptionsOptions, TeamsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { BackgroundBlurConfig, BackgroundReplacementConfig } from '@azure/communication-calling-effects';
/* @conditional-compile-remove(teams-identity-support)) */
import { TeamsCallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { RoomCallLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { Features } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions, DtmfTone } from '@azure/communication-calling';
import { EventEmitter } from 'events';
import {
  CommonCallAdapter,
  CallEndedListener,
  CallIdChangedListener,
  CallAdapterState,
  DisplayNameChangedListener,
  IsMutedChangedListener,
  IsLocalScreenSharingActiveChangedListener,
  IsSpeakingChangedListener,
  ParticipantsJoinedListener,
  ParticipantsLeftListener,
  DiagnosticChangedEventListner,
  CallAdapterCallEndedEvent,
  CallAdapter
} from './CallAdapter';
/* @conditional-compile-remove(call-transfer) */
import { TransferRequestedListener } from './CallAdapter';
/* @conditional-compile-remove(close-captions) */
import { CaptionsReceivedListener, IsCaptionsActiveChangedListener } from './CallAdapter';
/* @conditional-compile-remove(video-background-effects) */
import {
  VideoBackgroundImage,
  VideoBackgroundEffect,
  VideoBackgroundBlurEffect,
  VideoBackgroundReplacementEffect
} from './CallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCallAdapter } from './CallAdapter';
import { getCallCompositePage, IsCallEndedPage, isCameraOn } from '../utils';
/* @conditional-compile-remove(close-captions) */
import { _isTeamsMeetingCall } from '@internal/calling-stateful-client';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { Role } from '@internal/react-components';
import { toFlatCommunicationIdentifier, _toCommunicationIdentifier, _isValidIdentifier } from '@internal/acs-ui-common';
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  isCommunicationUserIdentifier,
  isPhoneNumberIdentifier,
  UnknownIdentifier,
  PhoneNumberIdentifier,
  CommunicationIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import { ParticipantSubscriber } from './ParticipantSubcriber';
import { AdapterError } from '../../common/adapters';
import { DiagnosticsForwarder } from './DiagnosticsForwarder';
import { useEffect, useRef, useState } from 'react';
import { CallHandlersOf, createHandlers } from './createHandlers';
import { createProfileStateModifier, OnFetchProfileCallback } from './OnFetchProfileCallback';
/* @conditional-compile-remove(video-background-effects) */
import { getBackgroundEffectFromSelectedEffect, getSelectedCameraFromAdapterState } from '../utils';

type CallTypeOf<AgentType extends CallAgent | BetaTeamsCallAgent> = AgentType extends CallAgent ? Call : TeamsCall;

/** Context of call, which is a centralized context for all state updates */
class CallContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: CallAdapterState;
  private callId: string | undefined;
  private displayNameModifier: AdapterStateModifier | undefined;

  constructor(
    clientState: CallClientState,
    isTeamsCall: boolean,
    options?: {
      /* @conditional-compile-remove(rooms) */ roleHint?: Role;
      maxListeners?: number;
      onFetchProfile?: OnFetchProfileCallback;
      /* @conditional-compile-remove(video-background-effects) */ videoBackgroundImages?: VideoBackgroundImage[];
    }
  ) {
    this.state = {
      isLocalPreviewMicrophoneEnabled: false,
      userId: clientState.userId,
      displayName: clientState.callAgent?.displayName,
      devices: clientState.deviceManager,
      call: undefined,
      page: 'configuration',
      latestErrors: clientState.latestErrors,
      isTeamsCall,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId: clientState.alternateCallerId,
      /* @conditional-compile-remove(unsupported-browser) */ environmentInfo: clientState.environmentInfo,
      /* @conditional-compile-remove(unsupported-browser) */ unsupportedBrowserVersionsAllowed: false,
      /* @conditional-compile-remove(rooms) */ roleHint: options?.roleHint,
      /* @conditional-compile-remove(video-background-effects) */ videoBackgroundImages: options?.videoBackgroundImages,
      /* @conditional-compile-remove(video-background-effects) */ selectedVideoBackgroundEffect: undefined,
      cameraStatus: undefined
    };
    this.emitter.setMaxListeners(options?.maxListeners ?? 50);
    this.bindPublicMethods();
    this.displayNameModifier = options?.onFetchProfile
      ? createProfileStateModifier(options.onFetchProfile, () => {
          this.setState(this.getState());
        })
      : undefined;
  }

  private bindPublicMethods(): void {
    /* @conditional-compile-remove(unsupported-browser) */
    this.setAllowedUnsupportedBrowser.bind(this);
  }

  public onStateChange(handler: (_uiState: CallAdapterState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: CallAdapterState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: CallAdapterState): void {
    this.state = this.displayNameModifier ? this.displayNameModifier(state) : state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): CallAdapterState {
    return this.state;
  }

  public setIsLocalMicrophoneEnabled(isLocalPreviewMicrophoneEnabled: boolean): void {
    this.setState({ ...this.state, isLocalPreviewMicrophoneEnabled });
  }

  // This is the key to find current call object in client state
  public setCurrentCallId(callId: string | undefined): void {
    this.callId = callId;
  }

  public onCallEnded(handler: (callEndedData: CallAdapterCallEndedEvent) => void): void {
    this.emitter.on('callEnded', handler);
  }

  public offCallEnded(handler: (callEndedData: CallAdapterCallEndedEvent) => void): void {
    this.emitter.off('callEnded', handler);
  }

  public updateClientState(clientState: CallClientState): void {
    let call = this.callId ? clientState.calls[this.callId] : undefined;
    const latestEndedCall = clientState.callsEnded ? findLatestEndedCall(clientState.callsEnded) : undefined;
    // As the state is transitioning to a new state, trigger appropriate callback events.
    const oldPage = this.state.page;
    /* @conditional-compile-remove(unsupported-browser) */
    const environmentInfo = {
      environmentInfo: this.state.environmentInfo,
      unsupportedBrowserVersionOptedIn: this.state.unsupportedBrowserVersionsAllowed
    };

    /* @conditional-compile-remove(call-transfer) */
    const latestAcceptedTransfer = call?.transfer.acceptedTransfers
      ? findLatestAcceptedTransfer(call.transfer.acceptedTransfers)
      : undefined;
    /* @conditional-compile-remove(call-transfer) */
    const transferCall = latestAcceptedTransfer ? clientState.calls[latestAcceptedTransfer.callId] : undefined;

    const newPage = getCallCompositePage(
      call,
      latestEndedCall,
      /* @conditional-compile-remove(unsupported-browser) */ environmentInfo,
      /* @conditional-compile-remove(call-transfer) */ transferCall
    );
    if (!IsCallEndedPage(oldPage) && IsCallEndedPage(newPage)) {
      this.emitter.emit('callEnded', { callId: this.callId });
      // Reset the callId to undefined as the call has ended.
      this.setCurrentCallId(undefined);
      // Make sure that the call is set to undefined in the state.
      call = undefined;
    }

    if (this.state.page) {
      this.setState({
        ...this.state,
        userId: clientState.userId,
        displayName: clientState.callAgent?.displayName,
        call,
        page: newPage,
        endedCall: latestEndedCall,
        devices: clientState.deviceManager,
        latestErrors: clientState.latestErrors,
        cameraStatus:
          call?.localVideoStreams.find((s) => s.mediaStreamType === 'Video') ||
          clientState.deviceManager.unparentedViews.find((s) => s.mediaStreamType === 'Video')
            ? 'On'
            : 'Off',
        /* @conditional-compile-remove(call-transfer) */ acceptedTransferCallState: transferCall
      });
    }
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public setAllowedUnsupportedBrowser(): void {
    this.setState({ ...this.state, unsupportedBrowserVersionsAllowed: true });
  }

  /* @conditional-compile-remove(video-background-effects) */
  public setBackroundPickerImages(videoBackgroundImages: VideoBackgroundImage[]): void {
    this.setState({ ...this.state, videoBackgroundImages });
  }

  /* @conditional-compile-remove(video-background-effects) */
  public setSelectedVideoBackgroundEffect(selectedVideoBackgroundEffect?: VideoBackgroundEffect): void {
    this.setState({ ...this.state, selectedVideoBackgroundEffect });
  }

  /* @conditional-compile-remove(call-transfer) */
  public setAcceptedTransferCall(call?: CallState): void {
    this.setState({ ...this.state, acceptedTransferCallState: call });
  }
}

const findLatestEndedCall = (calls: { [key: string]: CallState }): CallState | undefined => {
  const callStates = Object.values(calls);
  if (callStates.length === 0) {
    return undefined;
  }
  let latestCall = callStates[0];
  for (const call of callStates.slice(1)) {
    if ((call.endTime?.getTime() ?? 0) > (latestCall.endTime?.getTime() ?? 0)) {
      latestCall = call;
    }
  }
  return latestCall;
};

/* @conditional-compile-remove(call-transfer) */
const findLatestAcceptedTransfer = (acceptedTransfers: {
  [key: string]: AcceptedTransfer;
}): AcceptedTransfer | undefined => {
  const acceptedTransferValues = Object.values(acceptedTransfers);
  if (acceptedTransferValues.length === 0) {
    return undefined;
  }
  let latestAcceptedTransfer = acceptedTransferValues[0];
  for (const acceptedTransfer of acceptedTransferValues.slice(1)) {
    if ((acceptedTransfer.timestamp?.getTime() ?? 0) > (latestAcceptedTransfer.timestamp?.getTime() ?? 0)) {
      latestAcceptedTransfer = acceptedTransfer;
    }
  }
  return latestAcceptedTransfer;
};

/**
 * @private
 */
export type AdapterStateModifier = (state: CallAdapterState) => CallAdapterState;

/**
 * @private
 */
export class AzureCommunicationCallAdapter<AgentType extends CallAgent | BetaTeamsCallAgent = CallAgent>
  implements CommonCallAdapter
{
  private callClient: StatefulCallClient;
  private callAgent: AgentType;
  private deviceManager: StatefulDeviceManager;
  private localStream: SDKLocalVideoStream | undefined;
  private locator: CallAdapterLocator;
  // Never use directly, even internally. Use `call` property instead.
  private _call?: CallCommon;
  private context: CallContext;
  private diagnosticsForwarder?: DiagnosticsForwarder;
  private handlers: CallHandlersOf<AgentType>;
  private participantSubscribers = new Map<string, ParticipantSubscriber>();
  private emitter: EventEmitter = new EventEmitter();
  private onClientStateChange: (clientState: CallClientState) => void;

  private get call(): CallCommon | undefined {
    return this._call;
  }

  private set call(newCall: CallCommon | undefined) {
    this.resetDiagnosticsForwarder(newCall);
    this._call = newCall;
  }

  constructor(
    callClient: StatefulCallClient,
    locator: CallAdapterLocator,
    callAgent: AgentType,
    deviceManager: StatefulDeviceManager,
    options?: AzureCommunicationCallAdapterOptions & TeamsAdapterOptions
  ) {
    this.bindPublicMethods();
    this.callClient = callClient;
    this.callAgent = callAgent;
    this.locator = locator;
    this.deviceManager = deviceManager;
    const isTeamsMeeting = 'meetingLink' in this.locator;

    /* @conditional-compile-remove(rooms) */
    const isRoomsCall = 'roomId' in this.locator;
    /* @conditional-compile-remove(rooms) */
    // to prevent showing components that depend on role such as local video tile, camera button, etc. in a rooms call
    // we set the default roleHint as 'Consumer' when roleHint is undefined since it has the lowest level of permissions
    if (isRoomsCall && options?.roleHint === undefined) {
      options = { ...options, roleHint: 'Consumer' };
    }

    this.context = new CallContext(callClient.getState(), isTeamsMeeting, options);

    this.context.onCallEnded((endCallData) => this.emitter.emit('callEnded', endCallData));

    const onStateChange = (clientState: CallClientState): void => {
      // unsubscribe when the instance gets disposed
      if (!this) {
        callClient.offStateChange(onStateChange);
        return;
      }

      // `updateClientState` searches for the current call from all the calls in the state using a cached `call.id`
      // from the call object. `call.id` can change during a call. We must update the cached `call.id` before
      // calling `updateClientState` so that we find the correct state object for the call even when `call.id`
      // has changed.
      // https://github.com/Azure/communication-ui-library/pull/1820
      if (this.call?.id) {
        this.context.setCurrentCallId(this.call.id);
      }

      this.context.updateClientState(clientState);

      /* @conditional-compile-remove(call-transfer) */
      const acceptedTransferCallState = this.context.getState().acceptedTransferCallState;

      /* @conditional-compile-remove(call-transfer) */
      // TODO: Remove this if statement when Calling SDK prevents accepting transfer requests that have timed out
      // This is to handle the case when there has been an accepted transfer call that is now in the connected state
      // AND is not the current call. Ensure we leave the current call.
      if (
        acceptedTransferCallState &&
        acceptedTransferCallState.state === 'Connected' &&
        this.call?.id &&
        acceptedTransferCallState.id !== this.call.id
      ) {
        const cAgent = callAgent as CallAgent;
        const transferCall = cAgent.calls.find((call) => (call as Call).id === acceptedTransferCallState.id);
        if (transferCall) {
          const oldCall = this.call;
          this.processNewCall(transferCall);
          // Arbitrary wait time before hanging up. 2 seconds is derived from manual testing. This is to allow
          // transferor to hang up themselves. If the transferor has not hung up, we hang up because we are now
          // in the transfer call
          setTimeout(() => {
            if (oldCall?.state === 'Connected') {
              oldCall.hangUp();
            }
          }, 2000);
        }
      }
    };

    this.handlers = createHandlers(callClient, callAgent, deviceManager, undefined);

    this.onClientStateChange = onStateChange;

    this.subscribeDeviceManagerEvents();

    this.callClient.onStateChange(onStateChange);
    /* @conditional-compile-remove(call-transfer) */
    if (this.callAgent.kind === 'CallAgent') {
      const onCallsUpdated = (args: { added: Call[]; removed: Call[] }): void => {
        if (this.call?.id) {
          const removedCall = args.removed.find((call) => call.id === this.call?.id);
          if (removedCall) {
            const removedCallState = this.callClient.getState().callsEnded[removedCall.id];
            const latestAcceptedTransfer = findLatestAcceptedTransfer(removedCallState.transfer.acceptedTransfers);
            const _callAgent = callAgent as CallAgent;
            const transferCall = _callAgent.calls.find((call: Call) => call.id === latestAcceptedTransfer?.callId);
            if (transferCall) {
              this.processNewCall(transferCall);
            }
          }
        }
      };
      (this.callAgent as CallAgent).on('callsUpdated', onCallsUpdated);
    } else if (this.callAgent.kind === 'TeamsCallAgent') {
      const onTeamsCallsUpdated = (args: { added: TeamsCall[]; removed: TeamsCall[] }): void => {
        if (this.call?.id) {
          const removedCall = args.removed.find((call) => call.id === this.call?.id);
          if (removedCall) {
            const removedCallState = this.callClient.getState().callsEnded[removedCall.id];
            const latestAcceptedTransfer = findLatestAcceptedTransfer(removedCallState.transfer.acceptedTransfers);
            const _callAgent = callAgent as TeamsCallAgent;
            const transferCall = _callAgent.calls.find((call: TeamsCall) => call.id === latestAcceptedTransfer?.callId);
            if (transferCall) {
              this.processNewCall(transferCall);
            }
          }
        }
      };
      (this.callAgent as TeamsCallAgent).on('callsUpdated', onTeamsCallsUpdated);
    }
  }

  // TODO: update this to include the 'selectedCameraChanged' when calling adds it to the device manager
  private subscribeDeviceManagerEvents(): void {
    this.deviceManager.on('selectedMicrophoneChanged', () => {
      this.emitter.emit('selectedMicrophoneChanged');
    });
    this.deviceManager.on('selectedSpeakerChanged', () => {
      this.emitter.emit('selectedSpeakerChanged');
    });
  }

  private bindPublicMethods(): void {
    this.onStateChange.bind(this);
    this.offStateChange.bind(this);
    this.getState.bind(this);
    this.dispose.bind(this);
    this.joinCall.bind(this);
    this.leaveCall.bind(this);
    this.setCamera.bind(this);
    this.setMicrophone.bind(this);
    this.setSpeaker.bind(this);
    this.askDevicePermission.bind(this);
    this.queryCameras.bind(this);
    this.queryMicrophones.bind(this);
    this.querySpeakers.bind(this);
    this.startCamera.bind(this);
    this.stopCamera.bind(this);
    this.mute.bind(this);
    this.unmute.bind(this);
    this.startCall.bind(this);
    this.startScreenShare.bind(this);
    this.stopScreenShare.bind(this);
    this.removeParticipant.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    this.disposeScreenShareStreamView.bind(this);
    this.disposeRemoteVideoStreamView.bind(this);
    this.disposeLocalVideoStreamView.bind(this);
    this.on.bind(this);
    this.off.bind(this);
    this.processNewCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.addParticipant.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.holdCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.resumeCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.sendDtmfTone.bind(this);
    /* @conditional-compile-remove(unsupported-browser) */
    this.allowUnsupportedBrowserVersion.bind(this);
    /* @conditional-compile-remove(close-captions) */
    {
      this.startCaptions.bind(this);
      this.stopCaptions.bind(this);
      this.setSpokenLanguage.bind(this);
      this.setCaptionLanguage.bind(this);
    }
    /* @conditional-compile-remove(video-background-effects) */
    this.startVideoBackgroundEffect.bind(this);
    /* @conditional-compile-remove(video-background-effects) */
    this.stopVideoBackgroundEffects.bind(this);
    /* @conditional-compile-remove(video-background-effects) */
    this.updateBackgroundPickerImages.bind(this);
  }

  public dispose(): void {
    this.resetDiagnosticsForwarder();
    this.callClient.offStateChange(this.onClientStateChange);
    this.callAgent.dispose();
  }

  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    const startTime = new Date().getTime();
    return await this.asyncTeeErrorToEventEmitter(async () => {
      const cameras = await this.deviceManager.getCameras();
      const endTime = new Date().getTime();
      compositeLogger.info('time to query cameras', endTime - startTime, 'ms');
      return cameras;
    });
  }

  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    const startTime = new Date().getTime();
    return await this.asyncTeeErrorToEventEmitter(async () => {
      const microphones = await this.deviceManager.getMicrophones();
      const endTime = new Date().getTime();
      compositeLogger.info('time to query microphones', endTime - startTime, 'ms');
      return microphones;
    });
  }

  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    const startTime = new Date().getTime();
    return await this.asyncTeeErrorToEventEmitter(async () => {
      const speakers = (await this.deviceManager.isSpeakerSelectionAvailable) ? this.deviceManager.getSpeakers() : [];
      const endTime = new Date().getTime();
      compositeLogger.info('time to query speakers', endTime - startTime, 'ms');
      return speakers;
    });
  }

  public async askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    const startTime = new Date().getTime();
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.deviceManager.askDevicePermission(constrain);
      const endTime = new Date().getTime();
      compositeLogger.info('time to query askDevicePermissions', endTime - startTime, 'ms');
    });
  }

  public joinCall(microphoneOn?: boolean): CallTypeOf<AgentType> | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call!');
    }

    return this.teeErrorToEventEmitter(() => {
      const audioOptions: AudioOptions = { muted: !(microphoneOn ?? this.getState().isLocalPreviewMicrophoneEnabled) };
      // TODO: find a way to expose stream to here
      const videoOptions = { localVideoStreams: this.localStream ? [this.localStream] : undefined };
      /* @conditional-compile-remove(teams-adhoc-call) */
      /* @conditional-compile-remove(PSTN-calls) */
      if (isOutboundCall(this.locator)) {
        const phoneNumber = this.getState().alternateCallerId;
        return this.startCall(this.locator.participantIds, {
          alternateCallerId: phoneNumber ? { phoneNumber: phoneNumber } : undefined,
          audioOptions,
          videoOptions
        });
      }
      const call = this._joinCall(audioOptions, videoOptions);

      this.processNewCall(call);
      return call;
    });
  }

  private _joinCall(audioOptions: AudioOptions, videoOptions: VideoOptions): CallTypeOf<AgentType> {
    const isTeamsMeeting = 'meetingLink' in this.locator;
    /* @conditional-compile-remove(rooms) */
    const isRoomsCall = 'roomId' in this.locator;

    /* @conditional-compile-remove(teams-identity-support) */
    if (_isTeamsCallAgent(this.callAgent)) {
      if (!isTeamsMeeting) {
        throw new Error('Locator not supported by TeamsCallAgent');
      }

      return this.callAgent.join(this.locator as TeamsMeetingLinkLocator, {
        audioOptions,
        videoOptions
      }) as CallTypeOf<AgentType>;
    }
    if (isTeamsMeeting) {
      return this.callAgent.join(this.locator as TeamsMeetingLinkLocator, {
        audioOptions,
        videoOptions
      }) as CallTypeOf<AgentType>;
    }
    /* @conditional-compile-remove(rooms) */
    if (isRoomsCall) {
      return this.callAgent.join(this.locator as RoomCallLocator, {
        audioOptions,
        videoOptions
      }) as CallTypeOf<AgentType>;
    }
    return this.callAgent.join(this.locator as GroupCallLocator, {
      audioOptions,
      videoOptions
    }) as CallTypeOf<AgentType>;
  }

  public async createStreamView(
    remoteUserId?: string,
    options?: VideoStreamOptions
  ): Promise<void | CreateVideoStreamViewResult> {
    if (remoteUserId === undefined) {
      return await this.handlers.onCreateLocalStreamView(options);
    } else {
      return await this.handlers.onCreateRemoteStreamView(remoteUserId, options);
    }
  }

  public async disposeStreamView(remoteUserId?: string): Promise<void> {
    if (remoteUserId === undefined) {
      await this.handlers.onDisposeLocalStreamView();
    } else {
      await this.handlers.onDisposeRemoteStreamView(remoteUserId);
    }
  }

  public async disposeScreenShareStreamView(remoteUserId: string): Promise<void> {
    await this.handlers.onDisposeRemoteScreenShareStreamView(remoteUserId);
  }

  public async disposeRemoteVideoStreamView(remoteUserId: string): Promise<void> {
    await this.handlers.onDisposeRemoteVideoStreamView(remoteUserId);
  }

  public async disposeLocalVideoStreamView(): Promise<void> {
    await this.handlers.onDisposeLocalStreamView();
  }

  public async leaveCall(forEveryone?: boolean): Promise<void> {
    await this.handlers.onHangUp(forEveryone);
    this.unsubscribeCallEvents();
    this.handlers = createHandlers(this.callClient, this.callAgent, this.deviceManager, undefined);
    // We set the adapter.call object to undefined immediately when a call is ended.
    // We do not set the context.callId to undefined because it is a part of the immutable data flow loop.
    this.call = undefined;
    this.stopCamera();
    this.mute();
  }

  public async setCamera(device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onSelectCamera(device, options);
    });
  }

  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onSelectMicrophone(device);
    });
  }

  public async setSpeaker(device: AudioDeviceInfo): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onSelectSpeaker(device);
    });
  }

  public async startCamera(options?: VideoStreamOptions): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      if (!isCameraOn(this.getState())) {
        // First kick off the effect on the local device before starting the camera in the call.
        // This prevents the effect not being applied for a brief moment when the camera is started.
        /* @conditional-compile-remove(video-background-effects) */
        {
          const selectedEffect = this.getState().selectedVideoBackgroundEffect;
          const selectedCamera = getSelectedCameraFromAdapterState(this.getState());
          if (selectedEffect && selectedCamera) {
            const stream = new SDKLocalVideoStream(selectedCamera);
            const effect = getBackgroundEffectFromSelectedEffect(selectedEffect);

            if (effect) {
              await stream.feature(Features.VideoEffects).startEffects(effect);
            } else {
              await stream.feature(Features.VideoEffects).stopEffects();
            }
          }
        }

        await this.handlers.onToggleCamera(options);
      }
    });
  }

  public async stopCamera(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      if (isCameraOn(this.getState())) {
        await this.handlers.onToggleCamera();
      }
    });
  }

  public async mute(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      this.context.setIsLocalMicrophoneEnabled(false);
      if (_isInCall(this.call?.state) && !this.call?.isMuted) {
        await this.handlers.onToggleMicrophone();
      }
    });
  }

  public async unmute(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      this.context.setIsLocalMicrophoneEnabled(true);
      if (_isInCall(this.call?.state) && this.call?.isMuted) {
        await this.handlers.onToggleMicrophone();
      }
    });
  }

  public async startScreenShare(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      if (!this.call?.isScreenSharingOn) {
        await this.handlers.onToggleScreenShare();
      }
    });
  }

  public async stopScreenShare(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      if (this.call?.isScreenSharingOn) {
        await this.handlers.onToggleScreenShare();
      }
    });
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public allowUnsupportedBrowserVersion(): void {
    this.context.setAllowedUnsupportedBrowser();
    this.context.updateClientState(this.callClient.getState());
  }

  /* @conditional-compile-remove(video-background-effects) */
  public async startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void> {
    if (this.isBlurEffect(videoBackgroundEffect)) {
      const blurConfig = videoBackgroundEffect as BackgroundBlurConfig;
      await this.handlers.onBlurVideoBackground(blurConfig);
    } else if (this.isReplacementEffect(videoBackgroundEffect)) {
      const replaceConfig = videoBackgroundEffect as BackgroundReplacementConfig;
      await this.handlers.onReplaceVideoBackground(replaceConfig);
    }
  }
  /* @conditional-compile-remove(video-background-effects) */
  public async stopVideoBackgroundEffects(): Promise<void> {
    await this.handlers.onRemoveVideoBackgroundEffects();
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void {
    this.context.setBackroundPickerImages(backgroundImages);
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void {
    this.context.setSelectedVideoBackgroundEffect(selectedVideoBackground);
  }

  public startCall(
    participants:
      | string[]
      /* @conditional-compile-remove(PSTN-calls) */
      | CommunicationIdentifier[],
    options?: StartCallOptions
  ): CallTypeOf<AgentType> | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call.');
    }

    const idsToAdd = participants.map((participant) => {
      // FIXME: `onStartCall` does not allow a Teams user.
      // Need some way to return an error if a Teams user is provided.
      const backendId: CommunicationIdentifier = _toCommunicationIdentifier(participant);
      if (isPhoneNumberIdentifier(backendId)) {
        if (options?.alternateCallerId === undefined) {
          throw new Error('Unable to start call, PSTN user present with no alternateCallerId.');
        }
        return backendId as PhoneNumberIdentifier;
      } else if (isCommunicationUserIdentifier(backendId)) {
        return backendId as CommunicationUserIdentifier;
      }
      return backendId as UnknownIdentifier;
    });

    const call = this.handlers.onStartCall(idsToAdd, options) as CallTypeOf<AgentType>;
    if (!call) {
      throw new Error('Unable to start call.');
    }
    this.processNewCall(call);

    return call;
  }

  private processNewCall(call: CallCommon): void {
    this.call = call;
    this.context.setCurrentCallId(call.id);

    // Resync state after callId is set
    this.context.updateClientState(this.callClient.getState());
    this.handlers = createHandlers(this.callClient, this.callAgent, this.deviceManager, this.call);
    this.subscribeCallEvents();
  }
  /* @conditional-compile-remove(video-background-effects) */
  private isBlurEffect(effect: VideoBackgroundEffect): effect is VideoBackgroundBlurEffect {
    return effect.effectName === 'blur';
  }

  /* @conditional-compile-remove(video-background-effects) */
  private isReplacementEffect(effect: VideoBackgroundEffect): effect is VideoBackgroundReplacementEffect {
    return effect.effectName === 'replacement';
  }

  public async removeParticipant(
    userId: string | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier
  ): Promise<void> {
    let participant = userId;
    /* @conditional-compile-remove(PSTN-calls) */
    participant = _toCommunicationIdentifier(userId);
    this.handlers.onRemoveParticipant(participant);
  }

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
      this.handlers.onAddParticipant(participant, options);
    } else if (isCommunicationUserIdentifier(participant)) {
      this.handlers.onAddParticipant(participant);
    }
  }

  /* @conditional-compile-remove(PSTN-calls) */
  public async holdCall(): Promise<void> {
    if (this.call?.state !== 'LocalHold') {
      this.handlers.onToggleHold();
    }
  }

  /* @conditional-compile-remove(PSTN-calls) */
  public async resumeCall(): Promise<void> {
    if (this.call?.state === 'LocalHold') {
      this.handlers.onToggleHold();
    }
  }

  /* @conditional-compile-remove(PSTN-calls) */
  public async sendDtmfTone(dtmfTone: DtmfTone): Promise<void> {
    this.handlers.onSendDtmfTone(dtmfTone);
  }

  /* @conditional-compile-remove(close-captions) */
  public async startCaptions(options?: StartCaptionsOptions): Promise<void> {
    this.handlers.onStartCaptions(options);
  }

  /* @conditional-compile-remove(close-captions) */
  public async stopCaptions(): Promise<void> {
    this.handlers.onStopCaptions();
  }

  /* @conditional-compile-remove(close-captions) */
  public async setCaptionLanguage(language: string): Promise<void> {
    this.handlers.onSetCaptionLanguage(language);
  }

  /* @conditional-compile-remove(close-captions) */
  public async setSpokenLanguage(language: string): Promise<void> {
    this.handlers.onSetSpokenLanguage(language);
  }

  public getState(): CallAdapterState {
    return this.context.getState();
  }

  public onStateChange(handler: (state: CallAdapterState) => void): void {
    this.context.onStateChange(handler);
  }

  public offStateChange(handler: (state: CallAdapterState) => void): void {
    this.context.offStateChange(handler);
  }

  on(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'diagnosticChanged', listener: DiagnosticChangedEventListner): void;
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  on(event: 'error', errorHandler: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(call-transfer) */
  on(event: 'transferRequested', listener: TransferRequestedListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: string, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  /* @conditional-compile-remove(close-captions) */
  private subscribeToCaptionEvents(): void {
    if (this.call && this.call.state === 'Connected' && _isTeamsMeetingCall(this.call)) {
      this.call?.feature(Features.TeamsCaptions).on('captionsReceived', this.captionsReceived.bind(this));
      this.call?.feature(Features.TeamsCaptions).on('isCaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));
      this.call?.off('stateChanged', this.subscribeToCaptionEvents.bind(this));
    }
  }

  /* @conditional-compile-remove(close-captions) */
  private unsubscribeFromCaptionEvents(): void {
    if (this.call && this.call.state === 'Connected' && _isTeamsMeetingCall(this.call)) {
      this._call?.feature(Features.TeamsCaptions).off('captionsReceived', this.captionsReceived.bind(this));
      this._call
        ?.feature(Features.TeamsCaptions)
        .off('isCaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));
      this.call?.off('stateChanged', this.subscribeToCaptionEvents.bind(this));
    }
  }

  private subscribeCallEvents(): void {
    this.call?.on('remoteParticipantsUpdated', this.onRemoteParticipantsUpdated.bind(this));
    this.call?.on('isMutedChanged', this.isMyMutedChanged.bind(this));
    this.call?.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged.bind(this));
    this.call?.on('idChanged', this.callIdChanged.bind(this));
    /* @conditional-compile-remove(close-captions) */
    this.call?.on('stateChanged', this.subscribeToCaptionEvents.bind(this));
    /* @conditional-compile-remove(call-transfer) */
    this.call?.feature(Features.Transfer).on('transferRequested', this.transferRequested.bind(this));
  }

  private unsubscribeCallEvents(): void {
    for (const subscriber of this.participantSubscribers.values()) {
      subscriber.unsubscribeAll();
    }
    this.participantSubscribers.clear();
    this.call?.off('remoteParticipantsUpdated', this.onRemoteParticipantsUpdated.bind(this));
    this.call?.off('isMutedChanged', this.isMyMutedChanged.bind(this));
    this.call?.off('isScreenSharingOnChanged', this.isScreenSharingOnChanged.bind(this));
    this.call?.off('idChanged', this.callIdChanged.bind(this));

    /* @conditional-compile-remove(close-captions) */
    this.unsubscribeFromCaptionEvents();
  }

  private isMyMutedChanged = (): void => {
    this.emitter.emit('isMutedChanged', {
      participantId: this.getState().userId,
      isMuted: this.call?.isMuted
    });
  };

  private onRemoteParticipantsUpdated({
    added,
    removed
  }: {
    added: RemoteParticipant[];
    removed: RemoteParticipant[];
  }): void {
    if (added && added.length > 0) {
      this.emitter.emit('participantsJoined', { joined: added });
    }
    if (removed && removed.length > 0) {
      this.emitter.emit('participantsLeft', { removed: removed });
    }

    added.forEach((participant) => {
      this.participantSubscribers.set(
        toFlatCommunicationIdentifier(participant.identifier),
        new ParticipantSubscriber(participant, this.emitter)
      );
    });

    removed.forEach((participant) => {
      const subscriber = this.participantSubscribers.get(toFlatCommunicationIdentifier(participant.identifier));
      subscriber && subscriber.unsubscribeAll();
      this.participantSubscribers.delete(toFlatCommunicationIdentifier(participant.identifier));
    });
  }

  private isScreenSharingOnChanged(): void {
    this.emitter.emit('isLocalScreenSharingActiveChanged', { isScreenSharingOn: this.call?.isScreenSharingOn });
  }

  /* @conditional-compile-remove(close-captions) */
  private captionsReceived(captionsInfo: TeamsCaptionsInfo): void {
    this.emitter.emit('captionsReceived', { captionsInfo });
  }

  /* @conditional-compile-remove(close-captions) */
  private isCaptionsActiveChanged(): void {
    this.emitter.emit('isCaptionsActiveChanged', {
      isActive: this.call?.feature(Features.TeamsCaptions).isCaptionsFeatureActive
    });
  }

  /* @conditional-compile-remove(call-transfer) */
  private transferRequested(args: TransferRequestedEventArgs): void {
    const newArgs = {
      ...args,
      accept: (options: AcceptTransferOptions) => {
        const videoSource = this.context.getState().call?.localVideoStreams?.[0]?.source;
        args.accept({
          audioOptions: options?.audioOptions ?? /* maintain audio state if options.audioOptions is not defined */ {
            muted: !!this.context.getState().call?.isMuted
          },
          videoOptions:
            options?.videoOptions ??
            /* maintain video state if options.videoOptions is not defined */
            (videoSource ? { localVideoStreams: [new LocalVideoStream(videoSource)] } : undefined)
        });
      }
    };
    this.emitter.emit('transferRequested', newArgs);
  }

  private callIdChanged(): void {
    this.call?.id && this.emitter.emit('callIdChanged', { callId: this.call.id });
  }

  private resetDiagnosticsForwarder(newCall?: CallCommon): void {
    if (this.diagnosticsForwarder) {
      this.diagnosticsForwarder.unsubscribe();
    }
    if (newCall) {
      this.diagnosticsForwarder = new DiagnosticsForwarder(this.emitter, newCall);
    }
  }

  off(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'diagnosticChanged', listener: DiagnosticChangedEventListner): void;
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  off(event: 'error', errorHandler: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(call-transfer) */
  off(event: 'transferRequested', listener: TransferRequestedListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(event: string, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
  }

  private async asyncTeeErrorToEventEmitter<T>(f: () => Promise<T>): Promise<T> {
    try {
      return await f();
    } catch (error) {
      if (isCallError(error as Error)) {
        this.emitter.emit('error', error as AdapterError);
      }
      throw error;
    }
  }

  private teeErrorToEventEmitter<T>(f: () => T): T {
    try {
      return f();
    } catch (error) {
      if (isCallError(error as Error)) {
        this.emitter.emit('error', error as AdapterError);
      }
      throw error;
    }
  }
}

/* @conditional-compile-remove(teams-adhoc-call) */
/* @conditional-compile-remove(PSTN-calls) */
/**
 * Locator used by {@link createAzureCommunicationCallAdapter} to call one or more participants
 *
 * @remarks
 * This is currently in beta and only supports calling one Teams User.
 *
 * @example
 * ```
 * ['8:orgid:ab220efe-5725-4742-9792-9fba7c9ac458']
 * ```
 *
 * @beta
 */
export type CallParticipantsLocator = {
  participantIds: string[];
};

/**
 * Locator used by {@link createAzureCommunicationCallAdapter} to locate the call to join
 *
 * @public
 */
export type CallAdapterLocator =
  | TeamsMeetingLinkLocator
  | GroupCallLocator
  | /* @conditional-compile-remove(rooms) */ RoomCallLocator
  | /* @conditional-compile-remove(teams-adhoc-call) */ /* @conditional-compile-remove(PSTN-calls) */ CallParticipantsLocator;

/**
 * Common optional parameters to create {@link AzureCommunicationCallAdapter} or {@link TeamsCallAdapter}
 *
 * @beta
 */
export type CommonCallAdapterOptions = {
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Default set of background images for background image picker.
   */
  videoBackgroundImages?: VideoBackgroundImage[];
  /**
   * Use this to fetch profile information which will override data in {@link CallAdapterState} like display name
   * The onFetchProfile is fetch-and-forget one time action for each user, once a user profile is updated, the value will be cached
   * and would not be updated again within the lifecycle of adapter.
   */
  onFetchProfile?: OnFetchProfileCallback;
};

/**
 * Optional parameters to create {@link AzureCommunicationCallAdapter}
 *
 * @beta
 */
export type AzureCommunicationCallAdapterOptions = {
  /* @conditional-compile-remove(rooms) */
  /**
   * Use this to hint the role of the user when the role is not available before a Rooms call is started. This value
   * should be obtained using the Rooms API. This role will determine permissions in the configuration page of the
   * {@link CallComposite}. The true role of the user will be synced with ACS services when a Rooms call starts.
   */
  roleHint?: Role;
} & CommonCallAdapterOptions;

/**
 * Arguments for creating the Azure Communication Services implementation of {@link CallAdapter}.
 *
 * Note: `displayName` can be a maximum of 256 characters.
 *
 * @public
 */
export type AzureCommunicationCallAdapterArgs = {
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  locator: CallAdapterLocator;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * A phone number in E.164 format procured using Azure Communication Services that will be used to represent callers identity.
   * E.164 numbers are formatted as [+] [country code] [phone number including area code]. For example, +14255550123 for a US phone number.
   */
  alternateCallerId?: string;
  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(video-background-effects) */
  /**
   * Optional parameters for the {@link AzureCommunicationCallAdapter} created
   */
  options?: AzureCommunicationCallAdapterOptions;
};

/**
 * Optional parameters to create {@link TeamsCallAdapter}
 *
 * @beta
 */
export type TeamsAdapterOptions = CommonCallAdapterOptions;

/**
 * Arguments for creating the Azure Communication Services implementation of {@link TeamsCallAdapter}.
 *
 * @beta
 */
export type TeamsCallAdapterArgs = {
  userId: MicrosoftTeamsUserIdentifier;
  credential: CommunicationTokenCredential;
  locator:
    | TeamsMeetingLinkLocator
    | /* @conditional-compile-remove(teams-adhoc-call) */ /* @conditional-compile-remove(PSTN-calls) */ CallParticipantsLocator;
  /**
   * Optional parameters for the {@link TeamsCallAdapter} created
   */
  options?: TeamsAdapterOptions;
};

/**
 * Create a {@link CallAdapter} backed by Azure Communication Services.
 *
 * This is the default implementation of {@link CallAdapter} provided by this library.
 *
 * Note: `displayName` can be a maximum of 256 characters.
 *
 * @public
 */
export const createAzureCommunicationCallAdapter = async ({
  userId,
  displayName,
  credential,
  locator,
  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
  /* @conditional-compile-remove(video-background-effects) */ options
}: AzureCommunicationCallAdapterArgs): Promise<CallAdapter> => {
  if (!_isValidIdentifier(userId)) {
    throw new Error('Invalid identifier. Please provide valid identifier object.');
  }

  const callClient = createStatefulCallClient({
    userId,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
  });
  const callAgent = await callClient.createCallAgent(credential, {
    displayName
  });
  const adapter = createAzureCommunicationCallAdapterFromClient(
    callClient,
    callAgent,
    locator,
    /* @conditional-compile-remove(video-background-effects) */ options
  );
  return adapter;
};

/* @conditional-compile-remove(teams-identity-support) */
/**
 * @beta
 */
export const createTeamsCallAdapter = async ({
  userId,
  credential,
  locator,
  options
}: TeamsCallAdapterArgs): Promise<TeamsCallAdapter> => {
  const callClient = createStatefulCallClient({
    userId
  });
  const callAgent = await callClient.createTeamsCallAgent(credential, {
    undefined
  });
  const adapter = createTeamsCallAdapterFromClient(callClient, callAgent, locator, options);
  return adapter;
};

type PartialArgsType<Adapter> = Adapter extends CallAdapter
  ? Partial<AzureCommunicationCallAdapterArgs>
  : Partial<TeamsCallAdapterArgs>;

type AdapterOf<AdapterKind extends 'AzureCommunication' | 'Teams'> = AdapterKind extends 'AzureCommunication'
  ? CallAdapter
  : never | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallAdapter;

/**
 * @private
 */
const useAzureCommunicationCallAdapterGeneric = <
  AdapterKind extends 'AzureCommunication' | 'Teams',
  Adapter extends AdapterOf<AdapterKind>
>(
  args: PartialArgsType<Adapter>,
  afterCreate?: (adapter: Adapter) => Promise<Adapter>,
  beforeDispose?: (adapter: Adapter) => Promise<void>,
  adapterKind: AdapterKind = 'AzureCommunication' as AdapterKind
): Adapter | undefined => {
  const { credential, locator, userId } = args;
  const displayName = 'displayName' in args ? args.displayName : undefined;
  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = 'alternateCallerId' in args ? args.alternateCallerId : undefined;
  /* @conditional-compile-remove(rooms) */
  const options = 'options' in args ? args.options : undefined;

  // State update needed to rerender the parent component when a new adapter is created.
  const [adapter, setAdapter] = useState<Adapter | undefined>(undefined);
  // Ref needed for cleanup to access the old adapter created asynchronously.
  const adapterRef = useRef<Adapter | undefined>(undefined);
  const creatingAdapterRef = useRef<boolean>(false);

  const afterCreateRef = useRef<((adapter: Adapter) => Promise<Adapter>) | undefined>(undefined);
  const beforeDisposeRef = useRef<((adapter: Adapter) => Promise<void>) | undefined>(undefined);
  // These refs are updated on *each* render, so that the latest values
  // are used in the `useEffect` closures below.
  // Using a Ref ensures that new values for the callbacks do not trigger the
  // useEffect blocks, and a new adapter creation / distruction is not triggered.
  afterCreateRef.current = afterCreate;
  beforeDisposeRef.current = beforeDispose;

  useEffect(
    () => {
      if (!credential || !locator || !userId) {
        return;
      }

      if (adapterKind === 'AzureCommunication' && !displayName) {
        return;
      }
      (async () => {
        if (adapterRef.current) {
          // Dispose the old adapter when a new one is created.
          //
          // This clean up function uses `adapterRef` because `adapter` can not be added to the dependency array of
          // this `useEffect` -- we do not want to trigger a new adapter creation because of the first adapter
          // creation.
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }
        let newAdapter: Adapter | undefined = undefined;
        if (adapterKind === 'AzureCommunication') {
          // This is just the type check to ensure that displayName is defined.
          if (!displayName) {
            throw new Error('Unreachable code, displayName already checked above.');
          }
          // This is just the type check to ensure that roleHint is defined.
          /* @conditional-compile-remove(rooms) */
          if (options && !('roleHint' in options)) {
            throw new Error('Unreachable code, provided a options without roleHint.');
          }
          if (creatingAdapterRef.current) {
            console.warn(
              'Adapter is already being created, please see storybook for more information: https://azure.github.io/communication-ui-library/?path=/story/troubleshooting--page'
            );
            return;
          }
          creatingAdapterRef.current = true;
          newAdapter = (await createAzureCommunicationCallAdapter({
            credential,
            displayName: displayName,
            locator,
            userId: userId as CommunicationUserIdentifier,
            /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
            /* @conditional-compile-remove(rooms) */ options
          })) as Adapter;
        } else if (adapterKind === 'Teams') {
          if (creatingAdapterRef.current) {
            console.warn('Adapter is already being created, skipping creation.');
            return;
          }
          creatingAdapterRef.current = true;
          /* @conditional-compile-remove(teams-identity-support) */
          newAdapter = (await createTeamsCallAdapter({
            credential,
            locator: locator as TeamsMeetingLinkLocator,
            userId: userId as MicrosoftTeamsUserIdentifier,
            options
          })) as Adapter;
        } else {
          throw new Error('Unreachable code, unknown adapterKind');
        }

        if (!newAdapter) {
          throw Error('Unreachable code! Get undefined adapter');
        }

        if (afterCreateRef.current) {
          newAdapter = await afterCreateRef.current(newAdapter);
        }
        adapterRef.current = newAdapter;
        creatingAdapterRef.current = false;
        setAdapter(newAdapter);
      })();
    },
    // Explicitly list all arguments so that caller doesn't have to memoize the `args` object.
    [
      adapterRef,
      afterCreateRef,
      beforeDisposeRef,
      adapterKind,
      credential,
      locator,
      userId,
      displayName,
      /* @conditional-compile-remove(PSTN-calls) */
      alternateCallerId,
      /* @conditional-compile-remove(rooms) */
      /* @conditional-compile-remove(teams-identity-support) */
      options
    ]
  );

  // Dispose any existing adapter when the component unmounts.
  useEffect(() => {
    return () => {
      (async () => {
        if (adapterRef.current) {
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }
      })();
    };
  }, []);

  return adapter;
};

/**
 * A custom React hook to simplify the creation of {@link CallAdapter}.
 *
 * Similar to {@link createAzureCommunicationCallAdapter}, but takes care of asynchronous
 * creation of the adapter internally.
 *
 * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
 * as they are created. The adapter is only created when all arguments are defined.
 *
 * Note that you must memoize the arguments to avoid recreating adapter on each render.
 * See storybook for typical usage examples.
 *
 * @public
 */
export const useAzureCommunicationCallAdapter = (
  /**
   * Arguments to be passed to {@link createAzureCommunicationCallAdapter}.
   *
   * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
   * as they are created. The adapter is only created when all arguments are defined.
   */
  args: Partial<AzureCommunicationCallAdapterArgs>,
  /**
   * Optional callback to modify the adapter once it is created.
   *
   * If set, must return the modified adapter.
   */
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>,
  /**
   * Optional callback called before the adapter is disposed.
   *
   * This is useful for clean up tasks, e.g., leaving any ongoing calls.
   */
  beforeDispose?: (adapter: CallAdapter) => Promise<void>
): CallAdapter | undefined => {
  return useAzureCommunicationCallAdapterGeneric(args, afterCreate, beforeDispose, 'AzureCommunication');
};

/* @conditional-compile-remove(teams-identity-support) */
/**
 * A custom React hook to simplify the creation of {@link TeamsCallAdapter}.
 *
 * Similar to {@link createTeamsAzureCommunicationCallAdapter}, but takes care of asynchronous
 * creation of the adapter internally.
 *
 * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
 * as they are created. The adapter is only created when all arguments are defined.
 *
 * Note that you must memoize the arguments to avoid recreating adapter on each render.
 * See storybook for typical usage examples.
 *
 * @beta
 */
export const useTeamsCallAdapter = (
  /**
   * Arguments to be passed to {@link createAzureCommunicationCallAdapter}.
   *
   * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
   * as they are created. The adapter is only created when all arguments are defined.
   */
  args: Partial<TeamsCallAdapterArgs>,
  /**
   * Optional callback to modify the adapter once it is created.
   *
   * If set, must return the modified adapter.
   */
  afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>,
  /**
   * Optional callback called before the adapter is disposed.
   *
   * This is useful for clean up tasks, e.g., leaving any ongoing calls.
   */
  beforeDispose?: (adapter: TeamsCallAdapter) => Promise<void>
): TeamsCallAdapter | undefined => {
  return useAzureCommunicationCallAdapterGeneric(args, afterCreate, beforeDispose, 'Teams');
};

/**
 * Create a {@link CallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export const createAzureCommunicationCallAdapterFromClient: (
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locator: CallAdapterLocator,
  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(video-background-effects) */ options?: AzureCommunicationCallAdapterOptions
) => Promise<CallAdapter> = async (
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locator: CallAdapterLocator,
  options?
): Promise<CallAdapter> => {
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  /* @conditional-compile-remove(unsupported-browser) */
  await callClient.feature(Features.DebugInfo).getEnvironmentInfo();
  return new AzureCommunicationCallAdapter(
    callClient,
    locator,
    callAgent,
    deviceManager,
    /* @conditional-compile-remove(rooms) */ options
  );
};

/* @conditional-compile-remove(teams-identity-support) */
/**
 * Create a {@link TeamsCallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @beta
 */
export const createTeamsCallAdapterFromClient = async (
  callClient: StatefulCallClient,
  callAgent: TeamsCallAgent,
  locator: CallAdapterLocator,
  options?: TeamsAdapterOptions
): Promise<TeamsCallAdapter> => {
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  /* @conditional-compile-remove(unsupported-browser) */
  await callClient.feature(Features.DebugInfo).getEnvironmentInfo();
  return new AzureCommunicationCallAdapter(callClient, locator, callAgent, deviceManager, options);
};

const isCallError = (e: Error): e is CallError => {
  return e['target'] !== undefined && e['innerError'] !== undefined;
};

/* @conditional-compile-remove(teams-adhoc-call) */
/* @conditional-compile-remove(PSTN-calls) */
const isOutboundCall = (callLocator: CallAdapterLocator): callLocator is CallParticipantsLocator => {
  return 'participantIds' in callLocator;
};
