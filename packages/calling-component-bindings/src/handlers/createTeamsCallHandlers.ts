// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, StartCallOptions, TeamsCall, TeamsCallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier, isCommunicationUserIdentifier } from '@azure/communication-common';
import { Common } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { isTeamsCallParticipants } from '../utils/callUtils';
import { CallingHandlers } from './createHandlers';
import { createDefaultCallingHandlersCommon } from './createHandlersCommon';

/**
 * Object containing all the handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export type TeamsCallingHandlers = Omit<CallingHandlers, 'onStartCall'> & {
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => TeamsCall | undefined;
  onAddParticipant: (participant: CommunicationIdentifier, options?: AddPhoneNumberOptions) => Promise<void>;
  onRemoveParticipant: (userId: string) => Promise<void>;
};

/**
 * @private
 */
export const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

/**
 * Create the default implementation of {@link CallingHandlers}.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const createDefaultTeamsCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    callAgent: TeamsCallAgent | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    call: TeamsCall | undefined
  ): TeamsCallingHandlers => {
    const calingsHandlers = createDefaultCallingHandlersCommon(callClient, callAgent, deviceManager, call);
    return {
      ...calingsHandlers,
      onStartCall: (participants, options) => {
        const threadId = options?.threadId;
        if (!isTeamsCallParticipants(participants)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        return callAgent ? callAgent.startCall(participants, threadId ? { threadId } : undefined) : undefined;
      },
      onAddParticipant: async (participant: CommunicationIdentifier, options?: AddPhoneNumberOptions) => {
        const threadId = options?.threadId;
        if (isCommunicationUserIdentifier(participant)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        call?.addParticipant(participant, threadId ? { threadId } : undefined);
      },
      onRemoveParticipant: async (userId) => {
        await call?.removeParticipant({ microsoftTeamsUserId: userId });
      }
    };
  }
);

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invocations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param callClient - StatefulCallClient returned from
 *   {@link @azure/communication-react#createStatefulCallClient}.
 * @param callAgent - Instance of {@link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 *
 * @public
 */
export const createTeamsCallingHandlersForComponent = <Props>(
  callClient: StatefulCallClient,
  callAgent: TeamsCallAgent | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: TeamsCall | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<TeamsCallingHandlers, Props> => {
  return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call);
};
