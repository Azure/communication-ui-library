// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextEditorOptions } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { _ErrorBoundary, RichTextSendBoxProps } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';

/* @conditional-compile-remove(rich-text-editor-composite-support) */
/**
 * Wrapper for RichTextSendBox component to allow us to use usePropsFor with richTextSendBox with lazy loading
 */
const RichTextSendBoxWrapper = React.lazy(() =>
  import('./RichTextSendBoxWrapper').then((module) => ({ default: module.RichTextSendBoxWrapper }))
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
}> => import('./RichTextSendBoxWrapper').then((module) => ({ default: module.RichTextSendBoxWrapper }));

/**
 * @private
 */
export type SendBoxPickerProps = {
  styles?: SendBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  onSendMessage: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */ options?: MessageOptions
  ) => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  richTextEditorOptions?: RichTextEditorOptions;
  /* @conditional-compile-remove(file-sharing-acs) */
  attachments?: AttachmentMetadataInProgress[];
  /* @conditional-compile-remove(file-sharing-acs) */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onUploadImage?: (imageUrl: string, imageFileName: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  imageUploadsInProgress?: AttachmentMetadataInProgress[];
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onCancelInlineImageUpload?: (imageId: string) => void;
};

/**
 * @private
 */
export const SendBoxPicker = (props: SendBoxPickerProps): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const { richTextEditorOptions } = props;

  const sendBoxProps = usePropsFor(SendBox);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const isRichTextEditorEnabled = useMemo(() => {
    return richTextEditorOptions !== undefined;
  }, [richTextEditorOptions]);

  const sendBox = useMemo(() => <SendBox {...sendBoxProps} {...props} />, [props, sendBoxProps]);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  if (isRichTextEditorEnabled) {
    return (
      <_ErrorBoundary fallback={sendBox}>
        <Suspense fallback={sendBox}>
          <RichTextSendBoxWrapper {...props} />
        </Suspense>
      </_ErrorBoundary>
    );
  }
  return sendBox;
};
