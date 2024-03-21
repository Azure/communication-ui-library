// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor, RichTextEditorComponentRef, RichTextEditorStyleProps } from './RichTextEditor';
import { RichTextSendBoxStrings } from './RichTextSendBox';
import { useTheme } from '../../theming';
import { Icon, Stack } from '@fluentui/react';
import { InputBoxButton } from '../InputBoxButton';
import { isEnterKeyEventFromCompositionSession } from '../utils';
import {
  richTextActionButtonsDividerStyle,
  richTextActionButtonsStackStyle,
  richTextActionButtonsStyle,
  richTextFormatButtonIconStyle
} from '../styles/RichTextEditor.styles';
import {
  inputBoxContentStackStyle,
  inputBoxRichTextStackItemStyle,
  inputBoxRichTextStackStyle,
  richTextBorderBoxStyle
} from '../styles/RichTextInputBoxComponent.styles';

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
  onEnterKeyDown?: () => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
  disabled: boolean;
  actionComponents: ReactNode;
  /* @conditional-compile-remove(file-sharing) */
  onRenderFileUploads?: () => JSX.Element;
  /* @conditional-compile-remove(file-sharing) */
  hasFiles?: boolean;
  // props for min and max height for the rich text editor
  // otherwise the editor will grow to fit the content
  richTextEditorStyleProps: (isExpanded: boolean) => RichTextEditorStyleProps;
  isHorizontalLayoutDisabled?: boolean;
}

/**
 * @private
 */
export const RichTextInputBoxComponent = (props: RichTextInputBoxComponentProps): JSX.Element => {
  const {
    placeholderText,
    initialContent,
    onChange,
    onEnterKeyDown,
    editorComponentRef,
    disabled,
    strings,
    actionComponents,
    /* @conditional-compile-remove(file-sharing) */
    onRenderFileUploads,
    /* @conditional-compile-remove(file-sharing) */
    hasFiles,
    richTextEditorStyleProps,
    isHorizontalLayoutDisabled = false
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
            data-testId={'rich-text-input-box-format-button'}
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

  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLElement>) => {
      if (isEnterKeyEventFromCompositionSession(ev)) {
        return;
      }
      if (ev.key === 'Enter' && ev.shiftKey === false && !showRichTextEditorFormatting) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      }
    },
    [onEnterKeyDown, showRichTextEditorFormatting]
  );

  const useHorizontalLayout = useMemo(() => {
    return (
      !isHorizontalLayoutDisabled &&
      !showRichTextEditorFormatting &&
      /* @conditional-compile-remove(file-sharing) */ !hasFiles
    );
  }, [
    isHorizontalLayoutDisabled,
    showRichTextEditorFormatting,
    /* @conditional-compile-remove(file-sharing) */ hasFiles
  ]);

  return (
    <div
      className={richTextBorderBoxStyle({
        theme: theme,
        disabled: !!disabled
      })}
    >
      <Stack grow className={inputBoxContentStackStyle(useHorizontalLayout)}>
        {/* fixes the issue when flex box can grow to be bigger than parent */}
        <Stack grow className={inputBoxRichTextStackStyle}>
          {/* Add padding to stack.item */}
          <Stack.Item className={inputBoxRichTextStackItemStyle}>
            <RichTextEditor
              initialContent={initialContent}
              placeholderText={placeholderText}
              onChange={onChange}
              onKeyDown={onKeyDown}
              ref={editorComponentRef}
              strings={strings}
              showRichTextEditorFormatting={showRichTextEditorFormatting}
              styles={richTextEditorStyle}
            />
          </Stack.Item>
          {/* @conditional-compile-remove(file-sharing) */ onRenderFileUploads && onRenderFileUploads()}
        </Stack>
        {actionButtons}
      </Stack>
    </div>
  );
};
