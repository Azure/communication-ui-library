// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithCustomMessagesExample } from './snippets/CustomMessageContainer.snippet';

// Main story
export { MessageThreadWithCustomMessage } from './CustomMessage.story';

// Snippet wrapping to stories
export const CustomMessageContainerDocsOnly = {
  render: MessageThreadWithCustomMessagesExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread with Custom Message',
  component: MessageThreadComponent,
  argTypes: {
    customMessageContent: { control: 'text', label: 'Custom Message Content' }
  },
  args: {
    customMessageContent: 'Today'
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
