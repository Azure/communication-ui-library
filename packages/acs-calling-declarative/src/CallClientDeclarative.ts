// © Microsoft Corporation. All rights reserved.
import { deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import { CallAgent, CallClient, CreateViewOptions, DeviceManager } from '@azure/communication-calling';
import { CallClientState, LocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { startRenderVideo, stopRenderVideo } from './StreamUtils';

/**
 * Defines the methods that allow CallClient {@Link @azure/communication-calling#CallClient} to be used declaratively.
 * The interface provides access to proxied state and also allows registering a handler for state change events.
 */
export interface DeclarativeCallClient extends CallClient {
  /**
   * Holds all the state that we could proxy from CallClient {@Link @azure/communication-calling#CallClient} as
   * CallClientState {@Link CallClientState}.
   */
  state: CallClientState;
  /**
   * Allows a handler to be registered for 'stateChanged' events.
   *
   * @param handler - Callback to receive the state.
   */
  onStateChange(handler: (state: CallClientState) => void): void;
  /**
   * Renders a {@Link RemoteVideoStream} or {@Link LocalVideoStream} and stores the resulting
   * {@Link VideoStreamRendererView} under the relevant {@Link RemoteVideoStream} or {@Link LocalVideoStream} in the
   * state. Under the hood calls {@Link @azure/communication-calling#VideoStreamRenderer.createView}.
   *
   * @param callId - CallId of the Call where the stream to start rendering is contained in.
   * @param stream - The LocalVideoStream or RemoteVideoStream to start rendering.
   * @param options - Options that are passed to the {@Link @azure/communication-calling#VideoStreamRenderer}.
   */
  startRenderVideo(
    callId: string,
    stream: LocalVideoStream | RemoteVideoStream,
    options?: CreateViewOptions
  ): Promise<void>;
  /**
   * Stops rendering a {@Link RemoteVideoStream} or {@Link LocalVideoStream} and removes the
   * {@Link VideoStreamRendererView} from the relevant {@Link RemoteVideoStream} or {@Link LocalVideoStream} in the
   * state. Under the hood calls {@Link @azure/communication-calling#VideoStreamRenderer.dispose}.
   *
   * @param callId - CallId of the Call where the stream to stop rendering is contained in.
   * @param stream - The LocalVideoStream or RemoteVideoStream to start rendering.
   */
  stopRenderVideo(callId: string, stream: LocalVideoStream | RemoteVideoStream): void;
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
 * Creates a declarative CallClient {@Link DeclarativeCallClient} by proxying CallClient
 * {@Link @azure/communication-calling#CallClient} with ProxyCallClient {@Link ProxyCallClient} which then allows access
 * to state in a declarative way.
 *
 * @param callClient - CallClient from SDK to declaratify
 */
export const callClientDeclaratify = (callClient: CallClient): DeclarativeCallClient => {
  const context: CallContext = new CallContext();
  const internalContext: InternalCallContext = new InternalCallContext();

  Object.defineProperty(callClient, 'state', {
    configurable: false,
    get: () => context.getState()
  });
  Object.defineProperty(callClient, 'onStateChange', {
    configurable: false,
    value: (handler: (state: CallClientState) => void) => context.onStateChange(handler)
  });
  Object.defineProperty(callClient, 'startRenderVideo', {
    configurable: false,
    value: (
      callId: string,
      stream: LocalVideoStream | RemoteVideoStream,
      options?: CreateViewOptions
    ): Promise<void> => {
      return startRenderVideo(context, internalContext, callId, stream, options);
    }
  });
  Object.defineProperty(callClient, 'stopRenderVideo', {
    configurable: false,
    value: (callId: string, stream: LocalVideoStream | RemoteVideoStream): void => {
      stopRenderVideo(context, internalContext, callId, stream);
    }
  });

  return new Proxy(callClient, new ProxyCallClient(context, internalContext)) as DeclarativeCallClient;
};
