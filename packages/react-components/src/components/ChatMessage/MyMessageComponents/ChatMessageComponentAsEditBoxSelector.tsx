// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor) */
import React, { Suspense } from 'react';
import { AttachmentMetadata, ChatMessage } from '../../../types';
import { MessageThreadStrings } from '../../MessageThread';
import { ChatMessageComponentAsEditBox } from '../ChatMessageComponentAsEditBox';
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
export type ChatMessageComponentAsEditBoxSelectorProps = {
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
  enableRichTextEditor: boolean;
};

/**
 * @private
 */
export const ChatMessageComponentAsEditBoxSelector = (
  props: ChatMessageComponentAsEditBoxSelectorProps
): JSX.Element => {
  const { enableRichTextEditor } = props;

  // /* @conditional-compile-remove(rich-text-editor) */
  if (enableRichTextEditor) {
    return (
      <Suspense>
        <ChatMessageComponentAsRichTextEditBox {...props} />
      </Suspense>
    );
  }

  return <ChatMessageComponentAsEditBox {...props} />;
};
