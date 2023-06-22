// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent, StartCallOptions, Features } from '@azure/communication-calling';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import {
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';

import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { isACSCallParticipants } from '../utils/callUtils';
import { createDefaultCommonCallingHandlers, CommonCallingHandlers } from './createCommonHandlers';

/**
 * Object containing all the handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export interface CallingHandlers extends CommonCallingHandlers {
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => Call | undefined;
}

/**
 * Create the default implementation of {@link CallingHandlers} for teams call.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const createDefaultCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    callAgent: CallAgent | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    call: Call | undefined
  ): CallingHandlers => {
    return {
      ...createDefaultCommonCallingHandlers(callClient, deviceManager, call),
      // FIXME: onStartCall API should use string, not the underlying SDK types.
      onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined => {
        /* @conditional-compile-remove(teams-adhoc-call) */
        return callAgent?.startCall(participants, options);
        if (!isACSCallParticipants(participants)) {
          throw new Error('TeamsUserIdentifier in Teams call is not supported!');
        }
        return callAgent?.startCall(participants, options);
      },
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant: async (
        userId: string | CommunicationIdentifier,
        options?: AddPhoneNumberOptions
      ): Promise<void> => {
        const participant = _toCommunicationIdentifier(userId);
        if (isPhoneNumberIdentifier(participant)) {
          call?.addParticipant(participant, options);
        } else if (isCommunicationUserIdentifier(participant) || isMicrosoftTeamsUserIdentifier(participant)) {
          call?.addParticipant(participant);
        }
      },
      onRemoveParticipant: async (
        userId: string | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier
      ): Promise<void> => {
        const participant = _toCommunicationIdentifier(userId);
        await call?.removeParticipant(participant);
      },
      /* @conditional-compile-remove(raise-hands) */
      onLowerHands: async (userIds: string[]): Promise<void> => {
        const participants = userIds.map((userId) => {
          return _toCommunicationIdentifier(userId) as CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier;
        });
        await call?.feature(Features.RaiseHand).lowerHands(participants);
      }
    };
  }
);
