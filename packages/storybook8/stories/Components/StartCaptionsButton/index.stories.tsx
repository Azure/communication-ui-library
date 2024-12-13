// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartCaptionsButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { StartCaptionsButton } from './StartCaptionsButton.story';

const meta: Meta = {
  title: 'Components/StartCaptionsButton',
  component: StartCaptionsButton,
  argTypes: {
    onStartCaptions: hiddenControl,
    onStopCaptions: hiddenControl,
    onSetSpokenLanguage: hiddenControl,
    currentSpokenLanguage: hiddenControl,
    checked: hiddenControl
  }
};

export default meta;
