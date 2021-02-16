// © Microsoft Corporation. All rights reserved.

import {
  AcceptCallOptions,
  AddPhoneNumberOptions,
  CallEndReason,
  CallState,
  CollectionUpdatedEvent,
  DtmfTone,
  GroupCallContext,
  GroupChatCallContext,
  HangupCallOptions,
  JoinCallOptions,
  LocalVideoStream,
  MediaStreamType,
  PropertyChangedEvent,
  RemoteParticipant,
  StartCallOptions
} from '@azure/communication-calling';
import { CallingApplication, CommunicationUser, PhoneNumber, UnknownIdentifier } from '@azure/communication-common';

/**
 * Represents a MockCall
 * @public
 */
export declare interface MockCall {
  /**
   * Get the unique Id for this Call.
   */
  readonly id: string;
  /**
   * The identity of caller if the call is incoming.
   */
  readonly callerIdentity: CommunicationUser | PhoneNumber | CallingApplication | UnknownIdentifier | undefined;
  /**
   * Get the state of this Call.
   */
  readonly state: CallState;
  /**
   * Containing code/subcode indicating how call ended
   */
  readonly callEndReason?: CallEndReason;
  /**
   * Whether this Call is incoming.
   */
  isIncoming: boolean;
  /**
   * Whether this local microphone is muted.
   */
  isMicrophoneMuted: boolean;
  /**
   * When the call is being actively recorded
   */
  isRecordingActive: boolean;
  /**
   * Whether screen sharing is on
   */
  readonly isScreenSharingOn: boolean;
  /**
   * Collection of video streams sent to other participants in a call.
   */
  readonly localVideoStreams: LocalVideoStream[];
  /**
   * Collection of remote participants participating in this call.
   */
  remoteParticipants: RemoteParticipant[];

  /**
   * Accept this incoming Call.
   * @param options - accept options.
   */
  accept(options?: AcceptCallOptions): Promise<void>;
  /**
   * Reject this incoming Call.
   */
  reject(): Promise<void>;
  /**
   * Hang up the call.
   * @param options? - Hangup options.
   */
  hangUp(options?: HangupCallOptions): Promise<void>;
  /**
   * Mute local microphone.
   */
  mute(): Promise<void>;
  /**
   * Unmute local microphone.
   */
  unmute(): Promise<void>;
  /**
   * Unmute local microphone.
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
   * @param options - options
   * @returns The RemoteParticipant object associated with the successfully added participant.
   */
  addParticipant(identifier: CommunicationUser | CallingApplication): RemoteParticipant;
  addParticipant(identifier: PhoneNumber, options?: AddPhoneNumberOptions): RemoteParticipant;
  /**
   * Remove a participant from this Call.
   * @param identifier - The identifier of the participant to remove.
   * @param options - options
   */
  removeParticipant(
    identifier: CommunicationUser | PhoneNumber | CallingApplication | UnknownIdentifier
  ): Promise<void>;
  /**
   * Put this Call on hold.
   */
  hold(): Promise<void>;
  /**
   * Unhold this Call.
   */
  unhold(): Promise<void>;
  /**
   * Start local screen sharing, browser handles screen/window enumeration and selection.
   */
  startScreenSharing(): Promise<void>;
  /**
   * Stop local screen sharing.
   */
  stopScreenSharing(): Promise<void>;
  /**
   * Subscribe function for callStateChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'callStateChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for callIdChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'callIdChanged', listener: PropertyChangedEvent): void;
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
   * Unsubscribe function for callStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for callStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'callStateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for callIdChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'callIdChanged', listener: PropertyChangedEvent): void;
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
  /**
   * Unsubscribe function for isRecordingActiveChanged event
   * @beta
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
}

/**
 * Represents a mock remote participants video or screen-sharing stream
 * @public
 */
export declare interface MockRemoteVideoStream {
  /**
   * Id of the remote stream
   */
  readonly id: number;
  /**
   * Get this remote media stream type.
   */
  type: MediaStreamType;
  /**
   * Whether the stream is available or not.
   */
  isAvailable: boolean;
  /**
   * Subscribe function for availability event
   * @param event - event name
   * @param listener - callback fn that will be called when value of this property will change
   */
  on(event: 'availabilityChanged', listener: PropertyChangedEvent): void;
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
  off(event: 'availabilityChanged', listener: PropertyChangedEvent): void;
}

/**
 * The Mock CallAgent is used to handle calls.
 * @public
 */
export declare interface MockCallAgent {
  /**
   * Get the calls.
   */
  calls: MockCall[];
  /**
   * Initiates a call to the participants provided.
   * @param participants[] - User Identifiers (Callees) to make a call to.
   * @param options? - Start Call options.
   * @returns The Call object associated with the started call.
   */
  call(
    participants: (CommunicationUser | PhoneNumber | CallingApplication | UnknownIdentifier)[],
    options?: StartCallOptions
  ): MockCall;
  /**
   * Join a group call.
   * To join a group call just use a groupId.
   * @param context - Group call context information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(context: GroupChatCallContext, options?: JoinCallOptions): MockCall;
  join(context: GroupCallContext, options?: JoinCallOptions): MockCall;

  /**
   * Update display name of local participant.
   * It will be used in all new calls.
   * @param displayName The display name to use.
   */
  updateDisplayName(displayName: string): void;
  /**
   * Dispose this CallAgent ( required to create another new CallAgent)
   */
  dispose(): Promise<void>;
  /**
   * Subscribe function for callsUpdated event.
   * @param event - event name
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements
   */
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<MockCall>): void;
  /**
   * Unsubscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - allback fn that was used to subscribe to this event.
   */
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<MockCall>): void;
}
