// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * @private
 */
export interface RichTextInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RichTextInputBoxComponentProps {
  placeholderText?: string;
  // the initial content of editor that is set when editor is created (e.g. when editing a message)
  initialContent?: string;
  onChange: (newValue?: string) => void;
  onEnterKeyDown?: () => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  strings: Partial<RichTextSendBoxStrings>;
  disabled: boolean;
  actionComponents: ReactNode;
  /* @conditional-compile-remove(attachment-upload) */
  onRenderAttachmentUploads?: () => JSX.Element;
  /* @conditional-compile-remove(attachment-upload) */
  hasAttachments?: boolean;
  // props for min and max height for the rich text editor
  // otherwise the editor will grow to fit the content
  richTextEditorStyleProps: (isExpanded: boolean) => RichTextEditorStyleProps;
  isHorizontalLayoutDisabled?: boolean;
  autoFocus?: 'sendBoxTextField';
  onTyping?: () => Promise<void>;
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
    /* @conditional-compile-remove(attachment-upload) */
    onRenderAttachmentUploads,
    /* @conditional-compile-remove(attachment-upload) */
    hasAttachments,
    richTextEditorStyleProps,
    isHorizontalLayoutDisabled = false,
    autoFocus,
    onTyping
  } = props;
  const theme = useTheme();
  // undefined is used to indicate that the rich text editor toolbar state wasn't changed yet
  const [isRichTextEditorToolbarShown, setIsRichTextEditorToolbarShown] = useState<boolean | undefined>(undefined);
  const [contentModel, setContentModel] = useState<ContentModelDocument | undefined>(undefined);

  const onRenderRichTextEditorIcon = useCallback(
    (isHover: boolean) => (
      <Icon
        iconName={
          isHover || showRichTextEditorFormatting(isRichTextEditorToolbarShown)
            ? 'RichTextEditorButtonIconFilled'
            : 'RichTextEditorButtonIcon'
        }
        className={richTextFormatButtonIconStyle(
          theme,
          !disabled && (isHover || showRichTextEditorFormatting(isRichTextEditorToolbarShown))
        )}
      />
    ),
    [disabled, isRichTextEditorToolbarShown, theme]
  );

  useEffect(() => {
    if (isRichTextEditorToolbarShown !== undefined) {
      // Focus the editor when toolbar shown/hidden
      editorComponentRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRichTextEditorFormatting]);

  const actionButtons = useMemo(() => {
    return (
      <Stack.Item align="end" className={richTextActionButtonsStackStyle}>
        <Stack horizontal>
          <InputBoxButton
            onRenderIcon={onRenderRichTextEditorIcon}
            onClick={(e) => {
              setIsRichTextEditorToolbarShown(!showRichTextEditorFormatting(isRichTextEditorToolbarShown));
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
    onRenderRichTextEditorIcon,
    isRichTextEditorToolbarShown,
    strings.richTextFormatButtonTooltip,
    theme
  ]);

  const richTextEditorStyle = useMemo(() => {
    return richTextEditorStyleProps(showRichTextEditorFormatting(isRichTextEditorToolbarShown));
  }, [richTextEditorStyleProps, isRichTextEditorToolbarShown]);

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (isEnterKeyEventFromCompositionSession(ev)) {
        return;
      }
      if (ev.key === 'Enter' && ev.shiftKey === false && !showRichTextEditorFormatting(isRichTextEditorToolbarShown)) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      } else {
        onTyping?.();
      }
    },
    [onEnterKeyDown, isRichTextEditorToolbarShown, onTyping]
  );

  const useHorizontalLayout = useMemo(() => {
    return (
      !isHorizontalLayoutDisabled &&
      !showRichTextEditorFormatting(isRichTextEditorToolbarShown) &&
      /* @conditional-compile-remove(attachment-upload) */ !hasAttachments
    );
  }, [
    isHorizontalLayoutDisabled,
    isRichTextEditorToolbarShown,
    /* @conditional-compile-remove(attachment-upload) */ hasAttachments
  ]);

  const onContentModelUpdate = useCallback((contentModel: ContentModelDocument | undefined) => {
    setContentModel(contentModel);
  }, []);

  return (
    <div
      className={richTextBorderBoxStyle({
        theme: theme,
        disabled: !!disabled
      })}
    >
      {/* This layout is used for the compact view when formatting options are not shown */}
      <Stack
        grow
        horizontal={useHorizontalLayout}
        horizontalAlign={useHorizontalLayout ? 'end' : 'space-between'}
        className={inputBoxContentStackStyle}
        wrap={useHorizontalLayout}
      >
        {/* Fixes the issue when flex box can grow to be bigger than parent */}
        <Stack grow className={inputBoxRichTextStackStyle}>
          <Stack.Item className={inputBoxRichTextStackItemStyle}>
            <RichTextEditor
              contentModel={contentModel}
              initialContent={initialContent}
              placeholderText={placeholderText}
              onChange={onChange}
              onKeyDown={onKeyDown}
              ref={editorComponentRef}
              strings={strings}
              showRichTextEditorFormatting={showRichTextEditorFormatting(isRichTextEditorToolbarShown)}
              styles={richTextEditorStyle}
              autoFocus={autoFocus}
              onContentModelUpdate={onContentModelUpdate}
            />
          </Stack.Item>
          {
            /* @conditional-compile-remove(attachment-upload) */ onRenderAttachmentUploads &&
              onRenderAttachmentUploads()
          }
        </Stack>
        {actionButtons}
      </Stack>
    </div>
  );
};

const showRichTextEditorFormatting = (isRichTextEditorToolbarShown: boolean | undefined): boolean => {
  return isRichTextEditorToolbarShown === true;
};
