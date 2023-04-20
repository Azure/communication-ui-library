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
import { Caret } from 'textarea-caret-ts';
import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions, _MentionFlyout, MentionSuggestion } from './MentionFlyout';
import { debounce } from 'lodash';

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
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
  /* @conditional-compile-remove(mention) */
  onMentionAdd?: (newTextValue?: string) => void; // textValue should be updated in it
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
    mentionLookupOptions,
    onMentionAdd
  } = props;
  const inputBoxRef = useRef<HTMLDivElement>(null);

  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([]);

  // Index of the current trigger character in the text field
  const [currentTagIndex, setCurrentTagIndex] = useState<number>(-1);
  const [inputTextValue, setInputTextValue] = useState<string>('');
  const [tagsValue, setTagsValue] = useState<UpdatedParsedTag[]>([]);

  // Caret position in the text field
  const [caretPosition, setCaretPosition] = useState<Caret.Position | undefined>(undefined);

  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = mentionLookupOptions?.trigger || defaultMentionTrigger;
    console.log('textValue', textValue);
    const [tags, plainText] = parseHTMLText(textValue, trigger);
    reformedTagParser(textValue, trigger);
    console.log('tags', tags);
    console.log('plainText', plainText);
    setInputTextValue(plainText);
    setTagsValue(tags);
  }, [textValue, mentionLookupOptions?.trigger]);

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
    (suggestions: MentionSuggestion[]) => {
      setMentionSuggestions(suggestions);
      //TODO: add focus to the correct position
      textFieldRef?.current?.focus();
    },
    [textFieldRef]
  );

  const onSuggestionSelected = useCallback(
    (suggestion: MentionSuggestion) => {
      let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
      if (selectionEnd < 0) {
        selectionEnd = 0;
      } else if (selectionEnd > inputTextValue.length) {
        selectionEnd = inputTextValue.length;
      }

      const oldPlainText = inputTextValue;
      const mention = htmlStringForMentionSuggestion(suggestion);
      // update plain text with the mention html text
      const newPlainText =
        inputTextValue.substring(0, currentTagIndex) + mention + inputTextValue.substring(selectionEnd);
      const triggerText = mentionLookupOptions?.trigger ?? defaultMentionTrigger;
      // update html text with updated plain text
      const updatedHTML = updateHTML(
        textValue,
        oldPlainText,
        newPlainText,
        tagsValue,
        currentTagIndex,
        selectionEnd,
        mention,
        triggerText
      );
      // This change moves focus to the end of the input field when plainText != the text that in the input field
      updateMentionSuggestions([]);
      setCurrentTagIndex(-1);
      onMentionAdd && onMentionAdd(updatedHTML);
    },
    [
      textFieldRef,
      inputTextValue,
      currentTagIndex,
      mentionLookupOptions?.trigger,
      textValue,
      tagsValue,
      onMentionAdd,
      updateMentionSuggestions
    ]
  );

  const debouncedQueryUpdate = useRef(
    debounce(async (query: string) => {
      const suggestions = (await mentionLookupOptions?.onQueryUpdated(query)) ?? [];
      updateMentionSuggestions(suggestions);
    }, 500)
  ).current;

  React.useEffect(() => {
    return () => {
      debouncedQueryUpdate.cancel();
    };
  }, [debouncedQueryUpdate]);

  const handleOnChange = async (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    updatedValue?: string | undefined
  ): Promise<void> => {
    let newValue = updatedValue;
    if (newValue === undefined) {
      newValue = '';
    }
    const triggerText = mentionLookupOptions?.trigger ?? defaultMentionTrigger;

    const newTextLength = newValue.length;
    let selectionEnd = textFieldRef?.current?.selectionEnd || -1;
    if (selectionEnd < 0) {
      selectionEnd = 0;
    } else if (selectionEnd > newTextLength) {
      selectionEnd = newTextLength - 1;
    }
    // If we are enabled for lookups,
    if (mentionLookupOptions !== undefined) {
      // Look at the range of the change for a trigger character
      const triggerPriorIndex = newValue?.lastIndexOf(triggerText, selectionEnd - 1);
      // Update the caret position, if not doing a lookup
      setCaretPosition(Caret.getRelativePosition(event.currentTarget));

      if (triggerPriorIndex !== undefined) {
        // trigger is found
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
              debouncedQueryUpdate(query);
            }
          }
        }
      }
    }
    let result = '';
    if (tagsValue.length === 0) {
      // no tags in the string, textValue is a sting
      result = newValue;
    } else {
      // there are tags in the text value, textValue is html string
      const { changeStart, oldChangeEnd, newChangeEnd } = findStringsDiffIndexes(
        inputTextValue,
        newValue,
        selectionEnd
      );
      // get updated html string
      result = updateHTML(
        textValue,
        inputTextValue,
        newValue,
        tagsValue,
        changeStart,
        oldChangeEnd,
        newValue.substring(changeStart, newChangeEnd),
        triggerText
      );
      console.log('!!! updatedHTML', result);
    }

    onChange && onChange(event, result);
  };

  return (
    <Stack className={mergedRootStyle}>
      <div className={mergedTextContainerStyle}>
        {mentionSuggestions.length > 0 && (
          <_MentionFlyout
            suggestions={mentionSuggestions}
            target={inputBoxRef}
            targetPositionOffset={caretPosition}
            onSuggestionSelected={onSuggestionSelected}
            onDismiss={() => {
              updateMentionSuggestions([]);
            }}
          />
        )}
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
  openTagLength: number; // helps to simplify calculation for different cases
  htmlCloseTagStartIndex?: number; // Might not have a close tag
  closeTagLength?: number; // Might not have a close tag
  content?: string; // Might not have content
  subTags?: UpdatedParsedTag[]; // Tags can contain other tags
  plainTextStartIndex: number; //position where the open tag should begin
  plainTextEndIndex?: number; // position where the open tag should begin. Might not have a close tag
};

