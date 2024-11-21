// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithMessageStatusIndicatorExample } from './snippets/MessageStatusIndicator.snippet';

// Main story
export { DefaultMessageStatusIndicator } from './DefaultMessageStatusIndicator.story';

// Snippet wrapping to stories
export const MessageStatusIndicatorDocsOnly = {
  render: MessageThreadWithMessageStatusIndicatorExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Default Message Status Indicator',
  component: MessageThreadComponent,
  argTypes: {
    showMessageStatus: { control: 'boolean', name: 'Show MessageStatus' }
  },
  args: {
    showMessageStatus: true
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate'])
    }
  }
};

export default meta;
