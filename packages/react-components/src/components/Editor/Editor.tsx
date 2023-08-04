// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { ContentEdit } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin, IEditor, ClearFormatMode } from 'roosterjs-editor-types';
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
import { IconButton } from '@fluentui/react';
import { clearFormat as clearFormatApi, toggleBold } from 'roosterjs-editor-api';
import EditorViewState from './EditorViewState';

export interface RichTextEditorProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
  //   editorCreator?: (div: HTMLDivElement, options: EditorOptions) => IEditor;
  children: ReactNode;
  onChange: (newValue?: string) => void;
}
export default function RichTextEditor(props: RichTextEditorProps) {
  const { children, onChange } = props;
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<IEditor | null>(null);
  const ribbonPlugin = React.useRef(createRibbonPlugin());

  function renderRibbon() {
    const buttons = getButtons([KnownRibbonButtonKey.Bold, KnownRibbonButtonKey.Italic]);

    return (
      <div>
        <Ribbon buttons={buttons} plugin={ribbonPlugin.current} />
      </div>
    );
  }
  function renderBottomButtons() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton
          iconProps={{ iconName: 'ClearFormatting' }}
          onClick={() => {
            clearFormatApi(editor.current, ClearFormatMode.AutoDetect);
          }}
        />
        <IconButton
          iconProps={{ iconName: 'Bold' }}
          onClick={() => {
            toggleBold(editor.current);
            return true;
          }}
        />
        <div style={{ flex: 1 }} />
        {children()}
      </div>
    );
  }

  return (
    <div>
      {renderRibbon()}
      <Rooster plugins={[ribbonPlugin.current]} editorCreator={defaultEditorCreator} />
      {renderBottomButtons()}
    </div>
  );

  function defaultEditorCreator(div: HTMLDivElement) {
    const contentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInputq,
      (html, mode) => {
        onChange(html);
        // console.log('onChange::: ', html);
      }
    );

    const options: EditorOptions = {
      plugins: [ribbonPlugin.current, contentPlugin],
      trustedHTMLHandler: preserveImagesHandler
    };
    editor.current = new Editor(div, options);
    return editor.current;
  }
}

const preserveImagesHandler = (html: string) => {
  console.log('paste html:: /n ', html);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ALL);

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent.trim();
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG') {
      if (node.textContent) {
        const textNode = doc.createTextNode(node.textContent.trim());
        node.parentNode.replaceChild(textNode, node);
      } else {
        node.parentNode.removeChild(node);
      }
    }
    node = walker.nextNode();
  }

  return html;
};
