// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { _ErrorBoundary, RichTextSendBoxProps, RichTextEditorOptions } from '@internal/react-components';
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

/* @conditional-compile-remove(rich-text-editor) */
/**
 * Options for the rich text editor send box configuration.
 *
 * @internal
 */
export interface RichTextSendBoxOptions extends RichTextEditorOptions {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle an inline image that's inserted in the rich text editor.
   * When not provided, pasting images into rich text editor will be disabled.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name']
   */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback invoked after inline image is removed from the UI.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name'].
   *        Note that if the src attribute is a local blob url, it has been revoked at this point.
   */
  onRemoveInlineImage?: (imageAttributes: Record<string, string>) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional Array of type {@link AttachmentMetadataInProgress}
   * to render the errorBar for inline images inserted in the RichTextSendBox when:
   *   - there is an error provided in the inlineImagesWithProgress
   *   - progress is less than 1 when the send button is clicked
   *   - content html string is longer than the max allowed length.
   *     (Note that the id and the url prop of the inlineImagesWithProgress will be used as the id and src attribute of the content html
   *     when calculating the content length, only for the purpose of displaying the content length overflow error.)
   */
  inlineImagesWithProgress?: AttachmentMetadataInProgress[];
}
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
  richTextEditorOptions?: RichTextSendBoxOptions;
  /* @conditional-compile-remove(file-sharing-acs) */
  attachments?: AttachmentMetadataInProgress[];
  /* @conditional-compile-remove(file-sharing-acs) */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
};

/**
 * @private
 */
export const SendBoxPicker = (props: SendBoxPickerProps): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const { richTextEditorOptions } = props;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const { onPaste, onInsertInlineImage, inlineImagesWithProgress, onRemoveInlineImage } = richTextEditorOptions || {};

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
          <RichTextSendBoxWrapper
            {...props}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onPaste={onPaste}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onInsertInlineImage={onInsertInlineImage}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            inlineImagesWithProgress={inlineImagesWithProgress}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onRemoveInlineImage={onRemoveInlineImage}
          />
        </Suspense>
      </_ErrorBoundary>
    );
  }
  return sendBox;
};
