// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Component that chooses either the SendBox or the RichTextSendBox based on if RichTextEditor is enabled

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
import { ChatCompositeOptions } from '../ChatComposite';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(file-sharing) */
import { ChatAdapter } from '../ChatComposite';
/* @conditional-compile-remove(file-sharing) */
import { useSelector } from '../ChatComposite/hooks/useSelector';

// TODO: Improve Lazy Loading
/* @condition-compile-remove(rich-text-editor-composite-support) */
const richTextSendBox = React.lazy(() =>
  import('./rich-text-editor/RichTextSendBox').then((module) => ({ default: module.RichTextSendBox }))
);

/**
 * @private
 */
export type SendBoxPickerProps = {
  options?: ChatCompositeOptions;
  styles?: SendBoxStylesProps;
  /* @conditional-compile-remove(file-sharing) */
  adapter: ChatAdapter;
};

/**
 * @private
 */
export const SendBoxPicker = (props: SendBoxPickerProps): JSX.Element => {
  const {
    options,
    styles,
    /* @conditional-compile-remove(file-sharing) */
    adapter
  } = props;

  const sendBoxProps = usePropsFor(SendBox);

  const isRichTextEditorEnabled = useMemo(() => {
    return options?.richTextEditor;
  }, [options]);

  const sendBoxStyles = useMemo(() => {
    return styles;
  }, [styles]);

  const sendBox = useMemo(
    () => (
      <SendBox
        {...sendBoxProps}
        styles={sendBoxStyles}
        //TODO: add file upload
      />
    ),
    [sendBoxProps, sendBoxStyles]
  );

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  if (isRichTextEditorEnabled) {
    return (
      <Suspense fallback={sendBox}>
        <RichTextSendBox adapter={adapter} options={options} styles={sendBoxStyles} />
      </Suspense>
    );
  }
};
