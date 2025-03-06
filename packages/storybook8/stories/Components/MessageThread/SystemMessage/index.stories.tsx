// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithSystemMessagesExample } from './snippets/SystemMessages.snippet';

// Main story
export { MessageThreadWithSystemMessage } from './SystemMessage.story';

export const SystemMessageDocsOnly = {
  render: MessageThreadWithSystemMessagesExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With System Message',
  component: MessageThreadComponent,
  argTypes: {
    content: { control: 'text', name: 'System Content' },
    icons: { control: 'radio', options: ['PeopleAdd', 'PeopleBlock'], name: 'Icon' }
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
