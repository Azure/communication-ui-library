// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RTT } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleRTT } from './snippets/ExampleRTT.snippet';

export const ExampleRTTExampleDocsOnly = {
  render: ExampleRTT
};

export { RTT } from './RTT.story';

const meta: Meta = {
  title: 'Components/Internal/RTT',
  component: RTT,
  argTypes: {
    isTyping: controlsToAdd.isRTTTyping,
    displayName: controlsToAdd.rttDisplayName,
    captionText: controlsToAdd.rttCaptionText,
    id: hiddenControl,
    onRenderAvatar: hiddenControl,
    strings: hiddenControl,
    userId: hiddenControl
  }
};

export default meta;
