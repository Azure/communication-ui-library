// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import {
  Rooster,
  createUpdateContentPlugin,
  UpdateMode,
  createRibbonPlugin,
  Ribbon,
  createContextMenuPlugin
} from 'roosterjs-react';
import { ribbonButtonStyle, ribbonStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { useTheme } from '@fluentui/react';
import { ribbonButtons, ribbonButtonsStrings } from './Buttons/RTERibbonButtons';
import { RichTextSendBoxStrings } from './RTESendBox';
import { isDarkThemed } from '../../theming/themeUtils';
import { createTableEditMenuProvider } from './Buttons/RTETableContextMenu';

/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorProps {
  content?: string;
  onChange: (newValue?: string) => void;
  placeholderText?: string;
  strings: Partial<RichTextSendBoxStrings>;
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
  const { content, onChange, placeholderText, strings } = props;
  const editor = useRef<IEditor | null>(null);
  const [divComponent, setDivComponent] = useState<HTMLDivElement | null>(null);
  const theme = useTheme();
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

  useEffect(() => {
    if (divComponent !== null && theme.palette.neutralPrimary !== undefined) {
      // Adjust color prop for the div component when theme is updated
      // because doNotAdjustEditorColor is set for Rooster
      divComponent.style.color = theme.palette.neutralPrimary;
    }
  }, [divComponent, theme]);

  const ribbonPlugin = React.useMemo(() => {
    return createRibbonPlugin();
  }, []);

  const editorCreator = useCallback((div: HTMLDivElement, options: EditorOptions) => {
    editor.current = new Editor(div, options);
    setDivComponent(div);
    // Remove the background color of the editor
    div.style.backgroundColor = 'transparent';
    return editor.current;
  }, []);

  const plugins = useMemo(() => {
    const contextPlugin = createContextMenuPlugin();
    const tableMenuProvider = createTableEditMenuProvider();
    const contentEdit = new ContentEdit();
    const placeholderPlugin = new Watermark(placeholderText || '');
    const updateContentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
      (content: string) => {
        onChange && onChange(content);
      }
    );
    return [contextPlugin, contentEdit, placeholderPlugin, updateContentPlugin, ribbonPlugin, tableMenuProvider];
  }, [onChange, placeholderText, ribbonPlugin]);

  const ribbon = useMemo(() => {
    const buttons = ribbonButtons(theme);

    return (
      //TODO: Add localization for watermark plugin https://github.com/microsoft/roosterjs/issues/2430
      <Ribbon
        styles={ribbonStyle()}
        buttons={buttons}
        plugin={ribbonPlugin}
        overflowButtonProps={{
          styles: ribbonButtonStyle(theme),
          menuProps: {
            items: [], // CommandBar will determine items rendered in overflow
            isBeakVisible: false
          }
        }}
        strings={ribbonButtonsStrings(strings)}
      />
    );
  }, [strings, ribbonPlugin, theme]);

  return (
    <div>
      {ribbon}
      <Rooster
        inDarkMode={isDarkThemed(theme)}
        plugins={plugins}
        className={richTextEditorStyle}
        editorCreator={editorCreator}
        // TODO: confirm the color during inline images implementation
        imageSelectionBorderColor={'blue'}
        // doNotAdjustEditorColor is used to fix the default background color for Rooster component
        doNotAdjustEditorColor={true}
      />
    </div>
  );
});
