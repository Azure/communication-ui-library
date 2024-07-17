// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
import { MessageThreadStrings } from '../../MessageThread';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextEditBoxOptions } from '../../MessageThread';
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
  richTextEditorOptions?: RichTextEditBoxOptions;
};

/**
 * @private
 */
export const ChatMessageComponentAsEditBoxPicker = (props: ChatMessageComponentAsEditBoxPickerProps): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor) */
  const { richTextEditorOptions } = props;

  const simpleEditBox = useMemo(() => {
    return <ChatMessageComponentAsEditBox {...props} />;
  }, [props]);

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const imageUploadsInProgressForMessage = useMemo(() => {
    const messageId = props.message.messageId;
    if (!richTextEditorOptions?.imageUploadsInProgress || !messageId) {
      return;
    }
    if (!richTextEditorOptions.imageUploadsInProgress || !messageId) {
      return;
    }
    return richTextEditorOptions.imageUploadsInProgress[messageId];
  }, [richTextEditorOptions?.imageUploadsInProgress, props.message.messageId]);

  /* @conditional-compile-remove(rich-text-editor) */
  if (richTextEditorOptions) {
    return (
      <_ErrorBoundary fallback={simpleEditBox}>
        <Suspense fallback={simpleEditBox}>
          <ChatMessageComponentAsRichTextEditBox
            {...props}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onPaste={richTextEditorOptions?.onPaste}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onUploadInlineImage={richTextEditorOptions?.onUploadInlineImage}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            imageUploadsInProgress={imageUploadsInProgressForMessage}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onCancelInlineImageUpload={richTextEditorOptions?.onCancelInlineImageUpload}
          />
        </Suspense>
      </_ErrorBoundary>
    );
  }

  return simpleEditBox;
};
