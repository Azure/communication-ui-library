// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddPhoneNumberOptions,
  CallApiFeature,
  CallDirection,
  CallEndReason,
  CallerInfo,
  CallFeatureFactoryType,
  CallState as CallStatus,
  CollectionUpdatedEvent,
  DtmfTone,
  GroupChatCallLocator,
  GroupLocator,
  HangUpOptions,
  IncomingCallEvent,
  JoinCallOptions,
  LocalVideoStream,
  MediaStreamType,
  MeetingLocator,
  PropertyChangedEvent,
  RemoteParticipant,
  StartCallOptions,
  CallInfo
} from '@azure/communication-calling';
import {
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier,
  UnknownIdentifier
} from '@azure/communication-common';

/**
 * Represents a MockCall
 *
 * @private
 */
export declare interface MockCall {
  /**
   * Get the unique Id for this Call.
   */
  readonly id: string;
  /**
   * Get information about this Call
   * @beta
   */
  readonly info: CallInfo;
  /**
   * Caller Information if the call is incoming.
   */
  readonly callerInfo: CallerInfo;
  /**
   * Get the state of this Call.
   */
  readonly state: CallStatus;
  /**
   * Containing code/subCode indicating how call ended
   */
  readonly callEndReason?: CallEndReason;
  /**
   * Get the call direction, whether Incoming or Outgoing.
   */
  readonly direction: CallDirection;
  /**
   * Whether local user is muted, locally or remotely
   */
  readonly isMuted: boolean;
  /**
   * Whether screen sharing is on
   */
  readonly isScreenSharingOn: boolean;
  /**
   * Collection of video streams sent to other participants in a call.
   */
  readonly localVideoStreams: ReadonlyArray<LocalVideoStream>;
  /**
   * Collection of remote participants participating in this call.
   */
  readonly remoteParticipants: ReadonlyArray<RemoteParticipant>;
  /**
   * Retrieves an initialized and memoized API feature object with extended API.
   * @param cls - The call feature class that provides an object with extended API.
   * @beta
   */
  api<TFeature extends CallApiFeature>(cls: CallFeatureFactoryType<TFeature>): TFeature;
  /**
   * Hang up the call.
   * @param options? - HangUp options.
   */
  hangUp(options?: HangUpOptions): Promise<void>;
  /**
   * Mute local microphone.
   */
  mute(): Promise<void>;
  /**
   * Unmute local microphone.
   */
  unmute(): Promise<void>;
  /**
   * Send DTMF tone.
   */
  sendDtmf(dtmfTone: DtmfTone): Promise<void>;
  /**
   * Start sending video stream in the call.
   * @param localVideoStream - Represents a local video stream and takes a camera in constructor.
   */
  startVideo(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Stop local video, pass localVideoStream you got from call.startVideo() API call.
   * @param localVideoStream - The local video stream to stop streaming.
   */
  stopVideo(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Add a participant to this Call.
   * @param identifier - The identifier of the participant to add.
   * @param options - Additional options for managing the PSTN call. For example, setting the Caller Id phone number in a PSTN call.
   * @returns The RemoteParticipant object associated with the successfully added participant.
   */
  addParticipant(identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier): RemoteParticipant;
  addParticipant(identifier: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): RemoteParticipant;
  /**
   * Remove a participant from this Call.
   * @param identifier - The identifier of the participant to remove.
   * @param options - options
   */
  removeParticipant(
    identifier: CommunicationUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier
  ): Promise<void>;
  /**
   * Put this Call on hold.
   */
  hold(): Promise<void>;
  /**
   * Resume this Call.
   */
  resume(): Promise<void>;
  /**
   * Start local screen sharing, browser handles screen/window enumeration and selection.
   */
  startScreenSharing(): Promise<void>;
  /**
   * Stop local screen sharing.
   */
  stopScreenSharing(): Promise<void>;
  /**
   * Subscribe function for stateChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for idChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'idChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isMutedChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isScreenSharingChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for remoteParticipantsUpdated event
   * @param event - event name
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements
   */
  on(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**
   * Subscribe function for localVideoStreamsUpdated event
   * @param event - event name
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements
   */
  on(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
  /**
   * Unsubscribe function for stateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for idChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'idChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isMutedChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isScreenSharingChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for remoteParticipantsUpdated event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**
   * Unsubscribe function for localVideoStreamsUpdated event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
}

/**
 * Represents a mock remote participants video or screen-sharing stream.
 *
 * @private
 */
export declare interface MockRemoteVideoStream {
  /**
   * Id of the remote stream
   */
  readonly id: number;
  /**
   * Get this remote media stream type.
   */
  mediaStreamType: MediaStreamType;
  /**
   * Whether the stream is available or not.
   */
  isAvailable: boolean;
  /**
   * Subscribe function for availability event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for activeRenderersChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements
   */
  /**
   * Unsubscribe function for availability event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
}

/**
 * The Mock CallAgent is used to handle calls.
 *
 * @private
 */
export declare interface MockCallAgent {
  /**
   * Get the calls.
   */
  readonly calls: ReadonlyArray<MockCall>;
  /**
   * Specify the display name of the local participant for all new calls.
   */
  readonly displayName?: string;
  /**
   * Initiates a call to the participants provided.
   * @param participants[] - User Identifiers (Callees) to make a call to.
   * @param options? - Start Call options.
   * @returns The Call object associated with the started call.
   */
  startCall(
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    options?: StartCallOptions
  ): MockCall;
  /**
   * Join a group call.
   * To join a group call just use a groupId.
   * @param groupLocator - Group call information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(groupLocator: GroupLocator, options?: JoinCallOptions): MockCall;
  /**
   * Join a group chat call.
   * To join a group chat call just use a threadId.
   * @param groupChatCallLocator - GroupChat call information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   * @beta
   */
  join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): MockCall;
  /**
   * Join a meeting.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   * @beta
   */
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): MockCall;
  /**
   * Dispose this CallAgent ( required to create another new CallAgent)
   */
  dispose(): Promise<void>;
  /**
   * Subscribe function for incomingCall event.
   * @param event - event name
   * @param listener - callback fn that will be called when this callAgent will receive an incoming call
   */
  on(event: 'incomingCall', listener: IncomingCallEvent): void;
  /**
   * Subscribe function for callsUpdated event.
   * @param event - event name
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements
   */
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<MockCall>): void;
  /**
   * Unsubscribe function for incomingCall event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'incomingCall', listener: IncomingCallEvent): void;
  /**
   * Unsubscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - allback fn that was used to subscribe to this event.
   */
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<MockCall>): void;
}
