// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { borderAndBoxShadowStyle } from '../styles/SendBox.styles';
import { useTheme } from '../../theming';

/**
 * @private
 */
export interface RichTextInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RichTextInputBoxComponentProps {
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
export const RichTextInputBoxComponent = (props: RichTextInputBoxComponentProps): JSX.Element => {
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
