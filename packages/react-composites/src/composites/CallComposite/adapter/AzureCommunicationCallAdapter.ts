// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { compositeLogger } from '../../../Logger';
import { _isInCall, _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import {
  CallClientState,
  CallError,
  CallState,
  _createStatefulCallClientInner,
  StatefulCallClient,
  StatefulDeviceManager,
  TeamsCall,
  _isACSCall,
  _isTeamsCall
} from '@internal/calling-stateful-client';
import { AcceptedTransfer } from '@internal/calling-stateful-client';
import { _isTeamsCallAgent } from '@internal/calling-stateful-client';
import { CallCommon } from '@internal/calling-stateful-client';
import { _TelemetryImplementationHint } from '@internal/acs-ui-common';
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
  RoomCallLocator,
  StartCallOptions,
  VideoOptions,
  Call
} from '@azure/communication-calling';
import { SpotlightedParticipant } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
import { TeamsCaptions } from '@azure/communication-calling';
import { Captions, CaptionsInfo } from '@azure/communication-calling';
import { TransferEventArgs } from '@azure/communication-calling';
import { TeamsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(rtt) */
import type { RealTimeTextInfo } from '@azure/communication-calling';
import type { BackgroundBlurConfig, BackgroundReplacementConfig, DeviceAccess } from '@azure/communication-calling';
import type { CapabilitiesChangeInfo } from '@azure/communication-calling';
import { TeamsCallAgent } from '@azure/communication-calling';
import { Features } from '@azure/communication-calling';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import type { BreakoutRoom, BreakoutRoomsEventData, BreakoutRoomsUpdatedListener } from '@azure/communication-calling';
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
  CallAdapter,
  JoinCallOptions,
  StartCallIdentifier,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from './CallAdapter';
import { ReactionResources } from '@internal/react-components';
import { TransferAcceptedListener } from './CallAdapter';
import { CapabilitiesChangedListener } from './CallAdapter';
import { SpotlightChangedListener } from './CallAdapter';
import {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from './CallAdapter';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextReceivedListener } from './CallAdapter';
import {
  VideoBackgroundImage,
  VideoBackgroundEffect,
  VideoBackgroundBlurEffect,
  VideoBackgroundReplacementEffect
} from './CallAdapter';
import { TeamsCallAdapter } from './CallAdapter';
import { getCallCompositePage, getLocatorOrTargetCallees, IsCallEndedPage, isCameraOn } from '../utils';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { toFlatCommunicationIdentifier, _toCommunicationIdentifier, _isValidIdentifier } from '@internal/acs-ui-common';
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  CommunicationIdentifier,
  MicrosoftTeamsUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  MicrosoftTeamsAppIdentifier,
  UnknownIdentifier,
  isMicrosoftTeamsAppIdentifier
} from '@azure/communication-common';
import { isCommunicationUserIdentifier } from '@azure/communication-common';
import { isPhoneNumberIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { ParticipantSubscriber } from './ParticipantSubcriber';
import { AdapterError } from '../../common/adapters';
import { DiagnosticsForwarder } from './DiagnosticsForwarder';
import { useEffect, useRef, useState } from 'react';
import { CallHandlersOf, createHandlers } from './createHandlers';
import { createProfileStateModifier, OnFetchProfileCallback } from './OnFetchProfileCallback';
import { getBackgroundEffectFromSelectedEffect } from '../utils';
import { getSelectedCameraFromAdapterState } from '../utils';
import {
  DeepNoiseSuppressionEffectDependency,
  VideoBackgroundEffectsDependency
} from '@internal/calling-component-bindings';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import { CallingSoundSubscriber } from './CallingSoundSubscriber';
import { CallingSounds } from './CallAdapter';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeStreamViewResult, TogetherModeStreamOptions } from '@internal/react-components';

type CallTypeOf<AgentType extends CallAgent | TeamsCallAgent> = AgentType extends CallAgent ? Call : TeamsCall;

/**
 * State used by the CallAdapter to manage the call state that is not exposed to the public API.
 */
interface CallAdapterPrivateState {
  /** Track how captions has been started to decide on showing UI or not */
  captionsTriggers?: {
    captionsStartedInBackground?: boolean;
    captionsStartedWithUI?: boolean;
  };
}

/**
 * For each time that we use the hook {@link useSelector} in the {@link CallComposite} we add another listener
 * to the `stateChanged` event on the this adapter. This number is set in relation to the number of
 * times that we are using the hook useSelector in the CallComposite.
 *
 * We will need to update this as the threshold is reached with more usages of useSelector.
 */
const EVENT_LISTENER_WARNING_WARNING_LIMIT = 125;

type CallContextState = CallAdapterState & CallAdapterPrivateState;

