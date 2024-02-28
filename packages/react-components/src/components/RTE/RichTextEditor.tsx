// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ContentEdit, Watermark } from 'roosterjs-editor-plugins';
import { Editor } from 'roosterjs-editor-core';
import type { EditorOptions, IEditor } from 'roosterjs-editor-types-compatible';
import { Rooster, createUpdateContentPlugin, UpdateMode, createRibbonPlugin, Ribbon } from 'roosterjs-react';
import { ribbonButtonStyle, ribbonStyle, richTextEditorStyle } from '../styles/RichTextEditor.styles';
import { Icon, Stack, useTheme } from '@fluentui/react';
import { ribbonButtons, ribbonButtonsStrings } from './RTERibbonButtons';
import { RichTextSendBoxStrings } from './RTESendBox';
import { isDarkThemed } from '../../theming/themeUtils';
import { InputBoxButton } from '../InputBoxButton';
import { sendIconStyle } from '../styles/SendBox.styles';

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
    const offsetHeight = div.offsetHeight;
    console.log('offsetHeight', offsetHeight);

    setDivComponent(div);
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

  const onRenderIcon = useCallback(
    (isHover: boolean, iconName: string) => (
      <Icon
        iconName={iconName}
        className={sendIconStyle({
          theme,
          hasText: true,
          /* @conditional-compile-remove(file-sharing) */
          hasFile: false,
          hasErrorMessage: false
        })}
      />
    ),
    [theme]
  );

  const onRenderSendIcon = useCallback(
    (isHover: boolean) => (
      <Icon
        iconName={'SendBoxSend'}
        className={sendIconStyle({
          theme,
          hasText: true,
          /* @conditional-compile-remove(file-sharing) */
          hasFile: false,
          hasErrorMessage: false
        })}
      />
    ),
    [theme]
  );

  return (
    <div>
      {ribbon}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
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
        <Stack.Item
          align="end"
          style={{ height: divComponent?.offsetHeight, display: 'flex', paddingRight: '8px', paddingLeft: '8px' }}
        >
          <InputBoxButton
            onRenderIcon={(isHover) => onRenderIcon(isHover, 'SendBoxSend')}
            onClick={(e) => {
              e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
            }}
          />
          <InputBoxButton
            onRenderIcon={(isHover) => onRenderIcon(isHover, 'SendBoxSend')}
            onClick={(e) => {
              // sendMessageOnClick();
              e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
            }}
            // className={sendButtonStyle}
            // ariaLabel={localeStrings.sendButtonAriaLabel}
            // tooltipContent={localeStrings.sendButtonAriaLabel}
          />
        </Stack.Item>
      </div>
    </div>
  );
});
