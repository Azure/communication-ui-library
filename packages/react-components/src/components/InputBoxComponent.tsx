// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useEffect, useRef } from 'react';
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

const defaultMentionTrigger = '@';
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
  onMentionAdd: (newTextValue?: string) => void;
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

  // Current @mention query to pass to the callback
  const [mentionQuery, setMentionQuery] = useState<string | undefined>(undefined);
  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<AtMentionSuggestion[]>([]);

  // Index of the current trigger character in the text field
  const [currentTagIndex, setCurrentTagIndex] = useState<number | undefined>(undefined);
  const [inputTextValue, setInputTextValue] = useState<string>('');

  // Parse the text and look for <msft-at-mention> tags.
  useEffect(() => {
    // Get a plain text version to display in the input box, resetting state
    console.log('Need to parse input text and set the html versions if needed');
    parseStringForMentions(textValue, atMentionLookupOptions?.trigger || defaultMentionTrigger);
    // Parse the text and look for <msft-at-mention> tags.
    // Store the index and range of the tags.
    // Store the details in an ordered array.
    // [ {
    //   tagType: string,
    //   htmlOpenTagStartIndex: number,
    //   openTagLength: number,
    //   htmlCloseTagStartIndex: number, // Might not have a close tag
    //   closeTagLength: number,        // Might not have a close tag
    //   }
    // ]
    //
    // Provide the plain text string to the inputTextValue
    // setInputTextValue(parsedText)
    //
  }, [textValue, atMentionLookupOptions?.trigger]);

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

  const onTextFieldKeyDown = useCallback(
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
      // Go back to the last trigger character and insert the HTML for the suggestion
      const lastTriggerIndex = inputTextValue.lastIndexOf(atMentionLookupOptions?.trigger || defaultMentionTrigger);

      // TODO: This will ultimately need to handle the case where the editor is not at the end of the text
      let updatedText = inputTextValue.substring(0, lastTriggerIndex);
      updatedText += htmlStringForMentionSuggestion(suggestion);

      setInputTextValue(updatedText);
      onMentionAdd(updatedText);
      setMentionQuery(undefined);
      setMentionSuggestions([]);
      setCurrentTagIndex(undefined);
    },
    [atMentionLookupOptions?.trigger, onMentionAdd, textFieldRef, inputTextValue]
  );

  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): Promise<void> => {
    // If we are enabled for lookups,
    if (!!atMentionLookupOptions) {
      // Go see if there's a trigger character in the text, from the end of the string
      const triggerText = atMentionLookupOptions?.trigger ?? defaultMentionTrigger;
      const lastTagIndex = newValue?.lastIndexOf(triggerText) ?? -1;
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
            // TODO: work in mentionQuery state or remove it.
            const query = newValue?.slice(lastTagIndex).split(' ')[0];
            if (!!query) {
              console.log('getting suggestions for query: ', query);
              setMentionQuery(query.slice(triggerText.length));
              const suggestions = (await atMentionLookupOptions?.onQueryUpdated(query)) ?? [];
              setMentionSuggestions(suggestions);
            }
          }
        }
      }
    }
    // TODO: filter the call back to the parent only after setting the text with HTML where
    // appropriate.
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
          value={inputTextValue}
          onChange={(e, newValue) => {
            setInputTextValue(newValue ?? '');
            handleOnChange(e, newValue);
          }}
          autoComplete="off"
          onKeyDown={onTextFieldKeyDown}
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

/**
 * @private
 */
type ParsedTag = {
  tagType: string;
  htmlOpenTagStartIndex: number;
  openTagLength: number;
  htmlCloseTagStartIndex?: number; // Might not have a close tag
  closeTagLength?: number; // Might not have a close tag
};

/**
 * Go through the text and parse out the tags
 * This should be only <msft-at-mention> tags for now...
 * We do need to remove all other HTML tags though...
 *
 * @private
 */
