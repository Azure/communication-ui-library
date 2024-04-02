// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor) */
import React, { Suspense } from 'react';
import { AttachmentMetadata, ChatMessage } from '../../../types';
import { MessageThreadStrings } from '../../MessageThread';
import { ChatMessageComponentAsEditBox } from '../ChatMessageComponentAsEditBox';
import { ChatMessageComponentAsRichTextEditBox } from '../ChatMessageComponentAsRichTextEditBox';
import { MentionLookupOptions } from '../../MentionPopover';

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

  if (enableRichTextEditor) {
    return (
      <Suspense>
        <ChatMessageComponentAsRichTextEditBox {...props} />
      </Suspense>
    );
  } else {
    return <ChatMessageComponentAsEditBox {...props} />;
  }
};
