// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageWithCustomMentionRenderer } from './snippets/MessageWithCustomMentionRenderer.snippet';

// Main story
export { MessageThreadWithMentionUsers } from './MentionUsers.story';

export const CustomMentionsDocsOnly = {
  render: MessageWithCustomMentionRenderer
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Mention Users',
  component: MessageThreadComponent,
  argTypes: {
    mentionNames: { control: 'text', name: 'Mention Names (comma seperated list)' }
  },
  args: {
    mentionNames: 'Kat Dennings, Robert Tolbert, Milton Dyer'
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
