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
  onChange: (
    newValue?: string,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ removedInlineImages?: Record<string, string>[]
  ) => void;
  onEnterKeyDown?: () => void;
  editorComponentRef: React.RefObject<RichTextEditorComponentRef>;
  // Partial needs to be removed when the rich text editor feature goes to GA
  strings: Partial<RichTextSendBoxStrings>;
  disabled: boolean;
  actionComponents: ReactNode;
  /* @conditional-compile-remove(file-sharing-acs) */
  onRenderAttachmentUploads?: () => JSX.Element;
  /* @conditional-compile-remove(file-sharing-acs) */
  hasAttachments?: boolean;
  // props for min and max height for the rich text editor
  // otherwise the editor will grow to fit the content
  richTextEditorStyleProps: (isExpanded: boolean) => RichTextEditorStyleProps;
  isHorizontalLayoutDisabled?: boolean;
  autoFocus?: 'sendBoxTextField';
  onTyping?: () => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;
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
    /* @conditional-compile-remove(file-sharing-acs) */
    onRenderAttachmentUploads,
    /* @conditional-compile-remove(file-sharing-acs) */
    hasAttachments,
    richTextEditorStyleProps,
    isHorizontalLayoutDisabled = false,
    autoFocus,
    onTyping,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onInsertInlineImage
  } = props;
  const theme = useTheme();
  // undefined is used to indicate that the rich text editor toolbar state wasn't changed yet
  const [showRichTextEditorFormatting, setShowRichTextEditorFormatting] = useState<boolean | undefined>(undefined);
  const [contentModel, setContentModel] = useState<ContentModelDocument | undefined>(undefined);

  const onRenderRichTextEditorIcon = useCallback(
    (isHover: boolean) => {
      const isRichTextEditorToolbarShown = showRichTextEditorFormatting === true;
      return (
        <Icon
          iconName={
            isHover || isRichTextEditorToolbarShown ? 'RichTextEditorButtonIconFilled' : 'RichTextEditorButtonIcon'
          }
          className={richTextFormatButtonIconStyle(theme, !disabled && (isHover || isRichTextEditorToolbarShown))}
        />
      );
    },
    [disabled, showRichTextEditorFormatting, theme]
  );

  useEffect(() => {
    if (showRichTextEditorFormatting !== undefined) {
      // Focus the editor when toolbar shown/hidden
      editorComponentRef.current?.focus();
    }
    // we don't need execute this useEffect if editorComponentRef is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRichTextEditorFormatting]);

  const actionButtons = useMemo(() => {
    return (
      <Stack.Item align="end" className={richTextActionButtonsStackStyle}>
        <Stack horizontal>
          <InputBoxButton
            onRenderIcon={onRenderRichTextEditorIcon}
            onClick={(e) => {
              const isRichTextEditorToolbarShown = showRichTextEditorFormatting === true;
              setShowRichTextEditorFormatting(!isRichTextEditorToolbarShown);
              e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
            }}
            ariaLabel={strings.richTextFormatButtonTooltip}
            tooltipContent={strings.richTextFormatButtonTooltip}
            className={richTextActionButtonsStyle}
            data-testId={'rich-text-input-box-format-button'}
            ariaExpanded={showRichTextEditorFormatting}
          />
          <Icon iconName="RichTextDividerIcon" className={richTextActionButtonsDividerStyle(theme)} />
          {actionComponents}
        </Stack>
      </Stack.Item>
    );
  }, [
    actionComponents,
    onRenderRichTextEditorIcon,
    showRichTextEditorFormatting,
    strings.richTextFormatButtonTooltip,
    theme
  ]);

  const richTextEditorStyle = useMemo(() => {
    return richTextEditorStyleProps(showRichTextEditorFormatting === true);
  }, [richTextEditorStyleProps, showRichTextEditorFormatting]);

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (isEnterKeyEventFromCompositionSession(ev)) {
        return;
      }
      const isRichTextEditorToolbarShown = showRichTextEditorFormatting === true;
      if (ev.key === 'Enter' && ev.shiftKey === false && !isRichTextEditorToolbarShown) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      } else {
        onTyping?.();
      }
    },
    [onEnterKeyDown, showRichTextEditorFormatting, onTyping]
  );

  const useHorizontalLayout = useMemo(() => {
    const isRichTextEditorToolbarShown = showRichTextEditorFormatting === true;
    return (
      !isHorizontalLayoutDisabled &&
      !isRichTextEditorToolbarShown &&
      /* @conditional-compile-remove(file-sharing-acs) */ !hasAttachments
    );
  }, [
    isHorizontalLayoutDisabled,
    showRichTextEditorFormatting,
    /* @conditional-compile-remove(file-sharing-acs) */ hasAttachments
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
              showRichTextEditorFormatting={showRichTextEditorFormatting === true}
              styles={richTextEditorStyle}
              autoFocus={autoFocus}
              onContentModelUpdate={onContentModelUpdate}
              /* @conditional-compile-remove(rich-text-editor-image-upload) */
              onPaste={props.onPaste}
              /* @conditional-compile-remove(rich-text-editor-image-upload) */
              onInsertInlineImage={onInsertInlineImage}
            />
          </Stack.Item>
          {/* @conditional-compile-remove(file-sharing-acs) */ onRenderAttachmentUploads && onRenderAttachmentUploads()}
        </Stack>
        {actionButtons}
      </Stack>
    </div>
  );
};
