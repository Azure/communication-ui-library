// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent, StartCallOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
} from '@azure/communication-common';
import { _toCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { CallingHandlersCommon, createDefaultCallingHandlersCommon } from './createHandlersCommon';

/**
 * Object containing all the handlers required for calling components.
 *
 * Calling related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export type CallingHandlers = Omit<CallingHandlersCommon, 'onStartCall'> & {
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => Call | undefined;
};

/**
 * @public
 */
export const createDefaultACSCallingHandlers = memoizeOne(
  (
    callClient: StatefulCallClient,
    callAgent: CallAgent | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    call: Call | undefined
  ): CallingHandlers => {
    return {
      ...createDefaultCallingHandlersCommon(callClient, deviceManager, call),
      // FIXME: onStartCall API should use string, not the underlying SDK types.
      onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined => {
        return callAgent ? callAgent.startCall(participants, options) : undefined;
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
      }
    };
  }
);
