// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallingBaseSelectorProps } from '@internal/calling-component-bindings';
import { OptionsDevice } from '@internal/react-components';
import * as reselect from 'reselect';
import { CallAdapterState } from '../../CallComposite/adapter/CallAdapter';
import { getDeviceManager } from '../../CallComposite/selectors/baseSelectors';

/** @private */
export type MoreDrawerSelector = (
  state: CallAdapterState,
  props: CallingBaseSelectorProps
) => {
  microphones?: OptionsDevice[];
  speakers?: OptionsDevice[];
  selectedMicrophone?: OptionsDevice;
  selectedSpeaker?: OptionsDevice;
};

/**
 * @private
 */
export const moreDrawerSelector: MoreDrawerSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    microphones: deviceManager.microphones,
    speakers: deviceManager.speakers,
    selectedMicrophone: deviceManager.selectedMicrophone,
    selectedSpeaker: deviceManager.selectedSpeaker
  };
});