/**
 * Go through the text and parse out the tags and plain text
 * This should be only <msft-mention> tags for now...
 * We do need to process all other HTML tags to text though.
 *
 * @private
 */
const parseHTMLText = (text: string, trigger: string): [UpdatedParsedTag[], string, boolean] => {
  const tags: UpdatedParsedTag[] = [];
  let htmlParseIndex = 0;
  let plainText = '';
  let isHtml = false;

  while (htmlParseIndex < text.length) {
    const openTagIndex = text.indexOf('<', htmlParseIndex); // Find next open tag, if it is a tag...
    if (openTagIndex === -1) {
      // No more open tags found, add the rest of the text as plain text
      plainText += text.substring(htmlParseIndex);
      break;
    }

    // Parse the open tag
    const openTagCloseIndex = text.indexOf('>', openTagIndex);
    const openTag = text.substring(openTagIndex + 1, openTagCloseIndex);
    const tagType = openTag.split(' ')[0];

    // Add all the text from the last tag close to this one open
    plainText += text.substring(htmlParseIndex, openTagIndex);
    const plainTextStartIndex = plainText.length; // - 1 is not used because text.substring doesn't include openTagIndex

    if (tagType === 'msft-mention') {
      isHtml = true; // Only support <msft-mention> tags for now
      plainText += trigger;
    }

    if (openTag[openTag.length - 1] === '/') {
      // Self closing tag, no corresponding close tag
      const selfClosingBody = openTag.substring(0, openTag.length - 1);
      const tagLength = openTagCloseIndex - openTagIndex;
      tags.push({
        tagType: tagType.substring(0, tagType.length - 1).toLowerCase(),
        openTagBody: selfClosingBody,
        htmlOpenTagStartIndex: openTagIndex,
        plainTextStartIndex: plainTextStartIndex,
        openTagLength: tagLength
      });
      htmlParseIndex = openTagIndex + tagLength - 1;
    } else {
      // Find the corresponding close tag
      const closeTagToFind = '</' + tagType + '>';
      console.log('looking for close tag:', closeTagToFind);

      // TODO: move while loop here, include the current tag?
      const nextOpenTagIndex = text.indexOf('<', openTagCloseIndex);
      let nextCloseTagIndex = text.indexOf(closeTagToFind, openTagCloseIndex);

      if (nextCloseTagIndex === -1) {
        console.error('Could not find close tag for ' + openTag);
        // TODO: handle invalid HTML better
        isHtml = false;
        break;
      } else {
        if (nextOpenTagIndex < nextCloseTagIndex) {
          // Grab the inner open tag content
          let innerOpenTagCloseIndex = text.indexOf('>', nextOpenTagIndex);
          let innerOpenTag = text.substring(nextOpenTagIndex + 1, innerOpenTagCloseIndex);
          let innerTagType = innerOpenTag.split(' ')[0];
          const tagStack = [innerTagType];
          console.log('found nested tag', innerTagType);

          // We have nested tags, so process the inner tags first
          let searchStartIndex = innerOpenTagCloseIndex; // Start at the end of the open tag
          while (tagStack.length > 0) {
            console.log('LOOP: tagStack:', tagStack);
            console.log('LOOP: searchStartIndex:', searchStartIndex);
            const closeTagToFind = '</' + tagStack[tagStack.length - 1] + '>';
            console.log('looking for close tag:', closeTagToFind);

            const nextInnerCloseTagIndex = text.indexOf(closeTagToFind, searchStartIndex + 1);
            const nextInnerOpenTagIndex = text.indexOf('<', searchStartIndex + 1);
            console.log('nextInnerCloseTagIndex:', nextInnerCloseTagIndex);
            console.log('nextInnerOpenTagIndex:', nextInnerOpenTagIndex);

            // Grab the next open tag content
            innerOpenTagCloseIndex = text.indexOf('>', nextInnerOpenTagIndex);
            innerOpenTag = text.substring(nextInnerOpenTagIndex + 1, innerOpenTagCloseIndex);
            innerTagType = innerOpenTag.split(' ')[0];

            if (nextInnerOpenTagIndex < nextInnerCloseTagIndex) {
              console.log('found another layer of nested tags:', innerOpenTag);
              // Another level of nesting
              tagStack.push(innerTagType);
              searchStartIndex = nextInnerOpenTagIndex + innerOpenTag.length;
            } else {
              console.log('found close tag for', tagStack[tagStack.length - 1]);
              // Corresponding close tag for top of the stack found
              tagStack.pop();
              searchStartIndex = nextInnerCloseTagIndex + 1;
            }
            nextCloseTagIndex = nextInnerCloseTagIndex;
          }
          console.log('OUT OF LOOP');

          // Find the corresponding close tag
          nextCloseTagIndex = text.indexOf(closeTagToFind, nextCloseTagIndex + tagType.length);
        }
        // try to find sub tags and plain text value from them
        const closeTagLength = closeTagToFind.length;
        const content = text.substring(openTagIndex + openTag.length + 2, nextCloseTagIndex);
        console.log('Tag contents:', content);

        const [subTags, contentPlainText] = parseHTMLText(content, trigger);
        plainText += contentPlainText;
        tags.push({
          tagType: tagType.toLowerCase(),
          openTagBody: openTag,
          openTagLength: openTag.length + 2, // +2 for '<' and '>'
          htmlOpenTagStartIndex: openTagIndex,
          htmlCloseTagStartIndex: nextCloseTagIndex,
          closeTagLength,
          content,
          subTags,
          plainTextStartIndex,
          plainTextEndIndex: plainText.length // - 1 is not used because we should use the next index after the content value
        });
        htmlParseIndex = nextCloseTagIndex + closeTagLength;
      }
    }
  }

  return [tags, plainText, isHtml];
};

