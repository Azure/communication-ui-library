// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import { CallClient, CallClientOptions, CreateViewOptions, DeviceManager } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { Features } from '@azure/communication-calling';
import { CallClientState, LocalVideoStreamState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import { callAgentDeclaratify, DeclarativeCallAgent } from './CallAgentDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { createView, disposeView, CreateViewResult } from './StreamUtils';
import { CommunicationIdentifier, CommunicationUserIdentifier, getIdentifierKind } from '@azure/communication-common';
import { toFlatCommunicationIdentifier, _getApplicationId } from '@internal/acs-ui-common';
import { callingStatefulLogger } from './Logger';
/* @conditional-compile-remove(teams-identity-support) */
import { DeclarativeTeamsCallAgent, teamsCallAgentDeclaratify } from './TeamsCallAgentDeclarative';
/* @conditional-compile-remove(teams-identity-support) */
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { videoStreamRendererViewDeclaratify } from './VideoStreamRendererViewDeclarative';

/**
 * Defines the methods that allow CallClient {@link @azure/communication-calling#CallClient} to be used statefully.
 * The interface provides access to proxied state and also allows registering a handler for state change events. For
 * state definition see {@link CallClientState}.
 *
 * State change events are driven by:
 * - Returned data from {@link @azure/communication-calling#DeviceManager} APIs.
 * - Returned data from {@link @azure/communication-calling#CallAgent} APIs.
 * - Listeners automatically attached to various azure communication-calling objects:
 *   - CallAgent 'incomingCall'
 *   - CallAgent 'callsUpdated'
 *   - DeviceManager 'videoDevicesUpdated'
 *   - DeviceManager 'audioDevicesUpdated
 *   - DeviceManager 'selectedMicrophoneChanged'
 *   - DeviceManager 'selectedSpeakerChanged'
 *   - Call 'stateChanged'
 *   - Call 'idChanged'
 *   - Call 'isMutedChanged'
 *   - Call 'isScreenSharingOnChanged'
 *   - Call 'remoteParticipantsUpdated'
 *   - Call 'localVideoStreamsUpdated'
 *   - IncomingCall 'callEnded'
 *   - RemoteParticipant 'stateChanged'
 *   - RemoteParticipant 'isMutedChanged'
 *   - RemoteParticipant 'displayNameChanged'
 *   - RemoteParticipant 'isSpeakingChanged'
 *   - RemoteParticipant 'videoStreamsUpdated'
 *   - RemoteVideoStream 'isAvailableChanged'
 *   - TranscriptionCallFeature 'isTranscriptionActiveChanged'
 *   - RecordingCallFeature 'isRecordingActiveChanged'
 *   - RaiseHandCallFeature 'raisedHandEvent'
 *   - RaiseHandCallFeature 'loweredHandEvent'
 *
 * @public
 */
export interface StatefulCallClient extends CallClient {
  /**
   * Holds all the state that we could proxy from CallClient {@link @azure/communication-calling#CallClient} as
   * CallClientState {@link CallClientState}.
   */
  getState(): CallClientState;
  /**
   * Allows a handler to be registered for 'stateChanged' events.
   *
   * @param handler - Callback to receive the state.
   */
  onStateChange(handler: (state: CallClientState) => void): void;
  /**
   * Allows unregistering for 'stateChanged' events.
   *
   * @param handler - Original callback to be unsubscribed.
   */
  offStateChange(handler: (state: CallClientState) => void): void;
  /**
   * Renders a {@link RemoteVideoStreamState} or {@link LocalVideoStreamState} and stores the resulting
   * {@link VideoStreamRendererViewState} under the relevant {@link RemoteVideoStreamState} or
   * {@link LocalVideoStreamState} or as unparented view in the state. Under the hood calls
   * {@link @azure/communication-calling#VideoStreamRenderer.createView}.
   *
   * Scenario 1: Render RemoteVideoStreamState
   * - CallId is required, participantId is required, and stream of type RemoteVideoStreamState is required
   * - Resulting {@link VideoStreamRendererViewState} is stored in the given callId and participantId in
   * {@link CallClientState}
   *
   * Scenario 2: Render LocalVideoStreamState for a call
   * - CallId is required, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   * - The {@link @azure/communication-calling#Call.localVideoStreams} must already be started using
   *   {@link @azure/communication-calling#Call.startVideo}.
   * - Resulting {@link VideoStreamRendererViewState} is stored in the given callId {@link CallState.localVideoStreams}
   *   in {@link CallClientState}.
   *
   * - Scenario 2: Render LocalVideoStreamState not part of a call (example rendering camera for local preview)
   * - CallId must be undefined, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   * - Resulting {@link VideoStreamRendererViewState} is stored in under the given LocalVideoStreamState in
   *   {@link CallClientState.deviceManager.unparentedViews}
   *
   * @param callId - CallId for the given stream. Can be undefined if the stream is not part of any call.
   * @param participantId - {@link RemoteParticipant.identifier} associated with the given RemoteVideoStreamState. Could
   *   be undefined if rendering LocalVideoStreamState.
   * @param stream - The LocalVideoStreamState or RemoteVideoStreamState to start rendering.
   * @param options - Options that are passed to the {@link @azure/communication-calling#VideoStreamRenderer}.
   */
  createView(
    callId: string | undefined,
    participantId: CommunicationIdentifier | undefined,
    stream: LocalVideoStreamState | RemoteVideoStreamState,
    options?: CreateViewOptions
  ): Promise<CreateViewResult | undefined>;
  /**
   * Stops rendering a {@link RemoteVideoStreamState} or {@link LocalVideoStreamState} and removes the
   * {@link VideoStreamRendererView} from the relevant {@link RemoteVideoStreamState} in {@link CallClientState} or
   * {@link LocalVideoStream} in {@link CallClientState} or appropriate
   * {@link CallClientState.deviceManager.unparentedViews} Under the hood calls
   * {@link @azure/communication-calling#VideoStreamRenderer.dispose}.
   *
   * Its important to disposeView to clean up resources properly.
   *
   * Scenario 1: Dispose RemoteVideoStreamState
   * - CallId is required, participantId is required, and stream of type RemoteVideoStreamState is required
   *
   * Scenario 2: Dispose LocalVideoStreamState for a call
   * - CallId is required, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   *
   * - Scenario 2: Dispose LocalVideoStreamState not part of a call
   * - CallId must be undefined, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   * - LocalVideoStreamState must be the original one passed to createView.
   *
   * @param callId - CallId for the given stream. Can be undefined if the stream is not part of any call.
   * @param participantId - {@link RemoteParticipant.identifier} associated with the given RemoteVideoStreamState. Could
   *   be undefined if disposing LocalVideoStreamState.
   * @param stream - The LocalVideoStreamState or RemoteVideoStreamState to dispose.
   */
  disposeView(
    callId: string | undefined,
    participantId: CommunicationIdentifier | undefined,
    stream: LocalVideoStreamState | RemoteVideoStreamState
  ): void;

  /** @conditional-compile-remove(one-to-n-calling) */
  /**
   * The CallAgent is used to handle calls.
   * To create the CallAgent, pass a CommunicationTokenCredential object provided from SDK.
   * - The CallClient can only have one active CallAgent instance at a time.
   * - You can create a new CallClient instance to create a new CallAgent.
   * - You can dispose of a CallClient's current active CallAgent, and call the CallClient's
   *   createCallAgent() method again to create a new CallAgent.
   * @param tokenCredential - The token credential. Use AzureCommunicationTokenCredential from `@azure/communication-common` to create a credential.
   * @param options - The CallAgentOptions for additional options like display name.
   * @public
   */
  createCallAgent(...args: Parameters<CallClient['createCallAgent']>): Promise<DeclarativeCallAgent>;
}

/**
 * A function to modify the state of the StatefulCallClient.
 *
 * Provided as a callback to the {@link StatefulCallClient.modifyState} method.
 *
 * The function must modify the provided state in place as much as possible.
 * Making large modifications can lead to bad performance by causing spurious rerendering of the UI.
 *
 * Consider using commonly used modifier functions exported from this package.
 */
export type CallStateModifier = (state: CallClientState) => void;

/**
 * ProxyCallClient proxies CallClient {@link @azure/communication-calling#CallClient} and subscribes to all events that
 * affect state. ProxyCallClient keeps its own copy of the call state and when state is updated, ProxyCallClient emits
 * the event 'stateChanged'.
 */
class ProxyCallClient implements ProxyHandler<CallClient> {
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _callAgent:
    | DeclarativeCallAgent
    | /* @conditional-compile-remove(teams-identity-support) */ DeclarativeTeamsCallAgent
    | undefined;
  private _deviceManager: DeviceManager | undefined;
  private _sdkDeviceManager: DeviceManager | undefined;

  constructor(context: CallContext, internalContext: InternalCallContext) {
    this._context = context;
    this._internalContext = internalContext;
  }

  public get<P extends keyof CallClient>(target: CallClient, prop: P): any {
    switch (prop) {
      case 'createCallAgent': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<CallClient['createCallAgent']>): Promise<DeclarativeCallAgent> => {
            // createCallAgent will throw an exception if the previous callAgent was not disposed. If the previous
            // callAgent was disposed then it would have unsubscribed to events so we can just create a new declarative
            // callAgent if the createCallAgent succeeds.
            const callAgent = await target.createCallAgent(...args);
            this._callAgent = callAgentDeclaratify(callAgent, this._context, this._internalContext);
            this._context.setCallAgent({
              displayName: this._callAgent.displayName
            });
            return this._callAgent;
          },
          'CallClient.createCallAgent'
        );
      }
      case 'createTeamsCallAgent': {
        /* @conditional-compile-remove(teams-identity-support) */ return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<CallClient['createTeamsCallAgent']>): Promise<DeclarativeTeamsCallAgent> => {
            // createCallAgent will throw an exception if the previous callAgent was not disposed. If the previous
            // callAgent was disposed then it would have unsubscribed to events so we can just create a new declarative
            // callAgent if the createCallAgent succeeds.
            const callAgent = await target.createTeamsCallAgent(...args);
            this._callAgent = teamsCallAgentDeclaratify(callAgent, this._context, this._internalContext);
            this._context.setCallAgent({
              displayName: undefined
            });
            return this._callAgent;
          },
          'CallClient.createTeamsCallAgent'
        );
        return Reflect.get(target, prop);
      }
      case 'getDeviceManager': {
        return this._context.withAsyncErrorTeedToState(async () => {
          // As of writing, the SDK always returns the same instance of DeviceManager so we keep a reference of
          // DeviceManager and if it does not change we return the cached DeclarativeDeviceManager. If it does not we'll
          // throw an error that indicate we need to fix this issue as our implementation has diverged from the SDK.
          const deviceManager = await target.getDeviceManager();
          if (this._sdkDeviceManager) {
            if (this._sdkDeviceManager === deviceManager) {
              return this._deviceManager;
            } else {
              throw new Error(
                'Multiple DeviceManager not supported. This means a incompatible version of communication-calling is ' +
                  'used OR calling declarative was not properly updated to communication-calling version.'
              );
            }
          } else {
            this._sdkDeviceManager = deviceManager;
          }
          this._deviceManager = deviceManagerDeclaratify(deviceManager, this._context, this._internalContext);
          return this._deviceManager;
        }, 'CallClient.getDeviceManager');
      }
      case 'feature': {
        /* @conditional-compile-remove(unsupported-browser) */
        return this._context.withErrorTeedToState((...args: Parameters<CallClient['feature']>) => {
          if (args[0] === Features.DebugInfo) {
            const feature = target.feature(Features.DebugInfo);
            /**
             * add to this object if we want to proxy anything else off the DebugInfo feature object.
             */
            return {
              ...feature,
              getEnvironmentInfo: async () => {
                const environmentInfo = await feature.getEnvironmentInfo();
                this._context.setEnvironmentInfo(environmentInfo);
                return environmentInfo;
              }
            };
          }
          return Reflect.get(target, prop);
        }, 'CallClient.feature');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Arguments to construct the StatefulCallClient.
 *
 * @public
 */
export type StatefulCallClientArgs = {
  /**
   * UserId from SDK. This is provided for developer convenience to easily access the userId from the
   * state. It is not used by StatefulCallClient.
   */
  userId:
    | CommunicationUserIdentifier
    | /* @conditional-compile-remove(teams-identity-support) */ MicrosoftTeamsUserIdentifier;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * A phone number in E.164 format that will be used to represent the callers identity. This number is required
   * to start a PSTN call.
   *
   * example: +11234567
   *
   * This is not a cached value from the headless calling client.
   */
  alternateCallerId?: string;
};

/**
 * Options to construct the StatefulCallClient with.
 *
 * @public
 */
export type StatefulCallClientOptions = {
  /**
   * Options to construct the {@link @axure/communication-calling#CallClient} with.
   */
  callClientOptions: CallClientOptions;
  /**
   * Sets the max listeners limit of the 'stateChange' event. Defaults to the node.js EventEmitter.defaultMaxListeners
   * if not specified.
   */
  maxStateChangeListeners?: number;
};

/**
 * Creates a StatefulCallClient {@link StatefulCallClient} by proxying CallClient
 * {@link @azure/communication-calling#CallClient} with ProxyCallClient {@link ProxyCallClient} which then allows access
 * to state in a declarative way.
 *
 * It is important to use the {@link @azure/communication-calling#DeviceManager} and
 * {@link @azure/communication-calling#CallAgent} and {@link @azure/communication-calling#Call} (and etc.) that are
 * obtained from the StatefulCallClient in order for their state changes to be proxied properly.
 *
 * @param args - {@link StatefulCallClientArgs}
 * @param options - {@link StatefulCallClientOptions}
 *
 * @public
 */
export const createStatefulCallClient = (
  args: StatefulCallClientArgs,
  options?: StatefulCallClientOptions
): StatefulCallClient => {
  callingStatefulLogger.info(`Creating calling stateful client using library version: ${_getApplicationId()}`);
  return createStatefulCallClientWithDeps(
    new CallClient(withTelemetryTag(options?.callClientOptions)),
    new CallContext(
      getIdentifierKind(args.userId),
      options?.maxStateChangeListeners,
      /* @conditional-compile-remove(PSTN-calls) */ args.alternateCallerId
    ),
    new InternalCallContext()
  );
};

/**
 * Package-internal version of createStatefulCallClient that allows dependency injection.
 *
 * This function should not be exported from the package.
 */
export const createStatefulCallClientWithDeps = (
  callClient: CallClient,
  context: CallContext,
  internalContext: InternalCallContext
): StatefulCallClient => {
  Object.defineProperty(callClient, 'getState', {
    configurable: false,
    value: () => context.getState()
  });
  Object.defineProperty(callClient, 'onStateChange', {
    configurable: false,
    value: (handler: (state: CallClientState) => void) => context.onStateChange(handler)
  });
  Object.defineProperty(callClient, 'offStateChange', {
    configurable: false,
    value: (handler: (state: CallClientState) => void) => context.offStateChange(handler)
  });
  Object.defineProperty(callClient, 'createView', {
    configurable: false,
    value: async (
      callId: string | undefined,
      participantId: CommunicationIdentifier | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState,
      options?: CreateViewOptions
    ): Promise<CreateViewResult | undefined> => {
      const participantIdKind = participantId ? getIdentifierKind(participantId) : undefined;
      const result = await createView(context, internalContext, callId, participantIdKind, stream, options);
      // We only need to declaratify the VideoStreamRendererView object for remote participants. Because the updateScalingMode only needs to be called on remote participant stream views.
      if ('id' in stream && callId && participantId && result) {
        const participantKey = toFlatCommunicationIdentifier(participantId);
        result.view = videoStreamRendererViewDeclaratify(result.view, context, callId, participantKey, stream.id);
      }
      return result;
    }
  });
  Object.defineProperty(callClient, 'disposeView', {
    configurable: false,
    value: (
      callId: string | undefined,
      participantId: CommunicationIdentifier | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState
    ): void => {
      const participantIdKind = participantId ? getIdentifierKind(participantId) : undefined;
      disposeView(context, internalContext, callId, participantIdKind, stream);
    }
  });

  return new Proxy(callClient, new ProxyCallClient(context, internalContext)) as StatefulCallClient;
};

const withTelemetryTag = (options?: CallClientOptions): CallClientOptions => {
  const tags = options?.diagnostics?.tags ?? [];
  tags.push(_getApplicationId());
  return {
    ...options,
    diagnostics: {
      ...options?.diagnostics,
      tags
    }
  };
};
