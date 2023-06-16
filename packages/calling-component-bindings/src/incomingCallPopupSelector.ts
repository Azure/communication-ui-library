// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CallClientState } from '@internal/calling-stateful-client';
import { CallingBaseSelectorProps, getIncomingCalls } from './baseSelectors';
import * as reselect from 'reselect';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

/**
 * @internal
 */
export type _IncomingCallPopupSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  incomingCalls?: {
    id: string;
    callInfo: {
      id?: string;
      displayName?: string;
    };
    startTime: Date;
    endTime?: Date;
  }[];
};

/**
 * Selector for {@link IncomingCallModal} component.
 *
 * @internal
 */
export const _incomingCallPopupSelector: _IncomingCallPopupSelector = reselect.createSelector(
  [getIncomingCalls],
  (incomingCalls) => {
    return {
      incomingCalls: incomingCalls
        ?.filter((incomingCall) => incomingCall.callEndReason === undefined)
        .map((incomingCall) => ({
          id: incomingCall.id,
          callInfo: {
            id: incomingCall.callerInfo.identifier && toFlatCommunicationIdentifier(incomingCall.callerInfo.identifier),
            displayName: incomingCall.callerInfo.displayName
          },
          startTime: incomingCall.startTime,
          endTime: incomingCall.endTime
        }))
    };
  }
);
