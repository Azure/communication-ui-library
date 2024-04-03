// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBoxStylesProps, SendBox as SimpleSendBox } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
import { ChatCompositeOptions } from '../ChatComposite';
/* @conditional-compile-remove(rich-text-editor) */
import { Suspense } from 'react';
/* @conditional-compile-remove(attachment-upload) */
import { ChatAdapter } from '../ChatComposite';
/* @conditional-compile-remove(attachment-upload) */
import { attachmentUploadsSelector } from '../ChatComposite/selectors/attachmentUploadsSelector';
/* @conditional-compile-remove(attachment-upload) */
import { useSelector } from '../ChatComposite/hooks/useSelector';

/* @conditional-compile-remove(rich-text-editor) */
const RichTextSendBoxWrapper = React.lazy(() =>
  import('./RichTextSendBoxWrapper').then((module) => ({ default: module.RichTextSendBoxWrapper }))
);

/**
 * @private
 */
export type SendBoxProps = {
  options?: ChatCompositeOptions;
  styles?: SendBoxStylesProps;
  /* @conditional-compile-remove(attachment-upload) */
  adapter: ChatAdapter;
};

/**
 * @private
 */
export const SendBox = (props: SendBoxProps): JSX.Element => {
  const {
    options,
    styles,
    /* @conditional-compile-remove(attachment-upload) */
    adapter
  } = props;

  const sendBoxProps = usePropsFor(SimpleSendBox);

  /* @conditional-compile-remove(attachment-upload) */
  const activeAttachmentUploads = useSelector(attachmentUploadsSelector).attachments;

  const sendBoxStyles = useMemo(() => {
    return Object.assign({}, styles);
  }, [styles]);

  const simpleSendBox = useMemo(
    () => (
      <SimpleSendBox
        {...sendBoxProps}
        autoFocus={options?.autoFocus}
        styles={sendBoxStyles}
        /* @conditional-compile-remove(attachment-upload) */
        activeAttachmentUploads={activeAttachmentUploads}
        /* @conditional-compile-remove(attachment-upload) */
        onCancelAttachmentUpload={adapter.cancelUpload}
      />
    ),
    [
      sendBoxProps,
      options,
      sendBoxStyles,
      /* @conditional-compile-remove(attachment-upload) */ activeAttachmentUploads,
      /* @conditional-compile-remove(attachment-upload) */ adapter
    ]
  );

  // /* @conditional-compile-remove(rich-text-editor) */
  if (options?.richTextEditor === true) {
    return (
      <Suspense fallback={simpleSendBox}>
        <RichTextSendBoxWrapper />
      </Suspense>
    );
  }
  return simpleSendBox;
};
