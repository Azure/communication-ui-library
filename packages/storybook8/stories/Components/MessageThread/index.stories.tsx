// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithBlockedMessagesExample } from './snippets/BlockedMessages.snippet';
import { MessageThreadWithCustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { MessageThreadWithCustomBlockedMessageContainerExample } from './snippets/CustomBlockedMessage.snippet';
import { MessageThreadWithCustomChatContainerExample } from './snippets/CustomChatContainer.snippet';
import { MessageThreadWithCustomMessageContainerExample } from './snippets/CustomMessageContainer.snippet';
import { MessageThreadWithCustomMessagesExample } from './snippets/CustomMessages.snippet';
import { MessageThreadWithCustomMessageStatusIndicatorExample } from './snippets/CustomMessageStatusIndicator.snippet';
import { MessageThreadWithCustomTimestampExample } from './snippets/CustomTimestamp.snippet';
import { DefaultMessageThreadExample } from './snippets/Default.snippet';
import { MessageThreadWithMessageStatusIndicatorExample } from './snippets/MessageStatusIndicator.snippet';
import { MessageWithAttachment } from './snippets/MessageWithAttachment.snippet';
import { MessageWithAttachmentFromTeams } from './snippets/MessageWithAttachmentFromTeams.snippet';
import { MessageWithCustomAttachment } from './snippets/MessageWithCustomAttachment.snippet';
import { MessageWithCustomMentionRenderer } from './snippets/MessageWithCustomMentionRenderer.snippet';
import { MessageThreadWithSystemMessagesExample } from './snippets/SystemMessages.snippet';
import { MessageThreadWithInlineImageExample } from './snippets/WithInlineImageMessage.snippet';
import { MessageThreadWithMessageDateExample } from './snippets/WithMessageDate.snippet';
import { MessageThreadWithRichTextEditorExample } from './snippets/WithRichTextEditor.snippet';
import { MessageThreadWithRichTextEditorInlineImagesExample } from './snippets/WithRichTextEditorInlineImages.snippet';
import { MessageThreadWithWithRichTextEditorOnPasteExample } from './snippets/WithRichTextEditorOnPaste.snippet';

// Main story
export { MessageThread } from './MessageThread.story';

// Snippet wrapping to stories
export const BlockedMessagesDocsOnly = {
  render: MessageThreadWithBlockedMessagesExample
};
export const CustomAvatarDocsOnly = {
  render: MessageThreadWithCustomAvatarExample
};
export const CustomBlockedMessageDocsOnly = {
  render: MessageThreadWithCustomBlockedMessageContainerExample
};
export const CustomChatContainerDocsOnly = {
  render: MessageThreadWithCustomChatContainerExample
};
export const CustomMessageContainerDocsOnly = {
  render: MessageThreadWithCustomMessageContainerExample
};
export const CustomMessagesDocsOnly = {
  render: MessageThreadWithCustomMessagesExample
};
export const CustomStatusIndicatorDocsOnly = {
  render: MessageThreadWithCustomMessageStatusIndicatorExample
};
export const CustomTimestampExampleDocsOnly = {
  render: MessageThreadWithCustomTimestampExample
};
export const DefaultMessageThreadDocsOnly = {
  render: DefaultMessageThreadExample
};
export const MessageStatusIndicatorDocsOnly = {
  render: MessageThreadWithMessageStatusIndicatorExample
};
export const AttachmentsDocsOnly = {
  render: MessageWithAttachment
};
export const AttachmentFromTeamsDocsOnly = {
  render: MessageWithAttachmentFromTeams
};
export const CustomAttachmentsDocsOnly = {
  render: MessageWithCustomAttachment
};
export const CustomMentionsDocsOnly = {
  render: MessageWithCustomMentionRenderer
};
export const SystemMessageDocsOnly = {
  render: MessageThreadWithSystemMessagesExample
};
export const InlineImageDocsOnly = {
  render: MessageThreadWithInlineImageExample
};
export const DateExampleDocsOnly = {
  render: MessageThreadWithMessageDateExample
};

export const RichTextEditorTextDocsOnly = {
  render: MessageThreadWithRichTextEditorExample
};

export const RichTextEditorInlineImagesTextDocsOnly = {
  render: MessageThreadWithRichTextEditorInlineImagesExample
};

export const RichTextEditorOnPasteTextDocsOnly = {
  render: MessageThreadWithWithRichTextEditorOnPasteExample
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
