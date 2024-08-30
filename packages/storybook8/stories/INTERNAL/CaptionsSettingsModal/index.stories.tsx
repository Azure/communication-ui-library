// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _CaptionsSettingsModal } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl, controlsToAdd } from '../../controlsUtils';

export { CaptionsSettingsModal } from './CaptionsSettingsModal.story';

const meta: Meta = {
  title: 'Components/Internal/Captions Settings Modal',
  component: _CaptionsSettingsModal,
  argTypes: {
    isCaptionsFeatureActive: controlsToAdd.isCaptionsFeatureActive,
    showModal: hiddenControl,
    supportedSpokenLanguages: hiddenControl,
    currentSpokenLanguage: hiddenControl,
    strings: hiddenControl,
    onSetSpokenLanguage: hiddenControl,
    onDismissCaptionsSettings: hiddenControl,
    onStartCaptions: hiddenControl
  }
};

export default meta;
