// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RTESendBox';
import { borderAndBoxShadowStyle } from '../styles/SendBox.styles';
import { useTheme } from '../../theming';

/**
 * @private
 */
export interface RTEInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RTEInputBoxComponentProps {
  placeholderText?: string;
  initialContent?: string;
  onChange: (newValue?: string) => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
  disabled: boolean;
}

/**
 * @private
 */
export const RTEInputBoxComponent = (props: RTEInputBoxComponentProps): JSX.Element => {
  const { placeholderText, initialContent, onChange, editorComponentRef, disabled } = props;
  const theme = useTheme();

  return (
    <div
      className={borderAndBoxShadowStyle({
        theme: theme,
        // should always be false as we don't want to show the border when there is an error
        hasErrorMessage: false,
        disabled: !!disabled
      })}
    >
      {/* File Upload */}
      <RichTextEditor
        initialContent={initialContent}
        placeholderText={placeholderText}
        onChange={onChange}
        ref={editorComponentRef}
        strings={props.strings}
      />
    </div>
  );
};
