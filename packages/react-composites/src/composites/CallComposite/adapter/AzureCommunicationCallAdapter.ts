// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallingHandlers,
  createDefaultCallingHandlers,
  _isInCall,
  _isInLobbyOrConnecting
} from '@internal/calling-component-bindings';
import {
  CallClientState,
  CallError,
  CallState,
  createStatefulCallClient,
  StatefulCallClient,
  StatefulDeviceManager
} from '@internal/calling-stateful-client';
import {
  AudioOptions,
  CallAgent,
  Call,
  GroupCallLocator,
  TeamsMeetingLinkLocator,
  LocalVideoStream as SDKLocalVideoStream,
  AudioDeviceInfo,
  VideoDeviceInfo,
  RemoteParticipant,
  PermissionConstraints,
  PropertyChangedEvent,
  StartCallOptions,
  VideoOptions
} from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { RoomCallLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { EventEmitter } from 'events';
import {
  CallAdapter,
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
  CallCompositePage,
  OnEndCallPayload
} from './CallAdapter';
import { getCallCompositePage, isCameraOn } from '../utils';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  isCommunicationUserIdentifier,
  isPhoneNumberIdentifier,
  UnknownIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier } from '@azure/communication-common';
import { ParticipantSubscriber } from './ParticipantSubcriber';
import { AdapterError } from '../../common/adapters';
import { DiagnosticsForwarder } from './DiagnosticsForwarder';
import { useEffect, useRef, useState } from 'react';

const endCallPages: CallCompositePage[] = [
  'accessDeniedTeamsMeeting',
  'joinCallFailedDueToNoNetwork',
  'leftCall',
  'removedFromCall'
];

