// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor) */
import React from 'react';
/* @conditional-compile-remove(rich-text-editor) */
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextSendBox } from '@internal/react-components';

/* @conditional-compile-remove(rich-text-editor) */
/**
 * @private
 *
 * Wrapper for RichTextSendBox component to allow us to use usePropsFor with richTextSendBox
 * before lazyLoading is done
 */
export const RichTextSendBoxWrapper = (): JSX.Element => {
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  return <RichTextSendBox {...richTextSendBoxProps} />;
};
