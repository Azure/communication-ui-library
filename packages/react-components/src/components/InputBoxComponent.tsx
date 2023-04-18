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
  const [tagsValue, setTagsValue] = useState<UpdatedParsedTag[]>([]);

  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = atMentionLookupOptions?.trigger || defaultMentionTrigger;
    console.log('textValue', textValue);
    const [tags, plainText] = parseHTMLText(textValue, trigger);
    console.log('tags', tags);
    console.log('plainText', plainText);
    // Get a plain text version to display in the input box, resetting state
    // const tags = parseToTags(textValue);
    // const plainText = plainTextFromParsedTags(textValue, tags, trigger);
    // Provide the plain text string to the inputTextValue
    setInputTextValue(plainText);
    setTagsValue(tags);
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

  const updateMentionSuggestions = useCallback(
    (suggestions: AtMentionSuggestion[]) => {
      setMentionSuggestions(suggestions);
      //TODO: add focus to the correct position
      textFieldRef?.current?.focus();
    },
    [textFieldRef]
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
      const queryText = inputTextValue.substring(currentTagIndex).split(' ')[0];
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

      const [tags, plainText] = parseHTMLText(updatedText, triggerText);
      setInputTextValue(plainText);
      onMentionAdd && onMentionAdd(updatedText);
      updateMentionSuggestions([]);
      setCurrentTagIndex(-1);
    },
    [
      textFieldRef,
      inputTextValue,
      currentTagIndex,
      textValue,
      atMentionLookupOptions?.trigger,
      onMentionAdd,
      updateMentionSuggestions
    ]
  );

  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedValue?: string | undefined
  ): Promise<void> => {
    let newValue = updatedValue;
    if (newValue === undefined) {
      newValue = '';
    }

    const newTextLength = newValue.length;
    let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
    if (selectionEnd < 0) {
      selectionEnd = 0;
    } else if (selectionEnd > newTextLength) {
      selectionEnd = newTextLength - 1;
    }
    // If we are enabled for lookups,
    if (atMentionLookupOptions !== undefined) {
      //TODO; add check for the last space and check if it isn't between mention trigger and
      // Look at the range of the change for a trigger character
      const triggerText = atMentionLookupOptions?.trigger ?? defaultMentionTrigger;
      const triggerPriorIndex = newValue?.lastIndexOf(triggerText, selectionEnd - 1);
      // trigger is found
      if (triggerPriorIndex !== undefined) {
        const isSpaceBeforeTrigger = newValue?.substring(triggerPriorIndex - 1, triggerPriorIndex) === ' ';
        const wordAtSelection = newValue?.substring(triggerPriorIndex, selectionEnd);
        let tagIndex = currentTagIndex;
        if (!isSpaceBeforeTrigger && triggerPriorIndex !== 0) {
          //no space before the trigger <- continuation of the previous word
          tagIndex = -1;
          setCurrentTagIndex(tagIndex);
        } else if (wordAtSelection === triggerText) {
          // start of the mention
          tagIndex = selectionEnd - triggerText.length;
          if (tagIndex < 0) {
            tagIndex = 0;
          }
          setCurrentTagIndex(tagIndex);
        }

        console.log('currentTagIndex', currentTagIndex);
        console.log('tagIndex', tagIndex);
        if (tagIndex === -1) {
          updateMentionSuggestions([]);
        } else {
          // In the middle of a @mention lookup
          if (tagIndex > -1) {
            const query = wordAtSelection.substring(triggerText.length, wordAtSelection.length);
            if (query !== undefined) {
              const suggestions = (await atMentionLookupOptions?.onQueryUpdated(query)) ?? [];
              updateMentionSuggestions(suggestions);
            }
          }
        }
      }
    }
    //TODO: check if there are tags, otherwise just change text value without calculations
    const oldTextLength = inputTextValue.length;
    // find indexes -> find strings diff -> check where the diff is -> change -> move all tags

    let changeStart = 0;
    let newChangeEnd = 0;
    let oldChangeEnd = 0;
    const length = Math.min(newTextLength, oldTextLength);

    for (let i = 0; i < length; i++) {
      console.log(i + ': ' + newValue[i] + ' -> ' + inputTextValue[i]);
      if (newValue[i] !== inputTextValue[i]) {
        // the symbol with changeStart index is updated
        changeStart = i;
        break;
      } else if (i === length - 1 && newValue[i] === inputTextValue[i]) {
        // the symbol is added at the end of inputTextValue
        changeStart = length;
        break;
      }
    }

    console.log('changeStart', changeStart);
    console.log('oldTextLength', oldTextLength);
    console.log('newTextLength', newTextLength);
    if (oldTextLength < newTextLength) {
      //insert or replacement
      if (oldTextLength === changeStart) {
        // when change was at the end of string
        newChangeEnd = newTextLength - 1;
        oldChangeEnd = oldTextLength;
      }
      for (let i = 1; i < newTextLength && oldTextLength - i > changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        console.log(i + ': ' + newValue[newChangeEnd] + ' -> ' + inputTextValue[oldChangeEnd]);

        if (newValue[newChangeEnd] !== inputTextValue[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
    } else if (oldTextLength > newTextLength) {
      //deletion or replacement
      if (newTextLength === changeStart) {
        // when change was at the end of string
        newChangeEnd = newTextLength;
        oldChangeEnd = oldTextLength - 1;
      }
      for (let i = 1; i < oldTextLength && newTextLength - i > changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        console.log(i + ': ' + newValue[newChangeEnd] + ' -> ' + inputTextValue[oldChangeEnd]);

        if (newValue[newChangeEnd] !== inputTextValue[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
    } else {
      //replacement
      for (let i = 1; i < oldTextLength && oldTextLength - i > changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;

        if (newValue[newChangeEnd] !== inputTextValue[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
    }
    console.log('oldChangeEnd', oldChangeEnd);
    console.log('newChangeEnd', newChangeEnd);
    console.log(
      'inputTextValue.substring(changeStart, oldChangeEnd)',
      inputTextValue.substring(changeStart, oldChangeEnd + 1)
    );
    console.log('newValue.substring(changeStart, newChangeEnd)', newValue.substring(changeStart, newChangeEnd + 1));
    const updatedHTML = updateHTML(
      textValue,
      inputTextValue,
      newValue,
      tagsValue,
      changeStart,
      oldChangeEnd,
      newValue.substring(changeStart, newChangeEnd + 1)
    );
    console.log('updatedHTML', updatedHTML);
    // const updatedHTML =
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
    onChange && onChange(event, updatedHTML);
  };

  return (
    <Stack className={mergedRootStyle}>
      {mentionSuggestions.length > 0 && (
        <_AtMentionFlyout
          suggestions={mentionSuggestions}
          target={inputBoxRef}
          onSuggestionSelected={onSuggestionSelected}
          onDismiss={() => {
            updateMentionSuggestions([]);
          }}
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
};

/**
 * Object representing a parsed tag
 *
 * @private
 */
type UpdatedParsedTag = {
  tagType: string;
  htmlOpenTagStartIndex: number;
  openTagBody: string;
  htmlCloseTagStartIndex?: number; // Might not have a close tag
  closeTagLength?: number; // Might not have a close tag
  content?: string; // Might not have content
  subTags?: ParsedTag[]; // Tags can contain other tags
  plainTextStartIndex: number; //position where the open tag should begin
  plainTextEndIndex?: number; // position where the open tag should begin. Might not have a close tag
};

/**
 * Go through the text and parse out the tags and plain text
 * This should be only <msft-at-mention> tags for now...
 * We do need to process all other HTML tags to text though.
 *
 * @private
 */
const parseHTMLText = (text: string, trigger: string): [UpdatedParsedTag[], string] => {
  const tags: UpdatedParsedTag[] = [];
  let htmlParseIndex = 0;
  let plaintText = '';

  while (htmlParseIndex < text.length) {
    const openTagIndex = text.indexOf('<', htmlParseIndex);
    if (openTagIndex === -1) {
      //no open tags found, `text` is a plain text
      plaintText += text.substring(htmlParseIndex);
      break;
    }
    // Add all the text from the last tag close to this one open
    plaintText += text.substring(htmlParseIndex, openTagIndex);
    const plainTextStartIndex = plaintText.length; // - 1 is not used because text.substring doesn't include openTagIndex

    const openTagCloseIndex = text.indexOf('>', openTagIndex);
    const openTag = text.substring(openTagIndex + 1, openTagCloseIndex);
    const tagType = openTag.split(' ')[0];
    if (tagType === 'msft-at-mention') {
      plaintText += trigger;
    }

    if (openTag[openTag.length - 1] === '/') {
      // Self closing tag, no corresponding close tag
      const selfClosingBody = openTag.substring(0, openTag.length - 1);
      const tagLength = openTagCloseIndex - openTagIndex;
      tags.push({
        tagType: tagType.substring(0, tagType.length - 1).toLowerCase(),
        openTagBody: selfClosingBody,
        htmlOpenTagStartIndex: openTagIndex,
        plainTextStartIndex: plainTextStartIndex
      });
      htmlParseIndex = openTagIndex + tagLength - 1;
    } else {
      // Go find the close tag
      const tagToFind = '</' + tagType + '>';
      const closeTagIndex = text.indexOf(tagToFind, openTagCloseIndex);
      if (closeTagIndex === -1) {
        console.error('Could not find close tag for ' + openTag);
        break;
      } else {
        // try to find sub tags and plain text value from them
        const closeTagLength = tagToFind.length;
        const content = text.substring(openTagIndex + openTag.length + 2, closeTagIndex);

        const [subTags, contentPlainText] = parseHTMLText(content, trigger);
        plaintText += contentPlainText;

        tags.push({
          tagType: tagType.toLowerCase(),
          openTagBody: openTag,
          htmlOpenTagStartIndex: openTagIndex,
          htmlCloseTagStartIndex: closeTagIndex,
          closeTagLength,
          content,
          subTags,
          plainTextStartIndex,
          plainTextEndIndex: plaintText.length // - 1 is not used because we should use the next index after the content value
        });
        htmlParseIndex = closeTagIndex + closeTagLength;
      }
    }
  }

  return [tags, plaintText];
};

/**
 * Go through the text and update it with the changed text
 * This should be only <msft-at-mention> tags for now...
 * We do need to process all other HTML tags to text though.
 *
 * @private
 */
const updateHTML = (
  htmlText: string,
  oldPlainText: string,
  newPlainText: string,
  tags: UpdatedParsedTag[],
  startIndex: number,
  oldPlainTextEndIndex: number,
  change: string
): string => {
  console.log('tags', tags);
  console.log('htmlText updateHTML', htmlText);
  let result = htmlText;
  if (tags.length === 0) {
    // no tags added yet
    return newPlainText;
  }
  if (startIndex < tags[0].plainTextStartIndex && oldPlainTextEndIndex < tags[0].plainTextStartIndex) {
    // the text is before the first tag and can be just changed
    result = htmlText.substring(0, startIndex) + change + htmlText.substring(oldPlainTextEndIndex);
  } else if (
    (tags[tags.length - 1].plainTextEndIndex === undefined &&
      oldPlainTextEndIndex >= tags[tags.length - 1].plainTextStartIndex &&
      startIndex >= tags[tags.length - 1].plainTextStartIndex) ||
    (tags[tags.length - 1].plainTextEndIndex !== undefined &&
      oldPlainTextEndIndex >= tags[tags.length - 1].plainTextEndIndex &&
      startIndex >= tags[tags.length - 1].plainTextEndIndex)
  ) {
    const lastTag = tags[tags.length - 1];
    // calculate a diff between the start of the last tag and the change
    let lastTagEndIndex = 0;
    let lastTagPlainTextEndIndex = 0;
    if (
      lastTag.htmlCloseTagStartIndex === undefined ||
      lastTag.closeTagLength === undefined ||
      lastTag.plainTextEndIndex === undefined
    ) {
      // no close tag
      lastTagEndIndex = lastTag.htmlOpenTagStartIndex + lastTag.openTagBody.length;
      lastTagPlainTextEndIndex = lastTag.plainTextStartIndex;
    } else {
      console.log('lastTag.htmlCloseTagStartIndex', lastTag.htmlCloseTagStartIndex);
      console.log('lastTag.closeTagLength', lastTag.closeTagLength);
      if (oldPlainTextEndIndex === tags[tags.length - 1].plainTextEndIndex) {
        lastTagEndIndex = lastTag.htmlCloseTagStartIndex; //add text before the closed tag
      } else {
        lastTagEndIndex = lastTag.htmlCloseTagStartIndex + lastTag.closeTagLength; //add text after the closed tag
      }

      lastTagPlainTextEndIndex = lastTag.plainTextEndIndex;
    }
    const startDiff = startIndex - lastTagPlainTextEndIndex;
    const endDiff = oldPlainTextEndIndex - lastTagPlainTextEndIndex;
    console.log('startDiff', startDiff);
    console.log('endDiff', endDiff);
    console.log('lastTagEndIndex + startDiff', lastTagEndIndex + startDiff);
    console.log('lastTagEndIndex + endDiff', lastTagEndIndex + endDiff);
    console.log(
      'htmlText.substring(0, lastTagEndIndex + startDiff)',
      htmlText.substring(0, lastTagEndIndex + startDiff)
    );
    console.log('htmlText.substring(lastTagEndIndex + endDiff);', htmlText.substring(lastTagEndIndex + endDiff));

    result =
      htmlText.substring(0, lastTagEndIndex + startDiff) + change + htmlText.substring(lastTagEndIndex + endDiff);
    console.log('result', result);
  }
  return result;
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
    const openTag = text.substring(openTagIndex + 1, openTagCloseIndex);
    const tagType = openTag.split(' ')[0];

    if (openTag[openTag.length - 1] === '/') {
      // Self closing tag, no corresponding close tag
      const selfClosingBody = openTag.substring(0, openTag.length - 1);
      const tagLength = openTagCloseIndex - openTagIndex;
      tags.push({
        tagType: tagType.substring(0, tagType.length - 1).toLowerCase(),
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
        const content = text.substring(openTagIndex + openTag.length + 2, closeTagIndex);
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
    text += textBlock.substring(previousTagEndIndex, tag.htmlOpenTagStartIndex);
    if (tag.tagType === 'msft-at-mention') {
      text += trigger;
    }

    // If there are sub tags, go through them and add their text
    if (!!tag.subTags && tag.subTags.length > 0) {
      text += plainTextFromParsedTags(tag.content ?? '', tag.subTags, trigger);
    } else if (tag.content) {
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
    text += textBlock.substring(previousTagEndIndex);
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
      const textBetweenTags = htmlTextBlock.substring(previousTagEndIndex, tag.htmlOpenTagStartIndex);
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
      } else if (tag.content !== undefined) {
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
      text += htmlTextBlock.substring(previousTagEndIndex);
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
