// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { PersonaSize } from '@fluentui/react';
import { Meta } from '@storybook/react';

import { MessageThreadWithCustomAvatarExample } from './snippets/CustomAvatar.snippet';

// Main story
export { MessageThreadCustomAvatar } from './CustomAvatar.story';

// Snippet wrapping to stories
export const CustomAvatarDocsOnly = {
  render: MessageThreadWithCustomAvatarExample
};
const small = PersonaSize.size32;
const medium = PersonaSize.size48;
const large = PersonaSize.size72;
const extralarge = PersonaSize.size100;
const sizes = { small, medium, large, extralarge };

// Main story meta export
const meta: Meta<typeof MessageThreadComponent> = {
  title: 'Components/Message Thread/Custom Avatar',
  component: MessageThreadComponent,
  argTypes: {
    avatarSize: {
      options: Object.keys(sizes), // An array of serializable values
      mapping: sizes,
      control: 'select',
      labels: {
        small: 'small',
        medium: 'medium',
        large: 'large',
        extralarge: 'extralarge'
      }
    },
    avatarState: { control: 'boolean', name: 'Avatar Online' }
  },
  args: {
    avatarState: true
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
