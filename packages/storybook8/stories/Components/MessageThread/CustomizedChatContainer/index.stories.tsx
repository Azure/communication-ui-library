// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithCustomChatContainerExample } from './snippets/CustomChatContainer.snippet';

// Main story
export { MessageThreadWithCustomizedChatContainer } from './CustomizedChatContainer.story';

// Snippet wrapping to stories
export const CustomChatContainerDocsOnly = {
  render: MessageThreadWithCustomChatContainerExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With Customized Chat Container',
  component: MessageThreadComponent,
  argTypes: {
    backgroundColor: { control: 'text', name: 'Background Color' },
    padding: { control: 'text', name: 'Padding (px)' }
  },
  args: {
    backgroundColor: 'lightgray',
    padding: '15'
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
