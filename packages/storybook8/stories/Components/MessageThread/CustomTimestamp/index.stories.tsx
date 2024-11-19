// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithCustomTimestampExample } from './snippets/CustomTimestamp.snippet';

// Main story
export { MessageThreadCustomTimestamp } from './CustomTimestamp.story';

export const CustomTimestampExampleDocsOnly = {
  render: MessageThreadWithCustomTimestampExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Custom Timestamp',
  component: MessageThreadComponent,
  argTypes: {
    showCustomTimestamp: { control: 'boolean', name: 'Show Custom Timestamp' }
  },
  args: {
    showCustomTimestamp: false
  },
  parameters: {
    controls: {
      exclude: [
        'userId',
        'messages',
        'participantCount',
        'readReceiptsBySenderId',
        'styles',
        'disableJumpToNewMessageButton',
        'numberOfChatMessagesToReload',
        'onMessageSeen',
        'onRenderMessageStatus',
        'onRenderAvatar',
        'onRenderJumpToNewMessageButton',
        'onLoadPreviousChatMessages',
        'onRenderMessage',
        'onRenderAttachmentDownloads',
        'onUpdateMessage',
        'onCancelEditMessage',
        'onDeleteMessage',
        'onSendMessage',
        'disableEditing',
        'strings',
        'attachmentOptions',
        'onDisplayDateTimeString',
        'mentionOptions',
        'inlineImageOptions',
        'richTextEditorOptions',
        'showMessageDate',
        'showMessageStatus'
      ]
    }
  }
};

export default meta;
