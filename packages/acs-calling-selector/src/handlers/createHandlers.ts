// © Microsoft Corporation. All rights reserved.
import {
  CallAgent,
  DeviceManager,
  Call,
  StartCallOptions,
  HangUpOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import { DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#CallClient}.
 */
export type CallClientHandlers = {
  getDeviceManager: () => Promise<DeviceManager>;
};

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#CallAgent}.
 */
export type CallAgentHandlers = {
  onStartCall(
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    options?: StartCallOptions
  ): Call;
};

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#DeviceManager}.
 */
export type DeviceManagerHandlers = {
  getCameras(): Promise<VideoDeviceInfo[]>;
};

/**
 * Defines all handlers associated with {@Link @azure/communication-calling#Call}.
 */
export type CallHandlers = {
  onHangUp(options?: HangUpOptions): Promise<void>;
};

const createCallClientDefaultHandlers = memoizeOne(
  (declarativeCallClient: DeclarativeCallClient): CallClientHandlers => {
    return {
      getDeviceManager: () => declarativeCallClient.getDeviceManager()
    };
  }
);

const createCallAgentDefaultHandlers = memoizeOne(
  (declarativeCallAgent: CallAgent): CallAgentHandlers => {
    return {
      onStartCall: (
        participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
        options?: StartCallOptions
      ): Call => declarativeCallAgent.startCall(participants, options)
    };
  }
);

const createDeviceManagerDefaultHandlers = memoizeOne(
  (declarativeDeviceManager: DeviceManager): DeviceManagerHandlers => {
    return {
      getCameras: (): Promise<VideoDeviceInfo[]> => declarativeDeviceManager.getCameras()
    };
  }
);

const createCallDefaultHandlers = memoizeOne(
  (declarativeCall: Call): CallHandlers => {
    return {
      onHangUp: (options?: HangUpOptions): Promise<void> => declarativeCall.hangUp(options)
    };
  }
);

/**
 * Type guard for common properties between two types.
 */
export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties<A, B>>;

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invokations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param declarativeCallClient - DeclarativeCallClient returned from
 *   {@Link @azure/acs-calling-declarative#callClientDeclaratify}.
 * @param callAgent - Instance of {@Link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@Link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@Link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 * @returns
 */
export const createDefaultHandlersForComponent = <Props>(
  declarativeCallClient: DeclarativeCallClient,
  callAgent: CallAgent | undefined,
  deviceManager: DeviceManager | undefined,
  call: Call | undefined,
  _: (props: Props) => ReactElement | null
):
  | Common<CallClientHandlers & CallAgentHandlers & DeviceManagerHandlers & CallHandlers, Props>
  | Common<CallClientHandlers, Props> => {
  const callClientHandlers = createCallClientDefaultHandlers(declarativeCallClient);
  const callAgentHandlers = callAgent ? createCallAgentDefaultHandlers(callAgent) : undefined;
  const deviceManagerHandlers = deviceManager ? createDeviceManagerDefaultHandlers(deviceManager) : undefined;
  const callHandlers = call ? createCallDefaultHandlers(call) : undefined;
  return {
    ...callClientHandlers,
    ...callAgentHandlers,
    ...deviceManagerHandlers,
    ...callHandlers
  };
};
