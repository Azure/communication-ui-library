// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent, MessageThreadProps } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithBlockedMessagesExample } from './snippets/BlockedMessages.snippet';

// Main story
export { MessageThreadWithBlockedMessage } from './BlockedMessage.story';

// Snippet wrapping to stories
export const BlockedMessagesDocsOnly = {
  render: MessageThreadWithBlockedMessagesExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Message Thread With Blocked Message',
  component: MessageThreadComponent,
  argTypes: {
    displayName: { control: 'text', name: 'displayName' },
    link: { control: 'text', name: 'link' },
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
    showMessageStatus: { control: 'boolean' },
    onRenderAvatar: {
      table: {
        type: {
          summary: '(userId: string, options?: CustomAvatarOptions) => JSX.Element | undefined'
        }
      }
    },
    onUpdateMessage: {
      table: {
        type: {
          summary: '(messageId: string, content: string) => Promise<void>'
        }
      }
    },
    onSendMessage: {
      table: {
        type: {
          summary: '(content: string) => Promise<void>'
        }
      }
    },
    strings: {
      table: {
        type: {
          summary: 'Partial<MessageThreadStrings>'
        }
      }
    }
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
        'richTextEditor',
        'showMessageDate',
        'showMessageStatus',
        'enableJumpToNewMessageButton'
      ]
    }
  }
};

export default meta;
