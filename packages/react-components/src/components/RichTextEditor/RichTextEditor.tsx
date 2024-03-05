// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import { Rooster, createUpdateContentPlugin, UpdateMode, createRibbonPlugin, Ribbon } from 'roosterjs-react';
import {
  ribbonButtonStyle,
  ribbonOverflowButtonStyle,
  ribbonStyle,
  richTextEditorWrapperStyle,
  richTextEditorStyle
} from '../styles/RichTextEditor.styles';
import { useTheme } from '../../theming';
import { ribbonButtons, ribbonButtonsStrings } from './RichTextRibbonButtons';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { isDarkThemed } from '../../theming/themeUtils';

/**
 * Props for {@link RichTextEditor}.
 *
 * @private
 */
export interface RichTextEditorStyleProps {
  minHeight: string;
  maxHeight: string;
}

/**
 * Props for {@link RichTextEditor}.
 *
 * @private
 */
export interface RichTextEditorProps {
  initialContent?: string;
  onChange: (newValue?: string) => void;
  placeholderText?: string;
  strings: Partial<RichTextSendBoxStrings>;
  showRichTextEditorFormatting: boolean;
  styles: RichTextEditorStyleProps;
}

/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorComponentRef {
  focus: () => void;
  setEmptyContent: () => void;
}

/**
 * A component to wrap RoosterJS Rich Text Editor.
 *
 * @beta
 */
export const RichTextEditor = React.forwardRef<RichTextEditorComponentRef, RichTextEditorProps>((props, ref) => {
  const { initialContent, onChange, placeholderText, strings, showRichTextEditorFormatting } = props;
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
        },
        setEmptyContent() {
          if (editor.current) {
            editor.current.setContent('');
          }
        }
      };
    },
    []
  );

  const ribbonPlugin = React.useMemo(() => {
    return createRibbonPlugin();
  }, []);

  const editorCreator = useCallback((div: HTMLDivElement, options: EditorOptions) => {
    editor.current = new Editor(div, options);
    // Remove default values for background color and color
    // setBackgroundColor and setTextColor can't be used here as they cause the editor to be focused
    // color will be set in richTextEditorWrapperStyle instead of inline styles
    div.style.backgroundColor = '';
    div.style.color = '';

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
            isBeakVisible: false,
            styles: ribbonOverflowButtonStyle(theme)
          }
        }}
        strings={ribbonButtonsStrings(strings)}
      />
    );
  }, [strings, ribbonPlugin, theme]);

  return (
    <div>
      {showRichTextEditorFormatting && ribbon}
      <div className={richTextEditorWrapperStyle(theme, !showRichTextEditorFormatting, showRichTextEditorFormatting)}>
        <Rooster
          initialContent={initialContent}
          inDarkMode={isDarkThemed(theme)}
          plugins={plugins}
          className={richTextEditorStyle(props.styles)}
          editorCreator={editorCreator}
          // TODO: confirm the color during inline images implementation
          imageSelectionBorderColor={'blue'}
          // doNotAdjustEditorColor is used to fix the default background color for Rooster component
          doNotAdjustEditorColor={true}
        />
      </div>
    </div>
  );
});
