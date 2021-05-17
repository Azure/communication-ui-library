// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getCallStatus, getIsScreenShareOn } from './baseSelector';
import { createSelector } from 'reselect';

export const callStatusSelector = createSelector([getCallStatus, getIsScreenShareOn], (callStatus, isScreenShareOn) => {
  return {
    callStatus,
    isScreenShareOn
  };
});
