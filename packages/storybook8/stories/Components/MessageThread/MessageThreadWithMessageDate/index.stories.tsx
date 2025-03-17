// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithMessageDateExample } from './snippets/WithMessageDate.snippet';

// Main story
export { MessageThreadWithMessageDate } from './MessageThreadWithMessageDate.story';

// Snippet wrapping to stories
export const DateExampleDocsOnly = {
  render: MessageThreadWithMessageDateExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With Message Date',
  component: MessageThreadComponent,
  argTypes: {
    messages: {
      table: {
        type: {
          summary: 'Array'
        }
      }
    },
    readReceiptsBySenderId: {
      table: {
        type: {
          summary: 'ReadReceiptsBySenderId'
        }
      }
    },
    showMessageDate: { control: 'boolean' },
    strings: {
      table: {
        type: {
          summary: 'Partial<MessageThreadStrings>'
        }
      }
    }
  },
  args: {
    showMessageDate: true
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageStatus'])
    }
  }
};

export default meta;
