// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageWithAttachment } from './snippets/MessageWithAttachment.snippet';
import { MessageWithAttachmentFromTeams } from './snippets/MessageWithAttachmentFromTeams.snippet';
import { MessageWithCustomAttachment } from './snippets/MessageWithCustomAttachment.snippet';

// Main story
export { MessageWithAttachment } from './MessageWithAttachments.story';

// Snippet wrapping to stories
export const AttachmentsDocsOnly = {
  render: MessageWithAttachment
};
export const AttachmentFromTeamsDocsOnly = {
  render: MessageWithAttachmentFromTeams
};
export const CustomAttachmentsDocsOnly = {
  render: MessageWithCustomAttachment
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Display Message With Attachments',
  component: MessageThreadComponent,
  argTypes: {
    fileType: { control: 'select', options: ['docx', 'pdf', 'xlsx'], name: 'File Type' }
  },
  args: {
    fileType: 'docx'
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
