// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { ContentEdit } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin, IEditor } from 'roosterjs-editor-types';
// import { useTheme } from '@fluentui/react/lib/Theme';
export interface RichTextEditorProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
  //   editorCreator?: (div: HTMLDivElement, options: EditorOptions) => IEditor;
}
export default function RichTextEditor(props: RichTextEditorProps) {
  const editorDiv = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<IEditor | null>(null);

  React.useEffect(() => {
    if (editorDiv.current) {
      editor.current = defaultEditorCreator(editorDiv.current);
    }

    return () => {
      if (editor.current) {
        editor.current.dispose();
        editor.current = null;
      }
    };
  }, []);

  return <div ref={editorDiv} tabIndex={0} />;
}

function defaultEditorCreator(div: HTMLDivElement) {
  const plugins = [new ContentEdit()];

  const preserveImagesHandler = (html: string) => {
    console.log('preserveImagesHandler input html:: /n ', html);
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

    console.log('output::: ', doc.body.innerHTML);
    return doc.body.innerHTML;
  };

  const options: EditorOptions = {
    plugins: []
    // trustedHTMLHandler: preserveImagesHandler
  };

  return new Editor(div, options);
}
