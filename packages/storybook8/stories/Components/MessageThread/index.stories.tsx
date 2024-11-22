// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { DefaultMessageThreadExample } from './snippets/Default.snippet';

// Main story
export { MessageThread } from './MessageThread.story';

// Snippet wrapping to stories
export const DefaultMessageThreadDocsOnly = {
  render: DefaultMessageThreadExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread',
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
  args: {
    richTextEditor: false,
    showMessageDate: true,
    showMessageStatus: true,
    enableJumpToNewMessageButton: false
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
        'richTextEditorOptions'
      ]
    }
  }
};

export default meta;
