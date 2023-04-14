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
import { tag } from 'type-fest/source/opaque';

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
  onMentionAdd?: (newTextValue?: string) => void;
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

  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<AtMentionSuggestion[]>([]);

  // Index of the current trigger character in the text field
  const [currentTagIndex, setCurrentTagIndex] = useState<number>(-1);
  const [inputTextValue, setInputTextValue] = useState<string>('');

  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = atMentionLookupOptions?.trigger || defaultMentionTrigger;
    // Get a plain text version to display in the input box, resetting state
    const tags = parseToTags(textValue);
    const plainText = plainTextFromParsedTags(textValue, tags, trigger);
    // Provide the plain text string to the inputTextValue
    setInputTextValue(plainText);
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
      const selectionStart = textFieldRef?.current?.selectionStart;
      let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
      if (selectionEnd < 0) {
        selectionEnd = 0;
      } else if (selectionEnd > inputTextValue.length) {
        selectionEnd = inputTextValue.length;
      }
      // TODO: Use the HTML value in the control
      // FIGURE OUT WHERE TO INSERT THE NEW TAG
      // INSERT IT INTO THE TEXT FIELD
      let queryText = inputTextValue.slice(currentTagIndex).split(' ')[0];
      const oldTags = parseToTags(textValue);
      //TODO: add check if we are in the middle of another tag

      const triggerText = atMentionLookupOptions?.trigger ?? defaultMentionTrigger;
      let htmlIndex = htmlMentionIndex(textValue, oldTags, triggerText, currentTagIndex, queryText, inputTextValue);
      if (htmlIndex < 0) {
        htmlIndex = 0;
      } else if (htmlIndex > textValue.length) {
        htmlIndex = textValue.length;
      }

      const firstPart = textValue.substring(0, htmlIndex);
      const lastPart = textValue.substring(htmlIndex + queryText.length);

      // TODO: make this logic work properly
      const updatedText = firstPart + htmlStringForMentionSuggestion(suggestion) + lastPart;

      const tags = parseToTags(updatedText);
      const plainText = plainTextFromParsedTags(
        updatedText,
        tags,
        props.atMentionLookupOptions?.trigger ?? defaultMentionTrigger
      );
      setInputTextValue(plainText);
      onMentionAdd && onMentionAdd(updatedText);
      setMentionSuggestions([]);
      setCurrentTagIndex(-1);
      //TODO: add focus to the correct position
      textFieldRef?.current?.focus();
    },
    [atMentionLookupOptions?.trigger, onMentionAdd, textFieldRef, inputTextValue]
  );

  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): Promise<void> => {
    const selectionEnd = textFieldRef?.current?.selectionEnd || -1;
    // If we are enabled for lookups,
    if (!!atMentionLookupOptions) {
      //TODO; add check for the last space and check if it isn't between mention trigger and
      // Look at the range of the change for a trigger character
      const triggerText = atMentionLookupOptions?.trigger ?? defaultMentionTrigger;
      const triggerPriorIndex = newValue?.lastIndexOf(triggerText, selectionEnd - 1);
      // trigger is found
      if (triggerPriorIndex !== undefined) {
        const isNextSpaceSymbol = newValue?.slice(triggerPriorIndex, triggerPriorIndex + 1) === ' ';
        const wordAtSelection = newValue?.slice(triggerPriorIndex, selectionEnd);
        if (wordAtSelection === triggerText) {
          // start of the mention
          let tagIndex = selectionEnd - triggerText.length;
          if (tagIndex < 0) {
            tagIndex = 0;
          }
          setCurrentTagIndex(tagIndex);
        } else if (isNextSpaceSymbol) {
        } else {
        }

        console.log('currentTagIndex', currentTagIndex);
        if (currentTagIndex === -1) {
          setMentionSuggestions([]);
        } else {
          // In the middle of a @mention lookup
          if (currentTagIndex > -1) {
            // This might want to be changed to not include the lookup tag. Currently it does.
            // TODO: work in mentionQuery state or remove it.
            // const query = newValue?.substring(currentTagIndex, selectionEnd);
            const query = wordAtSelection;
            if (query !== undefined) {
              const suggestions = (await atMentionLookupOptions?.onQueryUpdated(query)) ?? [];
              setMentionSuggestions(suggestions);
            }
          }
        }
      } else {
        // if ()
      }
    }
    // let updatedValue = newValue;
    // if (selectionEnd === inputTextValue.length) {
    //   // add text to the end of the string
    //   const findFirstDiff = (str1, str2) => str2[[...str1].findIndex((el, index) => el !== str2[index])];
    //   const diff = findFirstDiff(inputTextValue, newValue);
    //   updatedValue =
    // }
    // TODO: filter the call back to the parent only after setting the text with HTML where
    // appropriate.
    // TODO: should be html text!!!
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
 * Object representing a parsed tag
 *
 * @private
 */
type ParsedTag = {
  tagType: string;
  htmlOpenTagStartIndex: number;
  openTagBody: string;
  htmlCloseTagStartIndex?: number; // Might not have a close tag
  closeTagLength?: number; // Might not have a close tag
  content?: string; // Might not have content
  subTags?: ParsedTag[]; // Tags can contain other tags
  plainTextStartIndex: number;
  plainTextEndIndex: number;
};

/**
 * Go through the text and parse out the tags
 * This should be only <msft-at-mention> tags for now...
 * We do need to process all other HTML tags to text though.
 *
 * @private
 */
const parseToTags = (text: string): ParsedTag[] => {
  const tags: ParsedTag[] = [];
  let parseIndex = 0;

  while (parseIndex < text.length) {
    const openTagIndex = text.indexOf('<', parseIndex);
    if (openTagIndex === -1) {
      break;
    }
    const openTagCloseIndex = text.indexOf('>', openTagIndex);
    const openTag = text.slice(openTagIndex + 1, openTagCloseIndex);
    const tagType = openTag.split(' ')[0];

    if (openTag[openTag.length - 1] === '/') {
      // Self closing tag, no corresponding close tag
      const selfClosingBody = openTag.slice(0, openTag.length - 1);
      const tagLength = openTagCloseIndex - openTagIndex;
      tags.push({
        tagType: tagType.slice(0, tagType.length - 1).toLowerCase(),
        openTagBody: selfClosingBody,
        htmlOpenTagStartIndex: openTagIndex
      });
      parseIndex = openTagIndex + tagLength - 1;
    } else {
      // Go find the close tag
      const tagToFind = '</' + openTag.split(' ')[0] + '>';
      const closeTagIndex = text.indexOf(tagToFind, openTagCloseIndex);
      if (closeTagIndex === -1) {
        console.error('Could not find close tag for ' + openTag);
        break;
      } else {
        const closeTagLength = tagToFind.length;
        const content = text.slice(openTagIndex + openTag.length + 2, closeTagIndex);
        const subTags = parseToTags(content);

        tags.push({
          tagType: openTag.split(' ')[0].toLowerCase(),
          openTagBody: openTag,
          htmlOpenTagStartIndex: openTagIndex,
          htmlCloseTagStartIndex: closeTagIndex,
          closeTagLength,
          content,
          subTags
        });
        parseIndex = closeTagIndex + closeTagLength;
      }
    }
  }
  return tags;
};

/**
 * Given the text and the parsed tags, return the plain text to render in the input box
 *
 * @private
 */
const plainTextFromParsedTags = (textBlock: string, tags: ParsedTag[], trigger: string): string => {
  let text = '';
  let tagIndex = 0;
  let previousTagEndIndex = 0;

  while (tagIndex < tags.length) {
    const tag = tags[tagIndex];
    // Add all the text from the last tag close to this one open
    text += textBlock.slice(previousTagEndIndex, tag.htmlOpenTagStartIndex);
    if (tag.tagType === 'msft-at-mention') {
      text += trigger;
    }

    // If there are sub tags, go through them and add their text
    if (!!tag.subTags && tag.subTags.length > 0) {
      text += plainTextFromParsedTags(tag.content ?? '', tag.subTags, trigger);
    } else if (!!tag.content) {
      // Otherwise just add the content
      text += tag.content;
    }
    // Move the indices
    if (!!tag.htmlCloseTagStartIndex && tag.closeTagLength) {
      previousTagEndIndex = tag.htmlCloseTagStartIndex + tag.closeTagLength;
    } else {
      // Self-closing tag
      previousTagEndIndex = tag.htmlOpenTagStartIndex + tag.openTagBody.length + 3; // 3 for the < > and /
    }
    tagIndex++;
  }
  // Add the text after the last tag
  if (tagIndex < textBlock.length) {
    text += textBlock.slice(previousTagEndIndex);
  }
  return text;
};

const htmlMentionIndex = (
  htmlTextBlock: string,
  tags: ParsedTag[],
  trigger: string,
  plainStringIndex: number,
  query: string, // includes trigger
  plainTextBlock?: string
): number => {
  console.log('htmlTextBlock', htmlTextBlock);
  console.log('plainStringIndex', plainStringIndex);
  if (tags.length === 0) {
    // no tags were added yet
    return plainStringIndex;
  } else if (plainTextBlock !== undefined && plainStringIndex + query.length === plainTextBlock.length) {
    // tags will be added at the end of the current text
    return htmlTextBlock.length - 1;
  } else {
    // tag will be added in the middle of the text

    let text = '';
    let tagIndex = 0;
    let previousTagEndIndex = 0;
    let htmlIndex = 0;

    while (tagIndex < tags.length && htmlIndex < htmlTextBlock.length) {
      const tag = tags[tagIndex];
      // Add all the text from the last tag close to this one open
      const textBetweenTags = htmlTextBlock.slice(previousTagEndIndex, tag.htmlOpenTagStartIndex);
      text += textBetweenTags;
      if (plainStringIndex <= textBetweenTags.length) {
        //TODO: check!
        htmlIndex += textBetweenTags.length + plainStringIndex;
        return htmlIndex;
      }
      if (tag.tagType === 'msft-at-mention') {
        text += trigger;
        htmlIndex += trigger.length;
      }

      // If there are sub tags, go through them and add their text
      if (!!tag.subTags && tag.subTags.length > 0) {
        htmlIndex += htmlMentionIndex(
          tag.content ?? '',
          tag.subTags ?? [],
          trigger,
          plainStringIndex - text.length,
          query
        );
        text += plainTextFromParsedTags(tag.content ?? '', tag.subTags, trigger);
      } else if (!!tag.content) {
        // Otherwise just add the content
        text += tag.content;
        if (plainStringIndex < tag.content.length) {
          //TODO: check!
          htmlIndex += plainStringIndex;
          return htmlIndex;
        } else {
          htmlIndex += tag.content.length;
        }
      }
      // Move the indices
      if (!!tag.htmlCloseTagStartIndex && tag.closeTagLength) {
        previousTagEndIndex = tag.htmlCloseTagStartIndex + tag.closeTagLength;
      } else {
        // Self-closing tag
        previousTagEndIndex = tag.htmlOpenTagStartIndex + tag.openTagBody.length + 3; // 3 for the < > and /
      }
      tagIndex++;
    }
    // Add the text after the last tag
    if (previousTagEndIndex < htmlTextBlock.length) {
      if (plainStringIndex > previousTagEndIndex) {
        htmlIndex += htmlTextBlock.length - previousTagEndIndex + plainStringIndex;
      }
      text += htmlTextBlock.slice(previousTagEndIndex);
    }
    console.log('text', text);
    console.log('htmlTextBlock', htmlTextBlock);
    console.log('htmlIndex', htmlIndex);
    return htmlIndex;
  }
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
