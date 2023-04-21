// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useRef } from 'react';
/* @conditional-compile-remove(mention) */
import { useEffect } from 'react';

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
/* @conditional-compile-remove(mention) */
import { Caret } from 'textarea-caret-ts';
import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions, _MentionFlyout, Mention } from './MentionFlyout';
/* @conditional-compile-remove(mention) */
import { debounce } from 'lodash';
/* @conditional-compile-remove(mention) */
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
    /* @conditional-compile-remove(mention) */
    mentionLookupOptions,
    /* @conditional-compile-remove(mention) */
    onMentionAdd
  } = props;
  const inputBoxRef = useRef<HTMLDivElement>(null);

  /* @conditional-compile-remove(mention) */
  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<Mention[]>([]);

  /* @conditional-compile-remove(mention) */
  // Index of the current trigger character in the text field
  const [currentTagIndex, setCurrentTagIndex] = useState<number>(-1);
  /* @conditional-compile-remove(mention) */
  const [inputTextValue, setInputTextValue] = useState<string>('');
  /* @conditional-compile-remove(mention) */
  const [tagsValue, setTagsValue] = useState<ReformedTag[]>([]);

  /* @conditional-compile-remove(mention) */
  // Caret position in the text field
  const [caretPosition, setCaretPosition] = useState<Caret.Position | undefined>(undefined);

  /* @conditional-compile-remove(mention) */
  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = mentionLookupOptions?.trigger || defaultMentionTrigger;
    console.log('updateHTML textValue <- html', textValue);
    const [tags, plainText] = reformedTagParser(textValue, trigger);
    console.log('updateHTML tags', tags);
    console.log('updateHTML plainText', plainText);
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

  /* @conditional-compile-remove(mention) */
  const updateMentionSuggestions = useCallback(
    (suggestions: Mention[]) => {
      setMentionSuggestions(suggestions);
      //TODO: add focus to the correct position
      textFieldRef?.current?.focus();
    },
    [textFieldRef]
  );

  /* @conditional-compile-remove(mention) */
  const onSuggestionSelected = useCallback(
    (suggestion: Mention) => {
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

  /* @conditional-compile-remove(mention) */
  const debouncedQueryUpdate = useRef(
    debounce(async (query: string) => {
      const suggestions = (await mentionLookupOptions?.onQueryUpdated(query)) ?? [];
      updateMentionSuggestions(suggestions);
    }, 500)
  ).current;

  /* @conditional-compile-remove(mention) */
  useEffect(() => {
    return () => {
      debouncedQueryUpdate.cancel();
    };
  }, [debouncedQueryUpdate]);

  /* @conditional-compile-remove(mention) */
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
      console.log('updateHTML updatedHTML', result);
    }

    onChange && onChange(event, result);
  };

  const getInputFieldTextValue = (): string => {
    /* @conditional-compile-remove(mention) */
    return inputTextValue;
    return textValue;
  };

  return (
    <Stack className={mergedRootStyle}>
      <div className={mergedTextContainerStyle}>
        {
          /* @conditional-compile-remove(mention) */ mentionSuggestions.length > 0 && (
            <_MentionFlyout
              suggestions={mentionSuggestions}
              target={inputBoxRef}
              targetPositionOffset={caretPosition}
              onSuggestionSelected={onSuggestionSelected}
              onDismiss={() => {
                updateMentionSuggestions([]);
              }}
            />
          )
        }
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
          value={getInputFieldTextValue()}
          onChange={(e, newValue) => {
            /* @conditional-compile-remove(mention) */
            setInputTextValue(newValue ?? '');
            /* @conditional-compile-remove(mention) */
            handleOnChange(e, newValue);
            /* @conditional-compile-remove(mention) */
            return;
            onChange(e, newValue);
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
 * Go through the text and update it with the changed text
 *
 * @private
 */
const updateHTML = (
  htmlText: string,
  oldPlainText: string,
  newPlainText: string,
  tags: ReformedTag[],
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
  let result = '';
  if (tags.length === 0) {
    // no tags added yet
    return newPlainText;
  }
  if (startIndex === 0 && oldPlainTextEndIndex === oldPlainText.length - 1) {
    // the whole text is changed
    return newPlainText;
  }
  let lastProcessedHTMLIndex = 0;
  // the value can be updated with empty string when the change covers more than 1 place (tag + before or after the tag)
  // in this case change won't be added as part of the tag
  // ex: change is before and partially in tag => change will be added before the tag and outdated text in the tag will be removed
  // ex: change is after and partially in tag => change will be added after the tag and outdated text in the tag will be removed
  let processedChange = change;
  // end tag plain text index of the last processed tag
  let lastProcessedPlainTextTagEndIndex = 0;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.plainTextBeginIndex === undefined) {
      continue;
    }
    console.log('updateHTML tag.type', tag.tagType);
    console.log('updateHTML tag.plainTextBeginIndex', tag.plainTextBeginIndex);
    console.log('updateHTML tag.plainTextEndIndex', tag.plainTextEndIndex);
    console.log('updateHTML startIndex', startIndex);
    console.log('updateHTML oldPlainTextEndIndex', oldPlainTextEndIndex);

    //change start is before the open tag
    if (startIndex < tag.plainTextBeginIndex) {
      console.log('updateHTML 0 result', result);
      console.log('updateHTML !!!!!! 0 lastProcessedPlainTextTagEndIndex', lastProcessedPlainTextTagEndIndex);
      // Math.max(lastProcessedPlainTextTagEndIndex, startIndex) is used as startIndex may not be in [[previous tag].plainTextEndIndex - tag.plainTextBeginIndex] range
      const startChangeDiff = tag.plainTextBeginIndex - Math.max(lastProcessedPlainTextTagEndIndex, startIndex);
      console.log('updateHTML 0 tag.type', tag.tagType);
      console.log('updateHTML 0 lastProcessedHTMLIndex', lastProcessedHTMLIndex);
      console.log('updateHTML 0 tag.openTagIdx - startChangeDiff', tag.openTagIdx - startChangeDiff);
      result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx - startChangeDiff) + processedChange;
      console.log('updateHTML 0 result after update', result);
      console.log('updateHTML 0 tag.type', tag.tagType);
      if (oldPlainTextEndIndex <= tag.plainTextBeginIndex) {
        //the whole change is before tag start
        const endChangeDiff = tag.plainTextBeginIndex - oldPlainTextEndIndex;
        console.log('updateHTML 0.1 endChangeDiff', endChangeDiff);
        lastProcessedHTMLIndex = tag.openTagIdx - endChangeDiff;
        processedChange = '';
        // the change is handled; exit
        break;
      } else {
        // change continues in the tag
        lastProcessedHTMLIndex = tag.openTagIdx;
        processedChange = '';
        // proceed to the next check
      }
    }
    let plainTextEndIndex = 0;
    let closeTagIdx = 0;
    let closeTagLength = 0;
    if (tag.plainTextEndIndex !== undefined && tag.closeTagIdx !== undefined) {
      // close tag exists
      plainTextEndIndex = tag.plainTextEndIndex;
      closeTagIdx = tag.closeTagIdx;
      // tag.tagType.length + </>
      closeTagLength = tag.tagType.length + 3;
    } else {
      //no close tag
      plainTextEndIndex = tag.plainTextBeginIndex;
      closeTagIdx = tag.openTagIdx + tag.openTagBody.length;
      closeTagLength = 0;
    }

    if (startIndex <= plainTextEndIndex) {
      // change started before the end tag
      if (startIndex <= tag.plainTextBeginIndex && oldPlainTextEndIndex === plainTextEndIndex) {
        console.log('updateHTML 1.1 result', result);
        // the change is a tag or starts before the tag
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
        processedChange = '';
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        // the change is handled; exit
        break;
      } else if (startIndex >= tag.plainTextBeginIndex && oldPlainTextEndIndex < plainTextEndIndex) {
        // the change is between tag
        console.log('updateHTML 1.2 result', result);
        if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content) {
          // with subtags

          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;

          const content = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            processedChange,
            mentionTrigger
          );
          result += stringBefore + content;
          break;
        } else {
          // no subtags
          // startChangeDiff and endChangeDiff includes trigger length that shouldn't be included in htmlText.substring because html strings doesn't have the trigger
          // mentionTagLength will be set only for 'msft-mention', otherwise should be 0
          let mentionTagLength = 0;
          if (tag.tagType === 'msft-mention') {
            mentionTagLength = mentionTrigger.length;
          }
          const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
          const endChangeDiff = plainTextEndIndex - oldPlainTextEndIndex - mentionTagLength;
          console.log('updateHTML startChangeDiff', startChangeDiff);
          console.log('updateHTML tag.openTagIdx', tag.openTagIdx);
          console.log('updateHTML lastProcessedHTMLIndex before update', lastProcessedHTMLIndex);
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff) +
            processedChange;

          console.log('updateHTML result', result);
          processedChange = '';
          lastProcessedHTMLIndex = closeTagIdx - endChangeDiff;
          console.log('updateHTML htmlText[lastProcessedHTMLIndex]', htmlText[lastProcessedHTMLIndex]);
          console.log('updateHTML lastProcessedHTMLIndex', lastProcessedHTMLIndex);
          console.log('updateHTML htmlText', htmlText);
          console.log('updateHTML htmlText.length', htmlText.length);
          // the change is handled; exit
          break;
        }
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.3 result', result);
        //the change started in the tag but finishes somewhere further
        // startChangeDiff includes trigger length that shouldn't be included in htmlText.substring because html strings doesn't have the trigger
        // mentionTagLength will be set only for 'msft-mention', otherwise should be 0
        let mentionTagLength = 0;
        if (tag.tagType === 'msft-mention') {
          mentionTagLength = mentionTrigger.length;
        }
        const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
        if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags

          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          console.log('updateHTML closeTagIdx', closeTagIdx);
          console.log('updateHTML htmlText[closeTagIdx]', htmlText[closeTagIdx]);
          console.log('updateHTML CloseTag', htmlText.substring(closeTagIdx, closeTagIdx + closeTagLength));
          lastProcessedHTMLIndex = closeTagIdx;

          const content = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            processedChange,
            mentionTrigger
          );
          result += stringBefore + content;
          //proceed with the next calculations
        } else {
          // no subtags
          result += htmlText.substring(
            lastProcessedHTMLIndex,
            tag.openTagIdx + tag.openTagBody.length + startChangeDiff
          );
          console.log('updateHTML no subtags result', result);
          lastProcessedHTMLIndex = closeTagIdx;
          //proceed with the next calculations
        }
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.4 result', result);
        // the change starts before  the tag and finishes after it

        // tag should be removed, no matter if there are subtags
        // no need to save anything between lastProcessedHTMLIndex and closeTagIdx + closeTagLength
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        //proceed with the next calculations
      } else if (startIndex === tag.plainTextBeginIndex && oldPlainTextEndIndex > plainTextEndIndex) {
        console.log('updateHTML 1.5 result', result);
        // the change starts in the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        console.log('updateHTML  result', result);
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx);
        console.log('updateHTML result after update', result);
        console.log('updateHTML result after tag.openTagIdx', tag.openTagIdx);
        console.log('updateHTML result after closeTagIdx', closeTagIdx);
        console.log('updateHTML result after closeTagLength', closeTagLength);
        // processedChange shouldn't be updated as it will be added after the tag
        lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
        //proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex < plainTextEndIndex) {
        console.log('updateHTML 1.6 result', result);
        // the change  starts before the tag and ends in a tag
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
        // endChangeDiff includes trigger length that shouldn't be included in htmlText.substring because html strings doesn't have the trigger
        // mentionTagLength will be set only for 'msft-mention', otherwise should be 0
        let mentionTagLength = 0;
        if (tag.tagType === 'msft-mention') {
          mentionTagLength = mentionTrigger.length;
        }
        const endChangeDiff = plainTextEndIndex - oldPlainTextEndIndex - mentionTagLength;
        lastProcessedHTMLIndex = closeTagIdx - endChangeDiff;
        // the change is handled; exit
        break;
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex === plainTextEndIndex) {
        console.log('updateHTML 1.7 result', result);
        // the change  starts in the tag and ends at the end of a tag
        if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags

          // before the tag content
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closeTagIdx;

          const content = updateHTML(
            tag.content,
            oldPlainText,
            newPlainText,
            tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            processedChange,
            mentionTrigger
          );
          result += stringBefore + content;
          break;
        } else {
          // no subtags
          // startChangeDiff includes trigger length that shouldn't be included in htmlText.substring because html strings doesn't have the trigger
          // mentionTagLength will be set only for 'msft-mention', otherwise should be 0
          let mentionTagLength = 0;
          if (tag.tagType === 'msft-mention') {
            mentionTagLength = mentionTrigger.length;
          }
          const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff) +
            processedChange;
          processedChange = '';
          lastProcessedHTMLIndex = closeTagIdx;
          // the change is handled; exit
          break;
        }
      }
      lastProcessedPlainTextTagEndIndex = plainTextEndIndex;
    }
    if (i === tags.length - 1 && oldPlainTextEndIndex >= plainTextEndIndex) {
      console.log('updateHTML 2 oldPlainTextEndIndex', oldPlainTextEndIndex);
      console.log('updateHTML 2 plainTextEndIndex', plainTextEndIndex);
      console.log('updateHTML 2 startIndex', startIndex);
      console.log('updateHTML 2 oldPlainText', oldPlainText);
      console.log('updateHTML 2 oldPlainText.length', oldPlainText.length);
      //the last tag should handle the end of the change if needed
      const endChangeDiff = oldPlainTextEndIndex - plainTextEndIndex;
      if (startIndex >= plainTextEndIndex) {
        const startChangeDiff = startIndex - plainTextEndIndex;
        result +=
          htmlText.substring(lastProcessedHTMLIndex, closeTagIdx + closeTagLength + startChangeDiff) + processedChange;
      } else {
        result += processedChange;
      }
      processedChange = '';
      console.log('updateHTML 2 lastProcessedHTMLIndex befor', lastProcessedHTMLIndex);
      lastProcessedHTMLIndex = closeTagIdx + closeTagLength + endChangeDiff;
      console.log('updateHTML 2 lastProcessedHTMLIndex', lastProcessedHTMLIndex);
      // the change is handled; exit
      // break is not required here as this is the last element but added for consistency
      break;
    }
  }

  if (lastProcessedHTMLIndex < htmlText.length) {
    console.log('updateHTML lastProcessedHTMLIndex < htmlText.length - 1 result', result);
    console.log('updateHTML lastProcessedHTMLIndex < htmlText.length - 1 htmlText.length', htmlText.length);
    console.log('updateHTML lastProcessedHTMLIndex < htmlText.length - 1 htmlText', htmlText);
    console.log(
      'updateHTML lastProcessedHTMLIndex < htmlText.length - 1 lastProcessedHTMLIndex',
      lastProcessedHTMLIndex
    );
    result += htmlText.substring(lastProcessedHTMLIndex);
  }

  console.log('updateHTML result "', result, '"');
  return result;
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

