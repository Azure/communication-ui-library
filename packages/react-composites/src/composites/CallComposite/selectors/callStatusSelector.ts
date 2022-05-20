// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getCallStatus, getIsScreenShareOn } from './baseSelectors';
import { createSelector } from 'reselect';
import { CallState as SDKCallStatus } from '@azure/communication-calling';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectCallStatus(callStatus: SDKCallStatus, isScreenShareOn: boolean) {
  return {
    callStatus,
    isScreenShareOn
  };
}

/**
 * @private
 */
export const callStatusSelector = createSelector([getCallStatus, getIsScreenShareOn], selectCallStatus);
