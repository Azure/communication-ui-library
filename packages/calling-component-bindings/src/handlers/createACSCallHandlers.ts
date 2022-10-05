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
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
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
export type ACSCallingHandlers = Omit<CallingHandlersCommon, 'onStartCall'> & {
  onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions) => Call | undefined;
  onAddParticipant: (participant: CommunicationIdentifier, options?: AddPhoneNumberOptions) => Promise<void>;
  onRemoveParticipant: (userId: string) => Promise<void>;
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
  ): ACSCallingHandlers => {
    return {
      ...createDefaultCallingHandlersCommon(callClient, callAgent, deviceManager, call),
      // FIXME: onStartCall API should use string, not the underlying SDK types.
      onStartCall: (participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined => {
        return callAgent ? callAgent.startCall(participants, options) : undefined;
      },
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant: async (
        participant: CommunicationIdentifier,
        options?: AddPhoneNumberOptions
      ): Promise<void> => {
        if (isPhoneNumberIdentifier(participant)) {
          call?.addParticipant(participant, options);
        } else if (isCommunicationUserIdentifier(participant) || isMicrosoftTeamsUserIdentifier(participant)) {
          call?.addParticipant(participant);
        }
      },
      onRemoveParticipant: async (userId: string): Promise<void> => {
        await call?.removeParticipant(fromFlatCommunicationIdentifier(userId));
      }
    };
  }
);
