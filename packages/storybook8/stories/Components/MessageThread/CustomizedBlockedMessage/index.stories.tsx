// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithCustomBlockedMessageContainerExample } from './snippets/CustomBlockedMessage.snippet';

// Main story
export { CustomizedBlockedMessage } from './CustomizedBlockedMessage.story';

// Snippet wrapping to stories
export const CustomBlockedMessageDocsOnly = {
  render: MessageThreadWithCustomBlockedMessageContainerExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With Custom Blocked Message Container',
  component: MessageThreadComponent,
  argTypes: {
    textColor: { control: 'text', name: 'Text Color' },
    border: { control: 'text', name: 'Border' },
    warningMessage: { control: 'text', name: 'Warning Message' },
    overrideDefaultMessage: { control: 'text', name: 'Override Default Message' }
  },
  args: {
    textColor: 'red',
    border: '1px solid red',
    warningMessage: 'This is a warning message'
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
