// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RichTextSendBox as RichTextSendBoxComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { RichTextSendBoxExample } from './snippets/RichTextSendBox.snippet';
import { RichTextSendBoxAttachmentUploadsExample } from './snippets/RichTextSendBoxAttachmentUploads.snippet';
import { RichTextSendBoxOnPasteCallbackExample } from './snippets/RichTextSendBoxOnPasteCallback.snippet';
import { RichTextSendBoxWithInlineImagesExample } from './snippets/RichTextSendBoxWithInlineImages.snippet';
import { RichTextSendBoxWithSystemMessageExample } from './snippets/RichTextSendBoxWithSystemMessage.snippet';

export { RichTextSendBox } from './RichTextSendBox.story';

export const RichTextSendBoxSnippetDocsOnly = {
  render: RichTextSendBoxExample
};

export const RichTextSendBoxAttachmentUploadsSnippetDocsOnly = {
  render: RichTextSendBoxAttachmentUploadsExample
};

export const RichTextSendBoxOnPasteCallbackSnippetDocsOnly = {
  render: RichTextSendBoxOnPasteCallbackExample
};

export const RichTextSendBoxWithInlineImagesSnippetDocsOnly = {
  render: RichTextSendBoxWithInlineImagesExample
};

export const RichTextSendBoxWithSystemMessageSnippetDocsOnly = {
  render: RichTextSendBoxWithSystemMessageExample
};

const meta: Meta = {
  title: 'Components/SendBox/Rich Text Send Box',
  component: RichTextSendBoxComponent,
  argTypes: {
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    hasAttachments: controlsToAdd.isSendBoxWithAttachments,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
    strings: hiddenControl,
    onRenderAttachmentUploads: hiddenControl,
    attachments: hiddenControl,
    onCancelAttachmentUpload: hiddenControl,
    onSendMessage: hiddenControl,
    onTyping: hiddenControl,
    onPaste: hiddenControl,
    inlineImagesWithProgress: hiddenControl,
    onInsertInlineImage: hiddenControl,
    onRemoveInlineImage: hiddenControl,
    autoFocus: hiddenControl
  },
  args: {
    disabled: false,
    hasWarning: false,
    hasAttachments: false
  }
};

export default meta;
