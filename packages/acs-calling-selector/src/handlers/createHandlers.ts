// © Microsoft Corporation. All rights reserved.
import {
  CallClient,
  CallAgent,
  DeviceManager,
  Call,
  StartCallOptions,
  HangUpOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';

export type CallClientHandlers = {
  getDeviceManager: () => Promise<DeviceManager>;
};

export type CallAgentHandlers = {
  onStartCall(
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    options?: StartCallOptions
  ): Call;
};

export type DeviceManagerHandlers = {
  getCameras(): Promise<VideoDeviceInfo[]>;
};

export type CallHandlers = {
  onHangUp(options?: HangUpOptions): Promise<void>;
};

const createCallClientDefaultHandlers = memoizeOne(
  (declarativeCallClient: CallClient): CallClientHandlers => {
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
):
  | Common<CallClientHandlers & CallAgentHandlers & DeviceManagerHandlers & CallHandlers, Props>
  | Common<CallClientHandlers, Props> => {
  const callClientHandlers = createCallClientDefaultHandlers(declarativeCallClient);
  const callAgentHandlers = declarativeCallAgent ? createCallAgentDefaultHandlers(declarativeCallAgent) : undefined;
  const deviceManagerHandlers = declarativeDeviceManager
    ? createDeviceManagerDefaultHandlers(declarativeDeviceManager)
    : undefined;
  const callHandlers = declarativeCall ? createCallDefaultHandlers(declarativeCall) : undefined;
  return {
    ...callClientHandlers,
    ...callAgentHandlers,
    ...deviceManagerHandlers,
    ...callHandlers
  };
};