/** Context of call, which is a centralized context for all state updates */
class CallContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: CallContextState;
  private callId: string | undefined;
  private isReturningFromBreakoutRoom: boolean = false;
  private displayNameModifier: AdapterStateModifier | undefined;

  constructor(
    clientState: CallClientState,
    isTeamsCall: boolean,
    isTeamsMeeting: boolean,
    isRoomsCall: boolean,
    options?: {
      maxListeners?: number;
      onFetchProfile?: OnFetchProfileCallback;
      videoBackgroundOptions?: {
        videoBackgroundImages?: VideoBackgroundImage[];
        onResolveDependency?: () => Promise<VideoBackgroundEffectsDependency>;
      };
      deepNoiseSuppressionOptions?: {
        onResolveDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
        deepNoiseSuppressionOnByDefault?: boolean;
        hideDeepNoiseSuppressionButton?: boolean;
      };
      callingSounds?: CallingSounds;
      reactionResources?: ReactionResources;
      alternateCallerId?: string;
    },
    targetCallees?: StartCallIdentifier[]
  ) {
    this.state = {
      isLocalPreviewMicrophoneEnabled: false,
      userId: clientState.userId,
      displayName: clientState.callAgent?.displayName,
      devices: clientState.deviceManager,
      call: undefined,
      targetCallees: targetCallees as CommunicationIdentifier[],
      page: 'configuration',
      latestErrors: clientState.latestErrors,
      latestNotifications: clientState.latestNotifications,
      isTeamsCall,
      isTeamsMeeting,
      isRoomsCall,
      alternateCallerId: options?.alternateCallerId,
      environmentInfo: clientState.environmentInfo,
      /* @conditional-compile-remove(unsupported-browser) */ unsupportedBrowserVersionsAllowed: false,
      videoBackgroundImages: options?.videoBackgroundOptions?.videoBackgroundImages,
      onResolveVideoEffectDependency: options?.videoBackgroundOptions?.onResolveDependency,
      onResolveDeepNoiseSuppressionDependency: options?.deepNoiseSuppressionOptions?.onResolveDependency,
      deepNoiseSuppressionOnByDefault: options?.deepNoiseSuppressionOptions?.deepNoiseSuppressionOnByDefault ?? true,
      hideDeepNoiseSuppressionButton: options?.deepNoiseSuppressionOptions?.hideDeepNoiseSuppressionButton ?? false,
      selectedVideoBackgroundEffect: undefined,
      cameraStatus: undefined,
      sounds: options?.callingSounds,
      reactions: options?.reactionResources
    };
    this.emitter.setMaxListeners(options?.maxListeners ?? EVENT_LISTENER_WARNING_WARNING_LIMIT);
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

  public onStateChange(handler: (_uiState: CallContextState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: CallContextState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: CallContextState): void {
    this.state = this.displayNameModifier ? this.displayNameModifier(state) : state;

    // This context privately tracks how captions was started to determine if captions is running only in the background.
    // If so we should not show the UI.
    this.state = captionsUIVisibilityModifier(this.state);

    this.emitter.emit('stateChanged', this.state);
  }

  public updateCaptionsStartedInBackground(captionsStartedInBackground: boolean): void {
    const captionsTriggers = this.state.captionsTriggers ?? {};
    captionsTriggers.captionsStartedInBackground = captionsStartedInBackground;
    this.setState({ ...this.state, captionsTriggers });
  }

  public updateCaptionsStartedWithUI(captionsStartedWithUI: boolean): void {
    const captionsTriggers = this.state.captionsTriggers ?? {};
    captionsTriggers.captionsStartedWithUI = captionsStartedWithUI;
    this.setState({ ...this.state, captionsTriggers });
  }

  public getState(): CallContextState {
    return this.state;
  }

  public setIsLocalMicrophoneEnabled(isLocalPreviewMicrophoneEnabled: boolean): void {
    this.setState({ ...this.state, isLocalPreviewMicrophoneEnabled });
  }

  // This is the key to find current call object in client state
  public setCurrentCallId(callId: string | undefined): void {
    this.callId = callId;
  }

  public setTargetCallee(targetCallees: StartCallIdentifier[]): void {
    this.setState({ ...this.state, targetCallees });
  }

  public setIsReturningFromBreakoutRoom(isReturningFromBreakoutRoom: boolean): void {
    this.isReturningFromBreakoutRoom = isReturningFromBreakoutRoom;
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

    const latestAcceptedTransfer = call?.transfer.acceptedTransfers
      ? findLatestAcceptedTransfer(call.transfer.acceptedTransfers)
      : undefined;
    const transferCall = latestAcceptedTransfer ? clientState.calls[latestAcceptedTransfer.callId] : undefined;

    if (call?.state === 'Connected' || call?.state === 'Connecting') {
      this.setIsReturningFromBreakoutRoom(false);
    }

    let isReturningFromBreakoutRoom = false;
    isReturningFromBreakoutRoom = this.isReturningFromBreakoutRoom;

    const newPage = getCallCompositePage(
      call,
      latestEndedCall,
      transferCall,
      isReturningFromBreakoutRoom,
      /* @conditional-compile-remove(unsupported-browser) */ environmentInfo
    );
    if (!IsCallEndedPage(oldPage) && IsCallEndedPage(newPage)) {
      /**
       * We want to make sure that the id of the call that is ending
       * is the same as the call in the adapter as this is a scenario where
       * the call has ended and not been transferred and report the codes for this call.
       */
      if (this.callId === latestEndedCall?.id) {
        this.emitter.emit('callEnded', {
          callId: latestEndedCall?.id,
          code: latestEndedCall?.callEndReason?.code,
          subCode: latestEndedCall?.callEndReason?.subCode
        });
      }
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
        latestNotifications: clientState.latestNotifications,
        cameraStatus:
          call?.localVideoStreams.find((s) => s.mediaStreamType === 'Video') ||
          clientState.deviceManager.unparentedViews.find((s) => s.mediaStreamType === 'Video')
            ? 'On'
            : 'Off',
        acceptedTransferCallState: transferCall
      });
    }
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public setAllowedUnsupportedBrowser(): void {
    this.setState({ ...this.state, unsupportedBrowserVersionsAllowed: true });
  }

  public setBackroundPickerImages(videoBackgroundImages: VideoBackgroundImage[]): void {
    this.setState({ ...this.state, videoBackgroundImages });
  }

  public setSelectedVideoBackgroundEffect(selectedVideoBackgroundEffect?: VideoBackgroundEffect): void {
    this.setState({ ...this.state, selectedVideoBackgroundEffect });
  }

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
    if ((call.endTime?.getTime() ?? 0) > (latestCall?.endTime?.getTime() ?? 0)) {
      latestCall = call;
    }
  }
  return latestCall;
};

