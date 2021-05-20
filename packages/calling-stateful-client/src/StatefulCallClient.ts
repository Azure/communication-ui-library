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
import { CallClientState, LocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { createView, disposeView } from './StreamUtils';
import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

/**
 * Defines the methods that allow CallClient {@Link @azure/communication-calling#CallClient} to be used declaratively.
 * The interface provides access to proxied state and also allows registering a handler for state change events.
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
   * Renders a {@Link RemoteVideoStream} or {@Link LocalVideoStream} and stores the resulting
   * {@Link VideoStreamRendererView} under the relevant {@Link RemoteVideoStream} or {@Link LocalVideoStream} in the
   * state. Under the hood calls {@Link @azure/communication-calling#VideoStreamRenderer.createView}.
   *
   * If callId is undefined and stream provided is LocalVideoStream, we will render the LocalVideoStream and store the
   * resulting {@Link VideoStreamRendererView} under the {@Link CallClientState#DeviceManager.unparentedViews}. Note
   * that we use the LocalVideoStream as a reference and different instances of the same LocalVideoStream result in
   * different views being generated.
   *
   * @param callId - CallId of the Call where the stream to start rendering is contained in. Can be undefined if
   *   rendering a LocalVideoStream that is not tied to a Call.
   * @param participantId - {@Link RemoteParticipant.identifier} associated with the given RemoteVideoStream. Could be
   *   undefined if rendering LocalVideoStream.
   * @param stream - The LocalVideoStream or RemoteVideoStream to start rendering.
   * @param options - Options that are passed to the {@Link @azure/communication-calling#VideoStreamRenderer}.
   * @throws - Throws error when state-based stream is already started, state-based stream not found in state,
   *   non-state-based stream reached capacity, or invalid combination of parameters was provided (such as
   *   RemoteVideoStream with undefined callId).
   */
  createView(
    callId: string | undefined,
    participantId: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | undefined,
    stream: LocalVideoStream | RemoteVideoStream,
    options?: CreateViewOptions
  ): Promise<void>;
  /**
   * Stops rendering a {@Link RemoteVideoStream} or {@Link LocalVideoStream} and removes the
   * {@Link VideoStreamRendererView} from the relevant {@Link RemoteVideoStream} or {@Link LocalVideoStream} in the
   * state. Under the hood calls {@Link @azure/communication-calling#VideoStreamRenderer.dispose}.
   *
   * If callId is undefined and the stream provided is LocalVideoStream, we will search
   * {@Link CallClientState#DeviceManager.unparentedViews} for matching LocalVideoStream (by reference) and stop
   * rendering the found stream and remove it from the state. In order to stop a stream previously started, the same
   * LocalVideoStream reference must be used.
   *
   * @param callId - CallId of the Call where the stream to stop rendering is contained in. Can be undefined if
   *   stop rendering a LocalVideoStream that is not tied to a Call.
   * @param participantId - {@Link RemoteParticipant.identifier} associated with the given RemoteVideoStream. Could be
   *   undefined if rendering LocalVideoStream.
   * @param stream - The LocalVideoStream or RemoteVideoStream to start rendering.
   */
  disposeView(
    callId: string | undefined,
    participantId: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | undefined,
    stream: LocalVideoStream | RemoteVideoStream
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
 * Required arguments to construct the stateful call client
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
 * Pptions to construct the stateful call client with
 */
export type StatefulCallClientOptions = CallClientOptions;

/**
 * Creates a stateful CallClient {@Link StatefulCallClient} by proxying CallClient
 * {@Link @azure/communication-calling#CallClient} with ProxyCallClient {@Link ProxyCallClient} which then allows access
 * to state in a declarative way.
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
      participantId:
        | CommunicationUserKind
        | PhoneNumberKind
        | MicrosoftTeamsUserKind
        | UnknownIdentifierKind
        | string
        | undefined,
      stream: LocalVideoStream | RemoteVideoStream,
      options?: CreateViewOptions
    ): Promise<void> => {
      return createView(context, internalContext, callId, participantId, stream, options);
    }
  });
  Object.defineProperty(callClient, 'disposeView', {
    configurable: false,
    value: (
      callId: string | undefined,
      participantId:
        | CommunicationUserKind
        | PhoneNumberKind
        | MicrosoftTeamsUserKind
        | UnknownIdentifierKind
        | string
        | undefined,
      stream: LocalVideoStream | RemoteVideoStream
    ): void => {
      disposeView(context, internalContext, callId, participantId, stream);
    }
  });

  return new Proxy(callClient, new ProxyCallClient(context, internalContext)) as StatefulCallClient;
};
