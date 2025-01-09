// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeText } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleRealTimeText } from './snippets/ExampleRealTimeText.snippet';

export const ExampleRealTimeTextExampleDocsOnly = {
  render: ExampleRealTimeText
};

export { RealTimeText } from './RealTimeText.story';

const meta: Meta = {
  title: 'Components/Internal/Real Time Text',
  component: RealTimeText,
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
