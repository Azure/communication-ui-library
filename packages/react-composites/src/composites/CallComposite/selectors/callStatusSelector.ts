// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getCallStatus, getIsScreenShareOn } from './baseSelectors';
import { createSelector } from 'reselect';

export const callStatusSelector = createSelector([getCallStatus, getIsScreenShareOn], (callStatus, isScreenShareOn) => {
  return {
    callStatus,
    isScreenShareOn
  };
});
