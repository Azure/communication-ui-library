// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeText } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { ExampleRealTimeText } from './snippets/ExampleRealTimeText.snippet';

export const ExampleRealTimeTextExampleDocsOnly = {
  render: ExampleRealTimeText
};

export { RealTimeText } from './RealTimeText.story';

const meta: Meta = {
  title: 'Components/Real Time Text',
  component: RealTimeText,
  argTypes: {
    isTyping: controlsToAdd.isRTTTyping,
    displayName: controlsToAdd.rttDisplayName,
    message: controlsToAdd.rttCaptionText,
    id: hiddenControl,
    onRenderAvatar: hiddenControl,
    strings: hiddenControl,
    userId: hiddenControl,
    isMe: hiddenControl
  }
};

export default meta;
