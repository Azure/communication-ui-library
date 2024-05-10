// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { richTextEditorWrapperStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { useTheme } from '../../theming';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { isDarkThemed } from '../../theming/themeUtils';
// import { createTableEditMenuProvider } from './Buttons/Table/RichTextTableContextMenu';
import CopyPastePlugin from './Plugins/CopyPastePlugin';
import type { ContentModelDocument, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { createModelFromHtml, Editor, exportContent } from 'roosterjs-content-model-core';
import { createParagraph, createSelectionMarker, setSelection } from 'roosterjs-content-model-dom';
import { KeyboardInputPlugin } from './Plugins/KeyboardInputPlugin';
import { AutoFormatPlugin, EditPlugin, WatermarkPlugin, PastePlugin } from 'roosterjs-content-model-plugins';
import { UpdateContentPlugin, UpdateEvent } from './Plugins/UpdateContentPlugin';
import { RichTextToolbar } from './Toolbar/RichTextToolbar';
import { RichTextToolbarPlugin } from './Plugins/RichTextToolbarPlugin';

/**
 * Style props for {@link RichTextEditor}.
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
  onChange: (newValue?: string) => void;
  onKeyDown?: (ev: KeyboardEvent) => void;
  // update the current content of the rich text editor
  onContentModelUpdate?: (contentModel: ContentModelDocument | undefined) => void;
  contentModel?: ContentModelDocument | undefined;
  placeholderText?: string;
  strings: Partial<RichTextSendBoxStrings>;
  showRichTextEditorFormatting: boolean;
  styles: RichTextEditorStyleProps;
  autoFocus?: 'sendBoxTextField';
}

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
  const {
    initialContent,
    onChange,
    placeholderText,
    strings,
    showRichTextEditorFormatting,
    autoFocus,
    onKeyDown,
    onContentModelUpdate,
    contentModel
  } = props;
  const editor = useRef<IEditor | null>(null);
  const editorDiv = useRef<HTMLDivElement>(null);
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
            // remove all content from the editor and update the model
            // ContentChanged event will be sent by RoosterJS automatically
            editor.current.formatContentModel((model: ContentModelDocument): boolean => {
              model.blocks = [];
              return true;
            });
            //reset content model
            onContentModelUpdate && onContentModelUpdate(undefined);
          }
        },
        getPlainContent() {
          if (editor.current) {
            return exportContent(editor.current, 'PlainTextFast');
          } else {
            return undefined;
          }
        }
      };
    },
    [onContentModelUpdate]
  );

  const toolbarPlugin = React.useMemo(() => {
    return new RichTextToolbarPlugin();
  }, []);

  const isDarkThemedValue = useMemo(() => {
    return isDarkThemed(theme);
  }, [theme]);

  useEffect(() => {
    editor.current?.setDarkModeState(isDarkThemedValue);
  }, [isDarkThemedValue]);

  // useEffect(() => {
  //   if (placeholderText !== undefined) {
  //     placeholderPlugin.updateWatermark(placeholderText);
  //   }
  // }, [placeholderPlugin, placeholderText]);

  const toolbar = useMemo(() => {
    return <RichTextToolbar plugin={toolbarPlugin} strings={strings} />;
  }, [strings, toolbarPlugin]);

  const updatePlugin = useMemo(() => {
    return new UpdateContentPlugin();
  }, []);

  useEffect(() => {
    // don't set callback in plugin constructor to update callback without plugin recreation
    updatePlugin.onUpdate = (event: string) => {
      if (editor.current === null) {
        return;
      }
      if (event === UpdateEvent.Blur || event === UpdateEvent.Dispose) {
        onContentModelUpdate && onContentModelUpdate(editor.current.getContentModelCopy('disconnected'));
      } else {
        onChange && onChange(exportContent(editor.current));
      }
    };
  }, [onChange, onContentModelUpdate, updatePlugin]);

  const keyboardInputPlugin = useMemo(() => {
    return new KeyboardInputPlugin();
  }, []);

  useEffect(() => {
    // don't set callback in plugin constructor to update callback without plugin recreation
    keyboardInputPlugin.onKeyDown = onKeyDown;
  }, [keyboardInputPlugin, onKeyDown]);

  const plugins: EditorPlugin[] = useMemo(() => {
    //   // contextPlugin and tableEditMenuProvider allow to show insert/delete menu for the table
    //   const contextPlugin = createContextMenuPlugin();
    //   const tableEditMenuProvider = createTableEditMenuProvider(strings);
    const contentEdit = new EditPlugin();
    // AutoFormatPlugin previously was a part of the edit plugin
    const autoFormatPlugin = new AutoFormatPlugin({ autoBullet: true, autoNumbering: true, autoLink: true });
    const copyPastePlugin = new CopyPastePlugin();
    const roosterPastePlugin = new PastePlugin(false);
    const placeholderPlugin = new WatermarkPlugin(placeholderText ?? '');
    return [
      placeholderPlugin,
      keyboardInputPlugin,
      contentEdit,
      autoFormatPlugin,
      updatePlugin,
      copyPastePlugin,
      roosterPastePlugin,
      toolbarPlugin
    ];
  }, [keyboardInputPlugin, placeholderText, updatePlugin, toolbarPlugin]);
  // TODO: check shortcuts plugin
  //   return [,
  //     contextPlugin,
  //     tableEditMenuProvider,
  //   ];
  // TODO-vhuseinova: check that localization/rtl works
  useEffect(() => {
    const initialModel = createEditorInitialModel(initialContent, contentModel);
    if (editorDiv.current) {
      editor.current = new Editor(editorDiv.current, {
        inDarkMode: isDarkThemedValue,
        // doNotAdjustEditorColor is used to disable default color and background color for Rooster component
        doNotAdjustEditorColor: true,
        // TODO: confirm the color during inline images implementation
        imageSelectionBorderColor: 'blue',
        plugins: plugins,
        initialModel: initialModel
      });
    }

    if (autoFocus === 'sendBoxTextField') {
      editor.current?.focus();
    }

    return () => {
      if (editor.current) {
        editor.current.dispose();
        editor.current = null;
      }
    };
    // don't update the editor on focusOnInit, theme  change as it might reset the editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid={'rich-text-editor-wrapper'}>
      {showRichTextEditorFormatting && toolbar}
      <div className={richTextEditorWrapperStyle(theme, !showRichTextEditorFormatting)}>
        {/* div that is used by Rooster JS as a parent of the editor */}
        <div
          ref={editorDiv}
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          data-testid={'rooster-rich-text-editor'}
          className={richTextEditorStyle(props.styles)}
        />
      </div>
    </div>
  );
});

const createEditorInitialModel = (
  initialContent?: string,
  contentModel?: ContentModelDocument
): ContentModelDocument | undefined => {
  if (contentModel) {
    // contentModel is the current content of the editor
    return contentModel;
  } else {
    const initialContentValue = initialContent;
    const initialModel =
      initialContentValue && initialContentValue.length > 0 ? createModelFromHtml(initialContentValue) : undefined;
    // TODO-vhuseinova: check this and also check if 1 param in createParagraph should be true
    if (initialModel && initialModel.blocks.length > 0) {
      // lastBlock should have blockType = paragraph, otherwise add a new paragraph
      // to set focus to the end of the content
      let lastBlock = initialModel.blocks[initialModel.blocks.length - 1];
      if (lastBlock?.blockType === 'Paragraph') {
        // now lastBlock is paragraph
      } else {
        lastBlock = createParagraph(false);
        initialModel.blocks.push(lastBlock);
      }
      const marker = createSelectionMarker();
      lastBlock.segments.push(marker);
      setSelection(initialModel, marker);
    }
    return initialModel;
  }
};
