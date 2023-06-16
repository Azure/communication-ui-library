// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StartCallOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall, TeamsCallAgent } from '@azure/communication-calling';
import { CommunicationIdentifier, isCommunicationUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(teams-identity-support) */
import { isPhoneNumberIdentifier } from '@azure/communication-common';
import { Common, _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { isTeamsCallParticipants } from '../utils/callUtils';
import { createDefaultCommonCallingHandlers, CommonCallingHandlers } from './createCommonHandlers';

/**
 * Object containing all the teams call handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @beta
 */
export interface TeamsCallingHandlers extends CommonCallingHandlers {
  onStartCall: (
    participants: CommunicationIdentifier[],
    options?: StartCallOptions
  ) => undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall;
}

/**
 * Create the default implementation of {@link TeamsCallingHandlers} for teams call.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @beta
 */
export const createDefaultTeamsCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    callAgent: undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallAgent,
    deviceManager: StatefulDeviceManager | undefined,
    call: undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall
  ): never | TeamsCallingHandlers => {
    return {
      ...createDefaultCommonCallingHandlers(callClient, callAgent, deviceManager, call),
      onStartCall: (participants, options) => {
        /* @conditional-compile-remove(teams-identity-support) */
        const threadId = options?.threadId;
        if (!isTeamsCallParticipants(participants)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        /* @conditional-compile-remove(teams-identity-support) */
        if (callAgent) {
          return callAgent.startCall(participants, threadId ? { threadId } : undefined);
        }
        return undefined;
      },
      /* @conditional-compile-remove(teams-identity-support) */
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant: async (
        userId: string | CommunicationIdentifier,
        options?: AddPhoneNumberOptions
      ): Promise<void> => {
        const participant = _toCommunicationIdentifier(userId);
        /* @conditional-compile-remove(teams-identity-support) */
        const threadId = options?.threadId;
        if (isCommunicationUserIdentifier(participant)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        /* @conditional-compile-remove(teams-identity-support) */
        if (isPhoneNumberIdentifier(participant)) {
          call?.addParticipant(participant, threadId ? { threadId } : undefined);
        }
        /* @conditional-compile-remove(teams-identity-support) */
        call?.addParticipant(participant);
      },
      onRemoveParticipant: async (
        userId: string | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier
      ): Promise<void> => {
        const participant = _toCommunicationIdentifier(userId);
        if (isCommunicationUserIdentifier(participant)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        /* @conditional-compile-remove(teams-identity-support) */
        await call?.removeParticipant(participant);
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
 * @param callAgent - Instance of {@link @azure/communication-calling#TeamsCallClient}.
 * @param deviceManager - Instance of {@link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@link @azure/communication-calling#TeamsCall}.
 * @param _ - React component that you want to generate handlers for.
 *
 * @beta
 */
export const createTeamsCallingHandlersForComponent = <Props>(
  callClient: StatefulCallClient,
  callAgent: undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallAgent,
  deviceManager: StatefulDeviceManager | undefined,
  call: undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall,
  _Component: (props: Props) => ReactElement | null
): Common<TeamsCallingHandlers, Props> => {
  return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call);
};
