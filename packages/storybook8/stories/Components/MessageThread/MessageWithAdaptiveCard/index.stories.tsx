// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithAdaptiveCardExample } from './snippets/MessageWithAdaptiveCard.snippet';

// Main story
export { CustomizedAdaptiveCardMessage } from './CustomizedAdaptiveCardMessage.story';

// Snippet wrapping to stories
export const CustomAdaptiveCardMessageDocsOnly = {
  render: MessageThreadWithAdaptiveCardExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With Adaptive Card Message',
  component: MessageThreadComponent,
  argTypes: {
    border: { control: 'text', name: 'Border' },
    adaptiveCardTitle: { control: 'text', name: 'Adaptive Card Title' }
  },
  args: {
    border: '1px solid black',
    adaptiveCardTitle: 'Publish Adaptive Card Schema'
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
