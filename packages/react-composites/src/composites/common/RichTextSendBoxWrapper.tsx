// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-composite-support) */
import React from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextSendBox, RichTextSendBoxProps } from '@internal/react-components';

/* @conditional-compile-remove(rich-text-editor-composite-support) */
/**
 * @private
 *
 * Wrapper for RichTextSendBox component to allow us to use usePropsFor with richTextSendBox
 * before lazyLoading is done
 */
export const RichTextSendBoxWrapper = (props: RichTextSendBoxProps): JSX.Element => {
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  return <RichTextSendBox {...richTextSendBoxProps} {...props} />;
};
