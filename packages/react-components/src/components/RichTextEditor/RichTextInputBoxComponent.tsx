// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RichTextSendBox';

/**
 * @private
 */
export interface RichTextInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RichTextInputBoxComponentProps {
  placeholderText?: string;
  content: string;
  onChange: (newValue?: string) => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
}

/**
 * @private
 */
export const RichTextInputBoxComponent = (props: RichTextInputBoxComponentProps): JSX.Element => {
  const { placeholderText, content, onChange, editorComponentRef } = props;

  return (
    <div>
      <RichTextEditor
        content={content}
        placeholderText={placeholderText}
        onChange={onChange}
        ref={editorComponentRef}
        strings={props.strings}
      />
    </div>
  );
};
