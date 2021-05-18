// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { CallClientState, DeviceManager } from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getDeviceManager } from './baseSelectors';
// @ts-ignore
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';

export const localPreviewSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    videoStreamElement: deviceManager.unparentedViews[0] ? deviceManager.unparentedViews[0].target : null
  };
});
