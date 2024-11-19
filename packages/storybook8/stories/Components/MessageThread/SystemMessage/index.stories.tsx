// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithSystemMessagesExample } from './snippets/SystemMessages.snippet';

// Main story
export { MessageThreadWithSystemMessage } from './SystemMessage.story';

export const SystemMessageDocsOnly = {
  render: MessageThreadWithSystemMessagesExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Message Thread With System Message',
  component: MessageThreadComponent,
  argTypes: {
    content: { control: 'text', name: 'System Content' },
    icons: { control: 'radio', options: ['PeopleAdd', 'PeopleBlock'], name: 'Icon' }
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
