// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartCallOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallCommon } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall, TeamsCallAgent, TeamsCallAgentOptions } from '@azure/communication-calling';
import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsAppIdentifier
} from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { isPhoneNumberIdentifier } from '@azure/communication-common';
import { Common, _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(one-to-n-calling) */
import { DeclarativeTeamsCallAgent } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
import { isTeamsCallParticipants } from '../utils/callUtils';
/* @conditional-compile-remove(one-to-n-calling) */
import { createLocalVideoStream } from '../utils/callUtils';
import {
  createDefaultCommonCallingHandlers,
  CommonCallingHandlers,
  VideoBackgroundEffectsDependency
} from './createCommonHandlers';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from './createCommonHandlers';
/**
 * Object containing all the teams call handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
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
 * @public
 */
export const createDefaultTeamsCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    callAgent?: TeamsCallAgent,
    deviceManager?: StatefulDeviceManager,
    call?: TeamsCall,
    options?: {
      onResolveVideoBackgroundEffectsDependency?: () => Promise<VideoBackgroundEffectsDependency>;
      /* @conditional-compile-remove(DNS) */
      onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
    }
  ): TeamsCallingHandlers => {
    return {
      ...createDefaultCommonCallingHandlers(callClient, deviceManager, call, options),
      onStartCall: (participants, options) => {
        /* @conditional-compile-remove(teams-identity-support-beta) */
        const threadId = options?.threadId;
        if (!isTeamsCallParticipants(participants)) {
          throw new Error('CommunicationIdentifier in Teams call is not supported!');
        }
        if (callAgent) {
          /* @conditional-compile-remove(teams-identity-support-beta) */
          return callAgent.startCall(participants, threadId ? { threadId, ...options } : undefined);
          /* @conditional-compile-remove(teams-identity-support) */
          // Remove when teams identity in stable support multiple participants
          return teamsSingleParticipantTrampoline(callAgent as TeamsCallAgent, participants, options);
        }

        return undefined;
      },
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

        if (isMicrosoftTeamsAppIdentifier(participant)) {
          throw new Error('Adding Microsoft Teams app identifier is not supported!');
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

        if (isMicrosoftTeamsAppIdentifier(participant)) {
          throw new Error('Removing Microsoft Teams app identifier is not supported!');
        }
        /* @conditional-compile-remove(teams-identity-support) */
        await call?.removeParticipant(participant);
      },
      /* @conditional-compile-remove(one-to-n-calling) */
      onAcceptCall: async (incomingCallId: string, useVideo?: boolean): Promise<void> => {
        const localVideoStream = useVideo ? await createLocalVideoStream(callClient) : undefined;
        const incomingCall = (callAgent as DeclarativeTeamsCallAgent)?.incomingCalls.find(
          (incomingCall: IncomingCallCommon) => incomingCall.id === incomingCallId
        );
        if (incomingCall) {
          await incomingCall.accept(
            localVideoStream ? { videoOptions: { localVideoStreams: [localVideoStream] } } : undefined
          );
        }
      },
      /* @conditional-compile-remove(one-to-n-calling) */
      onRejectCall: async (incomingCallId: string): Promise<void> => {
        const incomingCall = (callAgent as DeclarativeTeamsCallAgent)?.incomingCalls.find(
          (incomingCall: IncomingCallCommon) => incomingCall.id === incomingCallId
        );
        if (incomingCall) {
          await incomingCall.reject();
        }
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
 * @public
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

/* @conditional-compile-remove(teams-identity-support) */
const teamsSingleParticipantTrampoline = (
  callAgent: TeamsCallAgent,
  participants: CommunicationIdentifier[],
  options?: TeamsCallAgentOptions
): TeamsCall => {
  if (participants.length !== 1) {
    throw new Error('Only one participant is supported in Teams call!');
  } else {
    return callAgent.startCall(participants[0] as any, options);
  }
};
