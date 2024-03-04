// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextSendBox } from '@internal/react-components';
/**
 * @private
 *
 * Wrapper for RichTextSendBox component to allow us to use usePropsFor with richTextSendBox
 * before lazyLoading is done
 */
export const RichTextSendBoxWrapper = (): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor) */
  const richTextSendBoxProps = usePropsFor(RichTextSendBox);

  return <RichTextSendBox {...richTextSendBoxProps} />;
};