/**
 * Go through the text and update it with the changed text
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
  change: string,
  mentionTrigger: string
): string => {
  console.log('updateHTML tags', tags);
  console.log('updateHTML htmlText', htmlText);
  console.log('updateHTML change "', change, '"');
  console.log('updateHTML oldPlainText', oldPlainText);
  console.log('updateHTML newPlainText', newPlainText);
  console.log('updateHTML startIndex', startIndex);
  console.log('updateHTML oldPlainTextEndIndex', oldPlainTextEndIndex);
  let result = htmlText;
  if (tags.length === 0) {
    // no tags added yet
    return newPlainText;
  }
  if (startIndex === 0 && oldPlainTextEndIndex === oldPlainText.length - 1) {
    // the whole text is changed
    return newPlainText;
  }
  // TODO: when change removes the tag partially
  // TODO: when change removes a couple of tags partially
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    console.log('updateHTML tag.type', tag.tagType);
    console.log('updateHTML tag.plainTextStartIndex', tag.plainTextStartIndex);
    console.log('updateHTML tag.plainTextEndIndex', tag.plainTextEndIndex);
    if (
      startIndex === tag.plainTextStartIndex &&
      ((tag.plainTextEndIndex !== undefined &&
        tag.closeTagLength !== undefined &&
        tag.htmlCloseTagStartIndex !== undefined &&
        tag.content !== undefined &&
        tag.plainTextEndIndex === oldPlainTextEndIndex) ||
        (tag.plainTextEndIndex === undefined &&
          tag.closeTagLength === undefined &&
          tag.htmlCloseTagStartIndex === undefined &&
          tag.content === undefined &&
          tag.plainTextStartIndex === oldPlainTextEndIndex))
    ) {
      // the tag is fully deleted
      console.log('updateHTML the tag is fully deleted');
      // before the tag content
      const stringBefore = htmlText.substring(0, tag.htmlOpenTagStartIndex);
      // after the tag content
      const stringAfter = htmlText.substring(
        tag.htmlCloseTagStartIndex + tag.closeTagLength || tag.htmlOpenTagStartIndex + tag.openTagLength
      );
      result = stringBefore + change + stringAfter;
      break;
      // } else if (
      //   startIndex < tag.plainTextStartIndex &&
      //   tag.plainTextEndIndex !== undefined &&
      //   tag.closeTagLength !== undefined &&
      //   tag.htmlCloseTagStartIndex !== undefined &&
      //   tag.content !== undefined &&
      //   tag.plainTextEndIndex > oldPlainTextEndIndex
      // ) {
      // const beforeTagStr;
      //change is partially before and partially in the tag
    } else if (startIndex < tag.plainTextStartIndex && oldPlainTextEndIndex < tag.plainTextStartIndex) {
      //before the open tag
      //find a diff between the open tag and change position
      const startChangeDiff = tag.plainTextStartIndex - startIndex;
      const endChangeDiff = tag.plainTextStartIndex - oldPlainTextEndIndex;
      result =
        htmlText.substring(0, tag.htmlOpenTagStartIndex - startChangeDiff) +
        change +
        htmlText.substring(tag.htmlOpenTagStartIndex - endChangeDiff);
      break;
    } else if (
      tag.plainTextEndIndex !== undefined &&
      tag.closeTagLength !== undefined &&
      tag.htmlCloseTagStartIndex !== undefined &&
      tag.content !== undefined &&
      startIndex >= tag.plainTextStartIndex &&
      oldPlainTextEndIndex <= tag.plainTextEndIndex
    ) {
      // between open and close tags
      const startChangeDiff = startIndex - tag.plainTextStartIndex;
      const endChangeDiff = oldPlainTextEndIndex - tag.plainTextStartIndex;
      if (tag.subTags === undefined || tag.subTags.length === 0) {
        // no subtags
        if (tag.tagType === 'msft-mention') {
          // startChangeDiff and endChangeDiff includes trigger length that shouldn't be included in htmlText.substring
          console.log('updateHTML msft-mention');
          console.log('updateHTML tag.type', tag.tagType);
          console.log('updateHTML tag.htmlOpenTagStartIndex', tag.htmlOpenTagStartIndex);
          console.log('updateHTML tag.openTagLength', tag.openTagLength);
          console.log('updateHTML startChangeDiff', startChangeDiff);
          console.log('updateHTML mentionTrigger.length', mentionTrigger.length);
          console.log('updateHTML startChangeDiff', endChangeDiff);
          console.log('updateHTML msft-mention end');
          result =
            htmlText.substring(
              0,
              tag.htmlOpenTagStartIndex + tag.openTagLength + startChangeDiff - mentionTrigger.length
            ) +
            change +
            htmlText.substring(tag.htmlOpenTagStartIndex + tag.openTagLength + endChangeDiff - mentionTrigger.length);
        } else {
          result =
            htmlText.substring(0, tag.htmlOpenTagStartIndex + tag.openTagLength + startChangeDiff) +
            change +
            htmlText.substring(tag.htmlOpenTagStartIndex + tag.openTagLength + endChangeDiff);
        }
        break;
      } else {
        // with subtags

        // before the tag content
        const stringBefore = htmlText.substring(0, tag.htmlOpenTagStartIndex + tag.openTagLength);
        // after the tag content
        const stringAfter = htmlText.substring(tag.htmlCloseTagStartIndex);
        const content = updateHTML(
          tag.content,
          oldPlainText.substring(tag.plainTextStartIndex, tag.plainTextEndIndex),
          newPlainText.substring(
            tag.plainTextStartIndex,
            tag.plainTextEndIndex + (newPlainText.length - oldPlainText.length)
          ),
          tag.subTags,
          startIndex - tag.plainTextStartIndex,
          oldPlainTextEndIndex - tag.plainTextStartIndex,
          change,
          mentionTrigger
        );
        result = stringBefore + content + stringAfter;
        break;
      }
    } else if (
      (tag.plainTextEndIndex === undefined && startIndex > tag.plainTextStartIndex) ||
      (tag.plainTextEndIndex !== undefined &&
        tag.closeTagLength !== undefined &&
        tag.htmlCloseTagStartIndex !== undefined &&
        startIndex > tag.plainTextEndIndex)
    ) {
      // after close tag or after the open tag if no close tag available
      if (i === tags.length - 1) {
        // the last or the only tag
        let htmlTagEndIndex = 0;
        let plainTextTagEndIndex = 0;
        if (
          tag.plainTextEndIndex !== undefined &&
          tag.closeTagLength !== undefined &&
          tag.htmlCloseTagStartIndex !== undefined
        ) {
          // the close tag exists
          htmlTagEndIndex = tag.htmlCloseTagStartIndex + tag.closeTagLength;
          plainTextTagEndIndex = tag.plainTextEndIndex;
        } else {
          // no close tag
          htmlTagEndIndex = tag.htmlOpenTagStartIndex + tag.openTagLength;
          plainTextTagEndIndex = tag.plainTextStartIndex;
        }
        const startChangeDiff = startIndex - plainTextTagEndIndex;
        const endChangeDiff = oldPlainTextEndIndex - plainTextTagEndIndex;
        result =
          htmlText.substring(0, htmlTagEndIndex + startChangeDiff) +
          change +
          htmlText.substring(htmlTagEndIndex + endChangeDiff);
        break;
      } else {
        //there is a next tag, the change should be handled in the check for open tag for the next tag
        continue;
      }
    }
  }

  console.log('updateHTML result "', result, '"');
  return result;
};
/**
 * Go through the text and parse out the tags
 * This should be only <msft-mention> tags for now...
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
    if (tag.tagType === 'msft-mention') {
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

/**
 * Given the oldText and newText, find the start index, old end index and new end index for the changes
 *
 * @private
 */
