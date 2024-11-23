import { AzureLogger } from '@azure/logger';
import { CommunicationIdentifier } from '@azure/communication-common';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { MicrosoftTeamsAppIdentifier } from '@azure/communication-common';
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { PhoneNumberIdentifier } from '@azure/communication-common';
import { UnknownIdentifier } from '@azure/communication-common';

/**
 * Options for accepting an incoming call.
 * Pass video streams that will be used to accept an incoming call.
 * If videoOptions is undefined, then the incoming call will be accepted with local video off.
 * If AudioOptions is undefined, then the incoming call will be accepted with default microphone as source from device manager.
 */
export declare interface AcceptCallOptions {
  videoOptions?: VideoOptions;
  audioOptions?: AudioOptions;
}

/**
 * Represents the current active audio effects
 */
export declare interface ActiveAudioEffects {
  /**
   * Current active auto gain control
   * @alpha
   */
  autoGainControl: AutoGainControlEffectName[];
  /**
   * Current active echo cancellation
   * @alpha
   */
  echoCancellation: EchoCancellationEffectName[];
  /**
   * Current active noise suppression
   */
  noiseSuppression: NoiseSuppressionEffectName[];
}

/**
 * Options for adding a AddCommunicationUserOptions participant to an on-going call.
 * @beta
 */
export declare interface AddCommunicationUserOptions {
  threadId?: string;
  /**
   * Options for adding custom context.
   * @beta
   */
  customContext?: CustomContext;
}

/**
 * Options for adding a MicrosoftTeamsUser participant to an on-going call.
 * @beta
 */
export declare interface AddMicrosoftTeamsUserOptions {
  threadId: string;
}

/**
 * Options for adding a PSTN participant to an on-going call.
 */
export declare interface AddPhoneNumberOptions {
  /**
   * A phone number in E.164 format that will be used to represent callers identity.
   * For example, using the alternateCallerId to add a participant using PSTN, this number will
   * be used as the caller id in the PSTN call.
   */
  alternateCallerId?: PhoneNumberIdentifier;
  /**
   * thread ID is required when adding PSTN to an on-going Teams group call.
   * @beta
   */
  threadId?: string;
  /**
   * Options for adding custom context.
   * @beta
   */
  customContext?: CustomContext;
}

/**
 * Options for adding a Teams participant to an on-going Teams call.
 * @beta
 */
export declare interface AddTeamsParticipantOptions {
  /**
   * Thread id is required for Teams group call.
   * @beta
   */
  threadId: string;
  /**
   * Options for adding custom context.
   * @beta
   */
  customContext?: CustomContext;
}

/**
 * Result for admit all participants.
 */
export declare interface AdmitAllOperationResult {
  readonly successCount: number;
  readonly failureCount: number;
}

/**
 * Options for admit participant from Lobby.
 */
export declare interface AdmitLobbyParticipantOptions {}

/**
 * Name of interface for assigned breakout room event
 */
export declare interface AssignedBreakoutRoomsEvent {
  /**
   * Breakout room event type
   */
  type: 'assignedBreakoutRooms';
  /**
   * Assigned breakout room details
   */
  data: BreakoutRoom | undefined;
}

/**
 * Information about a microphone or speaker device.
 */
export declare interface AudioDeviceInfo {
  /**
   * Get the name of this audio device.
   */
  readonly name: string;
  /**
   * Get Id of this audio device.
   */
  readonly id: string;
  /**
   * Is this the systems default audio device.
   */
  readonly isSystemDefault: boolean;
  /**
   * Get this audio device type.
   */
  readonly deviceType: AudioDeviceType;
}

/**
 * Type of an audio device.
 */
export declare type AudioDeviceType = 'Microphone' | 'Speaker' | 'CompositeAudioDevice' | 'Virtual';

/**
 * Base audio effect.
 */
export declare interface AudioEffect {
  /**
   * Please use the isSupported method on the AudioEffectsFeature API.
   * @deprecated
   */
  isSupported(): Promise<boolean>;
}

/**
 * API interface for the AudioEffects feature
 */
export declare interface AudioEffectsFeature extends AudioStreamFeature {
  /**
   * The alpha version of isSupported.
   * Accepts all the effect types we currently have; some of them can be alpha.
   * @alpha
   */
  isSupported(
    effect:
      | EchoCancellationEffect
      | DeepNoiseSuppressionEffect
      | 'BrowserAutoGainControl'
      | 'BrowserEchoCancellation'
      | 'BrowserNoiseSuppression'
  ): Promise<boolean>;
  /**
   * Method to check if an effect is supported in the current environment.
   * @param effect Instance of the effect or the 'Browser..' effect to check support of.
   * @returns true if effect is supported in the current environment.
   */
  isSupported(effect: DeepNoiseSuppressionEffect | 'BrowserNoiseSuppression'): Promise<boolean>;
  /**
   * Start effects
   * @param audioEffects Object representing the audio effects to start
   */
  startEffects(audioEffects: AudioEffectsStartConfig): Promise<void>;
  /**
   * Stop effects
   */
  stopEffects(audioEffects: AudioEffectsStopConfig): Promise<void>;
  /**
   * Read-only object that represents the current active audio effects
   */
  readonly activeEffects: ActiveAudioEffects;
  /**
   * Subscribe functions - fires when effects are started
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsStarted', listener: AudioEffectsFeatureListener): void;
  /**
   * Subscribe functions - fires when effects are stopped
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsStopped', listener: AudioEffectsFeatureListener): void;
  /**
   * Subscribe functions - fires on error while using effects
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsError', listener: AudioEffectsFeatureErrorListener): void;
  /**
   * Unsubscribe functions - fires when effects are started
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsStarted', listener: AudioEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - fires when effects are stopped
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsStopped', listener: AudioEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - fires on error while using effects
   * @param event Event of type AudioEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsError', listener: AudioEffectsFeatureErrorListener): void;
}

/**
 * Audio effects feature error listener callback type
 */
export declare type AudioEffectsFeatureErrorListener = (error: CommunicationServicesError) => void;

/**
 * Audio effects feature events
 */
export declare type AudioEffectsFeatureEvent = 'effectsStarted' | 'effectsStopped' | 'effectsError';

/**
 * Audio effects feature listener callback type
 */
export declare type AudioEffectsFeatureListener = (audioEffects: ActiveAudioEffects) => void;

/**
 * Represents the audio effects config while starting effects
 */
export declare interface AudioEffectsStartConfig {
  /**
   * Auto gain control
   * @alpha
   */
  autoGainControl?: 'BrowserAutoGainControl';
  /**
   * Echo cancellation
   * @alpha
   */
  echoCancellation?: 'BrowserEchoCancellation' | EchoCancellationEffect;
  /**
   * Noise suppression
   */
  noiseSuppression?: 'BrowserNoiseSuppression' | DeepNoiseSuppressionEffect;
}

/**
 * Represents the audio effects config while stopping effects
 */
export declare interface AudioEffectsStopConfig {
  /**
   * Auto gain control. Will be stopped if 'true'.
   * @alpha
   */
  autoGainControl?: boolean;
  /**
   * Echo cancellation. Will be stopped if 'true'.
   * @alpha
   */
  echoCancellation?: boolean;
  /**
   * Noise suppression. Will be stopped if 'true'.
   */
  noiseSuppression?: boolean;
}

/**
 * Audio quality diagnostics
 * @beta
 */
export declare interface AudioInCallDiagnostics extends BaseInCallDiagnostics {}

/**
 * Represents the end of call survey audio issues.
 * @example
 * NoLocalAudio - other participants unable to hear me.
 * NoRemoteAudio - participant unable to hear another participant's audio.
 * Echo - heard echo.
 * AudioNoise - heard audio noise.
 * LowVolume - call audio volume was low.
 * AudioStoppedUnexpectedly - call audio stopped unexpectedly.
 * DistortedSpeech - audio was distorted.
 * AudioInterruption - audio was interrupted.
 * OtherIssues - any other audio issue not listed here.
 *
 */
export declare type AudioIssue =
  | 'NoLocalAudio'
  | 'NoRemoteAudio'
  | 'Echo'
  | 'AudioNoise'
  | 'LowVolume'
  | 'AudioStoppedUnexpectedly'
  | 'DistortedSpeech'
  | 'AudioInterruption'
  | 'OtherIssues';

/**
 * Audio options provided when making an outgoing call or joining a group call.
 */
export declare interface AudioOptions {
  /**
   * Whether to start the call muted or unmuted.
   */
  muted?: boolean;
  /**
   * Audio stream to be used as the call audio
   */
  localAudioStreams?: LocalAudioStream[];
}

/**
 * Payload for audio source changed event.
 */
export declare type AudioSourceChangedEvent = (args: { source: LocalAudioStream }) => void;

/**
 * Represents a Audio stream feature
 */
export declare interface AudioStreamFeature extends BaseFeature {}

/**
 * Represents the context provided for extended audio/video stream features at the constructor.
 */
export declare interface AudioStreamFeatureContext {
  /**
   * The LocalAudioStream instance that is being extended by the feature.
   */
  streamInstance: LocalAudioStream;
}

/**
 * Represents the constructor for AudioStreamFeature object, along with the context argument.
 */
export declare type AudioStreamFeatureCtor<TFeature extends AudioStreamFeature> = new (
  context: AudioStreamFeatureContext
) => TFeature;

/**
 * Represents the factory of the audio stream features
 */
export declare interface AudioStreamFeatureFactory<TFeature extends AudioStreamFeature> extends FeatureFactory {
  /**
   * The constructor that returns an instance of the audio stream feature implementation.
   */
  readonly audioStreamApiCtor: AudioStreamFeatureCtor<TFeature>;
}

/**
 * Represents auto gain control effect names
 * @alpha
 */
export declare type AutoGainControlEffectName = 'BrowserAutoGainControl';

/**
 * Background blur config.
 */
export declare type BackgroundBlurConfig = VideoEffectConfig;

/**
 * Background blur effect.
 */
export declare interface BackgroundBlurEffect extends VideoEffect {
  /**
   * Method to configure the effect
   * @param config
   */
  configure(config: BackgroundBlurConfig): Promise<void>;
}

/**
 * Background replacement config.
 */
export declare interface BackgroundReplacementConfig extends VideoEffectConfig {
  /**
   * URL of the background image
   */
  backgroundImageUrl: string;
}

/**
 * Background replacement effect.
 */
export declare interface BackgroundReplacementEffect extends VideoEffect {
  /**
   * Method to configure the effect
   * @param config
   */
  configure(config: BackgroundReplacementConfig): Promise<void>;
}

/**
 * Represents the base interface for any Feature
 */
export declare interface BaseFeature extends Disposable {
  /**
   * The feature name.
   */
  readonly name: string;
}

/**
 * In Call diagnostics gathered
 * @beta
 */
export declare interface BaseInCallDiagnostics {
  jitter: QualityGrade;
  packetLoss: QualityGrade;
  rtt: QualityGrade;
}

/**
 *  Breakout room details
 */
export declare interface BreakoutRoom {
  /**
   * threadId of the breakout room
   */
  readonly threadId: string;
  /**
   * display name of the breakout room
   */
  readonly displayName?: string;
  /**
   * state of the breakout room
   */
  readonly state: BreakoutRoomState;
  /**
   * Automatically move people to breakout rooms  when they join
   */
  readonly autoMoveParticipantToBreakoutRoom?: boolean;
  /**
   * the list of invitees who are assigned to a breakout room
   */
  readonly invitees?: Invitee[];
  /**
   * breakout room call object when the participant joins the breakout room
   */
  readonly call?: Call | TeamsCall;
  /**
   * allows the participant to join the breakout room when Automove people to rooms is set to false.
   */
  join(): Promise<Call | TeamsCall>;
  /**
   * allows the breakout room participant to return to the main meeting.
   */
  rejoinMainMeeting(): Promise<Call | TeamsCall>;
}

/**
 * Breakout rooms call feature.
 */
export declare interface BreakoutRoomsCallFeature extends CallFeature {
  readonly assignedBreakoutRooms?: BreakoutRoom;
  readonly breakoutRoomsSettings?: BreakoutRoomsSettings;
  readonly breakoutRooms?: BreakoutRoom[];

  /**
   * Subscribe function for BreakoutRooms Updated event
   * @param event - AllBreakoutRoomsUpdated
   * @param listener - callback function that was used to subscribe to this event
   */
  on(event: BreakoutRoomsUpdated, listener: BreakoutRoomsUpdatedListener): void;
  /**
   * Subscribe function for BreakoutRooms Updated event
   * @param event - AllBreakoutRoomsUpdated
   * @param listener - callback function that was used to subscribe to this event
   */
  off(event: BreakoutRoomsUpdated, listener: BreakoutRoomsUpdatedListener): void;
}

/**
 * Name of interface for all BreakoutRooms available Event
 */
export declare interface BreakoutRoomsEvent {
  /**
   * Breakout room event type
   */
  type: 'breakoutRooms';
  /**
   * list of Breakout rooms
   */
  data: BreakoutRoom[] | undefined;
}

/**
 * Name of event type for all BreakoutRooms updated events
 */
export declare type BreakoutRoomsEventData =
  | BreakoutRoomsEvent
  | AssignedBreakoutRoomsEvent
  | BreakoutRoomsSettingsEvent
  | JoinBreakoutRoomsEvent;

/**
 * Breakout room settings available once the user joins the breakout room
 */
export declare interface BreakoutRoomsSettings {
  /**
   * disable participants to return to the main meeting from the breakout room call.
   */
  disableReturnToMainMeeting?: boolean;
  /**
   * breakout room end time
   */
  roomEndTime?: TimestampInfo;
}

/**
 * Name of interface for breakoutroom settings available event
 */
export declare interface BreakoutRoomsSettingsEvent {
  /**
   * Breakout room event type
   */
  type: 'breakoutRoomsSettings';
  /**
   * Breakout Room setting details
   */
  data: BreakoutRoomsSettings | undefined;
}

/**
 * Breakout room state
 */
export declare type BreakoutRoomState = 'open' | 'closed';

/**
 * Name of event type for all BreakoutRooms updated
 */
export declare type BreakoutRoomsUpdated = 'breakoutRoomsUpdated';

/**
 * Callback definition for handling breakout rooms events.
 */
export declare type BreakoutRoomsUpdatedListener = (eventData: BreakoutRoomsEventData) => void;

/**
 * Represents a Call.
 */
export declare interface Call extends CallCommon {
  /**
   * Get information about this Call.
   */
  readonly info: CallInfo;
  /**
   * Add a participant to this Call.
   * @param identifier - The identifier of the participant to add.
   * @returns The RemoteParticipant object associated with the successfully added participant.
   */
  addParticipant(identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier): RemoteParticipant;
  /**
   * Add a Teams App to this Call.
   * @param identifier - The identifier of the Teams App to add.
   * @returns The RemoteParticipant object associated with the successfully added Teams App.
   * @beta
   */
  addParticipant(identifier: MicrosoftTeamsAppIdentifier | UnknownIdentifier): RemoteParticipant;
  /**
   * Add a participant to this Call.
   * @param identifier - The identifier of the participant to add.
   * @param options - Additional options for managing the PSTN call. For example, setting the Caller Id phone number in a PSTN call.
   * @returns The RemoteParticipant object associated with the successfully added participant.
   */
  addParticipant(identifier: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): RemoteParticipant;
  /**
   * Add a participant to this Call.
   * @param identifier - The identifier of the participant to add.
   * @param options - Additional options for managing the call.
   * @returns The RemoteParticipant object associated with the successfully added participant.
   * @beta
   */
  addParticipant(identifier: CommunicationUserIdentifier, options?: AddCommunicationUserOptions): RemoteParticipant;
  /**
   * Add a participant to this Call.
   * @param identifier - The identifier of the participant to add.
   * @param options - Additional options for managing the call.
   * @returns The RemoteParticipant object associated with the successfully added participant.
   * @beta
   */
  addParticipant(identifier: MicrosoftTeamsUserIdentifier, options: AddMicrosoftTeamsUserOptions): RemoteParticipant;
  /**
   * Remove a participant from this Call.
   * @param identifier - The identifier of the participant to remove.
   */
  removeParticipant(identifier: CommunicationIdentifier): Promise<void>;
}

/**
 * The CallAgent is used to handle calls.
 */
export declare interface CallAgent extends CallAgentCommon {
  /**
   * Get the calls.
   */
  readonly calls: ReadonlyArray<Call>;
  /**
   * Get the display name of the local participant for all new calls.
   */
  readonly displayName?: string;
  /**
   * Initiate a call to the participants provided.
   * @param participants[] - User Identifiers (Callees) to make a call to.
   * @param options - Start Call options.
   * @returns The Call object associated with the started call.
   */
  startCall(
    participants: (
      | CommunicationUserIdentifier
      | PhoneNumberIdentifier
      | MicrosoftTeamsAppIdentifier
      | UnknownIdentifier
    )[],
    options?: StartCallOptions
  ): Call;
  /**
   * Initiate a call to the participants provided.
   * @param participants[] - User Identifiers (Callees) to make a call to.
   * @param options - Start Call options.
   * @returns The Call object associated with the started call.
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): Call;
  /**
   * Join a group call.
   * To join a group call, pass a groupId.
   * @param groupLocator - Group call information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
  /**
   * Join a group chat call.
   * To join a group chat call, pass a threadId.
   * @param groupChatCallLocator - GroupChat call information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   * @beta
   */
  join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): Call;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting link.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): Call;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting id and passcode.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(meetingLocator: TeamsMeetingIdLocator, options?: JoinCallOptions): Call;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting link or meeting coordinates.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   * @beta
   */
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
  /**
   * Join a rooms call.
   * To join a rooms call, pass a roomId.
   * @param roomLocator - Room call information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(roomLocator: RoomLocator, options?: JoinCallOptions): Call;
  /**
   * Subscribe function for incomingCall event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this callAgent will receive an incoming call.
   */
  on(event: 'incomingCall', listener: IncomingCallEvent): void;
  /**
   * Subscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  /**
   * Subscribe function for connectionStateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'connectionStateChanged', listener: ConnectionStateChangedEvent): void;
  /**
   * Unsubscribe function for incomingCall event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'incomingCall', listener: IncomingCallEvent): void;
  /**
   * Unsubscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  /**
   * Unsubscribe function for connectionStateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'connectionStateChanged', listener: ConnectionStateChangedEvent): void;
}

/**
 * CallAgent common interface.
 */
