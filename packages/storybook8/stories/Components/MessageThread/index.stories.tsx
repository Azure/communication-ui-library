// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';

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
const meta: Meta = {
  title: 'Components/Message Thread',
  component: MessageThreadComponent,
  argTypes: {
    showMessageDate: controlsToAdd.showMessageDate,
    showMessageStatus: controlsToAdd.showMessageStatus,
    enableJumpToNewMessageButton: controlsToAdd.enableJumpToNewMessageButton,
    richTextEditor: controlsToAdd.richTextEditor,
    // Hiding auto-generated controls
    richTextEditorOptions: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl,
    userId: hiddenControl,
    messages: hiddenControl,
    disableJumpToNewMessageButton: hiddenControl,
    numberOfChatMessagesToReload: hiddenControl,
    onMessageSeen: hiddenControl,
    onRenderMessageStatus: hiddenControl,
    onRenderAvatar: hiddenControl,
    onRenderJumpToNewMessageButton: hiddenControl,
    onLoadPreviousChatMessages: hiddenControl,
    onRenderMessage: hiddenControl,
    onUpdateMessage: hiddenControl,
    onDeleteMessage: hiddenControl,
    disableEditing: hiddenControl,
    // hide unnecessary props since we "send message with attachments" option
    onRenderAttachmentDownloads: hiddenControl,
    attachmentOptions: hiddenControl,
    onSendMessage: hiddenControl
  },
  args: {
    showMessageDate: true,
    showMessageStatus: true,
    enableJumpToNewMessageButton: true
  }
};

export default meta;
