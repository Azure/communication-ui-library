// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useRef } from 'react';
import {
  Stack,
  TextField,
  mergeStyles,
  IStyle,
  ITextField,
  concatStyleSets,
  IconButton,
  TooltipHost,
  ICalloutContentStyles
} from '@fluentui/react';
import { BaseCustomStyles } from '../types';
import {
  inputBoxStyle,
  inputBoxWrapperStyle,
  inputButtonStyle,
  textFieldStyle,
  textContainerStyle,
  inlineButtonsContainerStyle,
  newLineButtonsContainerStyle,
  inputBoxNewLineSpaceAffordance,
  inputButtonTooltipStyle
} from './styles/InputBoxComponent.style';

import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(at-mention) */
import { AtMentionLookupOptions, _AtMentionFlyout, AtMentionSuggestion } from './AtMentionFlyout';

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
  textValue: string;
  onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => void;
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
  /* @conditional-compile-remove(at-mention) */
  atMentionLookupOptions?: AtMentionLookupOptions;
  /* @conditional-compile-remove(at-mention) */
  onMentionAdd: (newTextValue?: string | undefined, newHTMLValue?: string | undefined) => void;
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
    children,
    atMentionLookupOptions,
    onMentionAdd
  } = props;
  const inputBoxRef = useRef(null);
  const [atMentionQueryEndIndex, setAtMentionQueryEndIndex] = useState<number | undefined>(undefined);
  const [atMentionQuery, setAtMentionQuery] = useState<string | undefined>(undefined);

  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedTextFiledStyle = mergeStyles(
    inputBoxStyle,
    inputClassName,
    props.inlineChildren ? {} : inputBoxNewLineSpaceAffordance
  );

  const mergedTextContainerStyle = mergeStyles(textContainerStyle, styles?.textFieldContainer);
  const mergedTextFieldStyle = concatStyleSets(textFieldStyle, {
    fieldGroup: styles?.textField,
    errorMessage: styles?.systemMessage
  });

  const onTexFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Uses KeyCode 229 and which code 229 to determine if the press of the enter key is from a composition session or not (Safari only)
      if (ev.nativeEvent.isComposing || ev.nativeEvent.keyCode === 229 || ev.nativeEvent.which === 229) {
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

  const onSuggestionSelected = useCallback(
    (suggestion: AtMentionSuggestion) => {
      //add default value for a trigger
      const onSuggestionSelected = atMentionLookupOptions?.onSuggestionSelected;
      onSuggestionSelected && onSuggestionSelected(suggestion);
      const trigger = atMentionLookupOptions?.trigger || '';
      const mentionQuery = atMentionQuery || '';
      const mention = trigger + mentionQuery;
      if (mention !== '' && suggestion.displayName !== undefined) {
        const displayName = suggestion.displayName || '';
        const updatedMention = trigger + displayName;
        let selectionEnd = textFieldRef?.current?.selectionEnd || 0;
        if (selectionEnd < 0) {
          selectionEnd = 0;
        } else if (selectionEnd > textValue.length) {
          selectionEnd = textValue.length;
        }
        console.log(mention.length);
        const updatedTextValue =
          textValue.substring(0, selectionEnd - mention.length) + updatedMention + textValue.substring(selectionEnd);
        onMentionAdd(updatedTextValue, updatedTextValue);
      }
      setAtMentionQuery(undefined);
      setAtMentionQueryEndIndex(undefined);
      textFieldRef?.current?.focus();
    },
    [
      atMentionLookupOptions?.onSuggestionSelected,
      atMentionLookupOptions?.trigger,
      atMentionQuery,
      onMentionAdd,
      textFieldRef,
      textValue
    ]
  );

  // Temporary implementation for AtMentionFlyout's position.
  const handleOnChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    // !isMentioning && last char is trigger
    // if (!isMentioning) {
    //   setIsMentioning(true);
    //   setAtMentionQuery(newValue);
    // } else if (isMentioning) {
    //   setIsMentioning(false);
    //   setAtMentionQuery(undefined);
    // }
    // setAtMentionQuery(newValue);
    setAtMentionQuery('Pa');
    onChange && onChange(event, newValue);
  };

  const atMentionLookupOptionsValue = { ...atMentionLookupOptions, onSuggestionSelected };
  return (
    <Stack className={mergedRootStyle}>
      <_AtMentionFlyout query={textValue} target={inputBoxRef} atMentionLookupOptions={atMentionLookupOptionsValue} />
      <div className={mergedTextContainerStyle}>
        <TextField
          autoFocus={props.autoFocus === 'sendBoxTextField'}
          data-ui-id={dataUiId}
          multiline
          autoAdjustHeight
          multiple={false}
          resizable={false}
          componentRef={textFieldRef}
          id={id}
          inputClassName={mergedTextFiledStyle}
          placeholder={placeholderText}
          value={textValue}
          onChange={handleOnChange}
          autoComplete="off"
          onKeyDown={onTexFieldKeyDown}
          styles={mergedTextFieldStyle}
          disabled={disabled}
          errorMessage={errorMessage}
          elementRef={inputBoxRef}
        />
        <Stack
          horizontal
          className={mergeStyles(props.inlineChildren ? inlineButtonsContainerStyle : newLineButtonsContainerStyle)}
        >
          {children}
        </Stack>
      </div>
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
        onRenderIcon={() => onRenderIcon(isHover)}
      />
    </TooltipHost>
  );
};
