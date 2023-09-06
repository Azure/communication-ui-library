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
  RibbonPlugin,
  createPasteOptionPlugin,
  createEmojiPlugin,
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
import EditorViewState from './EditorViewState';
import AtMentionPlugin from './Plugins/atMentionPlugin';
import { suggestions, trigger } from './Plugins/mentionLoopupData';

export interface RichTextEditorProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
  //   editorCreator?: (div: HTMLDivElement, options: EditorOptions) => IEditor;
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
  const ribbonPlugin = React.useRef(createRibbonPlugin());

  React.useEffect(() => {
    console.log('RichTextEditor::useEffect::editorDiv.current', editorDiv.current);
    editor.current.setContent(content || '');
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
        <Ribbon buttons={buttons} plugin={ribbonPlugin.current} />
        <div style={{ flex: 1 }} />
        {children()}
      </div>
    );
  }

  return (
    <div>
      <Rooster style={editorStyle} editorCreator={defaultEditorCreator} />
      {renderRibbon()}
    </div>
  );

  function defaultEditorCreator(div: HTMLDivElement) {
    // if (editor.current) {
    //   console.log('return editor.current:::::::::::');
    //   return editor.current;
    // }
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
        ribbonPlugin.current,
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
    // const allFeatures = getAllFeatures();
    // const features: ContentEditFeatureSettings = {
    //   defaultShortcut: true
    // };
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
