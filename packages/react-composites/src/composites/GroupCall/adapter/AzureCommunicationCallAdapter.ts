// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultCallingHandlers, createDefaultCallingHandlers } from '@azure/acs-calling-selector';
import {
  CallClientState,
  StatefulDeviceManager,
  StatefulCallClient,
  createStatefulCallClient,
  DeviceManager
} from 'calling-stateful-client';
import {
  CallAgent,
  Call,
  CallClientOptions,
  AudioOptions,
  LocalVideoStream as SDKLocalVideoStream,
  AudioDeviceInfo,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { EventEmitter } from 'events';
import { CallAdapter, CallEvent, CallState, IncomingCallListener, ParticipantJoinedListener } from './CallAdapter';
import { createAzureCommunicationUserCredential, getIdFromToken, isInCall } from '../../../utils';
import { VideoStreamOptions } from 'react-components';
import { FlatCommunicationIdentifier, fromFlatCommunicationIdentifier } from 'acs-ui-common';
import { CommunicationUserIdentifier } from '@azure/communication-signaling';

// Context of Chat, which is a centralized context for all state updates
class CallContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: CallState;
  private callId: string | undefined;

  constructor(clientState: CallClientState) {
    this.state = {
      isMicrophoneEnabled: false,
      userId: clientState.userId,
      displayName: clientState.callAgent?.displayName,
      devices: clientState.deviceManager,
      call: undefined,
      page: 'configuration'
    };
  }

  public onStateChange(handler: (_uiState: CallState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: CallState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: CallState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): CallState {
    return this.state;
  }

  public setError(error: Error): void {
    this.setState({ ...this.state, error });
  }

  public setIsMicrophoneEnabled(isMicrophoneEnabled: boolean): void {
    this.setState({ ...this.state, isMicrophoneEnabled });
  }

  public setCallId(callId: string | undefined): void {
    this.callId = callId;
  }

  public updateClientState(clientState: CallClientState): void {
    const call = clientState.calls.get(this.callId ?? '');
    this.setState({
      ...this.state,
      userId: clientState.userId,
      displayName: clientState.callAgent?.displayName,
      call,
      devices: clientState.deviceManager,
      isMicrophoneEnabled: call?.isMuted === undefined ? false : !call?.isMuted
    });
  }
}

export class AzureCommunicationCallAdapter implements CallAdapter {
  private callClient: StatefulCallClient;
  private callAgent: CallAgent;
  private deviceManager: StatefulDeviceManager;
  private localStream: SDKLocalVideoStream | undefined;
  private groupId: string;
  private call: Call | undefined;
  private context: CallContext;
  private handlers: DefaultCallingHandlers;
  private onClientStateChange: (clientState: CallClientState) => void;

  constructor(
    callClient: StatefulCallClient,
    groupId: string,
    callAgent: CallAgent,
    deviceManager: StatefulDeviceManager
  ) {
    this.callClient = callClient;
    this.callAgent = callAgent;
    this.groupId = groupId;
    this.deviceManager = deviceManager;
    this.context = new CallContext(callClient.getState());
    const onStateChange = (clientState: CallClientState): void => {
      // unsubscribe when the instance gets disposed
      if (!this) {
        callClient.offStateChange(onStateChange);
        return;
      }
      this.context.updateClientState(clientState);
    };

    this.handlers = createDefaultCallingHandlers(callClient, callAgent, deviceManager, undefined);

    this.onClientStateChange = onStateChange;

    this.callClient.onStateChange(onStateChange);
  }

  public dispose(): void {
    this.callClient.offStateChange(this.onClientStateChange);
  }

  public queryCameras(): Promise<VideoDeviceInfo[]> {
    return this.deviceManager.getCameras();
  }

  public queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return this.deviceManager.getMicrophones();
  }

  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return this.deviceManager.getSpeakers();
  }

  public async joinCall(): Promise<void> {
    if (isInCall(this.getState().call?.state ?? 'None')) {
      throw new Error('You are already in the call!');
    } else {
      const audioOptions: AudioOptions = { muted: !this.getState().isMicrophoneEnabled };
      // TODO: find a way to expose stream to here
      const videoOptions = { localVideoStreams: this.localStream ? [this.localStream] : undefined };

      const call = this.callAgent.join(
        {
          groupId: this.groupId
        },
        {
          audioOptions,
          videoOptions
        }
      );
      this.call = call;
      this.context.setCallId(call.id);
      // Resync state after callId is set
      this.context.updateClientState(this.callClient.getState());
      this.handlers = createDefaultCallingHandlers(this.callClient, this.callAgent, this.deviceManager, call);
    }
  }

  public async createStreamView(
    userId?: FlatCommunicationIdentifier,
    options?: VideoStreamOptions | undefined
  ): Promise<void> {
    if (userId === undefined) {
      await this.handlers.onCreateLocalStreamView(options);
    } else {
      await this.handlers.onCreateRemoteStreamView(userId, options);
    }
  }

  public async leaveCall(): Promise<void> {
    await this.handlers.onHangUp();
    this.call = undefined;
    this.handlers = createDefaultCallingHandlers(this.callClient, this.callAgent, this.deviceManager, undefined);
    this.context.setCallId(undefined);
    // Resync state after callId is set
    this.context.updateClientState(this.callClient.getState());
    this.stopCamera();
  }

  public async setCamera(device: VideoDeviceInfo): Promise<void> {
    await this.handlers.onSelectCamera(device);
  }

  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    await this.handlers.onSelectMicrophone(device);
  }

  public async setSpeaker(device: AudioDeviceInfo): Promise<void> {
    await this.handlers.onSelectSpeaker(device);
  }

  public async onToggleCamera(): Promise<void> {
    await this.handlers.onToggleCamera();
  }

  //TODO: seperate onToggleCamera logic in Handler
  public async startCamera(): Promise<void> {
    if (!this.isCameraOn()) await this.handlers.onToggleCamera();
  }

  public async stopCamera(): Promise<void> {
    if (this.isCameraOn()) await this.handlers.onToggleCamera();
  }

  private isCameraOn(): boolean {
    if (this.call) {
      const stream = this.call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
      return !!stream;
    } else {
      if (this.callClient.getState().deviceManager.selectedCamera) {
        const previewOn = isPreviewOn(this.callClient.getState().deviceManager);
        return previewOn;
      }
    }
    return false;
  }

  public async mute(): Promise<void> {
    if (!this.call) {
      this.context.setIsMicrophoneEnabled(true);
    }
    await this.call?.mute();
  }

  public async unmute(): Promise<void> {
    if (!this.call) {
      this.context.setIsMicrophoneEnabled(false);
    }
    await this.call?.unmute();
  }

  public async startScreenShare(): Promise<void> {
    if (!this.call?.isScreenSharingOn) await this.handlers.onToggleScreenShare();
  }

  public async stopScreenShare(): Promise<void> {
    if (this.call?.isScreenSharingOn) await this.handlers.onToggleScreenShare();
  }

  //TODO: a better way to expose option parameter
  public startCall(participants: FlatCommunicationIdentifier[]): Call | undefined {
    const idsToAdd = participants.map((participant) => {
      // FIXME: `onStartCall` does not allow a Teams user.
      // Need some way to return an error if a Teams user is provided.
      const backendId = fromFlatCommunicationIdentifier(participant) as CommunicationUserIdentifier;
      return backendId;
    });

    return this.handlers.onStartCall(idsToAdd);
  }

  public async removeParticipant(userId: FlatCommunicationIdentifier): Promise<void> {
    this.handlers.onParticipantRemove(userId);
  }

  public getState(): CallState {
    return this.context.getState();
  }

  public onStateChange(handler: (state: CallState) => void): void {
    this.context.onStateChange(handler);
  }

  public offStateChange(handler: (state: CallState) => void): void {
    this.context.offStateChange(handler);
  }

  on(event: 'incomingCall', listener: IncomingCallListener): void;
  on(event: 'participantJoined', participantsJoinedHandler: ParticipantJoinedListener): void;
  on(event: 'error', errorHandler: (e: Error) => void): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public on(_event: CallEvent, _listener: (e: any) => void): void {
    // Need to be implemented from chatClient
    throw 'Not implemented yet';
  }

  off(event: 'incomingCall', listener: IncomingCallListener): void;
  off(event: 'participantJoined', listener: ParticipantJoinedListener): void;
  off(event: 'error', errorHandler: (e: Error) => void): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public off(_event: CallEvent, _listener: (_e: any) => void): void {
    throw new Error('Method not implemented.');
  }
}

const isPreviewOn = (deviceManager: DeviceManager): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};

export const createAzureCommunicationCallAdapter = async (
  token: string,
  groupId: string,
  displayName: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined,
  callClientOptions?: CallClientOptions
): Promise<CallAdapter> => {
  const userId = getIdFromToken(token);

  const callClient = createStatefulCallClient({ userId }, callClientOptions);
  const deviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
  const callAgent = await callClient.createCallAgent(
    createAzureCommunicationUserCredential(token, refreshTokenCallback),
    { displayName }
  );

  const adapter = new AzureCommunicationCallAdapter(callClient, groupId, callAgent, deviceManager);
  return adapter;
};