const findStringsDiffIndexes = (
  oldText: string,
  newText: string,
  selectionEnd: number // should be a valid position in the input field
): { changeStart: number; oldChangeEnd: number; newChangeEnd: number } => {
  const newTextLength = newText.length;
  const oldTextLength = oldText.length;
  console.log('updateHTML - selectionEnd', selectionEnd);
  let changeStart = 0;
  let newChangeEnd = newTextLength;
  let oldChangeEnd = oldTextLength;
  const length = Math.min(newTextLength, oldTextLength, selectionEnd);

  for (let i = 0; i < length; i++) {
    if (newText[i] !== oldText[i]) {
      // the symbol with changeStart index is updated
      changeStart = i;
      break;
    } else if (i === length - 1 && newText[i] === oldText[i]) {
      // the symbol is added at the end of inputTextValue
      changeStart = length;
      break;
    }
  }
  if (oldTextLength < newTextLength) {
    //insert or replacement
    if (oldTextLength === changeStart) {
      // when change was at the end of string
      // Change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < newTextLength && oldTextLength - i > changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;

        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
    }
  } else if (oldTextLength > newTextLength) {
    //deletion or replacement
    if (newTextLength === changeStart) {
      // when change was at the end of string
      // Change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < oldTextLength && newTextLength - i > changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        console.log('updateHTML newChangeEnd', newChangeEnd, newText[newChangeEnd]);
        console.log('updateHTML oldText', oldChangeEnd, oldText[newChangeEnd]);
        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // Change is found
          break;
        }
      }
    }
  } else {
    //replacement
    for (let i = 1; i < oldTextLength && oldTextLength - i > changeStart; i++) {
      newChangeEnd = newTextLength - i - 1;
      oldChangeEnd = oldTextLength - i - 1;

      if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
        // Change is found
        break;
      }
    }
  }
  console.log('updateHTML - oldText', oldText);
  console.log('updateHTML - newText', newText);

  console.log('updateHTML - changeStart', changeStart);
  console.log('updateHTML - oldChangeEnd', oldChangeEnd);
  console.log('updateHTML - newChangeEnd', newChangeEnd);
  return { changeStart, oldChangeEnd, newChangeEnd };
};