export declare interface CallAgentCommon {
  /**
   * Get the kind of call agent object.
   */
  readonly kind: CallAgentKind;
  /**
   * Get the connection state.
   */
  readonly connectionState: ConnectionState;
  /**
   * Retrieves an initialized and memoized Feature object with extended API.
   * Check the object Features.* for all available extended call agent features in this package.
   * @param factory - The factory for the call agent feature constructor that provides an extended API.
   * @beta
   */
  feature<TFeature extends CallAgentFeature>(factory: CallAgentFeatureFactory<TFeature>): TFeature;
  /**
   * Handles a push notification.
   * @param data - Push notification data
   * @beta
   */
  handlePushNotification(data: PushNotificationData): Promise<void>;
  /**
   * Dispose of this Call Agent
   */
  dispose(): Promise<void>;
}

/**
 * Represents a CallAgent Feature.
 * @beta
 */
export declare interface CallAgentFeature extends BaseFeature {}

/**
 * Represents the context provided for extended call agent features at the constructor.
 * @beta
 */
export declare interface CallAgentFeatureContext {
  /**
   * The call client that owns the extended call agent object.
   */
  callClient: CallClient;
  /**
   * The call agent instance that is being extended by the feature.
   */
  callAgent: CallAgentCommon;
}

/**
 * Represents the constructor for CallAgentFeature objects, along with the context argument.
 * @beta
 */
export declare type CallAgentFeatureCtor<TFeature extends CallAgentFeature> = new (
  context: CallAgentFeatureContext
) => TFeature;

/**
 * Represents the factory of call agent features
 * @beta
 */
export declare interface CallAgentFeatureFactory<TFeature extends CallAgentFeature> extends FeatureFactory {
  /**
   * The constructor that returns an instance of an call agent feature implementation.
   */
  readonly callAgentApiCtor: CallAgentFeatureCtor<TFeature>;
}

/**
 * The kind of call agent object.
 */
export declare enum CallAgentKind {
  /**
   * ACS call agent object kind.
   */
  CallAgent = 'CallAgent',
  /**
   * Teams call agent object kind.
   */
  TeamsCallAgent = 'TeamsCallAgent'
}

/**
 * Options for creating CallAgent.
 */
export declare interface CallAgentOptions {
  /**
   * Specify the display name of the local participant for all new calls.
   */
  displayName?: string;
  /**
   * Options related to emergency calling
   */
  emergencyCallOptions?: EmergencyCallOptions;
}

/**
 * The CallClient is the main entry point to the SDK.
 * The CallClient is used to create the CallAgent and to get the DeviceManager.
 * @public
 */
export declare class CallClient {
  private readonly clientId;
  private _callAgent;
  private _teamsCallAgent;
  private _callStack;
  private _deviceManager;
  private _previousOrientation;
  private _telemetryLogManager;
  private _sdkDiagnosticInformation;
  private _eventEmitter;
  private _environmentInfos;
  private _extensibleApi;
  private _acsProxy;
  private _acsCustomRelayManager;
  private _customProxyAndTurnInformation;

  /**
   * Create a CallClient.
   * @param options
   * @public
   */
  constructor(options?: CallClientOptions);

  /**
   * Retrieves an initialized and memoized Feature object with extended API.
   * Check the object Features.* for all available extended call client features in this package.
   * @param factory - The factory for the call client feature constructor that provides an extended API.
   */
  feature<TFeature extends CallClientFeature>(factory: CallClientFeatureFactory<TFeature>): TFeature;
  /**
   * The CallAgent is used to handle calls.
   * To create the CallAgent, pass a CommunicationTokenCredential object provided from SDK.
   * - The CallClient can only have one active CallAgent instance at a time.
   * - You can create a new CallClient instance to create a new CallAgent.
   * - You can dispose of a CallClient's current active CallAgent, and call the CallClient's
   *   createCallAgent() method again to create a new CallAgent.
   * @param tokenCredential - The token credential. Use AzureCommunicationTokenCredential from @azure/communication-common to create a credential.
   * @param options - The CallAgentOptions for additional options like display name.
   * @public
   */
  createCallAgent(tokenCredential: CommunicationTokenCredential, options?: CallAgentOptions): Promise<CallAgent>;
  /**
   * The TeamsCallAgent is used to handle Teams calls.
   * To create the TeamsCallAgent, pass a CommunicationTokenCredential object provided from SDK.
   * - The CallClient can only have one active TeamsCallAgent instance at a time.
   * - You can create a new CallClient instance to create a new TeamsCallAgent.
   * - You can dispose of a CallClient's current active TeamsCallAgent, and call the CallClient's
   *   createTeamsCallAgent() method again to create a new TeamsCallAgent.
   * @param tokenCredential - The token credential. Use AzureCommunicationTokenCredential from @azure/communication-common to create a credential.
   * @param options - The CallAgentOptions for additional options like display name.
   */
  createTeamsCallAgent(
    tokenCredential: CommunicationTokenCredential,
    options?: TeamsCallAgentOptions
  ): Promise<TeamsCallAgent>;
  /**
   * The DeviceManager is used to handle media devices such as cameras, microphones, and speakers.
   * @public
   */
  getDeviceManager(): Promise<DeviceManager>;

  private validateEmergencyCountryCode;
  private sendTelemetry;
  private handleVisibilityChange;
  private handlePageShow;
  private handlePageHide;
  private handleOrientationChange;
  private getOrientationBasedOnWindowSize;
  private handleResize;
  private sendOrientationChangeEvent;
  private sendInitialOrientation;
  private sendCallClientInitEvent;
  private hangupCalls;
  private sendPageVisibilityInfoEvent;
  private getTelemetryTag;
}

/**
 * Represents a CallClient Feature.
 */
export declare interface CallClientFeature extends BaseFeature {}

/**
 * Represents the context provided for extended call client features at the constructor.
 */
export declare interface CallClientFeatureContext {
  /**
   * The call client instance that is being extended by the feature.
   */
  callClient: CallClient;
}

/**
 * Represents the constructor for CallClientFeature objects, along with the context argument.
 */
export declare type CallClientFeatureCtor<TFeature extends CallClientFeature> = new (
  context: CallClientFeatureContext
) => TFeature;

/**
 * Represents the factory of call client agent features
 */
export declare interface CallClientFeatureFactory<TFeature extends CallClientFeature> extends FeatureFactory {
  /**
   * The constructor that returns an instance of an call client feature implementation.
   */
  readonly callClientApiCtor: CallClientFeatureCtor<TFeature>;
}

/**
 * Call client options
 */
export declare interface CallClientOptions {
  /**
   * Specify custom logger injected to the client,
   * Logger implementation is provided by @azure/logger package
   */
  logger?: AzureLogger;
  /**
   * Diagnostics options
   */
  diagnostics?: DiagnosticOptions;
  /**
   * Network configuration
   */
  networkConfiguration?: NetworkConfiguration;
}

/**
 * The Call common interface.
 */
export declare interface CallCommon extends Disposable {
  /**
   * Get the kind of call object.
   */
  readonly kind: CallKind;
  /**
   * Get the unique Id for this Call.
   */
  readonly id: string;
  /**
   * Caller Information if this call is incoming.
   */
  readonly callerInfo: CallerInfo;
  /**
   * Transfer initiator in case of transfer/forward scenarios.
   * @alpha
   */
  readonly transferorInfo?: CallerInfo;
  /**
   * Get the state of this Call.
   */
  readonly state: CallState;
  /**
   * Containing code/subCode indicating how this call ended.
   */
  readonly callEndReason?: CallEndReason;
  /**
   * Get the call direction, whether it is Incoming or Outgoing.
   */
  readonly direction: CallDirection;
  /**
   * Whether local user is muted, locally or remotely.
   */
  readonly isMuted: boolean;
  /**
   * Whether local user muted incoming audio.
   */
  readonly isIncomingAudioMuted: boolean;
  /**
   * Whether screen sharing is on.
   */
  readonly isScreenSharingOn: boolean;
  /**
   * Whether local video is on.
   */
  readonly isLocalVideoStarted: boolean;
  /**
   * Collection of local video streams being sent to other participants in a call.
   */
  readonly localVideoStreams: ReadonlyArray<LocalVideoStream>;
  /**
   * Collection of local audio streams being sent to other participants in a call.
   */
  readonly localAudioStreams: ReadonlyArray<LocalAudioStream>;
  /**
   * Collection of remote audio streams being received from the call.
   */
  readonly remoteAudioStreams: ReadonlyArray<RemoteAudioStream>;
  /**
   * Collection of remote participants in this call.
   * In case of calls with participants of hundred or more,
   * only media active participants are present in this collection.
   */
  readonly remoteParticipants: ReadonlyArray<RemoteParticipant>;
  /**
   * Count of total number of participants in this call.
   * @beta
   */
  readonly totalParticipantCount: number;
  /**
   * Get the role of the local user in the Call.
   */
  readonly role: ParticipantRole;
  /**
   * Get the Teams meeting lobby.
   */
  readonly lobby: Lobby;

