// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { _ErrorBoundary, RichTextSendBoxProps } from '@internal/react-components';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';

/* @conditional-compile-remove(rich-text-editor-composite-support) */
const RichTextSendBox = React.lazy(() =>
  import('@internal/react-components').then((module) => ({ default: module.RichTextSendBox }))
);

/**
 * @private
 * Use this function to load RoosterJS dependencies early in the lifecycle.
 * It should be the same import as used for lazy loading.
 *
/* @conditional-compile-remove(rich-text-editor-composite-support)
 */
export const loadRichTextSendBox = (): Promise<{
  default: React.ComponentType<RichTextSendBoxProps>;
}> => import('@internal/react-components').then((module) => ({ default: module.RichTextSendBox }));

/**
 * @private
 */
export type SendBoxPickerProps = {
  styles?: SendBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  onSendMessage: (
    content: string,
    /* @conditional-compile-remove(attachment-upload) */ options?: MessageOptions
  ) => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  richTextEditor?: boolean;
  /* @conditional-compile-remove(attachment-upload) */
  attachments?: AttachmentMetadataInProgress[];
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
    /* @conditional-compile-remove(attachment-upload) */
    attachments,
    /* @conditional-compile-remove(attachment-upload) */
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
        onSendMessage={props.onSendMessage}
        autoFocus={autoFocus}
        styles={sendBoxStyles}
        /* @conditional-compile-remove(attachment-upload) */
        attachments={attachments}
        /* @conditional-compile-remove(attachment-upload) */
        onCancelAttachmentUpload={onCancelAttachmentUpload}
      />
    ),
    [
      /* @conditional-compile-remove(attachment-upload) */ attachments,
      autoFocus,
      /* @conditional-compile-remove(attachment-upload) */ onCancelAttachmentUpload,
      props.onSendMessage,
      sendBoxProps,
      sendBoxStyles
    ]
  );

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  if (isRichTextEditorEnabled) {
    return (
      <_ErrorBoundary fallback={sendBox}>
        <Suspense fallback={sendBox}>
          <RichTextSendBox
            {...sendBoxProps}
            onSendMessage={props.onSendMessage}
            autoFocus={autoFocus}
            /* @conditional-compile-remove(attachment-upload) */
            attachments={attachments}
            /* @conditional-compile-remove(attachment-upload) */
            onCancelAttachmentUpload={onCancelAttachmentUpload}
          />
        </Suspense>
      </_ErrorBoundary>
    );
  }
  return sendBox;
};
