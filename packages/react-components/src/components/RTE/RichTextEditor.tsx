// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { DefaultFormat, EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import { Rooster, createUpdateContentPlugin, UpdateMode, createRibbonPlugin, Ribbon } from 'roosterjs-react';
import { ribbonButtonStyle, ribbonStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { useTheme } from '@fluentui/react';
import { ribbonButtons, ribbonButtonsStrings } from './RTERibbonButtons';
import { RichTextSendBoxStrings } from './RTESendBox';
import { isDarkThemed } from '../../theming/themeUtils';
import { darkTheme, lightTheme } from '../../theming';

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

  const ribbonPlugin = React.useMemo(() => {
    return createRibbonPlugin();
  }, []);

  const editorCreator = useCallback((div: HTMLDivElement, options: EditorOptions) => {
    editor.current = new Editor(div, options);
    // Remove the background color of the editor
    div.style.backgroundColor = 'transparent';
    return editor.current;
  }, []);

  const plugins = useMemo(() => {
    const contentEdit = new ContentEdit();
    const placeholderPlugin = new Watermark(placeholderText || '');
    const updateContentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
      (content: string) => {
        onChange && onChange(content);
      }
    );
    return [contentEdit, placeholderPlugin, updateContentPlugin, ribbonPlugin];
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

  const defaultFormat: DefaultFormat = useMemo(() => {
    return {
      textColors: {
        lightModeColor: lightTheme.palette?.neutralPrimary ?? 'black',
        darkModeColor: darkTheme.palette?.neutralPrimary ?? 'white'
      }
    };
  }, []);

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
        defaultFormat={defaultFormat}
        doNotAdjustEditorColor={true}
      />
    </div>
  );
});