const findLatestAcceptedTransfer = (acceptedTransfers: {
  [key: string]: AcceptedTransfer;
}): AcceptedTransfer | undefined => {
  const acceptedTransferValues = Object.values(acceptedTransfers);
  if (acceptedTransferValues.length === 0) {
    return undefined;
  }
  let latestAcceptedTransfer = acceptedTransferValues[0];
  for (const acceptedTransfer of acceptedTransferValues.slice(1)) {
    if ((acceptedTransfer.timestamp?.getTime() ?? 0) > (latestAcceptedTransfer?.timestamp?.getTime() ?? 0)) {
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
export class AzureCommunicationCallAdapter<AgentType extends CallAgent | TeamsCallAgent = CallAgent>
  implements CommonCallAdapter
{
  private callClient: StatefulCallClient;
  private callAgent: AgentType;
  private deviceManager: StatefulDeviceManager;
  private locator?: CallAdapterLocator;
  targetCallees?: StartCallIdentifier[];
  // Never use directly, even internally. Use `call` property instead.
  private _call?: CallCommon;
  private context: CallContext;
  private diagnosticsForwarder?: DiagnosticsForwarder;
  private handlers: CallHandlersOf<AgentType>;
  private participantSubscribers = new Map<string, ParticipantSubscriber>();
  private emitter: EventEmitter = new EventEmitter();
  private callingSoundSubscriber: CallingSoundSubscriber | undefined;
  private onClientStateChange: (clientState: CallClientState) => void;
  private originCall: CallCommon | undefined;
  private onResolveVideoBackgroundEffectsDependency?: () => Promise<VideoBackgroundEffectsDependency>;
  private onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;

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
    options?: AzureCommunicationCallAdapterOptions | TeamsAdapterOptions
  );
  constructor(
    callClient: StatefulCallClient,
    targetCallees: StartCallIdentifier[],
    callAgent: AgentType,
    deviceManager: StatefulDeviceManager,
    options?: AzureCommunicationCallAdapterOptions | TeamsAdapterOptions
  );
  constructor(
    callClient: StatefulCallClient,
    locatorOrTargetCalless: CallAdapterLocator | StartCallIdentifier[],
    callAgent: AgentType,
    deviceManager: StatefulDeviceManager,
    options?: AzureCommunicationCallAdapterOptions | TeamsAdapterOptions
  ) {
    this.bindPublicMethods();
    this.callClient = callClient;
    this.callAgent = callAgent;
    this.targetCallees =
      getLocatorOrTargetCallees(locatorOrTargetCalless) === true
        ? (locatorOrTargetCalless as StartCallIdentifier[])
        : undefined;
    this.locator =
      getLocatorOrTargetCallees(locatorOrTargetCalless) === false
        ? (locatorOrTargetCalless as CallAdapterLocator)
        : undefined;
    this.deviceManager = deviceManager;
    const isTeamsMeeting = this.locator ? 'meetingLink' in this.locator || 'meetingId' in this.locator : false;
    let isTeamsCall: boolean | undefined;
    this.targetCallees?.forEach((callee) => {
      if (isMicrosoftTeamsUserIdentifier(callee) || isMicrosoftTeamsAppIdentifier(callee)) {
        isTeamsCall = true;
      }
    });

    const isRoomsCall = this.locator ? 'roomId' in this.locator : false;

    this.onResolveVideoBackgroundEffectsDependency = options?.videoBackgroundOptions?.onResolveDependency;
    this.onResolveDeepNoiseSuppressionDependency = options?.deepNoiseSuppressionOptions?.onResolveDependency;

    this.context = new CallContext(
      callClient.getState(),
      !!isTeamsCall,
      isTeamsMeeting,
      isRoomsCall,
      options,
      this.targetCallees
    );

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

      // if the call hits the connected state we want to pause all calling sounds if playing.
      if (this.call?.state === 'Connected' && this.callingSoundSubscriber?.playingSounds) {
        this.callingSoundSubscriber.pauseSounds();
      }

      // If the call connects we need to clean up any previous unparentedViews
      if (
        (this.call?.state === 'InLobby' || this.call?.state === 'Connected') &&
        this.callClient.getState().deviceManager.unparentedViews.length > 0
      ) {
        this.callClient.getState().deviceManager.unparentedViews.forEach((view) => {
          this.callClient.disposeView(undefined, undefined, view);
        });
      }

      this.context.updateClientState(clientState);
    };

    this.handlers = createHandlers(callClient, callAgent, deviceManager, undefined, {
      onResolveVideoBackgroundEffectsDependency: this.onResolveVideoBackgroundEffectsDependency,
      onResolveDeepNoiseSuppressionDependency: this.onResolveDeepNoiseSuppressionDependency
    });

    this.onClientStateChange = onStateChange;

    this.subscribeDeviceManagerEvents();

    this.callClient.onStateChange(onStateChange);

    if (this.callAgent.kind === 'CallAgent') {
      const onCallsUpdated = (args: { added: Call[]; removed: Call[] }): void => {
        if (!this.call?.id) {
          return;
        }

        const removedCall = args.removed.find((call) => call.id === this.call?.id);
        if (!removedCall) {
          return;
        }

        const removedCallState = this.callClient.getState().callsEnded[removedCall.id];
        if (!removedCallState) {
          return;
        }

        const latestAcceptedTransfer = findLatestAcceptedTransfer(removedCallState.transfer.acceptedTransfers);
        const _callAgent = callAgent as CallAgent;
        const transferCall = _callAgent.calls.find((call: Call) => call.id === latestAcceptedTransfer?.callId);
        if (!transferCall) {
          return;
        }

        this.processNewCall(transferCall);
      };
      (this.callAgent as CallAgent).on('callsUpdated', onCallsUpdated);
    }

    if (this.callAgent.kind === 'TeamsCallAgent') {
      const onTeamsCallsUpdated = (args: { added: TeamsCall[]; removed: TeamsCall[] }): void => {
        if (!this.call?.id) {
          return;
        }

        const removedCall = args.removed.find((call) => call.id === this.call?.id);
        if (!removedCall) {
          return;
        }

        const removedCallState = this.callClient.getState().callsEnded[removedCall.id];
        if (!removedCallState) {
          return;
        }

        const latestAcceptedTransfer = findLatestAcceptedTransfer(removedCallState.transfer.acceptedTransfers);
        const _callAgent = callAgent as TeamsCallAgent;
        const transferCall = _callAgent.calls.find((call: TeamsCall) => call.id === latestAcceptedTransfer?.callId);
        if (!transferCall) {
          return;
        }

        this.processNewCall(transferCall);
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
    this.raiseHand.bind(this);
    this.onReactionClick.bind(this);
    this.lowerHand.bind(this);
    this.removeParticipant.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    /* @conditional-compile-remove(together-mode) */
    this.createTogetherModeStreamView.bind(this);
    /* @conditional-compile-remove(together-mode) */
    this.startTogetherMode.bind(this);
    /* @conditional-compile-remove(together-mode) */
    this.setTogetherModeSceneSize.bind(this);
    /* @conditional-compile-remove(together-mode) */
    this.disposeTogetherModeStreamView.bind(this);
    this.disposeScreenShareStreamView.bind(this);
    this.disposeRemoteVideoStreamView.bind(this);
    this.disposeLocalVideoStreamView.bind(this);
    this.on.bind(this);
    this.off.bind(this);
    this.processNewCall.bind(this);
    this.addParticipant.bind(this);
    this.holdCall.bind(this);
    this.resumeCall.bind(this);
    this.sendDtmfTone.bind(this);
    /* @conditional-compile-remove(unsupported-browser) */
    this.allowUnsupportedBrowserVersion.bind(this);
    this.startCaptions.bind(this);
    this.stopCaptions.bind(this);
    this.setSpokenLanguage.bind(this);
    this.setCaptionLanguage.bind(this);
    /* @conditional-compile-remove(rtt) */
    this.sendRealTimeText.bind(this);
    this.startVideoBackgroundEffect.bind(this);
    this.stopVideoBackgroundEffects.bind(this);
    this.updateBackgroundPickerImages.bind(this);
    this.startNoiseSuppressionEffect.bind(this);
    this.stopNoiseSuppressionEffect.bind(this);
    this.submitSurvey.bind(this);
    this.startSpotlight.bind(this);
    this.stopSpotlight.bind(this);
    this.stopAllSpotlight.bind(this);
    this.muteParticipant.bind(this);
    this.muteAllRemoteParticipants.bind(this);
    this.forbidOthersAudio.bind(this);
    this.permitOthersAudio.bind(this);
    this.forbidOthersAudio.bind(this);
    this.permitOthersAudio.bind(this);
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

  public async askDevicePermission(constrain: PermissionConstraints): Promise<DeviceAccess> {
    const startTime = new Date().getTime();
    return await this.asyncTeeErrorToEventEmitter(async () => {
      const result = await this.deviceManager.askDevicePermission(constrain);
      const endTime = new Date().getTime();
      compositeLogger.info('time to query askDevicePermissions', endTime - startTime, 'ms');
      return result;
    });
  }

  public joinCall(options?: boolean | JoinCallOptions): CallTypeOf<AgentType> | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call!');
    } else if (this.locator === undefined) {
      throw new Error('Locator is not defined!');
    }

    return this.teeErrorToEventEmitter(() => {
      // Default to keeping camera/mic on if no override argument specified
      let shouldCameraBeOnInCall = this.getState().cameraStatus === 'On';
      let shouldMicrophoneBeOnInCall = this.getState().isLocalPreviewMicrophoneEnabled;

      // Apply override arguments
      if (typeof options === 'boolean') {
        // Deprecated joinCall API (boolen)
        shouldMicrophoneBeOnInCall = options;
      } else if (typeof options === 'object') {
        // Options bag API
        if (options.microphoneOn && options.microphoneOn !== 'keep') {
          shouldMicrophoneBeOnInCall = options.microphoneOn;
        }
        if (options.cameraOn && options.cameraOn !== 'keep') {
          shouldCameraBeOnInCall = options.cameraOn;
        }
      }

      const audioOptions: AudioOptions = { muted: !shouldMicrophoneBeOnInCall };
      const selectedCamera = getSelectedCameraFromAdapterState(this.getState());
      const videoOptions: VideoOptions =
        selectedCamera && shouldCameraBeOnInCall
          ? { localVideoStreams: [new SDKLocalVideoStream(selectedCamera)] }
          : {};
      const call = this._joinCall(audioOptions, videoOptions);

      this.originCall = call;
      this.processNewCall(call);
      return call;
    });
  }

  private _joinCall(audioOptions: AudioOptions, videoOptions: VideoOptions): CallTypeOf<AgentType> {
    const isTeamsMeeting = this.locator ? 'meetingLink' in this.locator : false;
    const isTeamsMeetingId = this.locator ? 'meetingId' in this.locator : false;
    const isRoomsCall = this.locator ? 'roomId' in this.locator : false;

    if (_isTeamsCallAgent(this.callAgent)) {
      if (isTeamsMeeting) {
        return this.callAgent.join(this.locator as TeamsMeetingLinkLocator, {
          audioOptions,
          videoOptions
        }) as CallTypeOf<AgentType>;
      }
      if (isTeamsMeetingId) {
        return this.callAgent.join(this.locator as TeamsMeetingIdLocator, {
          audioOptions,
          videoOptions
        }) as CallTypeOf<AgentType>;
      }
      throw new Error('Locator not supported by TeamsCallAgent');
    }

    if (isTeamsMeeting) {
      return this.callAgent.join(this.locator as TeamsMeetingLinkLocator, {
        audioOptions,
        videoOptions
      }) as CallTypeOf<AgentType>;
    }

    if (isTeamsMeetingId) {
      return this.callAgent.join(this.locator as TeamsMeetingIdLocator, {
        audioOptions,
        videoOptions
      }) as CallTypeOf<AgentType>;
    }
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
    if (remoteUserId !== '') {
      await this.handlers.onDisposeRemoteScreenShareStreamView(remoteUserId);
    } else {
      await this.handlers.onDisposeLocalScreenShareStreamView();
    }
  }

  public async disposeRemoteVideoStreamView(remoteUserId: string): Promise<void> {
    await this.handlers.onDisposeRemoteVideoStreamView(remoteUserId);
  }

  public async disposeLocalVideoStreamView(): Promise<void> {
    await this.handlers.onDisposeLocalStreamView();
  }

  /* @conditional-compile-remove(together-mode) */
  public async createTogetherModeStreamView(
    options?: TogetherModeStreamOptions
  ): Promise<void | TogetherModeStreamViewResult> {
    return await this.handlers.onCreateTogetherModeStreamView(options);
  }

  /* @conditional-compile-remove(together-mode) */
  public async startTogetherMode(): Promise<void> {
    return await this.handlers.onStartTogetherMode();
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeSceneSize(width: number, height: number): void {
    return this.handlers.onSetTogetherModeSceneSize(width, height);
  }

  /* @conditional-compile-remove(together-mode) */
  public async disposeTogetherModeStreamView(): Promise<void> {
    return await this.handlers.onDisposeTogetherModeStreamView();
  }

  public async leaveCall(forEveryone?: boolean): Promise<void> {
    if (this.getState().page === 'transferring') {
      const transferCall = this.callAgent.calls.filter(
        (call) => call.id === this.getState().acceptedTransferCallState?.id
      )[0];
      transferCall?.hangUp();
    }
    await this.handlers.onHangUp(forEveryone);
    this.unsubscribeCallEvents();
    this.handlers = createHandlers(this.callClient, this.callAgent, this.deviceManager, this.call, {
      onResolveVideoBackgroundEffectsDependency: this.onResolveVideoBackgroundEffectsDependency,
      onResolveDeepNoiseSuppressionDependency: this.onResolveDeepNoiseSuppressionDependency
    });
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

        {
          const selectedEffect = this.getState().selectedVideoBackgroundEffect;
          const selectedCamera = getSelectedCameraFromAdapterState(this.getState());
          if (selectedEffect && selectedCamera && this.onResolveVideoBackgroundEffectsDependency) {
            const stream = new SDKLocalVideoStream(selectedCamera);
            const effect = getBackgroundEffectFromSelectedEffect(
              selectedEffect,
              await this.onResolveVideoBackgroundEffectsDependency()
            );

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
      if ((_isInCall(this.call?.state) || _isInLobbyOrConnecting(this.call?.state)) && this.call?.isMuted) {
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

  public async raiseHand(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onToggleRaiseHand();
    });
  }

  public async lowerHand(): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onToggleRaiseHand();
    });
  }

  public async onReactionClick(reaction: Reaction): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onReactionClick(reaction);
    });
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public allowUnsupportedBrowserVersion(): void {
    this.context.setAllowedUnsupportedBrowser();
    this.context.updateClientState(this.callClient.getState());
  }

  public async startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void> {
    if (this.isBlurEffect(videoBackgroundEffect)) {
      const blurConfig = videoBackgroundEffect as BackgroundBlurConfig;
      await this.handlers.onBlurVideoBackground(blurConfig);
    } else if (this.isReplacementEffect(videoBackgroundEffect)) {
      const replaceConfig = videoBackgroundEffect as BackgroundReplacementConfig;
      await this.handlers.onReplaceVideoBackground(replaceConfig);
    }
  }

  public async stopVideoBackgroundEffects(): Promise<void> {
    await this.handlers.onRemoveVideoBackgroundEffects();
  }

  public updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void {
    this.context.setBackroundPickerImages(backgroundImages);
  }

  public updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void {
    this.context.setSelectedVideoBackgroundEffect(selectedVideoBackground);
  }

  public async startNoiseSuppressionEffect(): Promise<void> {
    await this.handlers.onStartNoiseSuppressionEffect();
  }

  public async stopNoiseSuppressionEffect(): Promise<void> {
    await this.handlers.onStopNoiseSuppressionEffect();
  }

  public startCall(
    participants:
      | string[]
      | (
          | MicrosoftTeamsAppIdentifier
          | PhoneNumberIdentifier
          | CommunicationUserIdentifier
          | MicrosoftTeamsUserIdentifier
          | UnknownIdentifier
        )[],
    options?: StartCallOptions
  ): CallTypeOf<AgentType> | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call.');
    }

    const isCameraOn = this.getState().cameraStatus === 'On';
    const selectedCamera = getSelectedCameraFromAdapterState(this.getState());
    /* we only configure the video options here since the Calling SDK always unmutes the participant when starting a call */
    const startCallVideoOptions: StartCallOptions = selectedCamera
      ? {
          videoOptions: isCameraOn ? { localVideoStreams: [new SDKLocalVideoStream(selectedCamera)] } : undefined
        }
      : {};

    const combinedCallOptions = { ...startCallVideoOptions, ...options };

    const idsToAdd = participants.map((participant) => {
      const backendId: CommunicationIdentifier = _toCommunicationIdentifier(participant);
      if ('phoneNumber' in backendId) {
        if (options?.alternateCallerId === undefined) {
          throw new Error('Unable to start call, PSTN user present with no alternateCallerId.');
        }
      }
      return backendId;
    });

    this.context.setTargetCallee(
      idsToAdd as (
        | MicrosoftTeamsAppIdentifier
        | PhoneNumberIdentifier
        | CommunicationUserIdentifier
        | MicrosoftTeamsUserIdentifier
        | UnknownIdentifier
      )[]
    );

    const call = this.handlers.onStartCall(idsToAdd, combinedCallOptions) as CallTypeOf<AgentType>;
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
    this.handlers = createHandlers(this.callClient, this.callAgent, this.deviceManager, this.call, {
      onResolveVideoBackgroundEffectsDependency: this.onResolveVideoBackgroundEffectsDependency,
      onResolveDeepNoiseSuppressionDependency: this.onResolveDeepNoiseSuppressionDependency
    });
    this.subscribeCallEvents();
  }

  private isBlurEffect(effect: VideoBackgroundEffect): effect is VideoBackgroundBlurEffect {
    return effect.effectName === 'blur';
  }

  private isReplacementEffect(effect: VideoBackgroundEffect): effect is VideoBackgroundReplacementEffect {
    return effect.effectName === 'replacement';
  }

  public async removeParticipant(userId: string | CommunicationIdentifier): Promise<void> {
    let participant = userId;
    participant = _toCommunicationIdentifier(userId);
    this.handlers.onRemoveParticipant(participant);
  }

  public async addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;

  public async addParticipant(participant: CommunicationUserIdentifier): Promise<void>;

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

  public async holdCall(): Promise<void> {
    if (this.call?.state !== 'LocalHold') {
      if (this.call?.isLocalVideoStarted) {
        this.stopCamera().then(() => {
          this.handlers.onToggleHold();
        });
      } else {
        this.handlers.onToggleHold();
      }
    }
  }

  public async resumeCall(): Promise<void> {
    if (this.call?.state === 'LocalHold') {
      this.handlers.onToggleHold().then(() => {
        if (this.call?.feature(Features.Capabilities).capabilities.turnVideoOn.isPresent === false) {
          this.stopCamera();
        }
      });
    }
  }

  public async sendDtmfTone(dtmfTone: DtmfTone): Promise<void> {
    this.handlers.onSendDtmfTone(dtmfTone);
  }

  public async startCaptions(options?: StartCaptionsAdapterOptions): Promise<void> {
    if (options?.startInBackground) {
      this.context.updateCaptionsStartedInBackground(true);
    } else {
      this.context.updateCaptionsStartedWithUI(true);
    }
    this.handlers.onStartCaptions(options);
  }

  public async stopCaptions(options?: StopCaptionsAdapterOptions): Promise<void> {
    if (options?.stopInBackground) {
      this.context.updateCaptionsStartedInBackground(false);
    }

    this.context.updateCaptionsStartedWithUI(false);

    // Only stop captions if they are not still running in the background
    if (!this.context.getState().captionsTriggers?.captionsStartedInBackground) {
      this.handlers.onStopCaptions();
    }
  }

  public async setCaptionLanguage(language: string): Promise<void> {
    this.handlers.onSetCaptionLanguage(language);
  }

  public async setSpokenLanguage(language: string): Promise<void> {
    this.handlers.onSetSpokenLanguage(language);
  }
  /* @conditional-compile-remove(rtt) */
  public async sendRealTimeText(text: string, isFinalized: boolean): Promise<void> {
    this.handlers.onSendRealTimeText(text, isFinalized);
  }
  public async submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    return this.handlers.onSubmitSurvey(survey);
  }

  public async muteParticipant(userId: string): Promise<void> {
    this.handlers.onMuteParticipant(userId);
  }

  public async muteAllRemoteParticipants(): Promise<void> {
    this.handlers.onMuteAllRemoteParticipants();
  }

  public async startSpotlight(userIds?: string[]): Promise<void> {
    this.handlers.onStartSpotlight(userIds);
  }

  public async stopSpotlight(userIds?: string[]): Promise<void> {
    this.handlers.onStopSpotlight(userIds);
  }

  public async stopAllSpotlight(): Promise<void> {
    this.handlers.onStopAllSpotlight();
  }

  public async forbidAudio(userIds: string[]): Promise<void> {
    this.handlers.onForbidAudio?.(userIds);
  }

  public async permitAudio(userIds: string[]): Promise<void> {
    this.handlers.onPermitAudio?.(userIds);
  }

  public async forbidOthersAudio(): Promise<void> {
    this.handlers.onForbidOthersAudio?.();
  }

  public async permitOthersAudio(): Promise<void> {
    this.handlers.onPermitOthersAudio?.();
  }

  public async forbidVideo(userIds: string[]): Promise<void> {
    this.handlers.onForbidVideo?.(userIds);
  }

  public async permitVideo(userIds: string[]): Promise<void> {
    this.handlers.onPermitVideo?.(userIds);
  }

  public async forbidOthersVideo(): Promise<void> {
    this.handlers.onForbidOthersVideo?.();
  }

  public async permitOthersVideo(): Promise<void> {
    this.handlers.onPermitOthersVideo?.();
  }

  public async returnFromBreakoutRoom(): Promise<void> {
    const callState = this.call?.id ? this.callClient.getState().calls[this.call.id] : undefined;
    const assignedBreakoutRoom = callState?.breakoutRooms?.assignedBreakoutRoom;

    if (!assignedBreakoutRoom) {
      throw new Error(
        'Could not return from breakout room because assigned breakout room state could not be retrieved.'
      );
    }

    this.context.setIsReturningFromBreakoutRoom(true);

    const mainMeeting = await assignedBreakoutRoom.returnToMainMeeting();
    this.originCall = mainMeeting;
    this.processNewCall(mainMeeting);
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
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  on(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  on(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  /* @conditional-compile-remove(rtt) */
  on(event: 'realTimeTextReceived', listener: RealTimeTextReceivedListener): void;
  on(event: 'transferAccepted', listener: TransferAcceptedListener): void;
  on(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  on(event: 'roleChanged', listener: PropertyChangedEvent): void;
  on(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  on(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
  on(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: string, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  private subscribeToCaptionEvents(): void {
    const captionsFeature = this.call?.feature(Features.Captions);
    if (
      captionsFeature?.captions.kind === 'TeamsCaptions' &&
      (this.context.getState().isTeamsCall || this.context.getState().isTeamsMeeting)
    ) {
      const teamsCaptionsFeature = captionsFeature.captions as TeamsCaptions;
      teamsCaptionsFeature.on('CaptionsReceived', this.teamsCaptionsReceived.bind(this));
      teamsCaptionsFeature.on('CaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));
      teamsCaptionsFeature.on('CaptionLanguageChanged', this.isCaptionLanguageChanged.bind(this));
      teamsCaptionsFeature.on('SpokenLanguageChanged', this.isSpokenLanguageChanged.bind(this));
    } else {
      const acsCaptionsFeature = captionsFeature?.captions as Captions;

      acsCaptionsFeature.on('CaptionsReceived', this.captionsReceived.bind(this));

      acsCaptionsFeature.on('CaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));

      acsCaptionsFeature.on('SpokenLanguageChanged', this.isSpokenLanguageChanged.bind(this));

      captionsFeature?.on('CaptionsKindChanged', this.captionsKindChanged.bind(this));
    }
  }

  private unsubscribeFromCaptionEvents(): void {
    const captionsFeature = this.call?.feature(Features.Captions);
    if (
      captionsFeature?.captions.kind === 'TeamsCaptions' &&
      (this.context.getState().isTeamsCall || this.context.getState().isTeamsMeeting)
    ) {
      const teamsCaptionsFeature = captionsFeature.captions as TeamsCaptions;
      teamsCaptionsFeature.off('CaptionsReceived', this.teamsCaptionsReceived.bind(this));
      teamsCaptionsFeature.off('CaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));
      teamsCaptionsFeature.off('CaptionLanguageChanged', this.isCaptionLanguageChanged.bind(this));
      teamsCaptionsFeature.off('SpokenLanguageChanged', this.isSpokenLanguageChanged.bind(this));
    } else {
      const acsCaptionsFeature = captionsFeature?.captions as Captions;

      acsCaptionsFeature.off('CaptionsReceived', this.captionsReceived.bind(this));

      acsCaptionsFeature.off('CaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));

      acsCaptionsFeature.off('SpokenLanguageChanged', this.isSpokenLanguageChanged.bind(this));

      captionsFeature?.off('CaptionsKindChanged', this.captionsKindChanged.bind(this));
    }
  }

  private subscribeCallEvents(): void {
    if (this.call) {
      this.callingSoundSubscriber = new CallingSoundSubscriber(
        this.call,
        this.getState().targetCallees,
        this.getState().sounds
      );
    }
    this.call?.on('remoteParticipantsUpdated', this.onRemoteParticipantsUpdated.bind(this));
    this.call?.on('isMutedChanged', this.isMyMutedChanged.bind(this));
    this.call?.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged.bind(this));
    this.call?.on('idChanged', this.callIdChanged.bind(this));
    this.call?.on('roleChanged', this.roleChanged.bind(this));

    this.subscribeToCaptionEvents();
    this.call?.feature(Features.Transfer).on('transferAccepted', this.transferAccepted.bind(this));
    this.call?.feature(Features.Capabilities).on('capabilitiesChanged', this.capabilitiesChanged.bind(this));
    this.call?.feature(Features.Spotlight).on('spotlightChanged', this.spotlightChanged.bind(this));
    /* @conditional-compile-remove(rtt) */
    try {
      this.call?.feature(Features.RealTimeText).on('realTimeTextReceived', this.realTimeTextReceived.bind(this));
    } catch (e) {
      console.log('RealTimeText feature is not supported');
    }
    const breakoutRoomsFeature = this.call?.feature(Features.BreakoutRooms);
    if (breakoutRoomsFeature) {
      breakoutRoomsFeature.on('breakoutRoomsUpdated', this.breakoutRoomsUpdated.bind(this));
    }
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
    this.call?.off('roleChanged', this.roleChanged.bind(this));

    this.unsubscribeFromCaptionEvents();
    /* @conditional-compile-remove(rtt) */
    try {
      this.call?.feature(Features.RealTimeText).off('realTimeTextReceived', this.realTimeTextReceived.bind(this));
    } catch (e) {
      console.log('RealTimeText feature is not supported');
    }
    if (this.callingSoundSubscriber) {
      this.callingSoundSubscriber.unsubscribeAll();
    }
    const breakoutRoomsFeature = this.call?.feature(Features.BreakoutRooms);
    if (breakoutRoomsFeature) {
      breakoutRoomsFeature.off('breakoutRoomsUpdated', this.breakoutRoomsUpdated.bind(this));
    }
  }

  private isMyMutedChanged = (): void => {
    this.emitter.emit('isMutedChanged', {
      participantId: this.getState().userId,
      isMuted: this.call?.isMuted
    });
  };

  private captionsKindChanged(): void {
    const captionsFeature = this.call?.feature(Features.Captions);
    const teamsCaptionsFeature = captionsFeature?.captions as TeamsCaptions;
    teamsCaptionsFeature.on('CaptionsReceived', this.teamsCaptionsReceived.bind(this));
    teamsCaptionsFeature.on('CaptionsActiveChanged', this.isCaptionsActiveChanged.bind(this));
    teamsCaptionsFeature.on('CaptionLanguageChanged', this.isCaptionLanguageChanged.bind(this));
    teamsCaptionsFeature.on('SpokenLanguageChanged', this.isSpokenLanguageChanged.bind(this));
  }

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

  private teamsCaptionsReceived(captionsInfo: TeamsCaptionsInfo): void {
    this.emitter.emit('captionsReceived', { captionsInfo });
  }

  private captionsReceived(captionsInfo: CaptionsInfo): void {
    this.emitter.emit('captionsReceived', { captionsInfo });
  }
  /* @conditional-compile-remove(rtt) */
  private realTimeTextReceived(realTimeText: RealTimeTextInfo): void {
    this.emitter.emit('realTimeTextReceived', { realTimeText });
  }

  private isCaptionsActiveChanged(): void {
    const captionsFeature = this.call?.feature(Features.Captions).captions as TeamsCaptions | Captions;
    this.emitter.emit('isCaptionsActiveChanged', {
      isActive: captionsFeature.isCaptionsFeatureActive
    });
  }

  private isSpokenLanguageChanged(): void {
    const captionsFeature = this.call?.feature(Features.Captions).captions as TeamsCaptions | Captions;
    this.emitter.emit('isSpokenLanguageChanged', {
      activeSpokenLanguage: captionsFeature.activeSpokenLanguage
    });
  }

  private isCaptionLanguageChanged(): void {
    const captionsFeature = this.call?.feature(Features.Captions).captions as TeamsCaptions;
    this.emitter.emit('isCaptionLanguageChanged', {
      activeCaptionLanguage: captionsFeature.activeCaptionLanguage
    });
  }

  private transferAccepted(args: TransferEventArgs): void {
    this.emitter.emit('transferAccepted', args);
  }

  private capabilitiesChanged(data: CapabilitiesChangeInfo): void {
    if (data.newValue.turnVideoOn?.isPresent === false) {
      // stopCamera is handled by web sdk when video hard muted.
      this.disposeLocalVideoStreamView();
    }

    if (data.newValue.shareScreen?.isPresent === false) {
      this.stopScreenShare();
    }
    this.emitter.emit('capabilitiesChanged', data);
  }

  private roleChanged(): void {
    if (this.call?.role === 'Consumer') {
      this.call?.feature(Features.RaiseHand).lowerHand();
    }
    this.emitter.emit('roleChanged');
  }

  private spotlightChanged(args: { added: SpotlightedParticipant[]; removed: SpotlightedParticipant[] }): void {
    this.emitter.emit('spotlightChanged', args);
  }

  private breakoutRoomsUpdated(eventData: BreakoutRoomsEventData): void {
    if (eventData.type === 'assignedBreakoutRooms') {
      this.assignedBreakoutRoomUpdated(eventData.data);
    } else if (eventData.type === 'join') {
      this.breakoutRoomJoined(eventData.data);
    }
    this.emitter.emit('breakoutRoomsUpdated', eventData);
  }

  private assignedBreakoutRoomUpdated(breakoutRoom?: BreakoutRoom): void {
    if (!this.call?.id) {
      return;
    }
    if (this.originCall?.id !== this.call?.id && (!breakoutRoom || breakoutRoom.state === 'closed')) {
      this.returnFromBreakoutRoom();
    }
  }

  private breakoutRoomJoined(call: Call | TeamsCall): void {
    if (this.call?.id !== call.id) {
      this.processNewCall(call);
    }
    // Hang up other breakout room calls in case we are joining a new breakout room while already in one
    this.hangupOtherBreakoutRoomCalls(call.id);
  }

  private hangupOtherBreakoutRoomCalls(currentBreakoutRoomCallId: string): void {
    // Get other breakout room calls by checking which other calls have breakout room settings defined
    const otherBreakoutRoomCallStates = Object.values(this.callClient.getState().calls).filter((callState) => {
      return callState.breakoutRooms?.breakoutRoomSettings && callState.id !== currentBreakoutRoomCallId;
    });

    // Hang up other breakout room calls
    for (const breakoutRoom of otherBreakoutRoomCallStates) {
      const breakoutRoomCall = this.callAgent.calls.find((callAgentCall) => {
        return callAgentCall.id === breakoutRoom.id;
      });
      breakoutRoomCall?.hangUp();
    }
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
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  off(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  off(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  /* @conditional-compile-remove(rtt) */
  off(event: 'realTimeTextReceived', listener: RealTimeTextReceivedListener): void;
  off(event: 'transferAccepted', listener: TransferAcceptedListener): void;
  off(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  off(event: 'roleChanged', listener: PropertyChangedEvent): void;
  off(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  off(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
  off(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;

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

/* @conditional-compile-remove(call-participants-locator) */
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
  | RoomCallLocator
  | /* @conditional-compile-remove(call-participants-locator) */ CallParticipantsLocator
  | TeamsMeetingIdLocator;

/**
 * Common optional parameters to create {@link AzureCommunicationCallAdapter} or {@link TeamsCallAdapter}
 *
 * @public
 */
export type CommonCallAdapterOptions = {
  /**
   * Default set of background images for background image picker.
   */
  videoBackgroundOptions?: {
    videoBackgroundImages?: VideoBackgroundImage[];
    onResolveDependency?: () => Promise<VideoBackgroundEffectsDependency>;
  };
  /**
   * `DeepNoiseSuppressionEffect` options to be used for noise suppression.
   */
  deepNoiseSuppressionOptions?: {
    onResolveDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
    deepNoiseSuppressionOnByDefault?: boolean;
    hideDeepNoiseSuppressionButton?: boolean;
  };
  /**
   * Use this to fetch profile information which will override data in {@link CallAdapterState} like display name
   * The onFetchProfile is fetch-and-forget one time action for each user, once a user profile is updated, the value will be cached
   * and would not be updated again within the lifecycle of adapter.
   */
  onFetchProfile?: OnFetchProfileCallback;
  /**
   * Sounds to use for calling events
   */
  callingSounds?: CallingSounds;
  /**
   * Reaction resource for reaction resources
   * @beta
   */
  reactionResources?: ReactionResources;
  /**
   * A phone number in E.164 format procured using Azure Communication Services that will be used to represent callers identity.
   * E.164 numbers are formatted as [+] [country code] [phone number including area code]. For example, +14255550123 for a US phone number.
   */
  alternateCallerId?: string;
};

/**
 * Optional parameters to create {@link AzureCommunicationCallAdapter}
 *
 * @public
 */
export type AzureCommunicationCallAdapterOptions = CommonCallAdapterOptions;

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
  /**
   * Optional parameters for the {@link AzureCommunicationCallAdapter} created
   */
  options?: AzureCommunicationCallAdapterOptions;
};

/**
 * Arguments for creating the Azure Communication Services implementation of {@link CallAdapter}.
 *
 * These arguments are used to create an outbound call scenarios.
 *
 * Note: `displayName` can be a maximum of 256 characters.
 *
 * @public
 */
export type AzureCommunicationOutboundCallAdapterArgs = {
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  targetCallees: StartCallIdentifier[];
  /**
   * A phone number in E.164 format procured using Azure Communication Services that will be used to represent callers identity.
   * E.164 numbers are formatted as [+] [country code] [phone number including area code]. For example, +14255550123 for a US phone number.
   */
  alternateCallerId?: string;

  /**
   * Optional parameters for the {@link AzureCommunicationCallAdapter} created
   */
  options?: AzureCommunicationCallAdapterOptions;
};

/**
 * Optional parameters to create {@link TeamsCallAdapter}
 *
 * @public
 */
export type TeamsAdapterOptions = CommonCallAdapterOptions;

/**
 * Common part of args to create the Azure Communication Services implementation of {@link TeamsCallAdapter}.
 *
 * @public
 */
export type TeamsCallAdapterArgsCommon = {
  userId: MicrosoftTeamsUserIdentifier;
  credential: CommunicationTokenCredential;
  options?: TeamsAdapterOptions;
};

/**
 * Arguments for creating the Azure Communication Services implementation of {@link TeamsCallAdapter}.
 *
 * @public
 */
export type TeamsCallAdapterArgs = TeamsCallAdapterArgsCommon & {
  locator:
    | TeamsMeetingLinkLocator
    | /* @conditional-compile-remove(call-participants-locator) */ CallParticipantsLocator
    | TeamsMeetingIdLocator;
};

/* @conditional-compile-remove(teams-identity-support-beta) */
/**
 * Parameter to start a call using a Teams user identity.
 *
 * @beta
 */
export type StartTeamsCallIdentifier =
  | MicrosoftTeamsUserIdentifier
  | PhoneNumberIdentifier
  | MicrosoftTeamsAppIdentifier
  | UnknownIdentifier;

/* @conditional-compile-remove(teams-identity-support-beta) */
/**
 * Arguments for creating the Azure Communication Services implementation of {@link TeamsCallAdapter}.
 *
 * This is used to create an outbound call scenarios.
 *
 * @beta
 */
export type TeamsOutboundCallAdapterArgs = TeamsCallAdapterArgsCommon & {
  targetCallees: StartTeamsCallIdentifier[];
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
export async function createAzureCommunicationCallAdapter(
  args: AzureCommunicationCallAdapterArgs
): Promise<CallAdapter>;
/**
 * Create a {@link CallAdapter} backed by Azure Communication Services.
 *
 * This is the default implementation of {@link CallAdapter} provided by this library.
 *
 * Note: `displayName` can be a maximum of 256 characters.
 *
 * @public
 */
export async function createAzureCommunicationCallAdapter(
  args: AzureCommunicationOutboundCallAdapterArgs
): Promise<CallAdapter>;
/**
 * @public
 */
/**
 * Create a {@link CallAdapter} backed by Azure Communication Services.
 *
 * This is the default implementation of {@link CallAdapter} provided by this library.
 *
 * Note: `displayName` can be a maximum of 256 characters.
 *
 * @public
 */
export async function createAzureCommunicationCallAdapter(
  args: AzureCommunicationCallAdapterArgs | AzureCommunicationOutboundCallAdapterArgs
): Promise<CallAdapter> {
  if (isMicrosoftTeamsUserIdentifier(args.userId)) {
    throw new Error(
      'Microsoft Teams user identifier is not supported by AzureCommunicationCallAdapter. Instead use TeamsCallAdapter.'
    );
  }
  return _createAzureCommunicationCallAdapterInner({
    userId: args.userId,
    displayName: args.displayName,
    credential: args.credential,
    locator: (args as AzureCommunicationCallAdapterArgs).locator,
    targetCallees: (args as AzureCommunicationOutboundCallAdapterArgs).targetCallees,
    options: args.options
  });
}

/**
 * This inner function is used to allow injection of TelemetryImplementationHint without changing the public API.
 *
 * @internal
 */
export const _createAzureCommunicationCallAdapterInner = async ({
  userId,
  displayName,
  credential,
  locator,
  targetCallees,
  options,
  telemetryImplementationHint = 'Call'
}: {
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  locator: CallAdapterLocator;
  targetCallees?: StartCallIdentifier[];
  alternateCallerId?: string;
  options?: AzureCommunicationCallAdapterOptions;
  telemetryImplementationHint?: _TelemetryImplementationHint;
}): Promise<CallAdapter> => {
  if (!_isValidIdentifier(userId)) {
    throw new Error('Invalid identifier. Please provide valid identifier object.');
  }
  const callClient = _createStatefulCallClientInner(
    {
      userId
    },
    undefined,
    telemetryImplementationHint
  );
  const callAgent = await callClient.createCallAgent(credential, {
    displayName
  });
  let adapter;
  if (locator) {
    adapter = createAzureCommunicationCallAdapterFromClient(callClient, callAgent, locator, options);
  } else {
    adapter = createAzureCommunicationCallAdapterFromClient(
      callClient,
      callAgent,
      targetCallees as StartCallIdentifier[],
      options
    );
  }
  return adapter;
};

/**
 * @public
 */
export const createTeamsCallAdapter = async (
  args:
    | TeamsCallAdapterArgs
    | /* @conditional-compile-remove(teams-identity-support-beta) */ TeamsOutboundCallAdapterArgs
): Promise<TeamsCallAdapter> => {
  const { userId, credential, options } = args;
  if (isCommunicationUserIdentifier(userId)) {
    throw new Error(
      'Communication User identifier is not supported by TeamsCallAdapter, please use our AzureCommunicationCallAdapter.'
    );
  }
  const callClient = _createStatefulCallClientInner(
    {
      userId
    },
    undefined,
    'Call' as _TelemetryImplementationHint
  );
  const callAgent = await callClient.createTeamsCallAgent(credential, {
    undefined
  });

  /* @conditional-compile-remove(teams-identity-support-beta) */
  if ('targetCallees' in args) {
    return createTeamsCallAdapterFromClient(callClient, callAgent, args.targetCallees, options);
  }

  const adapter = createTeamsCallAdapterFromClient(callClient, callAgent, args.locator, options);
  return adapter;
};

type PartialArgsType<Adapter> = Adapter extends CallAdapter
  ? Partial<AzureCommunicationCallAdapterArgs>
  : Partial<TeamsCallAdapterArgs>;

type PartialArgsOutboundType<Adapter> = Adapter extends CallAdapter
  ? Partial<AzureCommunicationOutboundCallAdapterArgs>
  : Partial<TeamsCallAdapterArgs>;

type AdapterOf<AdapterKind extends 'AzureCommunication' | 'Teams'> = AdapterKind extends 'AzureCommunication'
  ? CallAdapter
  : never | TeamsCallAdapter;

/**
 * @private
 */
function useAzureCommunicationCallAdapterGeneric<
  AdapterKind extends 'AzureCommunication' | 'Teams',
  Adapter extends AdapterOf<AdapterKind>
>(
  args: PartialArgsType<Adapter>,
  adapterKind: AdapterKind,
  afterCreate?: (adapter: Adapter) => Promise<Adapter>,
  beforeDispose?: (adapter: Adapter) => Promise<void>
): Adapter | undefined;
/**
 * @private
 */
function useAzureCommunicationCallAdapterGeneric<
  AdapterKind extends 'AzureCommunication' | 'Teams',
  Adapter extends AdapterOf<AdapterKind>
>(
  args: PartialArgsOutboundType<Adapter>,
  adapterKind: AdapterKind,
  afterCreate?: (adapter: Adapter) => Promise<Adapter>,
  beforeDispose?: (adapter: Adapter) => Promise<void>
): Adapter | undefined;
/**
 * @private
 */
function useAzureCommunicationCallAdapterGeneric<
  AdapterKind extends 'AzureCommunication' | 'Teams',
  Adapter extends AdapterOf<AdapterKind>
>(
  args: PartialArgsType<Adapter> | PartialArgsOutboundType<Adapter>,
  adapterKind: AdapterKind = 'AzureCommunication' as AdapterKind,
  afterCreate?: (adapter: Adapter) => Promise<Adapter>,
  beforeDispose?: (adapter: Adapter) => Promise<void>
): Adapter | undefined {
  const { credential, userId } = args;
  const locator = 'locator' in args ? args.locator : undefined;
  const targetCallees = 'targetCallees' in args ? args.targetCallees : undefined;
  const displayName = 'displayName' in args ? args.displayName : undefined;

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
      if (!credential || (!locator && !targetCallees) || !userId) {
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
          if (creatingAdapterRef.current) {
            console.warn(
              'Adapter is already being created, please see storybook for more information: https://azure.github.io/communication-ui-library/?path=/story/troubleshooting--page'
            );
            return;
          }
          creatingAdapterRef.current = true;
          if (locator) {
            newAdapter = (await createAzureCommunicationCallAdapter({
              credential,
              displayName: displayName,
              locator,
              userId: userId as CommunicationUserIdentifier,
              options
            })) as Adapter;
          } else if (targetCallees) {
            newAdapter = (await createAzureCommunicationCallAdapter({
              credential,
              displayName: displayName,
              targetCallees,
              userId: userId as CommunicationUserIdentifier,
              options
            })) as Adapter;
          }
        } else if (adapterKind === 'Teams') {
          if (creatingAdapterRef.current) {
            console.warn('Adapter is already being created, skipping creation.');
            return;
          }
          creatingAdapterRef.current = true;
          if (targetCallees) {
            /* @conditional-compile-remove(teams-identity-support-beta) */
            newAdapter = (await createTeamsCallAdapter({
              credential,
              userId: userId as MicrosoftTeamsUserIdentifier,
              targetCallees: targetCallees as StartTeamsCallIdentifier[],
              options
            })) as Adapter;
          } else {
            newAdapter = (await createTeamsCallAdapter({
              credential,
              locator: locator as TeamsMeetingLinkLocator,
              userId: userId as MicrosoftTeamsUserIdentifier,
              options
            })) as Adapter;
          }
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
      options,
      targetCallees
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
}

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
  args: Partial<AzureCommunicationCallAdapterArgs | AzureCommunicationOutboundCallAdapterArgs>,
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
  return useAzureCommunicationCallAdapterGeneric(args, 'AzureCommunication', afterCreate, beforeDispose);
};

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
 * @public
 */
export const useTeamsCallAdapter = (
  /**
   * Arguments to be passed to {@link createAzureCommunicationCallAdapter}.
   *
   * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
   * as they are created. The adapter is only created when all arguments are defined.
   */
  args: Partial<
    TeamsCallAdapterArgs | /* @conditional-compile-remove(teams-identity-support-beta) */ TeamsOutboundCallAdapterArgs
  >,
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
  return useAzureCommunicationCallAdapterGeneric(args, 'Teams', afterCreate, beforeDispose);
};

/**
 * Create a {@link CallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export async function createAzureCommunicationCallAdapterFromClient(
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  targetCallees: StartCallIdentifier[],
  options?: AzureCommunicationCallAdapterOptions
): Promise<CallAdapter>;
/**
 * Create a {@link CallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export async function createAzureCommunicationCallAdapterFromClient(
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locator: CallAdapterLocator,
  options?: AzureCommunicationCallAdapterOptions
): Promise<CallAdapter>;
/**
 * Create a {@link CallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export async function createAzureCommunicationCallAdapterFromClient(
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locatorOrtargetCallees: CallAdapterLocator | StartCallIdentifier[],
  options?: AzureCommunicationCallAdapterOptions
): Promise<CallAdapter> {
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  await Promise.all([deviceManager.getCameras(), deviceManager.getMicrophones()]);
  if (deviceManager.isSpeakerSelectionAvailable) {
    await deviceManager.getSpeakers();
  }
  if (getLocatorOrTargetCallees(locatorOrtargetCallees)) {
    return new AzureCommunicationCallAdapter(
      callClient,
      locatorOrtargetCallees as StartCallIdentifier[],
      callAgent,
      deviceManager,
      options
    );
  } else {
    return new AzureCommunicationCallAdapter(
      callClient,
      locatorOrtargetCallees as CallAdapterLocator,
      callAgent,
      deviceManager,
      options
    );
  }
}

/**
 * Create a {@link TeamsCallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export const createTeamsCallAdapterFromClient = async (
  callClient: StatefulCallClient,
  callAgent: TeamsCallAgent,
  locator:
    | CallAdapterLocator
    | /* @conditional-compile-remove(teams-identity-support-beta) */ StartTeamsCallIdentifier[],
  options?: TeamsAdapterOptions
): Promise<TeamsCallAdapter> => {
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  await Promise.all([deviceManager.getCameras(), deviceManager.getMicrophones()]);
  if (deviceManager.isSpeakerSelectionAvailable) {
    await deviceManager.getSpeakers();
  }
  if (Array.isArray(locator)) {
    return new AzureCommunicationCallAdapter(callClient, locator, callAgent, deviceManager, options);
  } else {
    return new AzureCommunicationCallAdapter(callClient, locator, callAgent, deviceManager, options);
  }
};

const captionsUIVisibilityModifier = (state: CallContextState): CallContextState => {
  // To hide captions to the UI, set isCaptionsFeatureActive to false and startCaptionsInProgress to false
  if (
    state.call?.captionsFeature &&
    state.captionsTriggers?.captionsStartedInBackground &&
    !state.captionsTriggers?.captionsStartedWithUI
  ) {
    return {
      ...state,
      call: {
        ...state.call,
        captionsFeature: {
          ...state.call.captionsFeature,
          isCaptionsFeatureActive: false,
          startCaptionsInProgress: false
        }
      }
    };
  }
  return state;
};

const isCallError = (e: Error): e is CallError => {
  return 'target' in e && 'innerError' in e;
};
