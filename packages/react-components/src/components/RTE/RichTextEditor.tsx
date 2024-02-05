// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';
import { Rooster, createUpdateContentPlugin, UpdateMode } from 'roosterjs-react';
import { richTextEditorStyle } from '../styles/RichTextEditor.styles';
/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorProps {
  content?: string;
  onChange: (newValue?: string) => void;
  placeholderText?: string;
}

/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorComponentRef {
  focus: () => void;
}

/**
 * A component to wrap RoosterJS Rich Text Editor.
 *
 * @beta
 */
export const RichTextEditor = React.forwardRef<RichTextEditorComponentRef, RichTextEditorProps>((props, ref) => {
  const { content, onChange, placeholderText } = props;
  const editor = useRef<IEditor | null>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          if (editor.current) {
            editor.current.focus();
          }
        }
      };
    },
    []
  );

  useEffect(() => {
    if (content !== editor.current?.getContent()) {
      editor.current?.setContent(content || '');
    }
  }, [content]);

  const editorCreator = useMemo(() => {
    return (div: HTMLDivElement) => {
      const contentEdit = new ContentEdit();
      const placeholderPlugin = new Watermark(placeholderText || '');
      const updateContentPlugin = createUpdateContentPlugin(
        UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
        (content: string) => {
          onChange && onChange(content);
        }
      );

      const options: EditorOptions = {
        plugins: [placeholderPlugin, contentEdit, updateContentPlugin],
        imageSelectionBorderColor: 'blue'
      };

      editor.current = new Editor(div, options);
      return editor.current;
    };
  }, [onChange, placeholderText]);

  return (
    <div>
      <Rooster className={richTextEditorStyle} editorCreator={editorCreator} />
    </div>
  );
});
