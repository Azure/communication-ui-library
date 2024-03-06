// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, mergeStyles } from '@fluentui/react';
import { editorTextBoxButtonStyle } from './SendBox.styles';

/**
 * @private
 */
export const editBoxStyle = mergeStyles({
  marginTop: '0.0875rem',
  marginBottom: '0.0875rem'
});

/**
 * @private
 */
export const editingButtonStyle = mergeStyles({
  margin: '0',
  width: '2.125rem',
  height: '2.125rem',
  padding: '0.375rem 0 0 0'
});

/**
 * @private
 */
export const inputBoxIcon = mergeStyles({
  margin: 'auto',
  '&:hover svg': {
    stroke: 'currentColor'
  }
});
/**
 * @private
 */
export const richTextEditBoxActionButtonIcon = mergeStyles(editorTextBoxButtonStyle, {
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

/**
 * @private
 */
export const editBoxWidthStyles: IStyle = {
  minWidth: '6.25rem',
  maxWidth: '100%'
};

/**
 * @private
 */
export const editBoxStyleSet = {
  root: editBoxWidthStyles
};
