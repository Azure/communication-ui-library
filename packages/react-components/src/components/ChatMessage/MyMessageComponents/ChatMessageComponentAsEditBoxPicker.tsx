// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '../../../types';
import { MessageThreadStrings } from '../../MessageThread';
import { ChatMessageComponentAsEditBox } from '../ChatMessageComponentAsEditBox';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../../MentionPopover';

/* @conditional-compile-remove(rich-text-editor) */
const ChatMessageComponentAsRichTextEditBox = React.lazy(() =>
  import('../ChatMessageComponentAsRichTextEditBox').then((module) => ({
    default: module.ChatMessageComponentAsRichTextEditBox
  }))
);

/**
 * @private
 */
export type ChatMessageComponentAsEditBoxPickerProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      attachmentMetadata?: AttachmentMetadata[];
    }
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
  richTextEditor?: boolean;
};

/**
 * @private
 */
export const ChatMessageComponentAsEditBoxPicker = (props: ChatMessageComponentAsEditBoxPickerProps): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor) */
  const { richTextEditor } = props;

  /* @conditional-compile-remove(rich-text-editor) */
  if (richTextEditor) {
    return (
      <Suspense>
        <ChatMessageComponentAsRichTextEditBox {...props} />
      </Suspense>
    );
  }

  return <ChatMessageComponentAsEditBox {...props} />;
};
