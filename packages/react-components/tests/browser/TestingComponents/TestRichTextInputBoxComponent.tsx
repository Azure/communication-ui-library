// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useRef } from 'react';
import { RichTextInputBoxComponent } from '../../../src/components/RichTextEditor/RichTextInputBoxComponent';
import { RichTextEditorComponentRef } from '../../../src/components/RichTextEditor/RichTextEditor';
import { useLocale } from '../../../src/localization';

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
  const locale = useLocale();
  return (
    <RichTextInputBoxComponent
      onChange={() => {}}
      strings={locale.strings.richTextSendBox}
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
