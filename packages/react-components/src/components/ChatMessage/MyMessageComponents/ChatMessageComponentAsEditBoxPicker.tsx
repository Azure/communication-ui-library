// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { MessageThreadStrings, RichTextEditorOptions } from '../../MessageThread';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../../MentionPopover';
/* @conditional-compile-remove(rich-text-editor) */
import type { ChatMessageComponentAsRichTextEditBoxProps } from './ChatMessageComponentAsRichTextEditBox';
/* @conditional-compile-remove(rich-text-editor) */
import { _ErrorBoundary } from '../../ErrorBoundary';

/* @conditional-compile-remove(rich-text-editor) */
const ChatMessageComponentAsRichTextEditBox = React.lazy(() => import('./ChatMessageComponentAsRichTextEditBox'));

/**
 * @private
 * Use this function to load RoosterJS dependencies early in the lifecycle.
 * It should be the same import as used for lazy loading.
 *
 * @conditional-compile-remove(rich-text-editor)
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
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    attachmentMetadata?: AttachmentMetadata[]
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
  /* @conditional-compile-remove(rich-text-editor) */
  richTextEditor?: boolean | /* @conditional-compile-remove(rich-text-editor-image-upload) */ RichTextEditorOptions;
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

  const disableInlineImages = useMemo(() => {
    // If richTextEditor is an object, use the disableInlineImages property.
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (isRichTextEditorOptions(richTextEditor)) {
      return richTextEditor.disableInlineImages === undefined ? false : richTextEditor.disableInlineImages;
    }

    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    return false;

    return true;
  }, [
    /* @conditional-compile-remove(rich-text-editor-image-upload) @conditional-compile-remove(rich-text-editor) */ richTextEditor
  ]);

  /* @conditional-compile-remove(rich-text-editor) */
  if (richTextEditor) {
    return (
      <_ErrorBoundary fallback={simpleEditBox}>
        <Suspense fallback={simpleEditBox}>
          <ChatMessageComponentAsRichTextEditBox {...props} disableInlineImages={disableInlineImages} />
        </Suspense>
      </_ErrorBoundary>
    );
  }

  return simpleEditBox;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRichTextEditorOptions(obj: any): obj is RichTextEditorOptions {
  return obj && typeof obj === 'object' && 'disableInlineImages' in obj;
}