const parseStringForMentions = (text: string, trigger: string): ParsedTag[] => {
  let index = 0;
  let tags: ParsedTag[] = [];
  let previousLetter = '';
  console.log(text);
  let currentOpenTagIndex = -1;
  let currentTagStack: ParsedTag[] = [];

  while (index < text.length) {
    const letter = text[index];
    if (letter == '<') {
      if (currentOpenTagIndex === -1) {
        // This is the start of a tag
        currentOpenTagIndex = index;
      } else {
        console.error('Found a second open tag before a close tag!');
        break;
      }
    } else if (letter == '>') {
      if (currentOpenTagIndex === -1) {
        console.error('Found a close tag before an open tag!');
        break;
      } else {
        // This is the end of a tag
        const tagBody = text.slice(currentOpenTagIndex + 1, index);
        console.log('Tag body is ' + tagBody);

        if (tagBody[tagBody.length - 1] === '/') {
          // It's a self closing tag)
        } else if (tagBody[0] === '/') {
          // It's a close tag
          let currentTag = currentTagStack.pop();
          if (currentTag) {
            currentTag.htmlCloseTagStartIndex = currentOpenTagIndex;
            currentTag.closeTagLength = index - currentOpenTagIndex + 1;
            tags.push(currentTag);
            currentTag = undefined;
          } else {
            console.error('Should have an existing tag to complete!');
          }
        } else {
          // It's an open tag
          const tagElements = tagBody.split(' ');
          const tagType = tagElements[0];
          console.log(tagElements);

          let currentTag = {
            htmlOpenTagStartIndex: currentOpenTagIndex,
            openTagLength: index - currentOpenTagIndex + 1,
            tagType: tagType
          };
          currentTagStack.push(currentTag);
        }
        currentOpenTagIndex = -1;
      }
    }

    previousLetter = letter;
    index++;
  }

  const plainText = plainTextFromParsedTags(text, tags, trigger);
  // console.log(plainText);
  return tags;
};

/**
 * Given the text and the parsed tags, return the plain text to render in the input box
 *
 * @private
 */
const plainTextFromParsedTags = (textBlock: string, tags: ParsedTag[], trigger: string): string => {
  let text = '';
  let textBlockIndex = 0;
  let currentTagIndex = 0;

  while (textBlockIndex < textBlock.length) {
    if (currentTagIndex < tags.length) {
      // Grab the tag body text up to the next tag start or current tag close

      const tag = tags[currentTagIndex];

      // Have to consider nesting tags
      const nextTagStart = tags[currentTagIndex + 1]?.htmlOpenTagStartIndex ?? tag.htmlCloseTagStartIndex;
      // console.log(nextTagStart, tag.htmlOpenTagStartIndex);
      // Start of contents = end of open tag
      const tagText = textBlock.slice(tag.htmlOpenTagStartIndex + tag.openTagLength, nextTagStart);
      // console.log(tag.htmlOpenTagStartIndex, nextTagStart, tagText);
    }
    textBlockIndex++;
  }

  // for (const tag of tags) {
  //   console.log(tag);
  //   if (tag.tagType == 'msft-at-mention') {
  //     text += trigger;
  //     text += textBlock.slice(tag.htmlOpenTagStartIndex + tag.openTagLength,
  //                             tag.htmlCloseTagStartIndex);
  //   } else {
  //     // Any other tag, grab the text
  //   }
  // }
  return text;
};

const htmlStringForMentionSuggestion = (suggestion: AtMentionSuggestion): string => {
  const userIdHTML = ' userId ="' + suggestion.userId + '"';
  const displayName = suggestion.displayName || '';
  const displayNameHTML = ' displayName ="' + displayName + '"';
  const suggestionTypeHTML = ' suggestionType ="' + suggestion.suggestionType + '"';
  return (
    '<msft-at-mention' + userIdHTML + displayNameHTML + suggestionTypeHTML + '>' + displayName + '</msft-at-mention>'
  );
};
