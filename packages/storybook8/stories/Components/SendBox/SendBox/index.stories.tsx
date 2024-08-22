// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SendBox as SendBoxComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';

import { AttachmentUploadsExample } from './snippets/AttachmentUploads.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { CustomStylingExample } from './snippets/CustomStyling.snippet';
import { MentionsExample } from './snippets/Mentions.snippet';
import { SendBoxExample } from './snippets/SendBox.snippet';
import { SendBoxWithSystemMessageExample } from './snippets/SendBoxWithSystemMessage.snippet';
export { SendBox } from './SendBox.story';

export const AttachmentUploadsExampleDocsOnly = {
  render: AttachmentUploadsExample
};
export const CustomIconExampleDocsOnly = {
  render: CustomIconExample
};

export const CustomStylingExampleDocsOnly = {
  render: CustomStylingExample
};

export const MentionsExampleDocsOnly = {
  render: MentionsExample
};

export const SendBoxExampleDocsOnly = {
  render: SendBoxExample
};

export const SendBoxWithSystemMessageExampleDocsOnly = {
  render: SendBoxWithSystemMessageExample
};

const meta: Meta = {
  title: 'Components/SendBox/Send Box',
  component: SendBoxComponent,
  argTypes: {
    attachments: hiddenControl,
    onCancelAttachmentUpload: hiddenControl,
    onRenderAttachmentUploads: hiddenControl,
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
    hasAttachments: controlsToAdd.isSendBoxWithAttachments,
    systemMessage: hiddenControl,
    onSendMessage: hiddenControl,
    onTyping: hiddenControl,
    onRenderSystemMessage: hiddenControl,
    supportNewline: hiddenControl,
    onRenderIcon: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl
  },
  args: {
    disabled: false,
    hasWarning: false,
    hasAttachments: false,
    warningMessage: 'Please wait 30 seconds to send new messages'
  }
} as Meta<typeof SendBoxComponent>;

export default meta;
