// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { ContentEdit, Watermark, getAllFeatures } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import {
  EditorOptions,
  EditorPlugin,
  IEditor,
  ClearFormatMode,
  ContentEditFeatureSettings
} from 'roosterjs-editor-types';
import {
  Rooster,
  createRibbonPlugin,
  createPasteOptionPlugin,
  createUpdateContentPlugin,
  Ribbon,
  RibbonButton,
  getButtons,
  KnownRibbonButtonKey,
  OnContentChangedEvent,
  UpdateMode
} from 'roosterjs-react';
import { InputBoxButton } from '../InputBoxComponent';
import { IconButton, formProperties } from '@fluentui/react';
import { clearFormat as clearFormatApi, toggleBold } from 'roosterjs-editor-api';
import AtMentionPlugin from './Plugins/atMentionPlugin';
import { suggestions, trigger } from './Plugins/mentionLoopupData';

export interface RichTextEditorProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
  content?: string;
  onChange: (newValue?: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnterKeyDown?: () => void;
  mentionLookupOptions?: MentionLookupOptions;
  children: ReactNode;
}
const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { content, onChange, mentionLookupOptions, children } = props;
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<IEditor | null>(null);
  const ribbonPlugin = React.useMemo(() => createRibbonPlugin(), []);

  React.useEffect(() => {
    if (content != editor.current.getContent()) {
      editor.current.setContent(content || '');
    }
  }, [content]);

  function renderRibbon() {
    const buttons = getButtons([
      KnownRibbonButtonKey.Bold,
      KnownRibbonButtonKey.Italic,
      KnownRibbonButtonKey.InsertLink,
      KnownRibbonButtonKey.ClearFormat,
      KnownRibbonButtonKey.Undo,
      KnownRibbonButtonKey.Redo
    ]);

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Ribbon buttons={buttons} plugin={ribbonPlugin} />
        <div style={{ flex: 1 }} />
        {children()}
      </div>
    );
  }
  const editorCreator = React.useMemo(() => {
    return (div: HTMLDivElement, options: EditorOptions) => {
      defaultEditorCreator(div, onChange);
    };
  }, [onChange]);

  return (
    <div>
      <Rooster plugins={[ribbonPlugin]} style={editorStyle} editorCreator={editorCreator} />
      {renderRibbon()}
    </div>
  );

  function defaultEditorCreator(div: HTMLDivElement, onChange: (text: string) => void): IEditor {
    const updateContentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
      (content: String) => {
        onChange(content);
      }
    );

    const atMentionPluginInstance = new AtMentionPlugin(mentionLookupOptions);
    const contentEdit = new ContentEdit();
    const options: EditorOptions = {
      plugins: [
        ribbonPlugin,
        atMentionPluginInstance.Picker,
        getWaterMarkPlugin(),
        getContentEdit(),
        updateContentPlugin
      ]
    };
    editor.current = new Editor(div, options);
    return editor.current;
  }

  function getWaterMarkPlugin(): EditorPlugin {
    return new Watermark('Placeholder string');
  }

  function getContentEdit(): EditorPlugin {
    return new ContentEdit();
  }
};

const editorStyle = {
  border: 'none',
  overflow: 'auto',
  padding: '10px',
  outline: 'none',
  // position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
  bottom: '0',
  minHeight: '2.25rem',
  maxHeight: '8.25rem'
};

export default RichTextEditor; //= React.useMemo(RichTextEditor, [RichTextEditor];
