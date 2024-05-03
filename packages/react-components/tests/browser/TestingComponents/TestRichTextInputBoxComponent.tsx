// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useRef } from 'react';
import { RichTextInputBoxComponent } from '../../../src/components/RichTextEditor/RichTextInputBoxComponent';
import { RichTextEditorComponentRef } from '../../../src/components/RichTextEditor/RichTextEditor';

interface TestRichTextInputBoxComponentProps {
  minHeight: string;
  maxHeight: string;
  disabled: boolean;
}

/**
 * @private
 */
export const TestRichTextInputBoxComponent = (props: TestRichTextInputBoxComponentProps): JSX.Element => {
  const { disabled, minHeight, maxHeight } = props;
  const ref = useRef<RichTextEditorComponentRef>(null);
  return (
    <RichTextInputBoxComponent
      onChange={() => {}}
      strings={{}}
      disabled={disabled}
      placeholderText="Placeholder"
      actionComponents={<button>Test</button>}
      richTextEditorStyleProps={() => {
        return { minHeight, maxHeight };
      }}
      editorComponentRef={ref}
    />
  );
};
