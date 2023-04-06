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
  htmlValue?: string;
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
    htmlValue,
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

  // Current @mention query to pass to the callback
  const [mentionQuery, setMentionQuery] = useState<string | undefined>(undefined);
  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<AtMentionSuggestion[]>([]);
  // Index of the current trigger character in the text field
  const [currentTagIndex, setCurrentTagIndex] = useState<number | undefined>(undefined);

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
      const trigger = atMentionLookupOptions?.trigger || '';
      const queryString = mentionQuery || '';
      const mention = trigger + queryString;
      if (mention !== '') {
        const displayName = suggestion.displayName;
        const updatedMention = trigger + displayName;
        let selectionEnd = textFieldRef?.current?.selectionEnd || 0;
        if (selectionEnd < 0) {
          selectionEnd = 0;
        } else if (selectionEnd > textValue.length) {
          selectionEnd = textValue.length;
        }
        const updatedTextValue =
          textValue.substring(0, selectionEnd - mention.length) + updatedMention + textValue.substring(selectionEnd);
        let newHTMLValue: string | undefined;
        if (htmlValue !== undefined) {
          console.log('Not implemented');
          console.log(htmlValue);
        } else {
          newHTMLValue =
            textValue.substring(0, selectionEnd - mention.length) +
            htmlStringForMentionSuggestion(suggestion) +
            textValue.substring(selectionEnd);
        }
        onMentionAdd(updatedTextValue, newHTMLValue);
      }
      setMentionQuery(undefined);

      //set focus back to text field
      // textFieldRef?.current?.focus();
    },
    [atMentionLookupOptions?.trigger, mentionQuery, htmlValue, onMentionAdd, textFieldRef, textValue]
  );

  const htmlStringForMentionSuggestion = (suggestion: AtMentionSuggestion): string => {
    const userIdHTML = ' userId ="' + suggestion.userId + '"';
    const displayName = suggestion.displayName || '';
    const displayNameHTML = ' displayName ="' + displayName + '"';
    const suggestionTypeHTML = ' suggestionType ="' + suggestion.suggestionType + '"';
    return (
      '<msft-at-mention' + userIdHTML + displayNameHTML + suggestionTypeHTML + '>' + displayName + '</msft-at-mention>'
    );
  };

  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): Promise<void> => {
    // If we are enabled for lookups,
    if (!!atMentionLookupOptions) {
      // Go see if there's a trigger character in the text, from the end of the string
      const lastTagIndex = newValue?.lastIndexOf(atMentionLookupOptions?.trigger ?? '@') ?? -1;

      if (!!currentTagIndex && !!lastTagIndex) {
        setCurrentTagIndex(lastTagIndex);
      } else {
        // In the middle of a @mention lookup
        if (lastTagIndex === -1) {
          setCurrentTagIndex(undefined);
          setMentionSuggestions([]);
        } else {
          if (lastTagIndex > -1) {
            // This might want to be changed to not include the lookup tag. Currently it does.
            const query = newValue?.slice(lastTagIndex);
            if (!!query) {
              const suggestions = (await atMentionLookupOptions?.onQueryUpdated(query)) ?? [];
              setMentionSuggestions(suggestions);
            }
          }
        }
      }
    }
    onChange && onChange(event, newValue);
  };

  return (
    <Stack className={mergedRootStyle}>
      {mentionSuggestions.length > 0 && (
        <_AtMentionFlyout
          suggestions={mentionSuggestions}
          target={inputBoxRef}
          onSuggestionSelected={onSuggestionSelected}
        />
      )}
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
