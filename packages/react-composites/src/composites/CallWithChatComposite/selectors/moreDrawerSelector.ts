// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallingBaseSelectorProps } from '@internal/calling-component-bindings';
import * as reselect from 'reselect';
import { CallAdapterState } from '../../CallComposite/adapter/CallAdapter';
import { getDeviceManager } from '../../CallComposite/selectors/baseSelectors';
import { MoreDrawerDevicesMenuProps } from '../components/MoreDrawer';

/** @private */
export type MoreDrawerSelector = (
  state: CallAdapterState,
  props: CallingBaseSelectorProps
) => MoreDrawerDevicesMenuProps;

/**
 * @private
 */
export const moreDrawerSelector: MoreDrawerSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    speakers: deviceManager.speakers,
    selectedSpeaker: deviceManager.selectedSpeaker
  };
});
