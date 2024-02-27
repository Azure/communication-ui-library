// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RTESendBox';

/**
 * @private
 */
export interface RTEInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RTEInputBoxComponentProps {
  placeholderText?: string;
  content: string;
  onChange: (newValue?: string) => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
}

/**
 * @private
 */
export const RTEInputBoxComponent = (props: RTEInputBoxComponentProps): JSX.Element => {
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
