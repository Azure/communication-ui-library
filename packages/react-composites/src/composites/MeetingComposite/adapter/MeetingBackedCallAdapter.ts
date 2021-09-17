// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingAdapter } from './MeetingAdapter';
import { CallAdapter, CallAdapterState, CallCompositePage } from '../../CallComposite';
import { callPageToMeetingPage, meetingPageToCallPage } from '../state/MeetingCompositePage';
import { VideoStreamOptions } from '@internal/react-components';
import { AudioDeviceInfo, VideoDeviceInfo, Call, PermissionConstraints } from '@azure/communication-calling';
import { MeetingAdapterState, MeetingState } from '..';
import { CallState } from '@internal/calling-stateful-client';
import { callParticipantsFromMeetingParticipants } from '../state/MeetingParticipants';
import { AzureCommunicationMeetingAdapter } from './AzureCommunicationMeetingAdapter';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function callStateFromMeetingState(meetingState: MeetingState): CallState {
  return {
    id: meetingState.id,
    callerInfo: meetingState.callerInfo,
    state: meetingState.state,
    callEndReason: meetingState.meetingEndReason,
    direction: 'Incoming',
    isMuted: meetingState.isMuted,
    isScreenSharingOn: meetingState.isScreenSharingOn,
    localVideoStreams: meetingState.localVideoStreams,
    transcription: meetingState.transcription,
    recording: meetingState.recording,
    transfer: meetingState.transfer,
    screenShareRemoteParticipant: meetingState.screenShareRemoteParticipant,
    startTime: meetingState.startTime,
    endTime: meetingState.endTime,
    diagnostics: meetingState.diagnostics,
    remoteParticipants: callParticipantsFromMeetingParticipants(meetingState.participants),
    remoteParticipantsEnded: callParticipantsFromMeetingParticipants(meetingState.participantsEnded),
    dominantSpeakers: meetingState.dominantSpeakers
  };
}

export function callAdapterStateFromMeetingAdapterState(meetingState: MeetingAdapterState): CallAdapterState {
  return {
    isLocalPreviewMicrophoneEnabled: meetingState.isLocalPreviewMicrophoneEnabled,
    page: meetingPageToCallPage(meetingState.page),
    userId: { kind: 'communicationUser', communicationUserId: meetingState.userId.communicationUserId },
    displayName: meetingState.displayName,
    call: meetingState.meeting ? callStateFromMeetingState(meetingState.meeting) : undefined,
    devices: meetingState.devices,
    latestErrors: {} //@TODO: latest errors not supported in meeting composite yet.
  };
}

/**
 * Facade around the MeetingAdapter to satisfy the call adapter interface.
 */
export class MeetingBackedCallAdapter implements CallAdapter {
  private meetingAdapter: MeetingAdapter;

  // For onStateChange we must convert meeting state to chat state. This involves creating a new handler to be passed into the onStateChange.
  // In order to unsubscribe the handler when offStateChange is called we must have a mapping of the original handler to the newly created handler.
  private eventStore: Map<(state: CallAdapterState) => void, (state: MeetingAdapterState) => void> = new Map();

  constructor(meetingAdapter: MeetingAdapter) {
    this.meetingAdapter = meetingAdapter;
  }
  public on = (event: any, listener: any): void => this.meetingAdapter.on(event, listener);
  public off = (event: any, listener: any): void => this.meetingAdapter.off(event, listener);
  public onStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = (state: MeetingAdapterState): void => {
      handler(callAdapterStateFromMeetingAdapterState(state));
    };
    this.meetingAdapter.onStateChange(convertedHandler);
    this.eventStore.set(handler, convertedHandler);
  };
  public offStateChange = (handler: (state: CallAdapterState) => void): void => {
    const convertedHandler = this.eventStore.get(handler);
    convertedHandler && this.meetingAdapter.offStateChange(convertedHandler);
  };
  public getState = (): CallAdapterState => callAdapterStateFromMeetingAdapterState(this.meetingAdapter.getState());
  public dispose = (): void => this.meetingAdapter.dispose();
  public setPage = (page: CallCompositePage): void => this.meetingAdapter.setPage(callPageToMeetingPage(page));
  public joinCall = (microphoneOn?: boolean): Call | undefined => {
    return this.meetingAdapter.joinMeeting(microphoneOn);
  };
  public leaveCall = async (): Promise<void> => await this.meetingAdapter.leaveMeeting();
  public startCall = (participants: string[]): Call | undefined => {
    return this.meetingAdapter.startMeeting(participants);
  };
  public setCamera = async (sourceId: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.setCamera(sourceId, options);
  public setMicrophone = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.meetingAdapter.setMicrophone(sourceId);
  public setSpeaker = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.meetingAdapter.setSpeaker(sourceId);
  public askDevicePermission = async (constraints: PermissionConstraints): Promise<void> =>
    await this.meetingAdapter.askDevicePermission(constraints);
  public queryCameras = async (): Promise<VideoDeviceInfo[]> => await this.meetingAdapter.queryCameras();
  public queryMicrophones = async (): Promise<AudioDeviceInfo[]> => await this.meetingAdapter.queryMicrophones();
  public querySpeakers = async (): Promise<AudioDeviceInfo[]> => await this.meetingAdapter.querySpeakers();
  public startCamera = async (): Promise<void> => await this.meetingAdapter.startCamera();
  public stopCamera = async (): Promise<void> => await this.meetingAdapter.stopCamera();
  public onToggleCamera = async (options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.onToggleCamera(options);
  public mute = async (): Promise<void> => await this.meetingAdapter.mute();
  public unmute = async (): Promise<void> => await this.meetingAdapter.unmute();
  public startScreenShare = async (): Promise<void> => await this.meetingAdapter.startScreenShare();
  public stopScreenShare = async (): Promise<void> => await this.meetingAdapter.stopScreenShare();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.meetingAdapter.removeParticipant(userId);
  public createStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.createStreamView(remoteUserId, options);
  public disposeStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.disposeStreamView(remoteUserId, options);

  /**
   * This reflects the isTeamsCall in AzureCommunicationCallAdapter
   * @TODO: THIS NEEDS MOVED TO BE PART OF THE API NOT HIDDEN HERE.
   */
  public isTeamsCall(): boolean {
    return 'isTeamsCall' in this.meetingAdapter
      ? (this.meetingAdapter as AzureCommunicationMeetingAdapter).isTeamsCall()
      : false;
  }
}
