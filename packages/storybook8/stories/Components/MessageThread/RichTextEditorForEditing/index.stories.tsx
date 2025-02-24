// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThread as MessageThreadComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { messageThreadExcludeArguments } from '../utils';
import { MessageThreadWithRichTextEditorExample } from './snippets/WithRichTextEditor.snippet';
import { MessageThreadWithRichTextEditorInlineImagesExample } from './snippets/WithRichTextEditorInlineImages.snippet';
import { MessageThreadWithWithRichTextEditorOnPasteExample } from './snippets/WithRichTextEditorOnPaste.snippet';

// Main story
export { MessageThreadWithRichTextEditor } from './RichTextEditorForEditing.story';

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
  title: 'Components/Message Thread/Rich Text Editor Support',
  component: MessageThreadComponent,
  argTypes: {
    isEnableRTE: { control: 'boolean', name: 'Enable Rich Text Editor' }
  },
  args: {
    isEnableRTE: true
  },
  parameters: {
    controls: {
      exclude: messageThreadExcludeArguments.concat(['showMessageDate', 'showMessageStatus'])
    }
  }
};

export default meta;
