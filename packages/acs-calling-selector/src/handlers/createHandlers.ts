// © Microsoft Corporation. All rights reserved.
import { CallClient, CallAgent, DeviceManager, Call } from '@azure/communication-calling';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';

export type CallClientHandlers = {};
export type CallAgentHandlers = {};
export type CallHandlers = {};
export type DeviceManagerHandlers = {};

const createCallClientDefaultHandlers = memoizeOne(
  (declarativeCallClient: CallClient): CallClientHandlers => {
    return {};
  }
);

const createCallAgentDefaultHandlers = memoizeOne(
  (declarativeCallAgent: CallAgent): CallAgentHandlers => {
    return {};
  }
);

const createDeviceManagerDefaultHandlers = memoizeOne(
  (declarativeDeviceManager: DeviceManager): DeviceManagerHandlers => {
    return {};
  }
);

const createCallDefaultHandlers = memoizeOne(
  (declarativeCall: Call): CallHandlers => {
    return {};
  }
);

export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties<A, B>>;

export const createDefaultHandlersForComponent = <Props>(
  declarativeCallClient: CallClient,
  declarativeCallAgent: CallAgent | undefined,
  declarativeDeviceManager: DeviceManager | undefined,
  declarativeCall: Call | undefined,
  _: (props: Props) => ReactElement | null
): Common<CallClientHandlers & CallAgentHandlers & DeviceManagerHandlers & CallHandlers, Props> => {
  const callClientHandlers = createCallClientDefaultHandlers(declarativeCallClient);
  let callAgentHandlers: CallAgentHandlers | undefined;
  if (declarativeCallAgent) {
    callAgentHandlers = createCallAgentDefaultHandlers(declarativeCallAgent);
  }
  let deviceManagerHandlers: DeviceManagerHandlers | undefined;
  if (declarativeDeviceManager) {
    deviceManagerHandlers = createDeviceManagerDefaultHandlers(declarativeDeviceManager);
  }
  let callHandlers: CallHandlers | undefined;
  if (declarativeCall) {
    callHandlers = createCallDefaultHandlers(declarativeCall);
  }
  return {
    ...callClientHandlers,
    ...callAgentHandlers,
    ...deviceManagerHandlers,
    ...callHandlers
  };
};
