// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef, RichTextEditorStyleProps } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { richTextBorderBoxStyle } from '../styles/RichTextInputBoxComponent.styles';
import { useTheme } from '../../theming';
import { Icon, Stack } from '@fluentui/react';
import { InputBoxButton } from '../InputBoxButton';
import {
  richTextActionButtonsDividerStyle,
  richTextActionButtonsStackStyle,
  richTextActionButtonsStyle,
  richTextFormatButtonIconStyle
} from '../styles/RichTextEditor.styles';
import { inputBoxContentStackStyle, inputBoxRichTextStackStyle } from '../styles/RichTextInputBoxComponent.styles';

/**
 * @private
 */
export interface RichTextInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RichTextInputBoxComponentProps {
  placeholderText?: string;
  initialContent?: string;
  onChange: (newValue?: string) => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
  disabled: boolean;
  actionComponents: ReactNode;
  // props for min and max height for the rich text editor
  // otherwise the editor will grow to fit the content
  richTextEditorStyleProps: (isExpanded: boolean) => RichTextEditorStyleProps;
  supportHorizontalLayout?: boolean;
}

/**
 * @private
 */
export const RichTextInputBoxComponent = (props: RichTextInputBoxComponentProps): JSX.Element => {
  const {
    placeholderText,
    initialContent,
    onChange,
    editorComponentRef,
    disabled,
    strings,
    actionComponents,
    richTextEditorStyleProps,
    supportHorizontalLayout = true
  } = props;
  const theme = useTheme();
  const [showRichTextEditorFormatting, setShowRichTextEditorFormatting] = useState(false);

  const onRenderRichTextEditorIcon = useCallback(
    (isHover: boolean) => (
      <Icon
        iconName={
          isHover || showRichTextEditorFormatting ? 'RichTextEditorButtonIconFilled' : 'RichTextEditorButtonIcon'
        }
        className={richTextFormatButtonIconStyle(theme, !disabled && (isHover || showRichTextEditorFormatting))}
      />
    ),
    [disabled, showRichTextEditorFormatting, theme]
  );

  const actionButtons = useMemo(() => {
    return (
      <Stack.Item align="end" className={richTextActionButtonsStackStyle}>
        <Stack horizontal>
          <InputBoxButton
            onRenderIcon={onRenderRichTextEditorIcon}
            onClick={(e) => {
              setShowRichTextEditorFormatting(!showRichTextEditorFormatting);
              editorComponentRef.current?.focus();
              e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
            }}
            ariaLabel={strings.richTextFormatButtonTooltip}
            tooltipContent={strings.richTextFormatButtonTooltip}
            className={richTextActionButtonsStyle}
          />
          <Icon iconName="RichTextDividerIcon" className={richTextActionButtonsDividerStyle(theme)} />
          {actionComponents}
        </Stack>
      </Stack.Item>
    );
  }, [
    actionComponents,
    editorComponentRef,
    onRenderRichTextEditorIcon,
    showRichTextEditorFormatting,
    strings.richTextFormatButtonTooltip,
    theme
  ]);

  const richTextEditorStyle = useMemo(() => {
    return richTextEditorStyleProps(showRichTextEditorFormatting);
  }, [richTextEditorStyleProps, showRichTextEditorFormatting]);

  return (
    <div
      className={richTextBorderBoxStyle({
        theme: theme,
        disabled: !!disabled
      })}
    >
      <Stack
        grow
        horizontal={supportHorizontalLayout && !showRichTextEditorFormatting}
        className={inputBoxContentStackStyle}
      >
        {/* fixes the issue when flex box can grow to be bigger than parent */}
        <Stack grow className={inputBoxRichTextStackStyle}>
          <RichTextEditor
            initialContent={initialContent}
            placeholderText={placeholderText}
            onChange={onChange}
            ref={editorComponentRef}
            strings={strings}
            showRichTextEditorFormatting={showRichTextEditorFormatting}
            styles={richTextEditorStyle}
          />
          {/* File Upload */}
        </Stack>
        {actionButtons}
      </Stack>
    </div>
  );
};
