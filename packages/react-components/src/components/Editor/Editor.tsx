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
import { Stack } from '@fluentui/react';
import { clearFormat as clearFormatApi, toggleBold } from 'roosterjs-editor-api';
import AtMentionPlugin from './Plugins/atMentionPlugin';
import KeyDownPlugin from './Plugins/customizedPlugins';
import { suggestions, trigger } from './Plugins/mentionLoopupData';
import { MentionLookupOptions } from '../MentionPopover';

export interface RichTextEditorProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
  content?: string;
  'data-ui-id'?: string;
  onChange: (newValue?: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  mentionLookupOptions?: MentionLookupOptions;
  children: ReactNode;
  placeholderText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}
const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { content, onChange, mentionLookupOptions, children, placeholderText, disabled, autoFocus, onKeyDown } = props;
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<IEditor | null>(null);
  const ribbonPlugin = React.useMemo(() => createRibbonPlugin(), []);

  React.useEffect(() => {
    if (content !== editor.current?.getContent()) {
      editor.current?.setContent(content || '');
    }
  }, [content]);

  function onRenderRibbon() {
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
      {onRenderRibbon()}
    </div>
  );

  function defaultEditorCreator(div: HTMLDivElement, onChange: (text: string) => void): IEditor {
    const updateContentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
      (content: string) => {
        onChange(content);
      }
    );
    const keyDownPlugin = new KeyDownPlugin(onKeyDown);
    const atMentionPluginInstance = new AtMentionPlugin(mentionLookupOptions);
    const contentEdit = new ContentEdit();
    const placeholderPlugin = new Watermark(placeholderText || '');
    const options: EditorOptions = {
      plugins: [
        ribbonPlugin,
        atMentionPluginInstance.Picker,
        placeholderPlugin,
        contentEdit,
        updateContentPlugin,
        keyDownPlugin
      ],
      imageSelectionBorderColor: 'blue'
    };
    editor.current = new Editor(div, options);
    if (autoFocus) {
      editor.current.focus();
    }
    return editor.current;
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
