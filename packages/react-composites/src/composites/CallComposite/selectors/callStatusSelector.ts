// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getCallStatus, getIsScreenShareOn } from './baseSelectors';
import { createSelector } from 'reselect';
import { CallState as SDKCallStatus } from '@azure/communication-calling';

/**
 * @private
 */
export const callStatusSelector = createSelector(
  [getCallStatus, getIsScreenShareOn],
  (callStatus: SDKCallStatus, isScreenShareOn) => {
    return {
      callStatus,
      isScreenShareOn
    };
  }
);