const htmlStringForMentionSuggestion = (suggestion: MentionSuggestion): string => {
  const userIdHTML = ' userId ="' + suggestion.userId + '"';
  const displayName = suggestion.displayName || '';
  const displayNameHTML = ' displayName ="' + displayName + '"';
  const suggestionTypeHTML = ' suggestionType ="' + suggestion.suggestionType + '"';
  return '<msft-mention' + userIdHTML + displayNameHTML + suggestionTypeHTML + '>' + displayName + '</msft-mention>';
};

type ReformedTag = {
  tagType: string; // The type of tag (e.g. msft-mention)
  openTagIdx: number; // Start of the tag relative to the parent content
  openTagBody: string; // Complete open tag body
  content?: string; // All content between the open and close tags
  closeTagIdx?: number; // Start of the close tag relative to the parent content
  subTags?: ReformedTag[]; // Any child tags
  plainTextBeginIndex?: number; // Absolute index of the open tag start should be in plain text
  plainTextEndIndex?: number; // Absolute index of the close tag start should be in plain text
};

type HtmlTagType = 'open' | 'close' | 'self-closing';
type HtmlTag = {
  content: string;
  startIdx: number;
  type: HtmlTagType;
};

/**
 * Parse the text and return the tags and the plain text in one go
 * @param text
 * @param trigger
 * @returns
 */
