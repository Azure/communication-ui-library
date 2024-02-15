// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import {
  Rooster,
  createUpdateContentPlugin,
  UpdateMode,
  createRibbonPlugin,
  getButtons,
  KnownRibbonButtonKey,
  Ribbon,
  RibbonButton
} from 'roosterjs-react';
import { ribbonButtonStyle, ribbonDividerStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { useTheme, ContextualMenuItemType } from '@fluentui/react';
/**
 * Props for {@link RichTextEditor}.
 *
 * @beta
 */
export interface RichTextEditorProps {
  content?: string;
  onChange: (newValue?: string) => void;
  placeholderText?: string;
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
  const { content, onChange, placeholderText } = props;
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
    // TODO: need to check how to do this during inline images
    // const selectionPlugin = createSelectionPlugin(
    //   imageSelectionBorderColor: 'blue'
    // );
    return [contentEdit, placeholderPlugin, updateContentPlugin, ribbonPlugin];
  }, [onChange, placeholderText, ribbonPlugin]);

  const ribbon = useMemo(() => {
    //TODO: add more styles for ... button (small screen size)
    const dividerKey = 'Divider';
    const divider: RibbonButton<string> = {
      key: dividerKey,
      iconName: 'separator',
      unlocalizedText: '',
      onClick: () => {},
      isDisabled: () => true,
      commandBarProperties: {
        itemType: ContextualMenuItemType.Divider
      }
    };
    // TODO: add styles!
    const buttons: RibbonButton<string>[] = getButtons([
      KnownRibbonButtonKey.Bold,
      KnownRibbonButtonKey.Italic,
      KnownRibbonButtonKey.Underline,
      divider,
      KnownRibbonButtonKey.BulletedList,
      KnownRibbonButtonKey.NumberedList,
      KnownRibbonButtonKey.DecreaseIndent,
      KnownRibbonButtonKey.IncreaseIndent
    ]);

    for (const button of buttons) {
      button.commandBarProperties = {
        ...button.commandBarProperties,
        buttonStyles: {
          ...button.commandBarProperties?.buttonStyles,
          ...(button.key === dividerKey ? ribbonDividerStyle(theme) : ribbonButtonStyle(theme))
        }
      };
    }

    return (
      //TODO: Add localization */}
      <Ribbon buttons={buttons} plugin={ribbonPlugin} />
    );
  }, [ribbonPlugin, theme]);

  return (
    <div>
      {ribbon}
      <Rooster plugins={[...plugins, ribbonPlugin]} className={richTextEditorStyle} editorCreator={editorCreator} />
    </div>
  );
});
