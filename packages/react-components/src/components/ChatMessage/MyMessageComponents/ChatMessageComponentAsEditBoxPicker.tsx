// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { MessageThreadStrings } from '../../MessageThread';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextEditorOptions } from '../../MessageThread';
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
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
    attachmentMetadata?: AttachmentMetadata[]
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
  /* @conditional-compile-remove(rich-text-editor) */
  richTextEditor?: RichTextEditorOptions;
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
      <_ErrorBoundary fallback={simpleEditBox}>
        <Suspense fallback={simpleEditBox}>
          <ChatMessageComponentAsRichTextEditBox
            {...props}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onPaste={richTextEditor?.onPaste}
          />
        </Suspense>
      </_ErrorBoundary>
    );
  }

  return simpleEditBox;
};