const reformedTagParser = (text: string, trigger: string): [ReformedTag[], string] => {
  const tags: ReformedTag[] = [];
  const tagParseStack: ReformedTag[] = [];
  let plainTextRepresentation = '';
  let parseIndex = 0;

  while (parseIndex < text.length) {
    console.log('Parsing at index ' + parseIndex + ' of ' + text.length);
    const foundHtmlTag = findNextHtmlTag(text, parseIndex);

    if (!foundHtmlTag) {
      if (parseIndex !== 0) {
        // Add the remaining text to the plain text representation
        plainTextRepresentation += text.substring(parseIndex);
      } else {
        plainTextRepresentation = text;
      }
      break;
    }

    if (foundHtmlTag.type === 'open') {
      const nextOpenTag = parseOpenTag(foundHtmlTag.content, foundHtmlTag.startIdx);
      // Add the plain text between the last tag and this one found
      plainTextRepresentation += text.substring(parseIndex, foundHtmlTag.startIdx);
      nextOpenTag.plainTextBeginIndex = plainTextRepresentation.length;
      tagParseStack.push(nextOpenTag);
    }

    if (foundHtmlTag.type === 'close') {
      console.log('Found close tag: ' + foundHtmlTag.content);
      const currentOpenTag = tagParseStack.pop();
      const closeTagType = foundHtmlTag.content.substring(2, foundHtmlTag.content.length - 1).toLowerCase();

      if (currentOpenTag && currentOpenTag.tagType === closeTagType) {
        console.log('closing tag: ' + currentOpenTag.tagType + '');

        // Tag startIdx is absolute to the text. This is updated later to be relative to the parent tag
        currentOpenTag.content = text.substring(
          currentOpenTag.openTagIdx + currentOpenTag.openTagBody.length,
          foundHtmlTag.startIdx
        );

        // The closeTagIdx can be relative from the start
        currentOpenTag.closeTagIdx =
          currentOpenTag.openTagIdx + currentOpenTag.openTagBody.length + currentOpenTag.content.length;

        // Add the plain text pieces for the sub tags
        if (currentOpenTag.tagType === 'msft-mention') {
          plainTextRepresentation += trigger;
        }

        if (!currentOpenTag.subTags) {
          plainTextRepresentation += currentOpenTag.content;
        } else {
          // Add text after the last tag
          const lastSubTag = currentOpenTag.subTags[currentOpenTag.subTags.length - 1];
          const trailingCharactersLength =
            currentOpenTag.closeTagIdx! - lastSubTag.closeTagIdx! - lastSubTag.tagType.length - 3;

          if (trailingCharactersLength > 0) {
            const trailingText = currentOpenTag.content.substring(
              currentOpenTag.content.length - trailingCharactersLength
            );
            console.log('trailingText', trailingText);
            plainTextRepresentation += trailingText;
          }
        }

        currentOpenTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(currentOpenTag, tagParseStack, tags);
      } else {
        console.error(
          'Unexpected close tag found. Got ' +
            closeTagType +
            ' but expected ' +
            tagParseStack[tagParseStack.length - 1]?.tagType +
            ''
        );
      }
    }

    if (foundHtmlTag.type === 'self-closing') {
      console.log('Found self-closing tag: ' + foundHtmlTag.content);

      const selfClosingTag = parseOpenTag(foundHtmlTag.content, foundHtmlTag.startIdx);
      selfClosingTag.closeTagIdx = foundHtmlTag.startIdx; // Set them to the same value
      selfClosingTag.content = '';
      selfClosingTag.plainTextBeginIndex = plainTextRepresentation.length;
      selfClosingTag.plainTextEndIndex = plainTextRepresentation.length;

      addTag(selfClosingTag, tagParseStack, tags);
    }

    // Update parsing index; move past the end of the close tag
    parseIndex = foundHtmlTag.startIdx + foundHtmlTag.content.length;
  } // While parseIndex < text.length loop

  return [tags, plainTextRepresentation];
};

