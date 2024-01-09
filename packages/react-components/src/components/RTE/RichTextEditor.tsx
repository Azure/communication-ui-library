// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';
import {
  Rooster,
  createRibbonPlugin,
  createUpdateContentPlugin,
  Ribbon,
  getButtons,
  RibbonButton,
  KnownRibbonButtonKey,
  UpdateMode
} from 'roosterjs-react';
import { richTextEditorStyle } from '../styles/RichTextEditor.styles';

/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorProps {
  content?: string;
  onChange: (newValue?: string) => void;
  children: React.ReactNode;
  placeholderText?: string;
}

/**
 * A component to wrap RoosterJS Rich Text Editor.
 *
 * @beta
 */
export const RichTextEditor = (props: RichTextEditorProps): JSX.Element => {
  const { content, onChange, children, placeholderText } = props;
  const editor = useRef<IEditor | null>(null);
  const ribbonPlugin = useMemo(() => createRibbonPlugin(), []);

  useEffect(() => {
    if (content !== editor.current?.getContent()) {
      editor.current?.setContent(content || '');
    }
  }, [content]);

  const onRenderRibbon = function (): JSX.Element {
    const buttons = getButtons([
      KnownRibbonButtonKey.Bold,
      KnownRibbonButtonKey.Italic,
      KnownRibbonButtonKey.BulletedList,
      KnownRibbonButtonKey.TextColor,
      KnownRibbonButtonKey.FontSize,
      KnownRibbonButtonKey.InsertLink
    ]);

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Ribbon buttons={buttons as RibbonButton<string>[]} plugin={ribbonPlugin} />
        <div style={{ flex: 1 }} />
        {children}
      </div>
    );
  };

  const editorCreator = React.useMemo(() => {
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
        plugins: [ribbonPlugin, placeholderPlugin, contentEdit, updateContentPlugin],
        imageSelectionBorderColor: 'blue'
      };

      editor.current = new Editor(div, options);
      return editor.current;
    };
  }, [onChange, placeholderText, ribbonPlugin]);

  return (
    <div>
      <Rooster plugins={[ribbonPlugin]} style={richTextEditorStyle} editorCreator={editorCreator} />
      {onRenderRibbon()}
    </div>
  );
};
