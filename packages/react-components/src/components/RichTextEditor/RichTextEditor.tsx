// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { DefaultFormat, EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
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

  const defaultFormat: DefaultFormat = useMemo(() => {
    // without setting any styles, text input is not handled properly for tables (when insert or paste one in the editor)
    // because of https://github.com/microsoft/roosterjs/blob/14dbb947e3ae94580109cbd05e48ceb05327c4dc/packages/roosterjs-editor-core/lib/corePlugins/TypeInContainerPlugin.ts#L75
    // this issue is fixed for content model package
    return {
      backgroundColor: 'transparent'
    };
  }, []);

  return (
    <div data-testid={'rich-text-editor-wrapper'}>
      {showRichTextEditorFormatting && ribbon}
      <div className={richTextEditorWrapperStyle(theme, !showRichTextEditorFormatting)}>
        <Rooster
          defaultFormat={defaultFormat}
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