const parseOpenTag = (tag: string, startIdx: number): ReformedTag => {
  return {
    tagType: tag
      .substring(1, tag.length - 1)
      .split(' ')[0]
      .toLowerCase(),
    openTagIdx: startIdx,
    openTagBody: tag
  };
};

const findNextHtmlTag = (text: string, startIndex: number): HtmlTag | undefined => {
  const tagStartIndex = text.indexOf('<', startIndex);
  if (tagStartIndex === -1) {
    // No more tags
    return undefined;
  }
  const tagEndIndex = text.indexOf('>', tagStartIndex);
  if (tagEndIndex === -1) {
    // No close tag
    return undefined;
  }
  const tag = text.substring(tagStartIndex, tagEndIndex + 1);
  let type: HtmlTagType = 'open';
  if (tag[1] === '/') {
    type = 'close';
  } else if (tag[tag.length - 2] === '/') {
    type = 'self-closing';
  }
  return {
    content: tag,
    startIdx: tagStartIndex,
    type
  };
};

const addTag = (tag: ReformedTag, parseStack: ReformedTag[], tags: ReformedTag[]): void => {
  // Add as sub-tag to the parent stack tag, if there is one
  const parentTag = parseStack[parseStack.length - 1];
  if (parentTag) {
    // Relative start is the parent start index + the size of the parent open tag
    const parentContentStartIdx = parentTag.openTagIdx + parentTag.openTagBody.length;
    const relativeIdx = tag.openTagIdx - parentContentStartIdx;
    tag.openTagIdx = relativeIdx;

    if (!parentTag.subTags) {
      parentTag.subTags = [tag];
    } else {
      parentTag.subTags.push(tag);
    }
  } else {
    tags.push(tag);
  }
};
