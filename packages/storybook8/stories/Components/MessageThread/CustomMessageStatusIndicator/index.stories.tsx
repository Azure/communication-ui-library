// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithCustomMessageStatusIndicatorExample } from './snippets/CustomMessageStatusIndicator.snippet';

// Main story
export { CustomMessageStatusIndicator } from './CustomMessageStatusIndicator.story';

export const CustomStatusIndicatorDocsOnly = {
  render: MessageThreadWithCustomMessageStatusIndicatorExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Custom Message Status Indicator',
  component: MessageThreadComponent,
  argTypes: {
    fontStyle: { control: 'text', name: 'Font Style' },
    fontWeight: { control: 'text', name: 'Font Weight' },
    fontColor: { control: 'text', name: 'Font Color' },
    statusContent: { control: 'text', name: 'Status Content' }
  },
  args: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontColor: 'green',
    statusContent: 'SEEN'
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
