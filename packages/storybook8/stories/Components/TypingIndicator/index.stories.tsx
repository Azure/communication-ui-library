// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TypingIndicator as TypingIndicatorComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, defaultTypingUsers, hiddenControl } from '../../controlsUtils';
import { CustomStylingExample } from './snippets/CustomizeStyle.snippet';
import { CustomUserRenderExample } from './snippets/CustomizeUserRendering.snippet';
import { TypingIndicatorExample } from './snippets/TypingIndicator.snippet';
export { TypingIndicator } from './TypingIndicator.story';

export const TypingIndicatorExampleDocsOnly = {
  render: TypingIndicatorExample
};

export const CustomizeStyleExampleDocsOnly = {
  render: CustomStylingExample
};

export const CustomizeUserRenderingExampleDocsOnly = {
  render: CustomUserRenderExample
};

const meta: Meta = {
  title: 'Components/Typing Indicator',
  component: TypingIndicatorComponent,
  argTypes: {
    typingUsers: controlsToAdd.typingUsers,
    // Hidden Controls
    onRenderUser: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl
  },
  args: {
    typingUsers: defaultTypingUsers
  }
};

export default meta;
