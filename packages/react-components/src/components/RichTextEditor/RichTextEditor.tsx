// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { DefaultFormat, EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import {
  CompatibleContentPosition,
  CompatibleGetContentMode,
  CompatiblePositionType
} from 'roosterjs-editor-types-compatible';
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
import CopyPastePlugin from './Plugins/CopyPastePlugin';

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
  // the initial content of editor that is set when editor is created (e.g. when editing a message)
  initialContent?: string;
  // the current content of the editor
  content?: string;
  onChange: (newValue?: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLElement>) => void;
  placeholderText?: string;
  strings: Partial<RichTextSendBoxStrings>;
  showRichTextEditorFormatting: boolean;
  styles: RichTextEditorStyleProps;
  autoFocus?: 'sendBoxTextField';
}

/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
/**
 * Represents a reference to the RichTextEditor component.
 */
export interface RichTextEditorComponentRef {
  /**
   * Sets focus on the RichTextEditor component.
   */
  focus: () => void;

  /**
   * Sets the content of the RichTextEditor component to an empty string.
   */
  setEmptyContent: () => void;

  /**
   * Retrieves the plain text content of the RichTextEditor component.
   * @returns The plain text content of the RichTextEditor component, or undefined if the editor isn't available.
   */
  getPlainContent: () => string | undefined;
}

/**
 * A component to wrap RoosterJS Rich Text Editor.
 *
 * @beta
 */
export const RichTextEditor = React.forwardRef<RichTextEditorComponentRef, RichTextEditorProps>((props, ref) => {
  const { initialContent, onChange, placeholderText, strings, showRichTextEditorFormatting, content, autoFocus } =
    props;
  const editor = useRef<IEditor | null>(null);
  const contentValue = useRef<string | undefined>(content);
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
        },
        getPlainContent() {
          return editor?.current?.getContent(CompatibleGetContentMode.PlainTextFast);
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
      const editorValue = new Editor(div, options);
      // this is to fix issue when editor is created or re-rendered and has existing text
      // Content model package has a correct behavior and this fix can be deleted
      if (contentValue.current !== undefined && contentValue.current.length > 0) {
        // in case if initialContent is not empty, RoosterJS doesn't set caret position to the end.
        focusAndUpdateContent(editorValue, contentValue.current);
      } else if (initialContent !== undefined && initialContent.length > 0) {
        // changing layout in rich text send box cause the editor to be recreated
        // to keep the content, we need to set messageContent to the current content
        focusAndUpdateContent(editorValue, initialContent);
      }
      editor.current = editorValue;
      return editorValue;
    },
    // trigger force editor reset when strings are changed to update context menu strings
    // see RosterJS documentation for 'editorCreator' for more details
    // the editorCreator callback shouldn't be updated when the initialContent is changed
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
    const copyPastePlugin = new CopyPastePlugin();
    return [
      contentEdit,
      placeholderPlugin,
      updateContentPlugin,
      ribbonPlugin,
      contextPlugin,
      tableEditMenuProvider,
      copyPastePlugin
    ];
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
          focusOnInit={autoFocus === 'sendBoxTextField'}
        />
      </div>
    </div>
  );
});

const focusAndUpdateContent = (editor: Editor, content: string): void => {
  // setting focus before setting content, works for Chrome and Edge but not Safari
  editor.setContent(content);
  // this is a recommended way (by RoosterJS team) to set focus at the end of the text
  // RoosterJS v9 has this issue fixed and this code can be removed
  // CompatibleContentPosition.DomEnd shouldn't be used here as it set focus after the editor div
  editor.insertContent('<span id="focus-position-span"></span>', { position: CompatibleContentPosition.End });
  const elements = editor.queryElements('#focus-position-span');
  if (elements.length > 0) {
    const placeholder = editor.queryElements('#focus-position-span')[0];
    editor.select(placeholder, CompatiblePositionType.Before);
    placeholder.remove();
  }
};
