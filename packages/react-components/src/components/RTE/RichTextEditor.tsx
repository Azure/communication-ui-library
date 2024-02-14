// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
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
import { richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { Stack, useTheme, ContextualMenuItemType } from '@fluentui/react';
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

  const ribbonPlugin = React.useMemo(() => createRibbonPlugin(), []);

  const editorCreator = useMemo(() => {
    return (div: HTMLDivElement) => {
      const contentEdit = new ContentEdit();
      const placeholderPlugin = new Watermark(placeholderText || '');
      const updateContentPlugin = createUpdateContentPlugin(
        UpdateMode.OnContentChangedEvent | UpdateMode.OnUserInput,
        (content: string) => {
          onChange && onChange(content);
        }
      );

      const options: EditorOptions = {
        plugins: [ribbonPlugin, placeholderPlugin, contentEdit, updateContentPlugin],
        imageSelectionBorderColor: 'blue'
      };

      editor.current = new Editor(div, options);
      return editor.current;
    };
  }, [onChange, placeholderText, ribbonPlugin]);

  const ribbon = useMemo(() => {
    const divider: RibbonButton<string> = {
      key: 'Divider',
      iconName: 'separator',
      unlocalizedText: '',
      onClick: () => {},
      isDisabled: () => true,
      commandBarProperties: {
        // ...commandBarProperties,
        itemType: ContextualMenuItemType.Divider
      }
    };
    // TODO: add styles!
    let buttons = getButtons([
      KnownRibbonButtonKey.Bold,
      KnownRibbonButtonKey.Italic,
      KnownRibbonButtonKey.Underline,
      divider,
      KnownRibbonButtonKey.BulletedList,
      KnownRibbonButtonKey.NumberedList,
      KnownRibbonButtonKey.DecreaseIndent,
      KnownRibbonButtonKey.IncreaseIndent
    ]) as RibbonButton<string>[];
    buttons = buttons.map((button) => {
      button.commandBarProperties = {
        ...button.commandBarProperties
        // buttonStyles: { ...button.commandBarProperties?.buttonStyles, ...ribbonButtonStyle(theme) }
      };
      return button;
    });

    return (
      //TODO: Add localization */}
      <Ribbon buttons={buttons} plugin={ribbonPlugin} />
    );
  }, [ribbonPlugin]);

  return (
    <div>
      {ribbon}
      <Rooster plugins={[ribbonPlugin]} className={richTextEditorStyle} editorCreator={editorCreator} />
    </div>
  );
});
