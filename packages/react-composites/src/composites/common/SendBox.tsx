// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBoxStylesProps, SendBox as SimpleSendBox } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
import { ChatCompositeOptions } from '../ChatComposite';
/* @conditional-compile-remove(rich-text-editor) */
// import { Suspense } from 'react';
/* @conditional-compile-remove(file-sharing) */
import { ChatAdapter } from '../ChatComposite';
/* @conditional-compile-remove(file-sharing) */
import { fileUploadsSelector } from '../ChatComposite/selectors/fileUploadsSelector';
/* @conditional-compile-remove(file-sharing) */
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
  /* @conditional-compile-remove(file-sharing) */
  adapter: ChatAdapter;
};

/**
 * @private
 */
export const SendBox = (props: SendBoxProps): JSX.Element => {
  const {
    options,
    styles,
    /* @conditional-compile-remove(file-sharing) */
    adapter
  } = props;

  const sendBoxProps = usePropsFor(SimpleSendBox);

  /* @conditional-compile-remove(file-sharing) */
  const activeFileUploads = useSelector(fileUploadsSelector).files;

  const sendBoxStyles = useMemo(() => {
    return Object.assign({}, styles);
  }, [styles]);

  const simpleSendBox = useMemo(
    () => (
      <SimpleSendBox
        {...sendBoxProps}
        autoFocus={options?.autoFocus}
        styles={sendBoxStyles}
        /* @conditional-compile-remove(file-sharing) */
        activeFileUploads={activeFileUploads}
        /* @conditional-compile-remove(file-sharing) */
        onCancelFileUpload={adapter.cancelFileUpload}
      />
    ),
    [
      sendBoxProps,
      options,
      sendBoxStyles,
      /* @conditional-compile-remove(file-sharing) */ activeFileUploads,
      /* @conditional-compile-remove(file-sharing) */ adapter
    ]
  );

  // /* @conditional-compile-remove(rich-text-editor) */
  if (options?.richTextEditor === true) {
    return <RichTextSendBoxWrapper />;
  }
  return simpleSendBox;
};
