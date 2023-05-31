// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback } from 'react';
import {
  Stack,
  TextField,
  mergeStyles,
  IStyle,
  ITextField,
  concatStyleSets,
  IconButton,
  TooltipHost,
  ICalloutContentStyles,
  ITextFieldProps
} from '@fluentui/react';
import { BaseCustomStyles } from '../types';
import {
  inputBoxStyle,
  inputBoxWrapperStyle,
  inputButtonStyle,
  textFieldStyle,
  textContainerStyle,
  newLineButtonsContainerStyle,
  inputBoxNewLineSpaceAffordance,
  inputButtonTooltipStyle,
  iconWrapperStyle
} from './styles/InputBoxComponent.style';
import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions, _MentionPopover } from './MentionPopover';
/* @conditional-compile-remove(mention) */
import { TextFieldWithMention, TextFieldWithMentionProps } from './TextFieldWithMention/TextFieldWithMention';
import { isEnterKeyEventFromCompositionSession } from './utils/keyboardNavigation';

/**
 * @private
 */
export interface InputBoxStylesProps extends BaseCustomStyles {
  /** Styles for the text field. */
  textField?: IStyle;
  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;
  /** Styles for customizing the container of the text field */
  textFieldContainer?: IStyle;
}

type InputBoxComponentProps = {
  children: ReactNode;
  /**
   * Inline child elements passed in. Setting to false will mean they are on a new line.
   */
  inlineChildren: boolean;
  'data-ui-id'?: string;
  id?: string;
  textValue: string; // This could be plain text or HTML.
  onChange: (event?: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
  textFieldRef?: React.RefObject<ITextField>;
  inputClassName?: string;
  placeholderText?: string;
  supportNewline?: boolean;
  maxLength: number;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnterKeyDown?: () => void;
  errorMessage?: string | React.ReactElement;
  disabled?: boolean;
  styles?: InputBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
};

/**
 * @private
 */
export const InputBoxComponent = (props: InputBoxComponentProps): JSX.Element => {
  const {
    styles,
    id,
    'data-ui-id': dataUiId,
    textValue,
    onChange,
    textFieldRef,
    placeholderText,
    onKeyDown,
    onEnterKeyDown,
    supportNewline,
    inputClassName,
    errorMessage,
    disabled,
    children
  } = props;

  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedTextFiledStyle = mergeStyles(
    inputBoxStyle,
    inputClassName,
    props.inlineChildren ? {} : inputBoxNewLineSpaceAffordance
  );

  const mergedTextContainerStyle = mergeStyles(textContainerStyle, styles?.textFieldContainer);
  const mergedTextFieldStyle = concatStyleSets(textFieldStyle, {
    fieldGroup: styles?.textField,
    errorMessage: styles?.systemMessage,
    suffix: {
      backgroundColor: 'transparent',
      // Remove empty space in the suffix area when adding newline-style buttons
      display: props.inlineChildren ? 'flex' : 'contents',
      padding: '0 0.25rem'
    }
  });

  const mergedChildrenStyle = mergeStyles(props.inlineChildren ? {} : newLineButtonsContainerStyle);

  const onTextFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isEnterKeyEventFromCompositionSession(ev)) {
        return;
      }
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();
        onEnterKeyDown && onEnterKeyDown();
      }
      onKeyDown && onKeyDown(ev);
    },
    [onEnterKeyDown, onKeyDown, supportNewline]
  );

  const onRenderChildren = (): JSX.Element => {
    return (
      <Stack horizontal className={mergedChildrenStyle}>
        {children}
      </Stack>
    );
  };

  const renderTextField = (): JSX.Element => {
    const textFieldProps: ITextFieldProps = {
      autoFocus: props.autoFocus === 'sendBoxTextField',
      multiline: true,
      autoAdjustHeight: true,
      multiple: false,
      resizable: false,
      componentRef: textFieldRef,
      id,
      inputClassName: mergedTextFiledStyle,
      placeholder: placeholderText,
      autoComplete: 'off',
      styles: mergedTextFieldStyle,
      disabled,
      errorMessage,
      onRenderSuffix: onRenderChildren
    };
    /* @conditional-compile-remove(mention) */
    const textFieldWithMentionProps: TextFieldWithMentionProps = {
      textFieldProps: textFieldProps,
      dataUiId: dataUiId,
      textValue: textValue,
      onChange: onChange,
      onKeyDown: onKeyDown,
      onEnterKeyDown: onEnterKeyDown,
      textFieldRef: textFieldRef,
      supportNewline: supportNewline,
      mentionLookupOptions: props.mentionLookupOptions
    };
    /* @conditional-compile-remove(mention) */
    if (props.mentionLookupOptions) {
      return <TextFieldWithMention {...textFieldWithMentionProps} />;
    }
    return (
      <TextField
        {...textFieldProps}
        data-ui-id={dataUiId}
        value={textValue}
        onChange={onChange}
        onKeyDown={onTextFieldKeyDown}
      />
    );
  };

  return (
    <Stack className={mergedRootStyle}>
      <div className={mergedTextContainerStyle}>{renderTextField()}</div>
    </Stack>
  );
};

/**
 * Props for displaying a send button besides the text input area.
 *
 * @private
 */
export type InputBoxButtonProps = {
  onRenderIcon: (isHover: boolean) => JSX.Element;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
  tooltipContent?: string;
};

/**
 * @private
 */
export const InputBoxButton = (props: InputBoxButtonProps): JSX.Element => {
  const { onRenderIcon, onClick, ariaLabel, className, id, tooltipContent } = props;
  const [isHover, setIsHover] = useState(false);
  const mergedButtonStyle = mergeStyles(inputButtonStyle, className);

  const theme = useTheme();
  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  // Place callout with no gap between it and the button.
  const calloutProps = {
    gapSpace: 0,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };
  return (
    <TooltipHost hostClassName={inputButtonTooltipStyle} content={tooltipContent} calloutProps={{ ...calloutProps }}>
      <IconButton
        className={mergedButtonStyle}
        ariaLabel={ariaLabel}
        onClick={onClick}
        id={id}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        // VoiceOver fix: Avoid icon from stealing focus when IconButton is double-tapped to send message by wrapping with Stack with pointerEvents style to none
        onRenderIcon={() => <Stack className={iconWrapperStyle}>{onRenderIcon(isHover)}</Stack>}
      />
    </TooltipHost>
  );
};
