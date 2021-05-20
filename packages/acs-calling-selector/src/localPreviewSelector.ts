// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { CallClientState, DeviceManagerState, LocalVideoStream } from 'calling-stateful-client';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getDeviceManager } from './baseSelectors';
// @ts-ignore
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';

export const localPreviewSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  const view: HTMLElement | undefined = deviceManager.unparentedViews.values().next().value?.view;
  return {
    videoStreamElement: view ? view : null
  };
});
