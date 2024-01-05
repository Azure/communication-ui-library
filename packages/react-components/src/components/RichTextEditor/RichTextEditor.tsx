// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';
import {
  Rooster,
  createRibbonPlugin,
  createUpdateContentPlugin,
  Ribbon,
  RibbonButton,
  getButtons,
  KnownRibbonButtonKey,
  UpdateMode
} from 'roosterjs-react';

export interface RichTextEditorProps {
  content?: string;
  'data-ui-id'?: string;
  onChange: (newValue?: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  children: React.ReactNode;
  placeholderText?: string;
}
export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { onChange, children, placeholderText } = props;
  const editor = React.useRef<IEditor | null>(null);
  const ribbonPlugin = React.useMemo(() => createRibbonPlugin(), []);
//   const editorRef = React.useRef<HTMLInputElement>(null);


  const onRenderRibbon = function() {
    const buttons = getButtons([
      KnownRibbonButtonKey.Bold,
      KnownRibbonButtonKey.Italic,
      KnownRibbonButtonKey.BulletedList,
      KnownRibbonButtonKey.TextColor,
      KnownRibbonButtonKey.FontSize,
      KnownRibbonButtonKey.InsertLink
    ]);

    return (
      <div>
        <Ribbon buttons={buttons as RibbonButton<string>[]} plugin={ribbonPlugin} />
        <div style={{ flex: 1 }} />
        {children}
      </div>
    );
  }
    const defaultEditorCreator = function (div: HTMLDivElement, onChange: (text: string) => void): IEditor {
      const updateContentPlugin = createUpdateContentPlugin(
        UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
        (content: string) => {
          onChange(content);
        }
      );
      const contentEdit = new ContentEdit();
      const placeholderPlugin = new Watermark(placeholderText || '');
      const options: EditorOptions = {
        plugins: [ribbonPlugin, placeholderPlugin, contentEdit, updateContentPlugin],
        imageSelectionBorderColor: 'blue'
      };
      editor.current = new Editor(div, options);
      return editor.current;
    };

  const editorCreator = React.useMemo(() => {
    return (div: HTMLDivElement, options: EditorOptions) => {
      return defaultEditorCreator(div, onChange);
    };
  }, [onChange]);

  return (
    <div>
      <Rooster
        plugins={[ribbonPlugin]}
        editorCreator={editorCreator}
      />
      {onRenderRibbon()}
    </div>
  );


};