  /**
   * Retrieves an initialized and memoized Feature object with extended API.
   * Check the object Features.* for all available extended call features in this package, example:
   * ```typescript
   * const call: Call = ...;
   * call.feature(Features.Recording).isRecordingActive;
   * call.feature(Features.Captions).startCaptions('en-us')
   * ```
   * @param factory - The factory for the call feature constructor that provides an extended API.
   */
  feature<TFeature extends CallFeature>(factory: CallFeatureFactory<TFeature>): TFeature;
  /**
   * Hang up the call.
   * @param options - HangUp options.
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
   * Mute all remote participants.
   */
  muteAllRemoteParticipants(): Promise<void>;
  /**
   * Mute incoming audio.
   */
  muteIncomingAudio(): Promise<void>;
  /**
   * Unmute incoming audio.
   */
  unmuteIncomingAudio(): Promise<void>;
  /**
   * Send DTMF tone.
   */
  sendDtmf(dtmfTone: DtmfTone): Promise<void>;
  /**
   * Start sending video stream in the call.
   * Remote participants in the call will receive your video stream
   * so that they can render it in their UIs.
   * @param localVideoStream - Represents a local video stream that takes a camera source in constructor.
   */
  startVideo(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Stop sending video stream in the call.
   * Must pass the same LocalVideoStream object that was used to start video in
   * the CallAgent.startCall() API, CallAgent.join() API , IncomingCall.accept() API, or Call.startVideo() API.
   * @param localVideoStream - The local video stream to stop streaming.
   */
  stopVideo(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Put this Call on hold.
   */
  hold(): Promise<void>;
  /**
   * Resume this Call if it is on 'LocalHold' state.
   */
  resume(): Promise<void>;
  /**
   * - Start sending screen sharing stream in a call. Browser will prompt to select the screen, app, or browser tab.
   * - Sending screen sharing stream is not supported on iOS nor Android.
   * - Incoming screen sharing stream is supported on iOS and Android.
   */
  startScreenSharing(): Promise<void>;
  /**
   * Stop local screen sharing.
   */
  stopScreenSharing(): Promise<void>;
  /**
   * - Start sending raw screen sharing stream in a call.
   * - Sending raw screen sharing is not supported on iOS nor Android.
   * - Incoming raw screen sharing is supported on iOS and Android.
   * @param localVideoStream - Represents a local raw screen sharing stream that takes a MediaStream in constructor.
   * @beta
   */
  startScreenSharing(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Stop local screen sharing.
   * @param localVideoStream - The local screen sharing stream to stop streaming.
   * @beta
   */
  stopScreenSharing(localVideoStream: LocalVideoStream): Promise<void>;
  /**
   * Start audio in the call with custom audio.
   * LocalAudioStream source should be a MediaStream.
   */
  startAudio(localAudioStream: LocalAudioStream): Promise<void>;
  /**
   * Stop custom audio in the call and switch to Device manager default audio device.
   */
  stopAudio(): void;
  /**
   * Set call constraints.
   * This method sets the max constraints of based on the values provided.
   * The final applied constraints will be less than or equal to the values provided here to this method.
   * If 0 value is provided, then no constraint will be applied for that constraint.
   * If undefined value is provided, then the previous value used will be used for that constraint.
   * @param constraints - Object representing the call constraints to set
   */
  setConstraints(constraints: CallConstraints): Promise<void>;
  /**
   * Subscribe function for stateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for idChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'idChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isIncomingAudioMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isIncomingAudioMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isScreenSharingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isLocalVideoStartedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isLocalVideoStartedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for remoteParticipantsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**
   * Subscribe function for localVideoStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
  /**
   * Subscribe function for localAudioStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'localAudioStreamsUpdated', listener: CollectionUpdatedEvent<LocalAudioStream>): void;
  /**
   * Subscribe function for remoteAudioStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'remoteAudioStreamsUpdated', listener: CollectionUpdatedEvent<RemoteAudioStream>): void;
  /**
   * Subscribe function for totalParticipantCountChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the participant count changes.
   * @beta
   */
  on(event: 'totalParticipantCountChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for roleChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for mutedByOthers event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  on(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for stateChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for idChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'idChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isIncomingAudioMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'isIncomingAudioMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isScreenSharingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isLocalVideoStartedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'isLocalVideoStartedChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for remoteParticipantsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**
   * Unsubscribe function for localVideoStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
  /**
   * Unsubscribe function for localAudioStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'localAudioStreamsUpdated', listener: CollectionUpdatedEvent<LocalAudioStream>): void;
  /**
   * Unsubscribe function for remoteAudioStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'remoteAudioStreamsUpdated', listener: CollectionUpdatedEvent<RemoteAudioStream>): void;
  /**
   * unsubscribe function for totalParticipantCountChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the participant count changes.
   * @beta
   */
  off(event: 'totalParticipantCountChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for roleChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for meetingCapabilitiesChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   * @beta
   */
  /**
   * Unsubscribe function for mutedByOthers event.
   * @param event - event name.
   * @param listener - callback fn that was used to unsubscribe to this event.
   */
  off(event: 'mutedByOthers', listener: PropertyChangedEvent): void;
}

/**
 * Represents constraints for a call
 */
export declare interface CallConstraints {
  /**
   * Video constraints for the call
   */
  video?: VideoConstraints;
}

/**
 * Call diagnostics
 * @beta
 */
export declare interface CallDiagnostics {
  audio: AudioInCallDiagnostics;
  video: VideoInCallDiagnostics;
}

/**
 * Direction of a call:
 * - 'Incoming'
 * - 'Outgoing'
 */
export declare type CallDirection = 'Incoming' | 'Outgoing';

/**
 * Payload for call ended event.
 */
export declare type CallEndedEvent = (args: { callEndReason: CallEndReason }) => void;

/**
 * Describes the reason why the call ended.
 */
export declare interface CallEndReason {
  /**
   * Get a human readable message about the call end reason.
   * @beta
   */
  readonly message: string;
  /**
   * Get the HTTP code.
   */
  readonly code: number;
  /**
   * Get the subCode/reason code.
   */
  readonly subCode?: number;
  /**
   * Whether the call end reason is expected or unexpected.
   * @beta
   */
  readonly resultCategories: ResultCategories[];
}

/**
 * Caller Information.
 */
export declare interface CallerInfo {
  /**
   * Identifier of the caller.
   */
  readonly identifier: CommunicationIdentifierKind | undefined;
  /**
   * Display name of caller ( optional )
   */
  readonly displayName?: string;
}

/**
 * Represents a Call Feature.
 */
export declare interface CallFeature extends BaseFeature {}

/**
 * Represents the context provided for extended call features at the constructor.
 */
export declare interface CallFeatureContext {
  /**
   * The call agent that owns the extended call object.
   */
  callAgent: CallAgentCommon;
  /**
   * The call instance that is being extended by the feature.
   */
  call: CallCommon;
  /**
   * The call Info
   * @beta
   */
  callInfo: CallInfo;
}

/**
 * Represents the constructor for CallFeature objects, along with the context argument.
 */
export declare type CallFeatureCtor<TFeature extends CallFeature> = new (context: CallFeatureContext) => TFeature;

/**
 * Represents the factory of call features
 */
export declare interface CallFeatureFactory<TFeature extends CallFeature> extends FeatureFactory {
  /**
   * The constructor that returns an instance of an call feature implementation.
   */
  readonly callApiCtor: CallFeatureCtor<TFeature>;
}

/**
 * Information about a Call.
 */
export declare interface CallInfo extends CallInfoCommon {
  /**
   * Get the group Id of the call if you joined
   * the call using the CallAgent.join(groupLocator: GroupLocator) API.
   */
  readonly groupId: string | undefined;
  /**
   * Get the Room Id of the call if you joined
   * the call using the CallAgent.join(roomLocator: RoomLocator) API.
   * @beta
   */
  readonly roomId: string | undefined;
}

/**
 * CallInfo common interface.
 */
export declare interface CallInfoCommon {
  /**
   * Get the server call ID.
   */
  getServerCallId(): Promise<string>;
  /**
   * Get the teams meeting threadId id.
   */
  readonly threadId: string | undefined;
  /**
   * Get the local participant Id
   */
  readonly participantId: string;
  /**
   * Get the Call type of the call
   * @beta
   */
  callScenario?: CallInformationScenario;
  /**
   * Get the Call direction of the call
   * Outgoing or Incoming
   * @beta
   */
  direction?: CallDirection;
  /**
   * Get the initiator type of the call
   * @beta
   */
  initiatorKind?: CallInformationIdentifierKind;
  /**
   * Get the initiator target type of the call
   * @beta
   */
  targetKind?: CallInformationIdentifierKind | string;
  /**
   * Get the additional information context needed to get more details about the call
   * @beta
   */
  context?: CallInformationContext;
}

/**
 * @beta
 */
export declare type CallInformationContext =
  | 'transferToParticipant'
  | 'transferToCall'
  | 'escalation'
  | 'roomJoin'
  | 'groupJoin'
  | 'teamsMeetingJoin'
  | ''
  | 'p2pJoin'
  | 'callQueue';

/**
 * @beta
 */
export declare type CallInformationIdentifierKind =
  | 'microsoftTeamsUser'
  | 'phoneNumber'
  | 'communicationUser'
  | 'microsoftTeamsApp'
  | 'unknown';

/**
 * @beta
 */
export declare type CallInformationScenario = 'P2P' | 'Multiparty' | 'Unknown';

/**
 * Call stack initialization states
 * @beta
 */
export declare type CallInitializationResult =
  | 'None'
  | 'ConfigurationFailed'
  | 'SignalingFailed'
  | 'InitializationFailed'
  | 'Initialized';

/**
 * The kind of call object.
 */
export declare enum CallKind {
  /**
   * ACS call object kind.
   */
  Call = 'Call',
  /**
   * Teams call object kind.
   */
  TeamsCall = 'TeamsCall'
}

/**
 * Represents a call survey rating.
 */
export declare interface CallRating<TIssue extends AudioIssue | OverallIssue | ScreenshareIssue | VideoIssue> {
  /**
   * The rating value should follow rating scale.
   */
  score: number;
  /**
   * Call rating type with issues.
   */
  issues?: TIssue[];
  /**
   * Rating scale default 1-5 rating
   */
  scale?: RatingScale;
}

/**
 * Call states.
 */
export declare type CallState =
  | 'None'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'LocalHold'
  | 'RemoteHold'
  | 'InLobby'
  | 'Disconnecting'
  | 'Disconnected'
  | 'EarlyMedia';

/**
 * Represents the end of call survey.
 */
export declare interface CallSurvey {
  /**
   * Overall call rating with optional overall issues
   */
  overallRating?: CallRating<OverallIssue>;
  /**
   * Audio rating with optional audio issues
   */
  audioRating?: CallRating<AudioIssue>;
  /**
   * Video rating with optional video issues
   */
  videoRating?: CallRating<VideoIssue>;
  /**
   * Screenshare rating with optional screenshare issues
   */
  screenshareRating?: CallRating<ScreenshareIssue>;
}

/**
 * Feature for ACS Live Streaming
 */
export declare interface CallSurveyFeature extends CallFeature {
  /**
   * Send the end of call survey
   * @param survey - survey data
   * @param options - optional call survey options
   */
  submitSurvey(survey: CallSurvey, options?: SubmitSurveyOptions): Promise<CallSurveyResponse>;
}

/**
 * Represents the end of call survey response.
 */
export declare interface CallSurveyResponse extends CallSurvey {
  /**
   * Uniquely identify the call survey
   */
  readonly id: string;
  /**
   * Uniquely identify the call being served
   */
  readonly callId: string;
  /**
   * The participant submitting the survey
   */
  readonly localParticipantId: string;
}

/**
 * @public
 * Event type for capabilities changed event
 */
export declare type CapabilitiesChangedEventType = 'capabilitiesChanged';

/**
 * Capabilities Changed Reason
 * @public
 */
export declare type CapabilitiesChangedReason =
  | 'RoleChanged'
  | 'UserPolicyChanged'
  | 'MeetingOptionOrOrganizerPolicyChanged'
  | 'TeamsPremiumLicenseChanged';

/**
 * @public
 * Callback definition for handling the CaptionsReceivedEventType event.
 */
export declare type CapabilitiesChangeHandler = (data: CapabilitiesChangeInfo) => void;

/**
 * @public
 * Data structure received for each CapabilitiesChangedEventType event.
 */
export declare interface CapabilitiesChangeInfo {
  /**
   * The old value of the capabilities that changed.
   */
  oldValue: ChangedParticipantCapabilities;
  /**
   * The new value of the capabilities that changed.
   */
  newValue: ChangedParticipantCapabilities;
  /**
   * The capability change reason.
   */
  reason: CapabilitiesChangedReason;
}

/**
 * Capabilities Feature.
 * @public
 */
export declare interface CapabilitiesFeature extends CallFeature {
  /**
   * Get capabilities of the participant.
   * @returns capabilities of the participant
   */
  readonly capabilities: ParticipantCapabilities;
  /**
   * Subscribe function for capabilities changed event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CapabilitiesChangedEventType, listener: CapabilitiesChangeHandler): void;
  /**
   * Unsubscribe function for capabilities changed event
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: CapabilitiesChangedEventType, listener: CapabilitiesChangeHandler): void;
}

/**
 * Capability Resolution Reason
 * @public
 */
export declare type CapabilityResolutionReason =
  | 'Capable'
  | 'CapabilityNotApplicableForTheCallType'
  | 'ClientRestricted'
  | 'UserPolicyRestricted'
  | 'RoleRestricted'
  | 'FeatureNotSupported'
  | 'MeetingRestricted'
  | 'NotInitialized'
  | 'NotCapable'
  | 'TeamsPremiumLicenseRestricted';

/**
 * Event type for caption language changed event
 */
export declare type CaptionLanguageChangedEventType = 'CaptionLanguageChanged';

/**
 * Data structure for Captions object
 */
export declare interface Captions extends CaptionsCommon {
  /**
   * Subscribe function for the CaptionsReceivedEventType event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
  /**
   * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: CaptionsReceivedEventType, listener: CaptionsHandler): void;
  /**
   * Subscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for any of the SpokenLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: SpokenLanguageChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the SpokenLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: SpokenLanguageChangedEventType, listener: PropertyChangedEvent): void;
}

/**
 * Feature for Captions
 */
export declare interface CaptionsCallFeature extends CallFeature {
  /**
   * Indicates which captions type is currently active
   */
  readonly captions: CaptionsCommon;
  /**
   * Subscribe function for any of the CaptionsKindChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this
   *
   */
  on(event: CaptionsKindChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the CaptionsKindChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   *
   */
  off(event: CaptionsKindChangedEventType, listener: PropertyChangedEvent): void;
}

/**
 * Data structure for CaptionsCommon object
 */
export declare interface CaptionsCommon {
  /**
   * Starts the processing of captions in this call with the provided handler for this client
   *
   * @param startCaptionsOptions - Additional options for starting captions.
   * @returns A Promise representing the completion of the intialization process for the Start Caption operation
   *  The completion of this promise does NOT indicate the captions have started.
   *  A 'CaptionsActiveChanged' event will be emitted when captions have actually successfully started.
   */
  startCaptions(startCaptionsOptions?: StartCaptionsOptions): Promise<void>;
  /**
   * Stops the retrieval of captions data in the call for the user who initiated stopCaptions
   *
   * @returns A promise representing the completion of the Stop Caption operation
   * The completion of this promise does NOT indicate the captions bot has left the call.
   * The participant will unsubscribe from receiving captions data upon successfully stopped.
   */
  stopCaptions(): Promise<void>;
  /**
   * Updates the language of the ongoing Transcription / Captions
   *
   * @param language - The language to caption speech as. Must be BCP 47 format (e.g. "en-us")
   * @returns A Promise representing the completion of the Set Language operation.
   *  The completion of this promise does NOT indicate the language has changed.
   *  A 'SpokenLanguageChanged' event will be emitted when the language has actually successfully changed.
   */
  setSpokenLanguage(language: string): Promise<void>;
  /**
   * List of supported spoken languages to use with the caption service in BCP 47 format
   */
  readonly supportedSpokenLanguages: string[];
  /**
   * Indicates if captions are active in the current call
   */
  readonly isCaptionsFeatureActive: boolean;
  /**
   * Indicates the current active spoken language in the call in BCP 47 format
   */
  readonly activeSpokenLanguage: string;
  /**
   * Indicates the Captions type for the active captions object
   */
  readonly kind: CaptionsKind;
}

/**
 * Callback definition for handling the CaptionsReceivedEventType event
 */
export declare type CaptionsHandler = (data: CaptionsInfo) => void;

/**
 * Data structure received for each CaptionsReceivedEventType event
 */
export declare interface CaptionsInfo {
  /**
   * The state in which this caption data can be classified
   */
  resultType: CaptionsResultType;
  /**
   * The information of the call participant who spoke the captioned text
   */
  speaker: ParticipantInfo;
  /**
   * The language that the spoken words were interpretted as. Corresponds to the language specified in startCaptions / setSpokenLanguage
   */
  spokenLanguage: string;
  /**
   * The caption text
   */
  spokenText: string;
  /**
   * Timestamp of when the captioned words were initially spoken
   */
  timestamp: Date;
}

/**
 * Captions Type for classifying Captions object kind
 */
export declare type CaptionsKind = 'TeamsCaptions' | 'Captions';

/**
 * Event type for Captions Type changed event
 */
export declare type CaptionsKindChangedEventType = 'CaptionsKindChanged';

/**
 * Event type for captions property changed event
 */
export declare type CaptionsPropertyChangedEventType = 'CaptionsActiveChanged';

/**
 * Event type for captions received event
 */
export declare type CaptionsReceivedEventType = 'CaptionsReceived';

/**
 * Type for classifying the finality of the current phrase's transcription
 *
 * CaptionInfo will have ResultType of Partial if the text contains partially spoken sentence.
 * CaptionInfo will have ResultType of Final if once the sentence has been completely transcribed.
 */
export declare type CaptionsResultType = 'Partial' | 'Final';

/**
 * Changed Participant Capabilities
 * @public
 */
export declare type ChangedParticipantCapabilities = Partial<ParticipantCapabilities>;

/**
 * Payload for collection updated event.
 */
export declare type CollectionUpdatedEvent<T> = (args: { added: T[]; removed: T[] }) => void;

/**
 * Error that get's throw when API call fails.
 */
export declare interface CommunicationServicesError {
  /**
   * Get the error name.
   */
  readonly name: string;
  /**
   * Get a human readable message about the error.
   */
  readonly message: string;
  /**
   * Get the HTTP code.
   */
  readonly code: number;
  /**
   * Get the subCode/reason code.
   */
  readonly subCode: number;
  /**
   * Whether this error is expected or unexpected.
   * @beta
   */
  readonly resultCategories: ResultCategories[];
}

/**
 * Feature for Composition Stream
 * @alpha
 */
export declare interface ComposedStreamCallFeature extends CallFeature {
  /**
   * Collection of composed streams this participants has.
   */
  readonly composedStreams: ReadonlyArray<ComposedVideoStream>;
  /**
   * Subscribe function for composedStreamsUpdated  event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'composedStreamsUpdated', listener: CollectionUpdatedEvent<ComposedVideoStream>): void;
  /**
   * Unsubscribe function for composedStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'composedStreamsUpdated', listener: CollectionUpdatedEvent<ComposedVideoStream>): void;
}

/**
 * Represents a composed video stream.
 * @alpha
 */
export declare interface ComposedVideoStream extends RemoteVideoStreamCommon {
  /**
   * Subscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   * @alpha
   */
  on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   * @alpha
   */
  on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   * @alpha
   */
  off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   * @alpha
   */
  off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
}

/**
 * Information about a composite audio device.
 */
export declare interface CompositeAudioDeviceInfo {
  readonly microphone: AudioDeviceInfo;
  readonly speaker: AudioDeviceInfo;
  readonly compositeAudioDeviceType: CompositeAudioDeviceType;
}

/**
 * Type of a composite audio device.
 */
export declare type CompositeAudioDeviceType = 'Speaker' | 'Headphones' | 'Headset' | 'Handset' | 'Speakerphone';

/**
 * The ConnectionState is used to indicate the connection state of the CallAgent.
 * - 'Connected' - The CallAgent is connected and ready to receive incoming calls.
 * - 'Disconnected' - The CallAgent is disconnected and might not receive incoming calls.
 */
export declare type ConnectionState = 'Connected' | 'Disconnected';

/**
 * Payload for state changed event.
 */
export declare type ConnectionStateChangedEvent = (args: {
  newValue: ConnectionState;
  oldValue: ConnectionState;
  reason?: ConnectionStateChangedReason;
}) => void;

/**
 * Reason why connection state changed.
 */
export declare type ConnectionStateChangedReason = 'invalidToken' | 'connectionIssue';

/**
 * Options for the renderer of a video stream.
 */
export declare interface CreateViewOptions {
  /**
   * Whether the view should be mirrored or not.
   */
  isMirrored?: boolean;
  /**
   * Scaling mode for the view.
   */
  scalingMode?: ScalingMode;
}

/**
 * Received Options on call custom context.
 */
export declare interface CustomContext extends CustomContextOptions {
  /**
   * sip headers X-headers should begin with “X-MS-Custom-“ prefix.
   * Only the first 5 valid headers are parsed. The rest are ignored.
   */
  sipHeaders?: xHeader[];
  /**
   * voip headers.
   */
  voipHeaders?: xHeader[];
}

/**
 * Options for call custom context.
 */
export declare interface CustomContextOptions {
  /**
   * UUI header.
   */
  userToUser?: string;
  /**
   * X-headers should begin with “X-MS-Custom-“ prefix.
   * Only the first 5 valid headers are parsed. The rest are ignored.
   * @deprecated
   */
  xHeaders?: xHeader[];
}

/**
 * DataChannel Call Feature
 */
export declare interface DataChannelCallFeature extends CallFeature {
  /**
   * Create a DataChannel sender object
   * @param options - sender options
   */
  createDataChannelSender(options: DataChannelSenderOpenOptions): DataChannelSender;

  on(event: 'dataChannelReceiverCreated', listener: DataChannelReceiverCreatedEvent): void;
  off(event: 'dataChannelReceiverCreated', listener: DataChannelReceiverCreatedEvent): void;
}

/**
 * DataChannel message
 */
export declare interface DataChannelMessage {
  sequenceNumber: number;
  data: Uint8Array;
}

/**
 * priority option in DataChannelSenderOpenOptions
 */
export declare type DataChannelPriority = 'High' | 'Normal';

/**
 * DataChannel receiver
 */
export declare interface DataChannelReceiver {
  channelId: number;
  senderParticipantIdentifier: CommunicationIdentifierKind;
  on(event: 'messageReady', listener: DataChannelReceiverMessageReadyEvent): void;
  on(event: 'close', listener: DataChannelReceiverCloseEvent): void;
  off(event: 'messageReady', listener: DataChannelReceiverMessageReadyEvent): void;
  off(event: 'close', listener: DataChannelReceiverCloseEvent): void;
  readMessage(): DataChannelMessage | undefined;
}

/**
 * DataChannel close event listener
 */
export declare type DataChannelReceiverCloseEvent = () => void;

/**
 * DataChannel dataChannelReceiverCreated event listener
 */
export declare type DataChannelReceiverCreatedEvent = (args: DataChannelReceiver) => void;

/**
 * DataChannel messageReady event listener
 */
export declare type DataChannelReceiverMessageReadyEvent = () => void;

/**
 * reliability option in DataChannelSenderOpenOptions
 */
export declare type DataChannelReliability = 'Durable' | 'Lossy';

/**
 * DataChannel sender
 */
export declare interface DataChannelSender {
  channelId: number;
  maxMessageSize: number;
  setParticipants(participants: CommunicationIdentifier[]): void;
  sendMessage(data: Uint8Array): Promise<void>;
  close(): void;
}

/**
 * Sender options for creating a DataChannel sender object
 */
export declare type DataChannelSenderOpenOptions = {
  /**
   * bitrate in kbps
   */
  bitrateInKbps?: number;
  channelId?: number;
  participants?: CommunicationIdentifier[];
  priority?: DataChannelPriority;
  reliability?: DataChannelReliability;
};

/**
 * Feature for call debug info.
 */
export declare interface DebugInfoCallClientFeature extends CallClientFeature {
  /**
   * Get the LocalParticipantId of the last Call undefined if no call happened
   * @beta
   */
  readonly lastLocalParticipantId: string | undefined;
  /**
   * Get the CallId of the last Call undefined if no call happened
   * @beta
   */
  readonly lastCallId: string | undefined;
  /**
   * Provides environment details and tells if it is supported by ACS.
   * A supported environment is a combination of an operating system,
   * a browser, and the minimum version required for that browser.
   */
  getEnvironmentInfo(): Promise<EnvironmentInfo>;
  /**
   * Whether the CallClient is active in multiple tabs of a browser
   */
  readonly isCallClientActiveInAnotherTab: boolean;
  /**
   * Subscribe function for isCallClientActiveInAnotherTabChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isCallClientActiveInAnotherTabChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isCallClientActiveInAnotherTabChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isCallClientActiveInAnotherTabChanged', listener: PropertyChangedEvent): void;
  /**
   * Whether there are many CallClient active within the same tab of a browser
   * @alpha
   */
  readonly isAnotherCallClientActiveInSameTab: boolean;
  /**
   * Subscribe function for isAnotherCallClientActiveInSameTabChanged event
   * @alpha
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isAnotherCallClientActiveInSameTabChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isAnotherCallClientActiveInSameTabChanged event
   * @alpha
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isAnotherCallClientActiveInSameTabChanged', listener: PropertyChangedEvent): void;
  /**
   * A zipped log dump with its unique identifier and hash
   * @beta
   */
  dumpDebugInfo(): DebugInfoDump;
}

/**
 * dump id is a uniqueIdentifier for each debug info dump
 * @beta
 */
export declare interface DebugInfoDump {
  /**
   * A unique id for every log dump snap shot combined with its hash
   */
  readonly dumpId: string;
  /**
   * A zipped log dump
   */
  readonly dump: string;
}

/**
 * Deep noise suppression effect
 */
export declare interface DeepNoiseSuppressionEffect extends AudioEffect {
  /**
   * Name of the audio effect
   */
  readonly name: NoiseSuppressionEffectName;
}

/**
 * Permissions granted by the user.
 */
export declare interface DeviceAccess {
  /**
   * Whether the user allowed audio permissions or not.
   */
  audio: boolean;
  /**
   * Whether the user allowed video permission or not.
   */
  video: boolean;
}

/**
 * Device availability grade
 * @beta
 */
export declare type DeviceAvailabilityGrade = 'Available' | 'NotAvailable' | 'Unknown';

/**
 * Device compatibility information
 * @beta
 */
export declare interface DeviceCompatibility {
  browser: DeviceSupportGrade;
  os: DeviceSupportGrade;
}

/**
 * Device enumeration information
 * @beta
 */
export declare interface DeviceEnumeration {
  microphone: DeviceAvailabilityGrade;
  camera: DeviceAvailabilityGrade;
  speaker: DeviceAvailabilityGrade;
}

/**
 * The Device Manager is used to handle system
 * media devices such as cameras, microphones, and speakers.
 */
export declare interface DeviceManager {
  /**
   * Whether the device host can select speaker output.
   */
  readonly isSpeakerSelectionAvailable: boolean;
  /**
   *  The microphone device that is being used.
   */
  readonly selectedMicrophone?: AudioDeviceInfo;
  /**
   * The speaker device that is being used.
   */
  readonly selectedSpeaker?: AudioDeviceInfo;
  /**
   * Get a list of available video devices for use.
   */
  getCameras(): Promise<VideoDeviceInfo[]>;
  /**
   * Get a list of available microphone devices for use.
   */
  getMicrophones(): Promise<AudioDeviceInfo[]>;
  /**
   * Get a list of available speaker devices for use.
   */
  getSpeakers(): Promise<AudioDeviceInfo[]>;
  /**
   * Selects the microphone device to use.
   * @param microphoneDevice - Microphone device information.
   */
  selectMicrophone(microphoneDevice: AudioDeviceInfo): Promise<void>;
  /**
   * Select the speaker device to use.
   * @param speakerDevice - Speaker device information.
   */
  selectSpeaker(speakerDevice: AudioDeviceInfo): Promise<void>;
  /**
   * Show browser prompt to ask the front end user for permission to use the specified device.
   * @param permissionConstraints - configures which permission (audio/video) to request.
   * @returns The permissions that were granted by the user.
   */
  askDevicePermission(permissionConstraints: PermissionConstraints): Promise<DeviceAccess>;
  /**
   * Subscribe function for videoDevicesUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
  /**
   * Subscribe function for audioDevicesUpdated .
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
  /**
   * Subscribe function for selectedMicrophoneChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for selectedSpeakerChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for videoDevicesUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
  /**
   * Unsubscribe function for audioDevicesUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
  /**
   * Unsubscribe function for selectedMicrophoneChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for selectedSpeakerChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
}

/**
 * Browser/OS support grade
 * @beta
 */
export declare type DeviceSupportGrade = 'Supported' | 'NotSupported' | 'Unknown';

/**
 * Type of device.
 */
export declare type DeviceType = 'Camera' | 'Microphone' | 'Speaker';

/**
 * Listener arguments for the call 'diagnosticChanged' event
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 */
export declare type DiagnosticChangedEventArgs = {
  value: DiagnosticQuality | DiagnosticFlag;
  valueType: DiagnosticValueType;
};

/**
 * Boolean flag value for boolean related diagnostics such as DeviceSpeakWhileMuted, NoNetwork etc...
 */
export declare type DiagnosticFlag = boolean;

/**
 * Diagnostic options
 */
export declare interface DiagnosticOptions {
  appName?: string;
  /**
   * The application version
   */
  appVersion?: string;
  /**
   * Tags - additional information
   */
  tags?: string[];
}

/**
 * Quality value for Quality related diagnostics such as NetworkSendQuality, NetworkRevQuality, etc...
 * Good = 1, no problem.
 * Poor = 2, mild problem.
 * Bad = 3, severe problem.
 */
export declare enum DiagnosticQuality {
  Good = 1,
  Poor = 2,
  Bad = 3
}

/**
 * Diagnostic value type. DiagnosticQuality or DiagnosticFlag
 */
export declare type DiagnosticValueType = 'DiagnosticQuality' | 'DiagnosticFlag';

/**
 * Dispose of an object.
 */
export declare interface Disposable {
  dispose(): void;
}

/**
 * Feature for call dominant speaker.
 */
export declare interface DominantSpeakersCallFeature extends CallFeature {
  /**
   * Information about the dominant speakers
   */
  readonly dominantSpeakers: DominantSpeakersInfo;
  /**
   * Subscribe function for dominantSpeakersChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'dominantSpeakersChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for dominantSpeakersChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'dominantSpeakersChanged', listener: PropertyChangedEvent): void;
}

/**
 * Information about the dominant speakers of a call
 */
export declare interface DominantSpeakersInfo {
  /**
   * The list of the dominant speakers for the call:
   *     - dominantSpeakers[0] is the most dominant speaker.
   *     - dominantSpeakers[1] is the second most dominant speaker.
   *     - dominantSpeakers[2] is the third most dominat speaker.
   *     - and so on...
   */
  speakersList: ReadonlyArray<CommunicationIdentifierKind>;
  timestamp: Date;
}

/**
 * DTMF tone for PSTN calls.
 */
export declare type DtmfTone =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'Flash'
  | 'Num0'
  | 'Num1'
  | 'Num2'
  | 'Num3'
  | 'Num4'
  | 'Num5'
  | 'Num6'
  | 'Num7'
  | 'Num8'
  | 'Num9'
  | 'Pound'
  | 'Star';

/**
 * Echo cancellation effect
 * @alpha
 */
export declare interface EchoCancellationEffect extends AudioEffect {
  /**
   * Name of the audio effect
   */
  readonly name: EchoCancellationEffectName;
}

/**
 * Represents echo cancellation effect names
 * @alpha
 */
export declare type EchoCancellationEffectName = 'BrowserEchoCancellation' | 'EchoCancellation';

export declare interface EmergencyCallOptions {
  /**
   * Country code for emergency calls
   */
  countryCode?: string;
}

/**
 * Details of a remote participant's endpoint
 */
export declare interface EndpointDetails {
  /**
   * The participant Id for this endpoint.
   */
  participantId: string;
}

/**
 * Browser info
 */
export declare type Environment = {
  platform: string;
  browser: string;
  browserVersion: string;
};

/**
 * Environment Info
 */
export declare type EnvironmentInfo = {
  environment: Environment;
  isSupportedPlatform: boolean;
  isSupportedBrowser: boolean;
  isSupportedBrowserVersion: boolean;
  isSupportedEnvironment: boolean;
};

/**
 * Represents the interface for factoring a feature
 */
export declare interface FeatureFactory {}

/**
 * The collection of all 1st party Features.
 */
export declare const Features: {
  Recording: CallFeatureFactory<RecordingCallFeature>;
  Transfer: CallFeatureFactory<TransferCallFeature>;
  Transcription: CallFeatureFactory<TranscriptionCallFeature>;
  Captions: CallFeatureFactory<CaptionsCallFeature>;
  RaiseHand: CallFeatureFactory<RaiseHandCallFeature>;
  /**
   * @beta
   */
  LocalRecording: CallFeatureFactory<LocalRecordingCallFeature>;
  Reaction: CallFeatureFactory<ReactionCallFeature>;
  Spotlight: CallFeatureFactory<SpotlightCallFeature>;
  PPTLive: CallFeatureFactory<PPTLiveCallFeature>;
  /**
   * @beta
   */
  BreakoutRooms: CallFeatureFactory<BreakoutRoomsCallFeature>;
  /**
   * @public
   */
  Capabilities: CallFeatureFactory<CapabilitiesFeature>;
  DominantSpeakers: CallFeatureFactory<DominantSpeakersCallFeature>;
  /**
   * @alpha
   */
  LiveStream: CallFeatureFactory<LiveStreamCallFeature>;
  /**
   * @alpha
   */
  ComposedStream: CallFeatureFactory<ComposedStreamCallFeature>;
  CallSurvey: CallFeatureFactory<CallSurveyFeature>;
  UserFacingDiagnostics: CallFeatureFactory<UserFacingDiagnosticsFeature>;
  MediaStats: CallFeatureFactory<MediaStatsCallFeature>;
  DebugInfo: CallClientFeatureFactory<DebugInfoCallClientFeature>;
  /**
   * @beta
   */
  PreCallDiagnostics: CallClientFeatureFactory<PreCallDiagnosticsFeature>;
  VideoEffects: VideoStreamFeatureFactory<VideoEffectsFeature>;
  AudioEffects: AudioStreamFeatureFactory<AudioEffectsFeature>;
  DataChannel: CallFeatureFactory<DataChannelCallFeature>;
  /**
   * @public
   */
  OptimalVideoCount: CallFeatureFactory<OptimalVideoCountCallFeature>;

  /**
   * @public
   */
  TeamsMeetingAudioConferencing: CallFeatureFactory<TeamsMeetingAudioConferencingCallFeature>;
  /**
   * @beta
   */
  TogetherMode: CallFeatureFactory<TogetherModeCallFeature>;
};

/**
 * Locator used for joining a group call.
 */
export declare interface GroupCallLocator {
  groupId: string;
}

/**
 * Locator used to joining group chat call.
 * @beta
 */
export declare interface GroupChatCallLocator {
  threadId: string;
}

/**
 * Group locator.
 */
export declare type GroupLocator = GroupCallLocator;

/**
 * Options for hanging up a call.
 */
export declare interface HangUpOptions {
  /**
   * End the call for everyone.
   */
  forEveryone: boolean;
}

/**
 * Represents an ice server (stun/turn)
 */
export declare interface IceServer {
  urls: string[];
  username?: string;
  credential?: string;
}

/**
 * Call diagnostic information
 * @beta
 */
export declare interface InCallDiagnostics {
  connected: boolean;
  diagnostics: CallDiagnostics;
  bandWidth: QualityGrade;
}

/**
 * Generic type of audio receive media stats
 */
export declare interface IncomingAudioMediaStats<NumberType, StringType> {
  id: string;
  codecName?: StringType;
  bitrate?: NumberType;
  jitterInMs?: NumberType;
  packets?: NumberType;
  packetsPerSecond?: NumberType;
  packetsLost?: NumberType;
  packetsLostPerSecond?: NumberType;
  rttInMs?: NumberType;
  jitterBufferDelayInMs?: NumberType;
  audioOutputLevel?: NumberType;
  healedRatio?: NumberType;
  transportId?: StringType;
}

/**
 * Represents an incoming call.
 */
export declare interface IncomingCall extends IncomingCallCommon {
  /**
   * Get information about this Call.
   */
  readonly info: CallInfo;
  /**
   * Accept this incoming Call.
   * @param options - accept options.
   * @returns The Call object associated with the accepted call.
   */
  accept(options?: AcceptCallOptions): Promise<Call>;
}

/**
 * The incoming call common interface.
 */
export declare interface IncomingCallCommon {
  /**
   * Get the kind of incoming call oject.
   */
  readonly kind: IncomingCallKind;
  /**
   * Get the unique Id for this Call.
   */
  readonly id: string;
  /**
   * Identifier of the caller.
   */
  readonly callerInfo: CallerInfo;
  /**
   * Transfer initiator in case of transfer/forward scenarios.
   * @alpha
   */
  readonly transferorInfo?: CallerInfo;
  /**
   * Containing code/subCode indicating how call ended.
   */
  readonly callEndReason?: CallEndReason;
  /**
   * Options sent as custom context.
   */
  readonly customContext?: CustomContext;
  /**
   * Reject this incoming Call.
   */
  reject(): Promise<void>;
  /**
   * Subscribe function for onCallEnded event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  on(event: 'callEnded', listener: CallEndedEvent): void;
  /**
   * Unsubscribe function for onCallEnded event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'callEnded', listener: CallEndedEvent): void;
}

/**
 * Payload for incoming call event.
 */
export declare type IncomingCallEvent = (args: { incomingCall: IncomingCall }) => void;

/**
 * The kind of incoming call object.
 */
export declare enum IncomingCallKind {
  /**
   * ACS incoming call object kind.
   */
  IncomingCall = 'IncomingCall',
  /**
   * Teams incoming call object kind.
   */
  TeamsIncomingCall = 'TeamsIncomingCall'
}

/**
 * Incoming call push notification data
 * @beta
 */
export declare interface IncomingCallPushNotificationData {
  incomingCallContext: string;
}

/**
 * Generic type of screenshare receive media stats
 */
export declare type IncomingScreenShareMediaStats<NumberType, StringType> = IncomingVideoMediaStats<
  NumberType,
  StringType
>;

/**
 * Generic type of video receive media stats
 */
export declare interface IncomingVideoMediaStats<NumberType, StringType> {
  id: string;
  codecName?: StringType;
  bitrate?: NumberType;
  jitterInMs?: NumberType;
  packets?: NumberType;
  packetsPerSecond?: NumberType;
  packetsLost?: NumberType;
  packetsLostPerSecond?: NumberType;
  rttInMs?: NumberType;
  /**
   * streamId is the value which corresponds to id in VideoStreamCommon
   */
  streamId?: NumberType;
  jitterBufferDelayInMs?: NumberType;
  frameRateDecoded?: NumberType;
  frameRateReceived?: NumberType;
  frameWidthReceived?: NumberType;
  frameHeightReceived?: NumberType;
  longestFreezeDurationInMs?: NumberType;
  totalFreezeDurationInMs?: NumberType;
  framesReceived?: NumberType;
  framesDropped?: NumberType;
  framesDecoded?: NumberType;
  keyFramesDecoded?: NumberType;
  transportId?: StringType;
}

/**
 * Invitee details
 */
export declare interface Invitee {
  /**
   * Id of the invitee
   */
  readonly identifier: CommunicationIdentifier;
}

/**
 * Name of event type for breakoutroom joined event
 */
export declare interface JoinBreakoutRoomsEvent {
  /**
   * Breakout room event type
   */
  type: 'join';
  /**
   * Breakoutroom call object
   */
  data: Call | TeamsCall;
}

/**
 * Options for joining a group call.
 * Pass video stream that will be used to start a call. Remote participants in
 * the call will receive your video stream so that they can render it in their UIs.
 * Pass audio options weather to join the call muted or unmuted.
 * If videoOptions is undefined, then call will be started with local video off.
 */
export declare interface JoinCallOptions {
  videoOptions?: VideoOptions;
  audioOptions?: AudioOptions;
}

/**
 * Latest value for a call diagnostic
 */
export declare type LatestDiagnosticValue = {
  value: DiagnosticQuality | DiagnosticFlag;
  valueType: DiagnosticValueType;
};

/**
 * Latest media diagnostics that were raised.
 */
export declare interface LatestMediaDiagnostics {
  /**
   * Raised to True when local microphone is muted and the local user is speaking.
   * Raised to False when local user either stops speaking, or unmutes the microphone.
   */
  speakingWhileMicrophoneIsMuted?: LatestDiagnosticValue;
  /**
   * Raised to True when there are no speaker devices on the system, and speaker selection is supported.
   * Raised to False when there is a least 1 speaker device on the system, and speaker selection is supported.
   */
  noSpeakerDevicesEnumerated?: LatestDiagnosticValue;
  /**
   * Raised to True when there are no microphone devices on the system.
   * Raised to False when there is at least 1 microphone device on the system.
   */
  noMicrophoneDevicesEnumerated?: LatestDiagnosticValue;
  /**
   * Raised to True when the local video stream is frozen. This means the remote side is seeing your video frozen on their screen.
   * Raised to False when the freeze ends.
   */
  cameraFreeze?: LatestDiagnosticValue;
  /**
   * Raised to True when we fail to start sending local video becuase the camera device may have been disabled in the system
   * or it is being used by another process.
   * Raised to False when selected camera device successfully sends local video again.
   */
  cameraStartFailed?: LatestDiagnosticValue;
  /**
   * Raised to True when camera device times out to start sending video stream.
   * Raised to False when selected camera device successfully sends local video again
   */
  cameraStartTimedOut?: LatestDiagnosticValue;
  /**
   * Raised to True when we fail to start capturing the screen.
   * Raised to False when capturing the screen successfully can start.
   */
  capturerStartFailed?: LatestDiagnosticValue;
  /**
   * Raised to True when we fail to start sending local audio stream becuase the microphone device may have been disabled in the system
   * or it is being used by another process.
   * Raised to False when microphone starts to successfully send audio stream again.
   */
  microphoneNotFunctioning?: LatestDiagnosticValue;
  /**
   * Raised to True when microphone enters muted state unexpectedly.
   * Raised to False when microphone starts to successfully send audio stream again.
   */
  microphoneMuteUnexpectedly?: LatestDiagnosticValue;
  /**
   * Raised to True when camera enters stopped state unexpectedly.
   * Raised to False when camera starts to successfully send video stream again.
   */
  cameraStoppedUnexpectedly?: LatestDiagnosticValue;
  /**
   * Raised to True when screen capturer enters stopped state unexpectedly.
   * Raised to False when screen capturer starts to successfully capture again.
   */
  capturerStoppedUnexpectedly?: LatestDiagnosticValue;
  /**
   * Raised to True when screensharing permission is denied by system settings (sharing).
   * Raised to False on successful stream acquisition.
   * This diagnostic only works on MacOS Chrome
   */
  screenshareRecordingDisabled?: LatestDiagnosticValue;
  /**
   * Raised to True when audio permission is denied by system settings (audio).
   * Raised to False on successful stream acquisition.
   * This diagnostic only works on MacOS Chrome
   */
  microphonePermissionDenied?: LatestDiagnosticValue;
  /**
   * Raised to True when camera permission is denied by system settings (video).
   * Raised to False on successful stream acquisition.
   * This diagnostic only works on MacOS Chrome
   */
  cameraPermissionDenied?: LatestDiagnosticValue;
}

/**
 * Latest network diagnostics that were raised.
 */
export declare interface LatestNetworkDiagnostics {
  /**
   * Raised to 3 (DiagnosticQuality.Bad) when network is disconnected and unable to reconnect.
   * Raised to 2 (DiagnosticQuality.Poor) when media transport connectivity is lost.
   * Raised to 1 (DiagnosticQuality.Good) when new session is connected.
   */
  networkReconnect?: LatestDiagnosticValue;
  /**
   * Raised to 3 (DiagnosticQuality.Bad) when there is a severe problem with recv quality.
   * Raised to 2 (DiagnosticQuality.Poor) when there is a mild problem with recv quality.
   * Raised to 1 (DiagnosticQuality.Good) when there is no problem with recv quality.
   */
  networkReceiveQuality?: LatestDiagnosticValue;
  /**
   * Raised to 3 (DiagnosticQuality.Bad) when there is a severe problem with send quality.
   * Raised to 2 (DiagnosticQuality.Poor) when there is a mild problem with send quality.
   * Raised to 1 (DiagnosticQuality.Good) when there is no problem with send quality.
   */
  networkSendQuality?: LatestDiagnosticValue;
  /**
   * Raised to True when call fails to start because there is no network.
   * Raised to False when there are ice candidates present.
   */
  noNetwork?: LatestDiagnosticValue;
  /**
   * Raised to True when the network has some constraint that is not allowing to reach ACS relays.
   * Raised to False upon making a new call.
   */
  networkRelaysNotReachable?: LatestDiagnosticValue;
}

/**
 * Feature for ACS Live Streaming
 * @alpha
 */
export declare interface LiveStreamCallFeature extends CallFeature {
  /**
   * Collection of live streams this participants has.
   */
  readonly liveStreams: ReadonlyArray<LiveVideoStream>;
  /**
   * Count of total number of streaming participants in this call.
   * */
  readonly participantCount: number;
  /**
   * Subscribe function for liveStreamsUpdated  event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'liveStreamsUpdated', listener: CollectionUpdatedEvent<LiveVideoStream>): void;
  /**
   * Subscribe function for participantCountChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the participant count changes.
   */
  on(event: 'participantCountChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for liveStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'liveStreamsUpdated', listener: CollectionUpdatedEvent<LiveVideoStream>): void;
  /**
   * unsubscribe function for participantCountChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the participant count changes.
   * @alpha
   */
  off(event: 'participantCountChanged', listener: PropertyChangedEvent): void;
  /**
   * create a collector for live streams statistics
   * @param options - collector option
   */
  createStatsCollector(options?: MediaStatsCollectorOptions): LiveStreamStatsCollector;
}

/**
 * Livestream stats collector.
 * @alpha
 */
export declare interface LiveStreamStatsCollector {
  /**
   * Dispose collector.
   */
  dispose(): void;
  /**
   * Subscribe function for LiveStreamStatsSample event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'sampleReported', listener: LiveStreamStatsSampleEvent): void;
  /**
   * Subscribe function for LiveStreamStatsSummary event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'summaryReported', listener: LiveStreamStatsSummaryEvent): void;
  /**
   * Unsubscribe function for raw LiveStreamStatsSample event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'sampleReported', listener: LiveStreamStatsSampleEvent): void;
  /**
   * Unsubscribe function for LiveStreamStatsSummary event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'summaryReported', listener: LiveStreamStatsSummaryEvent): void;
}

/**
 * live streams stats data type, using stream id as key
 * @alpha
 */
export declare type LiveStreamStatsSample = Record<string, LiveStreamStatsSampleItem>;

/**
 * live streams stats sampleReported event listener
 * @alpha
 */
export declare type LiveStreamStatsSampleEvent = (args: LiveStreamStatsSample) => void;

/**
 * Properties of each live stream stats data
 * @alpha
 */
export declare interface LiveStreamStatsSampleItem {
  audioBitrate?: number;
  videoBitrate?: number;
  downloadBitrate?: number;
  bufferLengthInMs?: number;
  videoHeight?: number;
  videoWidth?: number;
  currentPlayPosition?: number;
}

/**
 * live streams stats summary type, using stream id as key
 * @alpha
 */
export declare type LiveStreamStatsSummary = Record<string, LiveStreamStatsSummaryItem>;

/**
 * live streams stats summaryReported event listener
 * @alpha
 */
export declare type LiveStreamStatsSummaryEvent = (args: LiveStreamStatsSummary) => void;

/**
 * Properties of each live stream stats summary
 * @alpha
 */
export declare interface LiveStreamStatsSummaryItem {
  audioBitrate?: MediaStatValue<number>;
  videoBitrate?: MediaStatValue<number>;
  downloadBitrate?: MediaStatValue<number>;
  bufferLengthInMs?: MediaStatValue<number>;
  videoHeight?: MediaStatValue<number>;
  videoWidth?: MediaStatValue<number>;
  currentPlayPosition?: MediaStatValue<number>;
}

/**
 * Represents a live video stream.
 * @alpha
 */
export declare interface LiveVideoStream extends RemoteVideoStreamCommon {
  /**
   * Subscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
}

/**
 * Teams meeting lobby
 */
export declare interface Lobby {
  /**
   * Collection of remote participants who have "InLobby" state in Teams meeting.
   */
  readonly participants: ReadonlyArray<RemoteParticipant>;
  /**
   * Subscribe function for lobbyParticipantsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'lobbyParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**
   * Unsubscribe function for lobbyParticipantsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'lobbyParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
  /**

     /**
     * Admit a participant from the lobby.
     * @param participant - the participant to be admitted.
     */
  admit(participant: CommunicationIdentifier, options?: AdmitLobbyParticipantOptions): Promise<void>;
  /**
   * Reject a participant from the lobby.
   * @param participant - the participant to be admitted.
   */
  reject(participant: CommunicationIdentifier, options?: RejectLobbyParticipantOptions): Promise<void>;
  /**
   * Admit all participants from the lobby.
   */
  admitAll(options?: AdmitLobbyParticipantOptions): Promise<AdmitAllOperationResult>;
}

/**
 * Represents a local audio stream for a local michrophone device
 */
export declare class LocalAudioStream {
  private _disposed;
  private _source;
  private _mediaStreamSource;
  private _mediaStreamType;
  private _eventEmitter;
  private _audioSourceChangedSub;
  private _rawStream;
  private _volumeIndicator;
  private _telemetryLogManager?;
  private _localStreamTelemetryEventSender;
  private _extensibleApi;

  /**
   * Create a local audio stream
   * @param source - The mic or media stream source to use.
   * @public
   */
  constructor(source: AudioDeviceInfo);
  constructor(source: MediaStream);
  /**
   * Subscribe function for audioSourceChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the audio source will change.
   */
  on(event: 'audioSourceChanged', listener: AudioSourceChangedEvent): void;
  /**
   * Unsubscribe function for audioSourceChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'audioSourceChanged', listener: AudioSourceChangedEvent): void;
  /**
   * Retrieves an initialized and memoized Feature object with extended API.
   * Check the object Features.* for all available extended features in this package.
   * Currently supported - Features.AudioEffects
   * @param factory The factory for the audio stream feature constructor that provides an extended API
   */
  feature<TFeature extends AudioStreamFeature>(factory: AudioStreamFeatureFactory<TFeature>): TFeature;
  /**
   * Get the media stream type for this LocalAudioStream
   * @public
   */
  get mediaStreamType(): MediaStreamType;
  /**
   * Get the current audio source for this LocalAudioStream
   * @public
   */
  get source(): AudioDeviceInfo;

  /**
   * Get media stream.
   */
  getMediaStream(): Promise<MediaStream>;
  /**
   * Switch to use a different audio stream
   * @param source - The new audio stream to use.
   */
  setMediaStream(source: MediaStream): Promise<void>;
  /**
   * Switch to use a different audio source
   * @param source - The new audio source to use.
   */
  switchSource(source: AudioDeviceInfo): Promise<void>;
  /**
   * Need to call dispose when the LocalAudioStream object is not provided in the CallOptions
   */
  dispose(): void;
  /**
   * Need to call getVolume on audioSourceChanged to get a new volume object binded to new source
   */
  getVolume(): Promise<Volume>;
  private subscribeToRawStreamChangedIfNeeded;
  private disposeRawStream;

  private setSource;
}

/**
 * Feature for call recording.
 * @beta
 */
export declare interface LocalRecordingCallFeature extends CallFeature {
  /**
   * Indicates if recording is active in current call
   */
  readonly isRecordingActive: boolean;
  /**
   * Gets current recordings
   */
  readonly recordings: LocalRecordingInfo[];
  /**
   * Subscribe function for isLocalRecordingActiveChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isLocalRecordingActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isLocalRecordingActiveChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isLocalRecordingActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for localRecordingsUpdated event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'localRecordingsUpdated', listener: CollectionUpdatedEvent<LocalRecordingInfo>): void;
  /**
   * Unsubscribe function for localRecordingsUpdated event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'localRecordingsUpdated', listener: CollectionUpdatedEvent<LocalRecordingInfo>): void;
}

/**
 * Local Recording Information.
 * @beta
 */
export declare interface LocalRecordingInfo {
  /**
   * Local recording state
   */
  state: LocalRecordingState;
  /**
   * displayName of the initiator
   */
  displayName?: string;
}

/**
 * Local recoring state
 * @beta
 */
export declare enum LocalRecordingState {
  /**
   * No Local recording is happening
   */
  None = 0,
  /**
   * Local Recording is inprogress
   */
  Started = 1,
  /**
   * Local Recording has ended
   */
  Ended = 2
}

/**
 * Represents a local video stream for a local camera device
 * @public
 */
export declare class LocalVideoStream {
  private _source;
  private _mediaStreamSource?;
  private _mediaStreamType;
  private _disposed;
  private _telemetryLogManager?;
  private _videoSourceChangedSub;
  private _rawStream;
  private _eventEmitter;
  private _call;
  private _extensibleApi;
  private _localStreamTelemetryEventSender;

  private _rawStreamCloneCache;
  /**
   * Create a local video stream
   * @param source - The video camera source to use.
   * @public
   */
  constructor(source: VideoDeviceInfo);
  constructor(source: MediaStream);
  /**
   * Subscribe function for videoSourceChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when the video source will change.
   */
  on(event: 'videoSourceChanged', listener: VideoSourceChangedEvent): void;
  /**
   * Unsubscribe function for videoSourceChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'videoSourceChanged', listener: VideoSourceChangedEvent): void;
  /**
   * Get the current video source for this LocalVideoStream
   * @public
   */
  get source(): VideoDeviceInfo;
  /**
   * Get the media stream type for this LocalVideoStream
   * @public
   */
  get mediaStreamType(): MediaStreamType;

  /**
   * Switch to use a different video source
   * @param source - The new video source to use.
   * @public
   */
  switchSource(source: VideoDeviceInfo): Promise<void>;

  /**
   * Get media stream.
   */
  getMediaStream(): Promise<MediaStream>;
  /**
   * Set media stream.
   */
  setMediaStream(source: MediaStream): Promise<void>;

  /**
   * Retrieves an initialized and memoized Feature object with extended API.
   * Check the object Features.* for all available extended features in this package.
   * Currently supported - Features.VideoEffects
   * @param factory - The factory for the call client feature constructor that provides an extended API
   */
  feature<TFeature extends VideoStreamFeature>(factory: VideoStreamFeatureFactory<TFeature>): TFeature;

  /**
   * Retrieves the LocalParticipantId of a call object associated with a LocalVideoStream if it exits.
   */
  private getLocalParticipantId;

  private setSource;
  private subscribeToRawStreamChangedIfNeeded;
  private _disposeRenderer;
  private _cacheCloneStream;
  private disposeRawStream;
}

/**
 * Name of event type for lowered hand feature
 */
export declare type LoweredHandEventType = 'loweredHandEvent';

/**
 * Callback definition for handling the LowerHandEventType event.
 */
export declare type LoweredHandListener = (data: RaisedHandChangedEvent) => void;

/**
 * Constraint range
 */
export declare interface MediaConstraintRange {
  max?: number;
}

/**
 * - diagnostic is the type of Media diagnostic, e.g. speakingWhileMicrophoneIsMuted, cameraStartFailed, etc...
 */
export declare type MediaDiagnosticChangedEventArgs = DiagnosticChangedEventArgs & {
  diagnostic: MediaDiagnosticType;
};

/**
 * Media Diagnostics
 */
export declare interface MediaDiagnostics {
  /**
   * Get the latest known Media diagnostics
   */
  getLatest(): LatestMediaDiagnostics;
  /**
   * Subscribe function for diagnosticChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when a diagnostic has changed
   */
  on(event: 'diagnosticChanged', listener: (args: MediaDiagnosticChangedEventArgs) => void): void;
  /**
   * Unsubscribe function for diagnosticChanged events
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: 'diagnosticChanged', listener: (args: MediaDiagnosticChangedEventArgs) => void): void;
}

/**
 * Media diagnostic types
 */
export declare type MediaDiagnosticType = keyof LatestMediaDiagnostics;

/**
 * Properties of aggregation for each stats field.
 */
export declare type MediaStatsAggregation = {
  count: number[];
  sum: number[];
  min: number[];
  max: number[];
};

/**
 * Feature for getting media stats while in a call.
 */
export declare interface MediaStatsCallFeature extends CallFeature {
  /**
   * Create media stats collector.
   * @param options - Optional options to define aggregation interval and size of each aggregated metric.
   * @returns MediaStatsCollector object.
   */
  createCollector(options?: MediaStatsCollectorOptions): MediaStatsCollector;
}

/**
 * Media stats collector.
 */
export declare interface MediaStatsCollector {
  /**
   * Dispose collector.
   */
  dispose(): void;
  /**
   * Subscribe function for MediaStatsReportSample event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'sampleReported', listener: MediaStatsReportSampleEvent): void;
  /**
   * Subscribe function for MediaStatsReportSummary event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'summaryReported', listener: MediaStatsReportSummaryEvent): void;
  /**
   * Unsubscribe function for raw mediaStatsReport event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'sampleReported', listener: MediaStatsReportSampleEvent): void;
  /**
   * Unsubscribe function for MediaStatsReportSummary event.
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'summaryReported', listener: MediaStatsReportSummaryEvent): void;
}

/**
 * Options for media stats collector
 */
export declare type MediaStatsCollectorOptions = {
  /**
   * Specifies the frequency at which stats should be aggregated.
   */
  aggregationInterval?: number;
  /**
   * Defines the number of aggregation data points for each metric in the summaryReported event
   */
  dataPointsPerAggregation?: number;
};

/**
 * media stats from 'sampleReported' event
 */
export declare interface MediaStatsReportSample {
  audio: {
    send: OutgoingAudioMediaStats<number, string>[];
    receive: IncomingAudioMediaStats<number, string>[];
  };
  video: {
    send: OutgoingVideoMediaStats<number, string>[];
    receive: IncomingVideoMediaStats<number, string>[];
  };
  screenShare: {
    send: OutgoingScreenShareMediaStats<number, string>[];
    receive: IncomingScreenShareMediaStats<number, string>[];
  };
  transports: TransportMediaStats<number>[];
}

/**
 * Payload for media stats emitted sampleReported event.
 */
export declare type MediaStatsReportSampleEvent = (args: MediaStatsReportSample) => void;

/**
 * Aggregated media stats from 'summaryReported' event
 */
export declare interface MediaStatsReportSummary {
  audio: {
    send: OutgoingAudioMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
    receive: IncomingAudioMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
  };
  video: {
    send: OutgoingVideoMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
    receive: IncomingVideoMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
  };
  screenShare: {
    send: OutgoingScreenShareMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
    receive: IncomingScreenShareMediaStats<MediaStatValue<number>, MediaStatValue<string>>[];
  };
  transports: TransportMediaStats<MediaStatValue<number>>[];
}

/**
 * Payload for media stats emitted summaryReported event.
 */
export declare type MediaStatsReportSummaryEvent = (args: MediaStatsReportSummary) => void;

/**
 * Properties of stats in summaryReported event
 */
export declare type MediaStatValue<T> = {
  aggregation?: MediaStatsAggregation;
  raw: T[];
  timestamp: Date;
};

/**
 * Media stream type.
 * - Video - Media stream from a camera device
 * - ScreenSharing - Media stream from a screen, app, or browser tab
 * - RawMedia - Raw video media stream or raw screen sharing stream
 * - LiveStream - Media stream from a live stream
 * - Audio - Media stream from audio device
 */
export declare type MediaStreamType = 'Video' | 'ScreenSharing' | 'RawMedia' | 'LiveStream' | 'Audio';

/**
 * Meeting locator.
 * @beta
 */
export declare type MeetingLocator = TeamsMeetingLinkLocator | TeamsMeetingCoordinatesLocator | TeamsMeetingIdLocator;

/**
 * Represents the network configuration to set while creating the call client
 */
export declare interface NetworkConfiguration {
  proxy?: ProxyConfiguration;
  turn?: TurnConfiguration;
}

/**
 * - diagnostic is the type of Network diagnostic, e.g. networkRcvQuality, noNetwrok, etc... DeviceSpeakWhileMuted, etc...
 */
export declare type NetworkDiagnosticChangedEventArgs = DiagnosticChangedEventArgs & {
  diagnostic: NetworkDiagnosticType;
};

/**
 * Network Diagnostics
 */
export declare interface NetworkDiagnostics {
  /**
   * Get the latest known Network diagnostics
   */
  getLatest(): LatestNetworkDiagnostics;
  /**
   * Subscribe function for diagnosticChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when a diagnostic has changed
   */
  on(event: 'diagnosticChanged', listener: (args: NetworkDiagnosticChangedEventArgs) => void): void;
  /**
   * Unsubscribe function for diagnosticChanged events
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: 'diagnosticChanged', listener: (args: NetworkDiagnosticChangedEventArgs) => void): void;
}

/**
 * Type of network diagnostic
 */
export declare type NetworkDiagnosticType = keyof LatestNetworkDiagnostics;

/**
 * Represents noise suppression effect names
 */
export declare type NoiseSuppressionEffectName = 'BrowserNoiseSuppression' | 'DeepNoiseSuppression';

/**
 * Options for OnBehalfOf another user
 * @alpha
 */
export declare interface OnBehalfOfOptions {
  /**
   * The user id of the user on behalf of whom the call is being made.
   */
  userId: MicrosoftTeamsAppIdentifier;
}

/**
 * Feature for Optimal Video count
 * @public
 */
export declare interface OptimalVideoCountCallFeature extends CallFeature {
  /**
   * Get the optimal number of incoming video streams
   * @public
   */
  readonly optimalVideoCount: number;
  /**
   * Subscribe function for optimal video count event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   * @public
   */
  on(event: 'optimalVideoCountChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for optimal video count changed event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   * @public
   */
  off(event: 'optimalVideoCountChanged', listener: PropertyChangedEvent): void;
}

/**
 * Generic type of audio send media stats
 */
export declare interface OutgoingAudioMediaStats<NumberType, StringType> {
  id: string;
  codecName?: StringType;
  bitrate?: NumberType;
  jitterInMs?: NumberType;
  packets?: NumberType;
  packetsPerSecond?: NumberType;
  packetsLost?: NumberType;
  packetsLostPerSecond?: NumberType;
  rttInMs?: NumberType;
  audioInputLevel?: NumberType;
  transportId?: StringType;
}

/**
 * Generic type of screenshare send media stats
 */
export declare type OutgoingScreenShareMediaStats<NumberType, StringType> = OutgoingVideoMediaStats<
  NumberType,
  StringType
>;

/**
 * Generic type of video send media stats
 */
export declare interface OutgoingVideoMediaStats<NumberType, StringType> {
  id: string;
  codecName?: StringType;
  bitrate?: NumberType;
  jitterInMs?: NumberType;
  packets?: NumberType;
  packetsPerSecond?: NumberType;
  packetsLost?: NumberType;
  packetsLostPerSecond?: NumberType;
  rttInMs?: NumberType;
  frameRateInput?: NumberType;
  frameWidthInput?: NumberType;
  frameHeightInput?: NumberType;
  framesEncoded?: NumberType;
  frameRateEncoded?: NumberType;
  framesSent?: NumberType;
  frameRateSent?: NumberType;
  frameWidthSent?: NumberType;
  frameHeightSent?: NumberType;
  keyFramesEncoded?: NumberType;
  transportId?: StringType;
  altLayouts?: OutgoingVideoMediaStats<NumberType, StringType>[];
}

/**
 * Represents the end of call survey call issues.
 * @example
 * CallCannotJoin - participant is unable to join the call.
 * CallCannotInvite - participant is unable to add another participant in the call.
 * HadToRejoin - participant rejoined the call due the call quality issue.
 * CallEndedUnexpectedly - when the call ended unexpectedly.
 * OtherIssues - any other overall call issue not listed here.
 *
 */
export declare type OverallIssue =
  | 'CallCannotJoin'
  | 'CallCannotInvite'
  | 'HadToRejoin'
  | 'CallEndedUnexpectedly'
  | 'OtherIssues';

/**
 * Participant Capabilities
 * @public
 */
export declare type ParticipantCapabilities = Record<
  ParticipantCapabilityName,
  {
    isPresent: boolean;
    reason: CapabilityResolutionReason;
  }
>;

/**
 * Capability Resolution Reason
 * @public
 */
export declare type ParticipantCapabilityName =
  /**
   * Ability to turn Video on
   */
  | 'turnVideoOn'
  /**
   * Ability to Mute Unmute Mic
   */
  | 'unmuteMic'
  /**
   * Ability to share screen
   */
  | 'shareScreen'
  /**
   * Ability to remove a Participant
   */
  | 'removeParticipant'
  /**
   * Ability to hang up for every one
   */
  | 'hangUpForEveryOne'
  /**
   * Ability to add an ACS User
   */
  | 'addCommunicationUser'
  /**
   * Ability to add a Teams User
   */
  | 'addTeamsUser'
  /**
   * Ability to add a Phone number
   */
  | 'addPhoneNumber'
  /** Ability to manage a lobby
   * @beta
   */
  | 'manageLobby'
  /** Ability to spotlight a participant
   * @beta
   */
  | 'spotlightParticipant'
  /** Ability to remove spotlight on a participant
   * @beta
   */
  | 'removeParticipantsSpotlight'
  | 'blurBackground'
  /** Ability to start live captions in meeting type calls */
  | 'startLiveMeetingCaptions'
  /** Ability to start live captions in calling type calls */
  | 'startLiveCallingCaptions'
  /** Ability to set caption language */
  | 'setCaptionLanguage'
  /** Ability to raise hand
   * @beta
   */
  | 'raiseHand'
  /**
   * Ability to PSTN dialout
   */
  | 'pstnDialOut'
  /**
   * Ability to mute others
   */
  | 'muteOthers'
  /**
   * Ability to send or receive reaction
   */
  | 'useReactions'
  /**
   * Ability to view attendee names
   */
  | 'viewAttendeeNames'
  /**
   * Ability to start together mode
   * @beta
   */
  | 'startTogetherMode'
  /**
   * Ability to join break out rooms
   * @beta
   */
  | 'joinBreakoutRooms';

/**
 * Represents a participant in a call.
 */
export declare interface ParticipantInfo {
  /**
   * Get the identifier for this remote participant.
   */
  readonly identifier: CommunicationIdentifierKind;
  /**
   * Optional display name, if it was set by the endpoint of
   * that remote participant.
   */
  readonly displayName?: string;
  /**
   * Get the details of all the endpoints for this remote participant
   */
  readonly endpointDetails: EndpointDetails[];
}

/**
 * Participant role.
 */
export declare type ParticipantRole = 'Unknown' | 'Attendee' | 'Presenter' | 'Organizer' | 'Co-organizer' | 'Consumer';

/**
 * Define constraints for accessing local devices.
 */
export declare interface PermissionConstraints {
  /**
   * Whether to ask for audio permissions or not.
   */
  audio: boolean;
  /**
   * Whether to ask for camera permission or not.
   */
  video: boolean;
}

/**
 * PPTLive feature.
 */
export declare interface PPTLiveCallFeature extends CallFeature {
  /**
   * Indicates if pptlive is active in current call
   */
  readonly isActive: boolean;
  /**
   * The target html element in which the ppt live is rendering on.
   * Use this property and attach it to any UI html element. Example:
   *     document.getElement('someDiv').appendChild(target);
   */
  readonly target: HTMLElement;
  /**
   * Current presenter's identifier
   */
  readonly activePresenterId?: CommunicationIdentifier;
  /**
   * Subscribe function for isActiveChanged event
   * @param event - event name - isActiveChanged
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isActiveChanged event
   * @param event - event name - isActiveChanged
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isActiveChanged', listener: PropertyChangedEvent): void;
}

/**
 * PreCallDiagnostics feature
 * @beta
 */
export declare interface PreCallDiagnosticsFeature extends CallClientFeature {
  /**
   * @beta
   */
  startTest(tokenCredentials: CommunicationTokenCredential, options?: RunOptions): Promise<PreCallDiagnosticsResult>;
}

/**
 * Diagnostic results
 * @beta
 */
export declare type PreCallDiagnosticsResult = {
  deviceAccess?: Promise<DeviceAccess>;
  deviceEnumeration?: Promise<DeviceEnumeration>;
  inCallDiagnostics?: Promise<InCallDiagnostics>;
  id: string;
  browserSupport?: Promise<DeviceCompatibility>;
  callMediaStatistics?: Promise<MediaStatsCallFeature>;
};

/**
 * Payload for property changed event.
 */
export declare type PropertyChangedEvent = () => void;

/**
 * Represents the proxy configuration of the proxy server to send traffic through that proxy server.
 */
export declare interface ProxyConfiguration {
  url: string;
}

/**
 * Push notification data
 * @beta
 */
export declare type PushNotificationData = IncomingCallPushNotificationData;

/**
 * Call quality grade
 * @beta
 */
export declare type QualityGrade = 'Bad' | 'Average' | 'Good' | 'Unknown';

/**
 * Raise hand state object
 */
export declare interface RaisedHand {
  /**
   * identifier for a participant
   */
  identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
  /**
   *  contain order in which the state was published across all users in a call
   */
  order: number;
}

/**
 * Lower hand event information
 */
export declare interface RaisedHandChangedEvent {
  /**
   * identifier for a participant
   */
  identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
}

/**
 * Name of event type for raise hand feature
 */
export declare type RaisedHandEventType = 'raisedHandEvent';

/**
 * Callback definition for handling the RaisedHandEventType event.
 */
export declare type RaisedHandListener = (data: RaisedHandChangedEvent) => void;

/**
 * Raise hand call reaction feature.
 */
export declare interface RaiseHandCallFeature extends CallFeature {
  /**
   * Send request to raise hand for local participant
   */
  raiseHand(): Promise<void>;
  /**
   * Send request to remove the raised hand state for local participant
   */
  lowerHand(): Promise<void>;
  /**
   * Send request to remove the raised hand states for remote participants
   * @param identifiers is list of Identifiers to remove multiple raised hand states for other users
   */
  lowerHands(identifiers: (CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier)[]): Promise<void>;
  /**
   * Send request to remove raise hand state for every participant on the call
   */
  lowerAllHands(): Promise<void>;
  /**
   * Get status of all participants with active raise hand status
   * @returns array of states with all participants with active raise hand status
   */
  getRaisedHands(): RaisedHand[];
  /**
   * Subscribe function for raiseHandChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: RaisedHandEventType, listener: RaisedHandListener): void;
  /**
   * Unsubscribe function for raiseHandChanged event
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: RaisedHandEventType, listener: RaisedHandListener): void;
  /**
   * Subscribe function for raiseHandChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: LoweredHandEventType, listener: LoweredHandListener): void;
  /**
   * Unsubscribe function for raiseHandChanged event
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: LoweredHandEventType, listener: LoweredHandListener): void;
}

/**
 * Rating scale to override the default scale
 */
export declare interface RatingScale {
  /**
   * Lower bound of the rating value 0 to 100 (default 1)
   */
  lowerBound: number;
  /**
   * Upper bound of the rating value 0 to 100 (default 5)
   */
  upperBound: number;
  /**
   * The rating value greater than the threshold will be considered as good
   */
  lowScoreThreshold: number;
}

/**
 * Reaction types defined for everyone
 */
export declare type Reaction = 'like' | 'heart' | 'laugh' | 'surprised' | 'applause';

/**
 * Meeting reaction feature.
 */
export declare interface ReactionCallFeature extends CallFeature {
  /**
   * Send reaction to a meeting from local participant
   * @param reaction - reaction emotion
   */
  sendReaction(reactionMessage: ReactionMessage): Promise<void>;
  /**
   * Subscribe function for Reaction event
   * @param event - event name
   * @param listener - callback function that was used to subscribe to this event
   */
  on(event: 'reaction', listener: ReactionListener): void;
  /**
   * Unsubscribe function for Reaction event
   * @param event - event name
   * @param listener - callback function that was used to unsubscribe to this event
   */
  off(event: 'reaction', listener: ReactionListener): void;
}

/**
 * Reaction message data model
 */
export declare interface ReactionEventPayload {
  /**
   * identifier for a participant
   */
  identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
  /**
   * reaction type received
   */
  reactionMessage: ReactionMessage;
}

/**
 * Callback definition for handling the ReactionEventType event.
 */
export declare type ReactionListener = (data: ReactionEventPayload) => void;

/**
 * Reaction Message type
 */
export declare interface ReactionMessage {
  /**
   * reaction to be send
   */
  reactionType: Reaction;
}

/**
 * Feature for call recording.
 */
export declare interface RecordingCallFeature extends CallFeature {
  /**
   * Indicates if recording is active in current call
   */
  readonly isRecordingActive: boolean;
  /**
   * Gets current recordings
   */
  readonly recordings: RecordingInfo[];
  /**
   * Subscribe function for isRecordingActiveChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isRecordingActiveChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for recordingStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
  /**
   * Unsubscribe function for recordingStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
}

/**
 * Call Recording Information.
 */
export declare interface RecordingInfo {
  /**
   * Call recording state
   */
  state: RecordingState_2;
  /**
   * displayName of the initiator
   * @beta
   */
  displayName?: string;
  /**
   * Subscribe function for recordingStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'recordingStateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for recordingStateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'recordingStateChanged', listener: PropertyChangedEvent): void;
}

/**
 * Recording state.
 */
declare enum RecordingState_2 {
  /**
   * No recording is happening
   */
  None = 0,
  /**
   * Recording is inprogress
   */
  Started = 1,
  /**
   * Recording is pause
   */
  Paused = 2,
  /**
   * Recording has ended
   */
  Ended = 3
}
export { RecordingState_2 as RecordingState };

/**
 * Options for reject a participant from Lobby.
 */
export declare interface RejectLobbyParticipantOptions {}

/**
 * Remote audio stream of the call.
 */
export declare interface RemoteAudioStream {
  /**
   * Get the remote media stream track.
   */
  getMediaStream(): Promise<MediaStream>;
  /**
   * Volume for remote audio stream
   */
  getVolume(): Promise<Volume>;
}

/**
 * Remote users facing diagnostics payload.
 * @beta
 */
export declare type RemoteDiagnostic = {
  readonly participantId: string;
  readonly rawId: string;
  readonly remoteParticipant?: RemoteParticipant;
  readonly diagnostic: NetworkDiagnosticType | MediaDiagnosticType | ServerDiagnosticType;
  readonly value: DiagnosticQuality | DiagnosticFlag;
  readonly valueType: DiagnosticValueType;
};

/**
 * Remote Diagnostics
 * @beta
 */
export declare interface RemoteDiagnostics {
  /**
   * Get the latest known Remote diagnostics
   */
  getLatest(): RemoteParticipantDiagnosticsData;
  /**
   * Subscribe function for diagnosticChanged event
   * @param event - event name
   * @param listener - callback fn that will be called when a diagnostic has changed
   */
  on(event: 'diagnosticChanged', listener: (args: RemoteParticipantDiagnosticsData) => void): void;
  /**
   * Unsubscribe function for diagnosticChanged events
   * @param event - event name
   * @param listener - callback fn that was used to unsubscribe to this event
   */
  off(event: 'diagnosticChanged', listener: (args: RemoteParticipantDiagnosticsData) => void): void;
}

/**
 * Represents a remote participant in a call.
 */
export declare interface RemoteParticipant extends ParticipantInfo {
  /**
   * Get state of this remote participant.
   */
  readonly state: RemoteParticipantState;
  /**
   * Reason why participant left the call, contains code/subCode/message.
   */
  readonly callEndReason?: CallEndReason;
  /**
   * Collection of video streams this participants has.
   */
  readonly videoStreams: ReadonlyArray<RemoteVideoStream>;
  /**
   * Whether this remote participant is muted or not.
   */
  readonly isMuted: boolean;
  /**
   * Whether this remote participant is speaking or not.
   */
  readonly isSpeaking: boolean;
  /**
   * Get the role of this remote participant.
   */
  readonly role: ParticipantRole;
  /**
   * Mute microphone of this remote participant.
   */
  mute(): Promise<void>;
  /**
   * Renders the video of a participant and attach to the DOM if an HTML element is given
   * @alpha
   */
  renderVideo(callbackObject: RenderingAPICallback, options?: RenderOptions): Promise<RenderComponents | void>;
  /**
   * Stops rendering video of a participant
   * @alpha
   */
  stopRenderingVideo(): Promise<void>;
  /**
   * Subscribe function for stateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for displayNameChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'displayNameChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for roleChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isSpeakingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isSpeakingChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for videoStreamsUpdated  event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'videoStreamsUpdated', listener: CollectionUpdatedEvent<RemoteVideoStream>): void;
  /**
   * Unsubscribe function for stateChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isMutedChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for displayNameChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'displayNameChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for roleChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'roleChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isSpeakingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isSpeakingChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for videoStreamsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'videoStreamsUpdated', listener: CollectionUpdatedEvent<RemoteVideoStream>): void;
}

/**
 * Remote diagnostics that were raised.
 * @beta
 */
export declare interface RemoteParticipantDiagnosticsData {
  /**
   * Array of remote participants diagnostics
   */
  diagnostics: RemoteDiagnostic[];
}

/**
 * Interface used to provide the renderer and the view separately in the new rendering API
 * @alpha
 */
export declare interface RemoteParticipantRenderers {
  /**
   * Render for video the uppercase is just to match the previous stream types that are uppercase as well
   */
  Video: {
    renderer?: VideoStreamRenderer;
    view?: VideoStreamRendererView;
    renderingState: RenderingState;
  };
  /**
   * Render for screenshare the uppercase is just to match the previous stream types that are uppercase as well
   */
  ScreenSharing: {
    renderer?: VideoStreamRenderer;
    view?: VideoStreamRendererView;
    renderingState: RenderingState;
  };
}

/**
 * Remote participant state.
 */
export declare type RemoteParticipantState =
  | 'Idle'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'Hold'
  | 'InLobby'
  | 'EarlyMedia'
  | 'Disconnected';

/**
 * Represents a remote participant's video or screen-sharing.
 */
export declare interface RemoteVideoStream extends RemoteVideoStreamCommon {
  /**
   * Whether the stream is available for rendering in the UI.
   * When this flag becomes true, the remote participant has their video turned on.
   * and we can create a view to display this remote video stream on the UI.
   */
  readonly isAvailable: boolean;
  /**
   * Subscribe function for isAvailableChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isRenderingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isAvailableChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isAvailableChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isRenderingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
  /**
   * Get remote raw video stream
   * @returns MediaStream or undefined.
   */
  getMediaStream(): Promise<MediaStream>;
}

/**
 * Represents a remote participant's video or screen-sharing or live stream.
 */
export declare interface RemoteVideoStreamCommon {
  /**
   * Id of the remote stream.
   */
  readonly id: number;
  /**
   * Get this remote media stream type.
   */
  readonly mediaStreamType: MediaStreamType;
  /**
   * Whether video packets are being received.
   * This flag can become false in cases such as remote video freezes, low network bandwidth, etc.
   * It is recommended to display a loading spinner over the video, if isReceiving is false and isAvailable is true.
   */
  readonly isReceiving: boolean;
  /**
   * The stream size. The higher the stream size, the better the video quality.
   */
  readonly size: StreamSize;
}

/**
 * Rendering data used by Contoso in new rendering API when the dom element approach is used
 * @alpha
 */
export declare interface RenderComponents {
  /**
   * The stream in case user wants to manipulate it
   */
  stream?: RemoteVideoStream;
  /**
   * The view that will be attached to the DOM
   */
  view?: VideoStreamRendererView;
}

/**
 * Rendering callback used by Contoso in new rendering API to get the properties from the SDK
 * @alpha
 */
export declare type RenderingAPICallback = (renderingState: RenderingState) => void;

/**
 * Rendering data used by Contoso in new rendering API
 * @alpha
 */
export declare interface RenderingState {
  /**
   * Checks if video is available for streaming
   */
  isStreaming?: boolean;
  /**
   * Checks if video is available but on hold for some reason
   */
  isFrozen?: boolean;
  /**
   * Returns the video HTML element that will be attached to the DOM
   */
  videoTarget?: HTMLElement;
  /**
   * Returns the remoteStream for handling in the user side
   */
  remoteStream?: RemoteVideoStream;
}

/**
 * Rendering data given by Contoso in new rendering API
 * @alpha
 */
export declare interface RenderOptions {
  /**
   * Regular View Options
   */
  viewOptions?: CreateViewOptions;
  /**
   * This is optional if the user wants to provide their own stream
   */
  stream: RemoteVideoStream;
}

/**
 * Error result categories
 * @beta
 */
export declare type ResultCategories = 'Success' | 'ExpectedError' | 'UnexpectedClientError' | 'UnexpectedServerError';

/**
 * Locator used for joining a room call.
 */
export declare interface RoomCallLocator {
  /**
   * The ID of the Room to join to
   */
  roomId: string;
}

/**
 * Room locator.
 */
export declare type RoomLocator = RoomCallLocator;

/**
 * PreCallDiagnostics options
 * @beta
 */
export declare type RunOptions = {
  deviceAccess: boolean;
  deviceEnumeration: boolean;
  inCallDiagnostics: boolean;
  browserSupport: boolean;
  callMediaStatistics: boolean;
};

/**
 * The scaling mode for the view of a video stream.
 */
export declare type ScalingMode = 'Stretch' | 'Crop' | 'Fit';

/**
 * Represents the end of call survey screenshare issues.
 * @example
 * NoContentLocal - other participants unable to see my screen.
 * NoContentRemote - participant unable to saw another participant's screen share.
 * CannotPresent - participant was unable to share the screen.
 * LowQuality - screen share video quality was low.
 * Freezes - screen share freezes.
 * StoppedUnexpectedly - screen share stopped unexpectedly.
 * LargeDelay - watch screen share having large delay.
 * OtherIssues - any other screen share issue not listed here.
 *
 */
export declare type ScreenshareIssue =
  | 'NoContentLocal'
  | 'NoContentRemote'
  | 'CannotPresent'
  | 'LowQuality'
  | 'Freezes'
  | 'StoppedUnexpectedly'
  | 'LargeDelay'
  | 'OtherIssues';

/**
 * Server diagnostics
 * @beta
 */
export declare type ServerDiagnosticType = 'serverConnection';

/**
 * Event type for captions spoken language changed event
 */
export declare type SpokenLanguageChangedEventType = 'SpokenLanguageChanged';

/**
 * Spotlight call feature.
 *
 */
export declare interface SpotlightCallFeature extends CallFeature {
  /**
   * Returns the maximum number of participants that can be Spotlighted
   */
  readonly maxParticipantsToSpotlight: number;
  /**
   * @param participants
   *  starts Spotlight for local and remote participants
   *  when participants array is not passed, action is performed on local participant
   * @returns A Promise representing the completion of startParticipantSpotlight operation.
   *  A 'SpotlightUpdated' event will be emitted when startParticipantSpotlight have successfully started.
   */
  startSpotlight(participants?: CommunicationIdentifier[]): Promise<void>;
  /**
   * @param participants
   *  stops Spotlight for local and remote participants
   *  when participants array is not passed, action is performed on local participant
   * @returns A Promise representing the completion of stopParticipantSpotlight operation.
   *  A 'SpotlightUpdated' event will be emitted when stopParticipantSpotlight have successfully stopped.
   */
  stopSpotlight(participants?: CommunicationIdentifier[]): Promise<void>;
  /**
   * Stops Spotlighting for all participants.
   * @returns A Promise representing the completion of the stopAllSpotlight operation.
   *  A 'SpotlightUpdated' event will be emitted when stopAllSpotlight have successfully stopped.
   */
  stopAllSpotlight(): Promise<void>;
  /**
   * @returns Returns list of all participants currently Spotlighted
   */
  getSpotlightedParticipants(): SpotlightedParticipant[];
  /**
   * Subscribe function for SpotlightUpdated event
   * @param event - event name
   * @param listener - callback function that was used to subscribe to this event
   */
  on(event: SpotlightChangedEventType, listener: CollectionUpdatedEvent<SpotlightedParticipant>): void;
  /**
   * Subscribe function for SpotlightUpdated event
   * @param event - event name
   * @param listener - callback function that was used to subscribe to this event
   */
  off(event: SpotlightChangedEventType, listener: CollectionUpdatedEvent<SpotlightedParticipant>): void;
}

/**
 * Name of event type for Spotlight feature
 *
 */
export declare type SpotlightChangedEventType = 'spotlightChanged';

/**
 * Spotlight state changed event object
 *
 */
export declare interface SpotlightedParticipant {
  /**
   * identifier for a participant
   */
  identifier: CommunicationIdentifier;
  /**
   * order in which the state was published across all users in a call
   */
  order?: number;
}

/**
 * Options for starting an outgoing call.
 */
export declare interface StartCallOptions extends JoinCallOptions {
  /**
   * A phone number in E.164 format that will be used to represent callers identity.
   * For example, using the alternateCallerId to add a participant using PSTN, this number will
   * be used as the caller id in the PSTN call.
   */
  alternateCallerId?: PhoneNumberIdentifier;
  /**
   * Thread ID is required if user is of type MicrosoftTeamsUserIdentifier.
   * @beta
   */
  threadId?: string;
  /**
   * Options for adding custom context.
   */
  customContext?: CustomContext;
}

/**
 * Options passed to StartCaptions
 */
export declare interface StartCaptionsOptions {
  /**
   * The language to caption speech as. Must be BCP 47 format (e.g. "en-us")
   */
  spokenLanguage: string;
}

/**
 * Options for starting an outgoing Teams call.
 */
export declare interface StartTeamsCallOptions extends JoinCallOptions {
  /**
   * Options for adding custom context.
   */
  customContext?: CustomContext;
  /**
   * Options to specify OnBehalfOf user options.
   * @alpha
   */
  onBehalfOfOptions?: OnBehalfOfOptions;
}

/**
 * Options for starting an outgoing Teams group call.
 * @beta
 */
export declare interface StartTeamsGroupCallOptions extends StartTeamsCallOptions {
  /**
   * The thread id.
   * @beta
   */
  threadId: string;
}

/**
 * Stream size.
 */
export declare interface StreamSize {
  width: number;
  height: number;
}

/**
 * Options for submitting call survey.
 */
export declare interface SubmitSurveyOptions {}

/**
 * Represents a Teams Call.
 */
export declare interface TeamsCall extends CallCommon {
  /**
   * Get information about this Teams Call.
   */
  readonly info: TeamsCallInfo;
  /**
   * Add a participant.
   * @param participant - Participant to be added
   * @param options - AddTeamsParticipantOptions
   * @beta
   */
  addParticipant(
    participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsAppIdentifier | UnknownIdentifier,
    options?: AddTeamsParticipantOptions
  ): RemoteParticipant;
  /**
   * Remove a participant from this call.
   * @param participant - the participant to be removed.
   */
  removeParticipant(
    participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier
  ): Promise<void>;
}

/**
 * The TeamsCallAgent is used to handle Teams calls.
 */
export declare interface TeamsCallAgent extends CallAgentCommon {
  /**
   * Get the calls.
   */
  readonly calls: ReadonlyArray<TeamsCall>;
  /**
   * Start 1:1 call.
   * @param participant
   * @param options
   * @returns The TeamsCall object associated with the call.
   */
  startCall(
    participant: MicrosoftTeamsUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsAppIdentifier | UnknownIdentifier,
    options?: StartTeamsCallOptions
  ): TeamsCall;
  /**
   * Start a 1:N call.
   * @param participants
   * @param options
   * @returns The TeamsCall object associated with the call.
   * @beta
   */
  startCall(
    participants: (
      | MicrosoftTeamsUserIdentifier
      | PhoneNumberIdentifier
      | MicrosoftTeamsAppIdentifier
      | UnknownIdentifier
    )[],
    options?: StartTeamsGroupCallOptions
  ): TeamsCall;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting link.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): TeamsCall;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting id and passcode.
   * @param meetingLocator - Meeting information.
   * @param options - Call start options.
   * @returns The Call object associated with the call.
   */
  join(meetingLocator: TeamsMeetingIdLocator, options?: JoinCallOptions): TeamsCall;
  /**
   * Join a Teams meeting.
   * To join a Teams meeting, pass a meeting link or meeting id or meeting coordinates.
   * @param meetingLocator - Meeting information.
   * @param options - Teams call start options.
   * @returns The TeamsCall object associated with the call.
   * @beta
   */
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): TeamsCall;
  /**
   * Subscribe function for incomingCall event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this callAgent will receive an incoming call.
   */
  on(event: 'incomingCall', listener: TeamsIncomingCallEvent): void;
  /**
   * Subscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   * it will pass arrays of added and removed elements.
   */
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<TeamsCall>): void;
  /**
   * Subscribe function for connectionStateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'connectionStateChanged', listener: ConnectionStateChangedEvent): void;
  /**
   * Unsubscribe function for incomingCall event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'incomingCall', listener: TeamsIncomingCallEvent): void;
  /**
   * Unsubscribe function for callsUpdated event.
   * @param event - event name.
   * @param listener - allback fn that was used to subscribe to this event.
   */
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<TeamsCall>): void;
  /**
   * Unsubscribe function for connectionStateChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  off(event: 'connectionStateChanged', listener: ConnectionStateChangedEvent): void;
}

/**
 * Options for creating TeamsCallAgent.
 */
export declare interface TeamsCallAgentOptions {}

/**
 * Information about a Teams Call.
 */
export declare interface TeamsCallInfo extends CallInfoCommon {}

/**
 * Data structure for TeamsCaptions object
 */
export declare interface TeamsCaptions extends CaptionsCommon {
  /**
   * List of supported caption languages to use with the caption service in ISO 639-1 format
   */
  readonly supportedCaptionLanguages: string[];
  /**
   * Indicates the current active caption language in ISO 639-1 format
   */
  readonly activeCaptionLanguage: string;
  /**
   * Updates the language of the ongoing Transcription / Captions
   * @param language - The language to caption speech as. Must be ISO 639-1 format (e.g. "en")
   * @returns A Promise representing the completion of the Set Language operation
   * The completion of this promise does NOT indicate the language has changed.
   * A 'CaptionLanguageChanged' event will be emitted when the language has actually successfully changed.
   */
  setCaptionLanguage(language: string): Promise<void>;
  /**
   * Subscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: CaptionsPropertyChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for the CaptionsReceivedEventType event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CaptionsReceivedEventType, listener: TeamsCaptionsHandler): void;
  /**
   * Unsubscribe function for any of the CaptionsPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: CaptionsReceivedEventType, listener: TeamsCaptionsHandler): void;
  /**
   * Subscribe function for any of the CaptionLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: CaptionLanguageChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the CaptionLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: CaptionLanguageChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for any of the SpokenLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: SpokenLanguageChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the SpokenLanguageChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: SpokenLanguageChangedEventType, listener: PropertyChangedEvent): void;
}

/**
 * Callback definition for handling the CaptionsReceivedEventType event
 */
export declare type TeamsCaptionsHandler = (data: TeamsCaptionsInfo) => void;

/**
 * Data structure received for each CaptionsReceivedEventType event
 */
export declare interface TeamsCaptionsInfo {
  /**
   * The caption text
   */
  captionText: string;
  /**
   * The language that the captions are presented in. Corresponds to the captionLanguage specified in setCaptionLanguage
   */
  captionLanguage: string;
  /**
   * The state in which this caption data can be classified
   */
  resultType: CaptionsResultType;
  /**
   * The information of the call participant who spoke the captioned text
   */
  speaker: CallerInfo;
  /**
   * The language that the spoken words were interpretted as. Corresponds to the language specified in startCaptions / setSpokenLanguage
   */
  spokenLanguage: string;
  /**
   * The original spoken caption text prior to translating to caption language
   */
  spokenText: string;
  /**
   * Timestamp of when the captioned words were initially spoken
   */
  timestamp: Date;
}

/**
 * Reoresents a Teams incoming call.
 */
export declare interface TeamsIncomingCall extends IncomingCallCommon {
  /**
   * Get information about this Call.
   */
  readonly info: TeamsCallInfo;
  /**
   * Accept this incoming Call.
   * @param options - accept options.
   * @returns The Call object associated with the accepted call.
   */
  accept(options?: AcceptCallOptions): Promise<TeamsCall>;
}

/**
 * Payload for Teams incoming call event.
 */
export declare type TeamsIncomingCallEvent = (args: { incomingCall: TeamsIncomingCall }) => void;

/**
 * TeamsMeetingAudioConferencing call feature.
 * @public
 */
export declare interface TeamsMeetingAudioConferencingCallFeature extends CallFeature {
  /**
   * Retrieves the Teams meeting audio conferencing details
   * @returns A Promise containing the Teams Meeting audio conferencing information
   */
  getTeamsMeetingAudioConferencingDetails(): Promise<TeamsMeetingAudioConferencingDetails>;
}

/**
 * Represents a Teams meeting audio conferencing details
 * @public
 */
export declare interface TeamsMeetingAudioConferencingDetails {
  /**
   * Conference Id associated with the teams meeting
   */
  readonly phoneConferenceId: string;
  /**
   * List of phone numbers assigned to the teams
   * meeting audio conferencing bridge
   */
  readonly phoneNumbers: TeamsMeetingAudioConferencingPhoneNumber[];
}

/**
 * Represents phone number assigned to a
 * audio conferencing bridge
 * @public
 */
export declare interface TeamsMeetingAudioConferencingPhoneNumber {
  /**
   * Toll number
   */
  readonly tollPhoneNumber?: PhoneNumberIdentifier;
  /**
   * Toll-Free number
   */
  readonly tollFreePhoneNumber?: PhoneNumberIdentifier;
  /**
   * Country name
   */
  readonly countryName?: string;
  /**
   * City name
   */
  readonly cityName?: string;
}

/**
 * Locator used for joining a meeting with meeting coordinates.
 * @beta
 */
export declare interface TeamsMeetingCoordinatesLocator {
  threadId: string;
  organizerId: string;
  tenantId: string;
  messageId: string;
}

/**
 * Locator used for joining a meeting with meeting id and code.
 */
export declare interface TeamsMeetingIdLocator {
  meetingId: string;
  passcode?: string;
}

/**
 * Locator used for joining a meeting with meeting link.
 */
export declare interface TeamsMeetingLinkLocator {
  /**
   * The meeting url.
   */
  meetingLink: string;
}

declare type TimestampInfo =
  | {
      attemptTimestamp: number | '';
    }
  | {
      deltaTimeInMs: number | '';
    };

/**
 *  Together mode call feature.
 * @beta
 */
export declare interface TogetherModeCallFeature extends CallFeature {
  /**
   * Collection of composed video stream of the together mode bot
   */
  readonly togetherModeStream: ReadonlyArray<TogetherModeVideoStream>;
  /**
   * Returns map of participants MRI to seating position
   */
  get togetherModeSeatingMap(): TogetherModeSeatingMap;
  /**
   * Returns the current scene size
   */
  get sceneSize(): TogetherModeSceneSize;
  /**
   * Configures the scene size. Seat mapping is re-calculated.
   * The seat mapping undergoes recalculation based on the newly configured scene size
   */
  set sceneSize(size: TogetherModeSceneSize);
  /**
   * Starts together mode for everyone
   */
  start(): Promise<void>;
  /**
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   */
  on(event: 'togetherModeStreamsUpdated', listener: CollectionUpdatedEvent<TogetherModeVideoStream>): void;
  /**
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   */
  on(event: 'togetherModeSceneUpdated', listener: TogetherModeSceneUpdatedListener): void;
  /**
   * @param event - event name.
   * @param listener - callback fn that will be called when this collection will change,
   */
  on(event: 'togetherModeSeatingUpdated', listener: TogetherModeSeatingUpdatedListener): void;
  /**
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'togetherModeStreamsUpdated', listener: CollectionUpdatedEvent<TogetherModeVideoStream>): void;
  /**
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'togetherModeSceneUpdated', listener: TogetherModeSceneUpdatedListener): void;
  /**
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'togetherModeSeatingUpdated', listener: TogetherModeSeatingUpdatedListener): void;
}

/**
 * Scene Size of Together Mode
 * @beta
 */
export declare interface TogetherModeSceneSize extends StreamSize {}

/**
 * Callback definition for handling the togetherMode scene update event.
 * @beta
 */
export declare type TogetherModeSceneUpdatedListener = (data: TogetherModeSeatingMap) => void;

/**
 * Mapping of participant's MRI to seating position
 * @beta
 */
export declare type TogetherModeSeatingMap = Map<string, TogetherModeSeatingPosition>;

/**
 * Together Mode Seating position CSS coordinates
 * @beta
 */
export declare interface TogetherModeSeatingPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Callback definition for handling the togetherMode seating update event.
 * @beta
 */
export declare type TogetherModeSeatingUpdatedListener = (data: TogetherModeSeatingMap) => void;

/**
 * Represents a together mode bot video stream.
 * @beta
 */
export declare interface TogetherModeVideoStream extends RemoteVideoStreamCommon {
  /**
   * Subscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Subscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that will be called when value of this property will change.
   */
  on(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for sizeChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'sizeChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for isReceivingChanged event.
   * @param event - event name.
   * @param listener - callback fn that was used to subscribe to this event.
   */
  off(event: 'isReceivingChanged', listener: PropertyChangedEvent): void;
}

/**
 * Feature for call transcription.
 */
export declare interface TranscriptionCallFeature extends CallFeature {
  /**
   * Indicates if transcription is active in current call
   */
  readonly isTranscriptionActive: boolean;
  /**
   * Subscribe function for any of the TranscriptionPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: TranscriptionPropertyChangedEventType, listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for any of the TranscriptionPropertyChangedEventType events
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: TranscriptionPropertyChangedEventType, listener: PropertyChangedEvent): void;
}

/**
 * Transcription property changed event.
 */
export declare type TranscriptionPropertyChangedEventType = 'isTranscriptionActiveChanged';

/**
 * Represents a Transfer Object
 * @public
 */
export declare interface Transfer {
  /**
   * The transfer state.
   */
  readonly state: TransferState;
  /**
   * The transfer error code.
   */
  readonly error?: TransferErrorCode;
  /**
   * Subscribe function for stateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: 'stateChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe function for stateChanged event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: 'stateChanged', listener: PropertyChangedEvent): void;
}

/**
 * Event that a transfer was accepted
 * @public
 */
export declare type TransferAcceptedEvent = (args: TransferEventArgs) => void;

/**
 * Name of event type for transfer accepted
 * @public
 */
export declare type TransferAcceptedEventType = 'transferAccepted';

/**
 * Feature for call transfer.
 * @public
 */
export declare interface TransferCallFeature extends CallFeature {
  /**
   * Transfer a call to a participant
   * @param target - The target participant which the source call is transferred to.
   * @param transferOptions - Transfer to participants options.
   * @returns The Transfer object returned by the call transfer.
   */
  transfer(target: TransferToParticipantLocator, options?: TransferToParticipantOptions): Transfer;
  /**
   * Transfer a call to a another call
   * @param target - The target call which the source call is transferred to.
   * @param transferOptions - Transfer to call options.
   * @returns The Transfer object returned by the call transfer.
   */
  transfer(target: TransferToCallLocator, options?: TransferToCallOptions): Transfer;
  /**
   * Transfer a call to voicemail
   * @param target - The target Microsoft Teams User mri which the source call is transferred to.
   * @param transferOptions - Transfer to voicemail options.
   * @returns The Transfer object returned by the call transfer.
   */
  transfer(target: TransferToVoicemailLocator, options?: TransferToVoicemailOptions): Transfer;
  /**
   * Subscribe function for transferAccepted event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  on(event: TransferAcceptedEventType, listener: TransferAcceptedEvent): void;
  /**
   * Unsubscribe function for transferAccepted event
   * @param event - event name
   * @param listener - callback fn that was used to subscribe to this event
   */
  off(event: TransferAcceptedEventType, listener: TransferAcceptedEvent): void;
}

/**
 * Transfer error code
 * @public
 */
export declare interface TransferErrorCode {
  /**
   * Get the HTTP code.
   */
  readonly code: number;
  /**
   * Get the subCode/reason code.
   */
  readonly subCode?: number;
}

/**
 * Transfer event base
 * @public
 */
export declare interface TransferEventArgs {
  targetCall: CallCommon;
}

/**
 * Transfer state
 * @public
 */
export declare type TransferState = 'None' | 'Transferring' | 'Transferred' | 'Failed';

/**
 * Transfer call into another call
 * @public
 */
export declare interface TransferToCallLocator {
  targetCallId: string;
}

/**
 * Options for transfering a call to a call
 * @public
 */
export declare interface TransferToCallOptions {
  /**
   * Options for adding custom context.
   */
  customContext?: CustomContext;
}

/**
 * Transfer call to participant
 * @public
 */
export declare interface TransferToParticipantLocator {
  targetParticipant: CommunicationIdentifier;
}

/**
 * Options for transfering a call to a participant
 * @public
 */
export declare interface TransferToParticipantOptions {
  disableForwardingAndUnanswered?: boolean;
  /**
   * Options for adding custom context.
   */
  customContext?: CustomContext;
}

/**
 * Transfer call to voicemail
 */
export declare interface TransferToVoicemailLocator {
  targetParticipantVoicemail: MicrosoftTeamsUserIdentifier;
}

/**
 * Options for transferring a call to voicemail
 */
export declare interface TransferToVoicemailOptions {}

/**
 * Generic type of transport media stats
 */
export declare interface TransportMediaStats<NumberType> {
  id: string;
  rttInMs?: NumberType;
  availableIncomingBitrate?: NumberType;
  availableOutgoingBitrate?: NumberType;
}

/**
 * Represents the turn server configuration to send all media traffic through it.
 */
export declare interface TurnConfiguration {
  iceServers: IceServer[];
}

/**
 * Feature for call diagnostics.
 */
export declare interface UserFacingDiagnosticsFeature extends CallFeature {
  readonly network: NetworkDiagnostics;
  readonly media: MediaDiagnostics;
  /**
   * Remote diagnostics
   * @beta
   */
  readonly remote: RemoteDiagnostics;
}

/**
 * Constraint of video stream
 */
export declare interface VideoConstraints {
  /**
   * Send video constraints
   */
  send?: VideoSendConstraints;
}

/**
 * Information about a camera device.
 */
export declare interface VideoDeviceInfo {
  /**
   * Get the name of this video device.
   */
  readonly name: string;
  /**
   * Get Id of this video device.
   */
  readonly id: string;
  /**
   * Get this video device type.
   */
  readonly deviceType: VideoDeviceType;
}

/**
 * Type of a video device.
 */
export declare type VideoDeviceType = 'Unknown' | 'UsbCamera' | 'CaptureAdapter' | 'Virtual' | 'ScreenSharing';

/**
 * Base video effect.
 */
export declare interface VideoEffect {
  /**
   * Name of the video effect.
   */
  readonly name: VideoEffectName;
  /**
   * Please use the isSupported method on the VideoEffectsFeature API.
   * @deprecated
   */
  isSupported(): Promise<boolean>;
}

/**
 * Base video effect config.
 */
export declare interface VideoEffectConfig {
  /**
   * Time to wait (in MS) before firing the 'timeForEffectsWarningReached' event.
   * Default value - 20000
   */
  effectInitTimeThresholdInMs?: number;
  /**
   * Minimum fps threshold before firing the 'fpsWarningThresholdReached' event.
   * Default value - 5
   */
  fpsWarningThreshold?: number;
}

/**
 * Video effect error type.
 */
export declare type VideoEffectError = 'FailedToProcess' | 'FailedToFetchImage';

/**
 * Video effect error payload.
 */
export declare type VideoEffectErrorPayload = {
  /**
   * HTTP error code
   */
  code: number;
  /**
   * Get a human readable message about the error.
   */
  message: string;
  /**
   * Get the subCode/reason code.
   * @beta
   */
  subCode: number;
  /**
   * Whether this error is expected or unexpected.
   * @beta
   */
  resultCategories: ResultCategories[];
};

/**
 * Represents the name of a video effect.
 */
export declare type VideoEffectName = 'BackgroundBlur' | 'BackgroundReplacement';

/**
 * Union type for all effects
 */
export declare type VideoEffectProcessor = BackgroundBlurEffect | BackgroundReplacementEffect;

/**
 * API interface for the VideoEffects feature
 */
export declare interface VideoEffectsFeature extends VideoStreamFeature {
  /**
   * Method to check if an effect is supported in the current environment.
   * @param effect Instance of the effect to check support of.
   * @returns true if effect is supported in the current environment.
   */
  isSupported(effect: VideoEffectProcessor): Promise<boolean>;
  /**
   * Start effects
   * @param effect Instance of the effect
   */
  startEffects(effect: VideoEffectProcessor): Promise<void>;
  /**
   * Stop effects
   */
  stopEffects(): Promise<void>;
  /**
   * List of current active effects
   */
  readonly activeEffects: VideoEffectName[];
  /**
   * Subscribe functions - fires when effects are started
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsStarted', listener: VideoEffectsFeatureListener): void;
  /**
   * Subscribe functions - fires when effects are stopped
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsStopped', listener: VideoEffectsFeatureListener): void;
  /**
   * Subscribe functions - fires on error while using effects
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'effectsError', listener: VideoEffectsFeatureErrorListener): void;
  /**
   * Subscribe functions - fires when the stream fps is equal to/less than 'fpsWarningThreshold' value
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'fpsWarningThresholdReached', listener: VideoEffectsFeatureListener): void;
  /**
   * Subscribe functions - fires when the time taken to start effects is more than the 'effectInitTimeThresholdInMs' value
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  on(event: 'timeForEffectsWarningReached', listener: VideoEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - effectsStarted
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsStarted', listener: VideoEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - effectsStopped
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsStopped', listener: VideoEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - effectsError
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'effectsError', listener: VideoEffectsFeatureErrorListener): void;
  /**
   * Unsubscribe functions - fpsWarningThresholdReached
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'fpsWarningThresholdReached', listener: VideoEffectsFeatureListener): void;
  /**
   * Unsubscribe functions - timeForEffectsWarningReached
   * @param event Event of type VideoEffectsFeatureEvent
   * @param listener A listener callback
   */
  off(event: 'timeForEffectsWarningReached', listener: VideoEffectsFeatureListener): void;
}

/**
 * Listener type for the 'effectsError' subscribe function
 */
export declare type VideoEffectsFeatureErrorListener = (error: VideoEffectErrorPayload) => void;

/**
 * Types of subscribe events
 */
export declare type VideoEffectsFeatureEvent =
  | 'effectsStarted'
  | 'effectsStopped'
  | 'effectsError'
  | 'fpsWarningThresholdReached'
  | 'timeForEffectsWarningReached';

/**
 * Listener type for effects feature subscribe functions
 */
export declare type VideoEffectsFeatureListener = (effects: VideoEffectName[]) => void;

/**
 * Video quality diagnostics
 * @beta
 */
export declare interface VideoInCallDiagnostics extends BaseInCallDiagnostics {}

/**
 * Represents the end of call survey video issues.
 * @example
 * NoVideoReceived - participant unable to saw another participant's video.
 * NoVideoSent - other participants unable to see me.
 * LowQuality - video quality was low.
 * Freezes - video freezes.
 * StoppedUnexpectedly - video stopped unexpectedly.
 * DarkVideoReceived - participant receives dark video.
 * AudioVideoOutOfSync - participant watch video and audio out of sync.
 * OtherIssues - any other video issue not listed here.
 *
 */
export declare type VideoIssue =
  | 'NoVideoReceived'
  | 'NoVideoSent'
  | 'LowQuality'
  | 'Freezes'
  | 'StoppedUnexpectedly'
  | 'DarkVideoReceived'
  | 'AudioVideoOutOfSync'
  | 'OtherIssues';

/**
 * Represents video option in CallOption
 */
export declare interface VideoOptions {
  /**
   * Represents a local video stream and takes a camera in constructor.
   */
  localVideoStreams?: LocalVideoStream[];
  /**
   * video constraint when call starts
   */
  constraints?: VideoConstraints;
}

/**
 * Represents video stream constraints
 */
export declare type VideoSendConstraints = {
  /**
   * Resolution constraint
   */
  frameHeight?: MediaConstraintRange;
  /**
   * FrameRate constraint
   */
  frameRate?: MediaConstraintRange;
  /**
   * Bitrate constraint
   */
  bitrate?: MediaConstraintRange;
};

/**
 * Payload for video source changed event.
 */
export declare type VideoSourceChangedEvent = (args: { source: LocalVideoStream }) => void;

/**
 * Represents a Video stream feature
 */
export declare interface VideoStreamFeature extends BaseFeature {}

/**
 * Represents the context provided for extended audio/video stream features at the constuctor.
 */
export declare interface VideoStreamFeatureContext {
  /**
   * The LocalVideoStream/RemoteVideoStream instance that is being extended by the feature.
   */
  streamInstance: LocalVideoStream;
}

/**
 * Represents the constructor for VideoStreamFeature object, along with the context argument.
 */
export declare type VideoStreamFeatureCtor<TFeature extends VideoStreamFeature> = new (
  context: VideoStreamFeatureContext
) => TFeature;

/**
 * Represents the factory of video stream features
 */
export declare interface VideoStreamFeatureFactory<TFeature extends VideoStreamFeature> extends FeatureFactory {
  /**
   * The constructor that returns an instance of the video stream feature implementation.
   */
  readonly videoStreamApiCtor: VideoStreamFeatureCtor<TFeature>;
}

declare type VideoStreamKind =
  | 'LocalVideoStream'
  | 'RemoteVideoStream'
  | 'LiveVideoStream'
  | 'ComposedVideoStream'
  | 'TogetherModeVideoStream';

/**
 * The renderer for a video stream
 * @public
 */
export declare class VideoStreamRenderer {
  /**
   * This API has been deprecated. Do not use it.
   * - To get the size of the local video stream, please use MediaStats Call feature API (MediaStats.stats.videoSendFrameWidthSent and MediaStats.stats.videoSendFrameHeightSent).
   * - To get the size of a remote video stream, please use RemoteVideoStream.size API.
   * @deprecated
   */
  readonly size: StreamSize;
  private views;
  private disposed;
  private _telemetryLogManager;
  private _videoStream;
  private get _createViewStats();
  private _createViewTelemetryHelper;
  private _createViewLiveStreamTelemetryHelper;

  /**
   * Create a Renderer for a local camera preview or remote video stream.
   * Future APIs:
   *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
   *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
   *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
   *     events/delegates are provided by IRendererEvents
   * @param videoStream - The video stream to render
   * @beta
   */
  constructor(videoStream: LocalVideoStream | RemoteVideoStreamCommon);
  /**
   * Create a Renderer for a local camera preview or remote video stream.
   * Future APIs:
   *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
   *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
   *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
   *     events/delegates are provided by IRendererEvents
   * @param videoStream - The video stream to render
   * @beta
   */
  constructor(videoStream: LocalVideoStream | RemoteVideoStream);
  /**
   * Create a Renderer for a local camera preview or remote video stream.
   * Future APIs:
   *     getStats(): Promise<RendererStats>; // Helpful in debugging; should be included
   *     onNextFrame((IFrame) -> void) // to allow app to fetch raw frames - to be implemented later
   *     captureFrame(timeoutMs: number, bufferName?: string): Promise<IVideoFrame>; // This can come in later
   *     events/delegates are provided by IRendererEvents
   * @param videoStream - The video stream to render
   * @public
   */
  constructor(videoStream: LocalVideoStream | RemoteVideoStream);
  /**
   * Create the view for the video stream.
   * @param options - Renderer options.
   * @public
   */
  createView(options?: CreateViewOptions): Promise<VideoStreamRendererView>;
  private sendCreateViewEvent;
  /**
   * Dispose of this Renderer
   * @public
   */
  dispose(): void;
  /**
   * Attempt to dispose view, if it fails, ignore error
   * @param view
   */
  private _attemptToDisposeView;
  /**
   * Add view to activeRemoteVideoStreamViews
   * @param videoStream
   * @param viewId
   * @param view
   */
  private _addActiveRemoteVideoStreamView;
}

/**
 * The view for a video stream.
 */
export declare interface VideoStreamRendererView extends Disposable {
  /**
   * The current scale mode for this view.
   */
  readonly scalingMode: ScalingMode;
  /**
   * Weather this view is mirrored.
   */
  readonly isMirrored: boolean;
  /**
   * The target html element in which the video stream is rendering on.
   * Use this property and attach it to any UI html element. Example:
   *     document.getElement('someDiv').appendChild(rendererView.target);
   */
  readonly target: HTMLElement;
  /**
   * Update the scale mode for this view.
   * @param scalingMode - The new scale mode.
   */
  updateScalingMode(scalingMode: ScalingMode): Promise<void>;
}

export declare interface Volume {
  /**
   * Subscription to the volume level
   */
  on(event: 'levelChanged', listener: PropertyChangedEvent): void;
  /**
   * Unsubscribe to the volume level
   */
  off(event: 'levelChanged', listener: PropertyChangedEvent): void;
  /**
   * Get the media stream track volume level 0-100
   */
  readonly level: number;
}

/**
 * X-header.
 */
export declare type xHeader = {
  /**
   * Maximal length is 64 chars, including the "X-MS-Custom" prefix.
   * Key may consist of alphanumeric characters and a few selected symbols which includes ".", "!", "%", "*", "", "+", "~", "-".
   */
  key: string;
  /**
   * Maximal length is 256 chars.
   * Value may consist of alphanumeric characters and a few selected symbols which includes "=", ";", ".", "!", "%", "*", "", "+", "~", "-".
   */
  value: string;
};

export {};
