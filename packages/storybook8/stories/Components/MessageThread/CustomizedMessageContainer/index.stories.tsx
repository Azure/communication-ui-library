// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { MessageThreadWithCustomMessageContainerExample } from './snippets/CustomMessageContainer.snippet';

// Main story
export { MessageThreadWithCustomMessageContainer } from './CustomMessageContainer.story';

// Snippet wrapping to stories
export const CustomMessageContainerDocsOnly = {
  render: MessageThreadWithCustomMessageContainerExample
};

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/MessageThread With Customized Message Container',
  component: MessageThreadComponent,
  argTypes: {
    fontStyle: { control: 'radio', options: ['normal', 'italic'], name: 'Font Style' }
  },
  args: {
    fontStyle: 'normal'
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
