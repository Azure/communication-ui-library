// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithMessageDateExample } from './snippets/WithMessageDate.snippet';

// Main story
export { MessageThreadWithMessageDate } from './MessageThreadWithMessageDate.story';

// Snippet wrapping to stories
export const DateExampleDocsOnly = {
  render: MessageThreadWithMessageDateExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Message Thread With Message Date',
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
        'showMessageStatus'
      ]
    }
  }
};

export default meta;
