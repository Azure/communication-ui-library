// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '../../../types';
import { MessageThreadStrings } from '../../MessageThread';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../../MentionPopover';
import type { ChatMessageComponentAsRichTextEditBoxProps } from './ChatMessageComponentAsRichTextEditBox';

/* @conditional-compile-remove(rich-text-editor) */
const ChatMessageComponentAsRichTextEditBox = React.lazy(() => import('./ChatMessageComponentAsRichTextEditBox'));

/**
 * @private
 * Use this function to load RoosterJS dependencies early in the lifecycle.
 * It should be the same import as used for lazy loading.
 */
export const loadChatMessageComponentAsRichTextEditBox = (): Promise<{
  default: React.ComponentType<ChatMessageComponentAsRichTextEditBoxProps>;
}> => import('./ChatMessageComponentAsRichTextEditBox');

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

  const simpleEditBox = useMemo(() => {
    return <ChatMessageComponentAsEditBox {...props} />;
  }, [props]);

  /* @conditional-compile-remove(rich-text-editor) */
  if (richTextEditor) {
    return (
      <Suspense fallback={simpleEditBox}>
        <ChatMessageComponentAsRichTextEditBox {...props} />
      </Suspense>
    );
  }

  return simpleEditBox;
};
