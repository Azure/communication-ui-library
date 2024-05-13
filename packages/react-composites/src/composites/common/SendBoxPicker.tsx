// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadataWithProgress } from '@internal/react-components';

// TODO: Improve lazy loading
const RichTextSendBox = React.lazy(() =>
  import('@internal/react-components').then((module) => ({ default: module.RichTextSendBox }))
);

/**
 * @private
 */
export type SendBoxPickerProps = {
  styles?: SendBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  richTextEditor?: boolean;
  /* @conditional-compile-remove(attachment-upload) */
  attachmentsWithProgress?: AttachmentMetadataWithProgress[];
  /* @conditional-compile-remove(attachment-upload) */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
};

/**
 * @private
 */
export const SendBoxPicker = (props: SendBoxPickerProps): JSX.Element => {
  const {
    styles,
    autoFocus,
    /* @conditional-compile-remove(rich-text-editor-composite-support) */
    richTextEditor,
    /* @conditional-compile-remove(file-sharing) */
    attachmentsWithProgress,
    /* @conditional-compile-remove(file-sharing) */
    onCancelAttachmentUpload
  } = props;

  const sendBoxProps = usePropsFor(SendBox);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const isRichTextEditorEnabled = useMemo(() => {
    return richTextEditor;
  }, [richTextEditor]);

  const sendBoxStyles = useMemo(() => {
    return styles;
  }, [styles]);

  const sendBox = useMemo(
    () => (
      <SendBox
        {...sendBoxProps}
        autoFocus={autoFocus}
        styles={sendBoxStyles}
        /* @conditional-compile-remove(attachment-upload) */
        attachmentsWithProgress={attachmentsWithProgress}
        /* @conditional-compile-remove(attachment-upload) */
        onCancelAttachmentUpload={onCancelAttachmentUpload}
      />
    ),
    [attachmentsWithProgress, autoFocus, onCancelAttachmentUpload, sendBoxProps, sendBoxStyles]
  );

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  if (isRichTextEditorEnabled) {
    return (
      <Suspense fallback={sendBox}>
        <RichTextSendBox
          {...sendBoxProps}
          onSendMessage={(content) => {
            return sendBoxProps.onSendMessage(content, { type: 'html' });
          }}
          autoFocus={autoFocus}
          /* @conditional-compile-remove(attachment-upload) */
          attachmentsWithProgress={attachmentsWithProgress}
          /* @conditional-compile-remove(attachment-upload) */
          onCancelAttachmentUpload={onCancelAttachmentUpload}
        />
      </Suspense>
    );
  }
  return sendBox;
};