const htmlStringForMentionSuggestion = (suggestion: Mention): string => {
  const idHTML = ' id ="' + suggestion.id + '"';
  const displayText = suggestion.displayText || '';
  const displayTextHTML = ' displayText ="' + displayText + '"';
  return '<msft-mention' + idHTML + displayTextHTML + '>' + displayText + '</msft-mention>';
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

    if (foundHtmlTag.type === 'open' || foundHtmlTag.type === 'self-closing') {
      const nextTag = parseOpenTag(foundHtmlTag.content, foundHtmlTag.startIdx);
      // Add the plain text between the last tag and this one found
      plainTextRepresentation += text.substring(parseIndex, foundHtmlTag.startIdx);
      nextTag.plainTextBeginIndex = plainTextRepresentation.length;

      if (foundHtmlTag.type === 'open') {
        tagParseStack.push(nextTag);
      } else {
        console.log('Found self-closing tag: ' + foundHtmlTag.content);
        nextTag.closeTagIdx = foundHtmlTag.startIdx; // Set them to the same value
        nextTag.content = '';
        nextTag.plainTextBeginIndex = plainTextRepresentation.length;
        nextTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(nextTag, tagParseStack, tags);
      }
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

        // Insert the plain text pieces for the sub tags
        if (currentOpenTag.tagType === 'msft-mention') {
          plainTextRepresentation =
            plainTextRepresentation.slice(0, currentOpenTag.plainTextBeginIndex) +
            trigger +
            plainTextRepresentation.slice(currentOpenTag.plainTextBeginIndex);
        }

        if (!currentOpenTag.subTags) {
          plainTextRepresentation += currentOpenTag.content;
        } else if (currentOpenTag.subTags.length > 0) {
          // Add text after the last tag
          const lastSubTag = currentOpenTag.subTags[currentOpenTag.subTags.length - 1];
          const trailingCharactersLength =
            currentOpenTag.closeTagIdx! - lastSubTag.closeTagIdx! - lastSubTag.tagType.length - 3;

          if (trailingCharactersLength > 0) {
            const trailingText = currentOpenTag.content.substring(
              currentOpenTag.content.length - trailingCharactersLength
            );
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

    // Update parsing index; move past the end of the close tag
    parseIndex = foundHtmlTag.startIdx + foundHtmlTag.content.length;
  } // While parseIndex < text.length loop

  return [tags, plainTextRepresentation];
};

const parseOpenTag = (tag: string, startIdx: number): ReformedTag => {
  const tagType = tag
    .substring(1, tag.length - 1)
    .split(' ')[0]
    .toLowerCase()
    .replace('/', '');
  return {
    tagType,
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
