// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsSettingsModal } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { CaptionsSettingsModal } from './CaptionsSettingsModal.story';

const meta: Meta = {
  title: 'Components/Captions Settings Modal',
  component: CaptionsSettingsModal,
  argTypes: {
    supportedSpokenLanguages: hiddenControl,
    supportedCaptionLanguages: hiddenControl,
    onSetSpokenLanguage: hiddenControl,
    onSetCaptionLanguage: hiddenControl,
    onStartCaptions: hiddenControl,
    currentSpokenLanguage: hiddenControl,
    currentCaptionLanguage: hiddenControl,
    spokenLanguageStrings: hiddenControl,
    captionLanguageStrings: hiddenControl,
    isCaptionsFeatureActive: hiddenControl,
    strings: hiddenControl,
    showModal: hiddenControl,
    onDismissCaptionsSettings: hiddenControl,
    changeCaptionLanguage: hiddenControl
  }
};

export default meta;
