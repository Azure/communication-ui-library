// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithInlineImageExample } from './snippets/WithInlineImageMessage.snippet';

// Main story
export { MessageThreadTappingInlineImage } from './TappingInlineImages.story';

export const InlineImageDocsOnly = {
  render: MessageThreadWithInlineImageExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Tapping Inline Images',
  component: MessageThreadComponent,
  argTypes: {
    tapMethod: { control: 'select', options: ['overlay', 'alert'] }
  },
  args: {
    tapMethod: 'overlay'
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