/** Context of call, which is a centralized context for all state updates */
class CallContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: CallAdapterState;
  private callId: string | undefined;

  constructor(clientState: CallClientState, isTeamsCall: boolean) {
    this.state = {
      isLocalPreviewMicrophoneEnabled: false,
      userId: clientState.userId,
      displayName: clientState.callAgent?.displayName,
      devices: clientState.deviceManager,
      call: undefined,
      page: 'configuration',
      latestErrors: clientState.latestErrors,
      isTeamsCall,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId: clientState.alternateCallerId
    };
  }

  public onStateChange(handler: (_uiState: CallAdapterState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: CallAdapterState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: CallAdapterState): void {
    this.state = state;
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

  public onCallEnded(handler: (callEndedData: OnEndCallPayload) => void): void {
    this.emitter.on('callEnded', handler);
  }

  public offCallEnded(handler: (callEndedData: OnEndCallPayload) => void): void {
    this.emitter.off('callEnded', handler);
  }

  public updateClientState(clientState: CallClientState): void {
    const call = this.callId ? clientState.calls[this.callId] : undefined;
    const latestEndedCall = findLatestEndedCall(clientState.callsEnded);

    const newPage = getCallCompositePage(call, latestEndedCall);
    if (!endCallPages.includes(this.state.page) && endCallPages.includes(newPage)) {
      this.emitter.emit('callEnded', {
        callId: this.callId,
        callEndedCode: latestEndedCall?.callEndReason?.code,
        callEndedSubCode: latestEndedCall?.callEndReason?.subCode
      });
    }

    if (this.state.page) {
      this.setState({
        ...this.state,
        userId: clientState.userId,
        displayName: clientState.callAgent?.displayName,
        call,
        page: getCallCompositePage(call, latestEndedCall),
        endedCall: latestEndedCall,
        devices: clientState.deviceManager,
        latestErrors: clientState.latestErrors
      });
    }
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

/**
 * @private
 */
export class AzureCommunicationCallAdapter implements CallAdapter {
  private callClient: StatefulCallClient;
  private callAgent: CallAgent;
  private deviceManager: StatefulDeviceManager;
  private localStream: SDKLocalVideoStream | undefined;
  private locator: CallAdapterLocator;
  // Never use directly, even internally. Use `call` property instead.
  private _call?: Call;
  private context: CallContext;
  private diagnosticsForwarder?: DiagnosticsForwarder;
  private handlers: CallingHandlers;
  private participantSubscribers = new Map<string, ParticipantSubscriber>();
  private emitter: EventEmitter = new EventEmitter();
  private onClientStateChange: (clientState: CallClientState) => void;

  private get call(): Call | undefined {
    return this._call;
  }

  private set call(newCall: Call | undefined) {
    this.resetDiagnosticsForwarder(newCall);
    this._call = newCall;
  }

  constructor(
    callClient: StatefulCallClient,
    locator: CallAdapterLocator,
    callAgent: CallAgent,
    deviceManager: StatefulDeviceManager
  ) {
    this.bindPublicMethods();
    this.callClient = callClient;
    this.callAgent = callAgent;
    this.locator = locator;
    this.deviceManager = deviceManager;
    const isTeamsMeeting = 'meetingLink' in this.locator;
    this.context = new CallContext(callClient.getState(), isTeamsMeeting);

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
    };

    this.handlers = createDefaultCallingHandlers(callClient, callAgent, deviceManager, undefined);

    this.onClientStateChange = onStateChange;

    this.subscribeDeviceManagerEvents();

    this.callClient.onStateChange(onStateChange);
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
    this.on.bind(this);
    this.off.bind(this);
    this.processNewCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.addParticipant.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.holdCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.resumeCall.bind(this);
  }

  public dispose(): void {
    this.resetDiagnosticsForwarder();
    this.callClient.offStateChange(this.onClientStateChange);
    this.callAgent.dispose();
  }

  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return this.deviceManager.getCameras();
    });
  }

  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return this.deviceManager.getMicrophones();
    });
  }

  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return this.deviceManager.isSpeakerSelectionAvailable ? this.deviceManager.getSpeakers() : [];
    });
  }

  public async askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      await this.deviceManager.askDevicePermission(constrain);
    });
  }

  public joinCall(microphoneOn?: boolean): Call | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call!');
    }

    /* @conditional-compile-remove(teams-adhoc-call) */
    /* @conditional-compile-remove(PSTN-calls) */
    if (isOutboundCall(this.locator)) {
      const phoneNumber = this.getState().alternateCallerId;
      return this.startCall(this.locator.participantIDs, {
        alternateCallerId: phoneNumber ? { phoneNumber: phoneNumber } : undefined
      });
    }

    return this.teeErrorToEventEmitter(() => {
      const audioOptions: AudioOptions = { muted: !(microphoneOn ?? this.getState().isLocalPreviewMicrophoneEnabled) };
      // TODO: find a way to expose stream to here
      const videoOptions = { localVideoStreams: this.localStream ? [this.localStream] : undefined };

      const call = this._joinCall(audioOptions, videoOptions);

      this.processNewCall(call);
      return call;
    });
  }

  private _joinCall(audioOptions: AudioOptions, videoOptions: VideoOptions): Call {
    const isTeamsMeeting = !('groupId' in this.locator);
    /* @conditional-compile-remove(rooms) */
    const isRoomsCall = !('roomId' in this.locator);

    if (isTeamsMeeting) {
      return this.callAgent.join(this.locator as TeamsMeetingLinkLocator, {
        audioOptions,
        videoOptions
      });
    }
    /* @conditional-compile-remove(rooms) */
    if (isRoomsCall) {
      return this.callAgent.join(this.locator as RoomCallLocator, {
        audioOptions,
        videoOptions
      });
    }
    return this.callAgent.join(this.locator as GroupCallLocator, {
      audioOptions,
      videoOptions
    });
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

  public async leaveCall(): Promise<void> {
    await this.handlers.onHangUp();
    this.unsubscribeCallEvents();
    this.call = undefined;
    this.handlers = createDefaultCallingHandlers(this.callClient, this.callAgent, this.deviceManager, undefined);
    this.context.setCurrentCallId(undefined);
    // Resync state after callId is set
    this.context.updateClientState(this.callClient.getState());
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

  public startCall(participants: string[], options?: StartCallOptions): Call | undefined {
    if (_isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call.');
    }

    const idsToAdd = participants.map((participant) => {
      // FIXME: `onStartCall` does not allow a Teams user.
      // Need some way to return an error if a Teams user is provided.
      const backendId = fromFlatCommunicationIdentifier(participant);
      if (isPhoneNumberIdentifier(backendId)) {
        if (options?.alternateCallerId === undefined) {
          throw new Error('unable to start call, PSTN user present with no alternateCallerId.');
        }
        return backendId as PhoneNumberIdentifier;
      } else if (isCommunicationUserIdentifier(backendId)) {
        return backendId as CommunicationUserIdentifier;
      }
      return backendId as UnknownIdentifier;
    });

    const call = this.handlers.onStartCall(idsToAdd, options);
    if (!call) {
      throw new Error('Unable to start call.');
    }
    this.processNewCall(call);

    return this.call;
  }

  private processNewCall(call: Call): void {
    this.call = call;
    this.context.setCurrentCallId(call.id);

    // Resync state after callId is set
    this.context.updateClientState(this.callClient.getState());
    this.handlers = createDefaultCallingHandlers(this.callClient, this.callAgent, this.deviceManager, this.call);
    this.subscribeCallEvents();
  }

  public async removeParticipant(userId: string): Promise<void> {
    this.handlers.onRemoveParticipant(userId);
  }

  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(participant: CommunicationIdentifier, options?: AddPhoneNumberOptions): Promise<void> {
    this.handlers.onAddParticipant(participant, options);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: string, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  private subscribeCallEvents(): void {
    this.call?.on('remoteParticipantsUpdated', this.onRemoteParticipantsUpdated.bind(this));
    this.call?.on('isMutedChanged', this.isMyMutedChanged.bind(this));
    this.call?.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged.bind(this));
    this.call?.on('idChanged', this.callIdChanged.bind(this));
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
      this.emitter.emit('participantsJoined', added);
    }
    if (removed && removed.length > 0) {
      this.emitter.emit('participantsLeft', removed);
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

  private callIdChanged(): void {
    this.call?.id && this.emitter.emit('callIdChanged', { callId: this.call.id });
  }

  private resetDiagnosticsForwarder(newCall?: Call): void {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(event: string, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
  }

  private async asyncTeeErrorToEventEmitter<T>(f: () => Promise<T>): Promise<T> {
    try {
      return await f();
    } catch (error) {
      if (isCallError(error)) {
        this.emitter.emit('error', error as AdapterError);
      }
      throw error;
    }
  }

  private teeErrorToEventEmitter<T>(f: () => T): T {
    try {
      return f();
    } catch (error) {
      if (isCallError(error)) {
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
  participantIDs: string[];
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
  alternateCallerId?: string;
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
  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
}: AzureCommunicationCallAdapterArgs): Promise<CallAdapter> => {
  const callClient = createStatefulCallClient({
    userId,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
  });
  const callAgent = await callClient.createCallAgent(credential, {
    displayName
  });
  const adapter = createAzureCommunicationCallAdapterFromClient(callClient, callAgent, locator);
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
  const { credential, displayName, locator, userId, /*@conditional-compile-remove(PSTN-calls) */ alternateCallerId } =
    args;

  // State update needed to rerender the parent component when a new adapter is created.
  const [adapter, setAdapter] = useState<CallAdapter | undefined>(undefined);
  // Ref needed for cleanup to access the old adapter created asynchronously.
  const adapterRef = useRef<CallAdapter | undefined>(undefined);

  const afterCreateRef = useRef<((adapter: CallAdapter) => Promise<CallAdapter>) | undefined>(undefined);
  const beforeDisposeRef = useRef<((adapter: CallAdapter) => Promise<void>) | undefined>(undefined);
  // These refs are updated on *each* render, so that the latest values
  // are used in the `useEffect` closures below.
  // Using a Ref ensures that new values for the callbacks do not trigger the
  // useEffect blocks, and a new adapter creation / distruction is not triggered.
  afterCreateRef.current = afterCreate;
  beforeDisposeRef.current = beforeDispose;

  useEffect(
    () => {
      if (!credential || !displayName || !locator || !userId) {
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

        let newAdapter = await createAzureCommunicationCallAdapter({
          credential,
          displayName,
          locator,
          userId,
          /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
        });
        if (afterCreateRef.current) {
          newAdapter = await afterCreateRef.current(newAdapter);
        }
        adapterRef.current = newAdapter;
        setAdapter(newAdapter);
      })();
    },
    // Explicitly list all arguments so that caller doesn't have to memoize the `args` object.
    [
      adapterRef,
      afterCreateRef,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
      beforeDisposeRef,
      credential,
      displayName,
      locator,
      userId
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
 * Create a {@link CallAdapter} using the provided {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallAdapter} for a simpler API.
 *
 * @public
 */
export const createAzureCommunicationCallAdapterFromClient = async (
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locator: CallAdapterLocator
): Promise<CallAdapter> => {
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  return new AzureCommunicationCallAdapter(callClient, locator, callAgent, deviceManager);
};

const isCallError = (e: Error): e is CallError => {
  return e['target'] !== undefined && e['innerError'] !== undefined;
};

/* @conditional-compile-remove(teams-adhoc-call) */
/* @conditional-compile-remove(PSTN-calls) */
const isOutboundCall = (callLocator: CallAdapterLocator): callLocator is CallParticipantsLocator => {
  return 'participantIDs' in callLocator;
};
