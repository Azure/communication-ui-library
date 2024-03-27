// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
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
import {
  ribbonButtonStyle,
  ribbonOverflowButtonStyle,
  ribbonStyle,
  richTextEditorWrapperStyle,
  richTextEditorStyle
} from '../styles/RichTextEditor.styles';
import { useTheme } from '../../theming';
import { ribbonButtons } from './Buttons/RichTextRibbonButtons';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { isDarkThemed } from '../../theming/themeUtils';
import { ribbonButtonsStrings } from '../utils/RichTextEditorStringsUtils';
import { createTableEditMenuProvider } from './Buttons/Table/RichTextTableContextMenu';

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
  onKeyDown?: (ev: React.KeyboardEvent<HTMLElement>) => void;
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

  const editorCreator = useCallback(
    (div: HTMLDivElement, options: EditorOptions) => {
      editor.current = new Editor(div, options);
      // Remove default values for background color and color
      // setBackgroundColor and setTextColor can't be used here as they cause the editor to be focused
      // color will be set in richTextEditorWrapperStyle instead of inline styles
      div.style.backgroundColor = '';
      div.style.color = '';

      return editor.current;
    },
    // trigger force editor reset when strings are changed to update context menu strings
    // see RosterJS documentation for 'editorCreator' for more details
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strings]
  );

  const placeholderPlugin = React.useMemo(() => {
    return new Watermark('');
  }, []);

  useEffect(() => {
    if (placeholderText !== undefined) {
      placeholderPlugin.updateWatermark(placeholderText);
    }
  }, [placeholderPlugin, placeholderText]);

  const plugins = useMemo(() => {
    // contextPlugin and tableEditMenuProvider allow to show insert/delete menu for the table
    const contextPlugin = createContextMenuPlugin();
    const tableEditMenuProvider = createTableEditMenuProvider(strings);
    const contentEdit = new ContentEdit();
    const updateContentPlugin = createUpdateContentPlugin(
      UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
      (content: string) => {
        onChange && onChange(content);
      }
    );
    return [contentEdit, placeholderPlugin, updateContentPlugin, ribbonPlugin, contextPlugin, tableEditMenuProvider];
  }, [onChange, placeholderPlugin, ribbonPlugin, strings]);

  const ribbon = useMemo(() => {
    const buttons = ribbonButtons(theme);

    return (
      <Ribbon
        styles={ribbonStyle}
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
        data-testid={'rich-text-editor-ribbon'}
      />
    );
  }, [strings, ribbonPlugin, theme]);

  return (
    <div data-testid={'rich-text-editor-wrapper'}>
      {showRichTextEditorFormatting && ribbon}
      <div className={richTextEditorWrapperStyle(theme, !showRichTextEditorFormatting)}>
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
          data-testid={'rooster-rich-text-editor'}
          // if we don't use 'allowKeyboardEventPropagation' only the enter key is caught
          onKeyDown={props.onKeyDown}
        />
      </div>
    </div>
  );
});
