// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-composite-support) */
import React from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Toggle } from '@fluentui/react';

/* @conditional-compile-remove(rich-text-editor-composite-support) */
export interface RichTextEditorToggleProps {
  setRichTextEditorIsEnabled(isEnabled: boolean): void;
}

/* @conditional-compile-remove(rich-text-editor-composite-support) */
export const RichTextEditorToggle = (props: RichTextEditorToggleProps): JSX.Element => {
  return (
    <Toggle
      label="Enable Rich Text Editor"
      onChange={(_, checked) => {
        props.setRichTextEditorIsEnabled(!!checked);
      }}
    />
  );
};
