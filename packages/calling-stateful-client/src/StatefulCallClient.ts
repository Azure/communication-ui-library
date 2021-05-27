// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import {
  CallAgent,
  CallClient,
  CallClientOptions,
  CreateViewOptions,
  DeviceManager
} from '@azure/communication-calling';
import { CallClientState, LocalVideoStreamState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { createView, disposeView } from './StreamUtils';
import { CommunicationIdentifierKind } from '@azure/communication-common';

/**
 * Defines the methods that allow CallClient {@Link @azure/communication-calling#CallClient} to be used statefully.
 * The interface provides access to proxied state and also allows registering a handler for state change events. For
 * state definition see {@Link CallClientState}.
 *
 * State change events are driven by:
 * - Returned data from {@Link @azure/communication-calling#DeviceManager} APIs.
 * - Returned data from {@Link @azure/communication-calling#CallAgent} APIs.
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
 *   - Transfer 'stateChanged'
 *   - TransferCallFeature 'transferRequested'
 */
export interface StatefulCallClient extends CallClient {
  /**
   * Holds all the state that we could proxy from CallClient {@Link @azure/communication-calling#CallClient} as
   * CallClientState {@Link CallClientState}.
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
   * Renders a {@Link RemoteVideoStreamState} or {@Link LocalVideoStreamState} and stores the resulting
   * {@Link VideoStreamRendererViewState} under the relevant {@Link RemoteVideoStreamState} or
   * {@Link LocalVideoStreamState} or as unparented view in the state. Under the hood calls
   * {@Link @azure/communication-calling#VideoStreamRenderer.createView}.
   *
   * Scenario 1: Render RemoteVideoStreamState
   * - CallId is required, participantId is required, and stream of type RemoteVideoStreamState is required
   * - Resulting {@Link VideoStreamRendererViewState} is stored in the given callId and participantId in
   * {@Link CallClientState}
   *
   * Scenario 2: Render LocalVideoStreamState for a call
   * - CallId is required, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   * - The {@Link @azure/communication-calling#Call.localVideoStreams} must already be started using
   *   {@Link @azure/communication-calling#Call.startVideo}.
   * - Resulting {@Link VideoStreamRendererViewState} is stored in the given callId {@Link CallState.localVideoStreams}
   *   in {@Link CallClientState}.
   *
   * - Scenario 2: Render LocalVideoStreamState not part of a call (example rendering camera for local preview)
   * - CallId must be undefined, participantId must be undefined, and stream of type LocalVideoStreamState is required.
   * - Resulting {@Link VideoStreamRendererViewState} is stored in under the given LocalVideoStreamState in
   *   {@Link CallClientState.deviceManager.unparentedViews}
   *
   * @param callId - CallId for the given stream. Can be undefined if the stream is not part of any call.
   * @param participantId - {@Link RemoteParticipant.identifier} associated with the given RemoteVideoStreamState. Could
   *   be undefined if rendering LocalVideoStreamState.
   * @param stream - The LocalVideoStreamState or RemoteVideoStreamState to start rendering.
   * @param options - Options that are passed to the {@Link @azure/communication-calling#VideoStreamRenderer}.
   */
  createView(
    callId: string | undefined,
    participantId: CommunicationIdentifierKind | undefined,
    stream: LocalVideoStreamState | RemoteVideoStreamState,
    options?: CreateViewOptions
  ): Promise<void>;
  /**
   * Stops rendering a {@Link RemoteVideoStreamState} or {@Link LocalVideoStreamState} and removes the
   * {@Link VideoStreamRendererView} from the relevant {@Link RemoteVideoStreamState} in {@Link CallClientState} or
   * {@Link LocalVideoStream} in {@Link CallClientState} or appropriate
   * {@Link CallClientState.deviceManager.unparentedViews} Under the hood calls
   * {@Link @azure/communication-calling#VideoStreamRenderer.dispose}.
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
   * @param participantId - {@Link RemoteParticipant.identifier} associated with the given RemoteVideoStreamState. Could
   *   be undefined if disposing LocalVideoStreamState.
   * @param stream - The LocalVideoStreamState or RemoteVideoStreamState to dispose.
   */
  disposeView(
    callId: string | undefined,
    participantId: CommunicationIdentifierKind | undefined,
    stream: LocalVideoStreamState | RemoteVideoStreamState
  ): void;
}

/**
 * ProxyCallClient proxies CallClient {@Link @azure/communication-calling#CallClient} and subscribes to all events that
 * affect state. ProxyCallClient keeps its own copy of the call state and when state is updated, ProxyCallClient emits
 * the event 'stateChanged'.
 */
class ProxyCallClient implements ProxyHandler<CallClient> {
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _callAgent: CallAgent | undefined;
  private _deviceManager: DeviceManager | undefined;
  private _sdkDeviceManager: DeviceManager | undefined;

  constructor(context: CallContext, internalContext: InternalCallContext) {
    this._context = context;
    this._internalContext = internalContext;
  }

  public get<P extends keyof CallClient>(target: CallClient, prop: P): any {
    switch (prop) {
      case 'createCallAgent': {
        return async (...args: Parameters<CallClient['createCallAgent']>) => {
          // createCallAgent will throw an exception if the previous callAgent was not disposed. If the previous
          // callAgent was disposed then it would have unsubscribed to events so we can just create a new declarative
          // callAgent if the createCallAgent succeeds.
          const callAgent = await target.createCallAgent(...args);
          this._callAgent = callAgentDeclaratify(callAgent, this._context, this._internalContext);
          this._context.setCallAgent({ displayName: this._callAgent.displayName });
          return this._callAgent;
        };
      }
      case 'getDeviceManager': {
        return async () => {
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
          this._deviceManager = deviceManagerDeclaratify(deviceManager, this._context);
          return this._deviceManager;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Required arguments to construct the stateful call client.
 */
export type StatefulCallClientArgs = {
  /**
   * UserId from SDK. This is provided for developer convenience to easily access the userId from the
   * state. It is not used by StatefulCallClient so if you do not have this value or do not want to use this value,
   * you could pass any dummy value like empty string.
   */
  userId: string;
};

/**
 * Options to construct the stateful call client with.
 */
export type StatefulCallClientOptions = CallClientOptions;

/**
 * Creates a StatefulCallClient {@Link StatefulCallClient} by proxying CallClient
 * {@Link @azure/communication-calling#CallClient} with ProxyCallClient {@Link ProxyCallClient} which then allows access
 * to state in a declarative way.
 *
 * It is important to use the {@Link @azure/communication-calling#DeviceManager} and
 * {@Link @azure/communication-calling#CallAgent} and {@Link @azure/communication-calling#Call} (and etc.) that are
 * obtained from the StatefulCallClient in order for their state changes to be proxied properly.
 *
 * @param callClientArgs - {@Link StatefulCallClientArgs}
 * @param callClientOptions - {@Link StatefulCallClientOptions}
 * @returns
 */
export const createStatefulCallClient = (
  callClientArgs: StatefulCallClientArgs,
  callClientOptions?: StatefulCallClientOptions
): StatefulCallClient => {
  const callClient = new CallClient(callClientOptions);
  const context: CallContext = new CallContext(callClientArgs.userId);
  const internalContext: InternalCallContext = new InternalCallContext();

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
    value: (
      callId: string | undefined,
      participantId: CommunicationIdentifierKind | string | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState,
      options?: CreateViewOptions
    ): Promise<void> => {
      return createView(context, internalContext, callId, participantId, stream, options);
    }
  });
  Object.defineProperty(callClient, 'disposeView', {
    configurable: false,
    value: (
      callId: string | undefined,
      participantId: CommunicationIdentifierKind | string | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState
    ): void => {
      disposeView(context, internalContext, callId, participantId, stream);
    }
  });

  return new Proxy(callClient, new ProxyCallClient(context, internalContext)) as StatefulCallClient;
};
