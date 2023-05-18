// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useRef } from 'react';
/* @conditional-compile-remove(mention) */
import { useEffect } from 'react';
/* @conditional-compile-remove(mention) */
import { ComponentStrings, useLocale } from '../localization';

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
  newLineButtonsContainerStyle,
  inputBoxNewLineSpaceAffordance,
  inputButtonTooltipStyle,
  iconWrapperStyle
} from './styles/InputBoxComponent.style';
/* @conditional-compile-remove(mention) */
import { Caret } from 'textarea-caret-ts';
import { isDarkThemed } from '../theming/themeUtils';
import { useTheme } from '../theming';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions, _MentionPopover, Mention } from './MentionPopover';
/* @conditional-compile-remove(mention) */
import { useDebouncedCallback } from 'use-debounce';
/* @conditional-compile-remove(mention) */
const DEFAULT_MENTION_TRIGGER = '@';
/* @conditional-compile-remove(mention) */
const MSFT_MENTION_TAG = 'msft-mention';

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
    /* @conditional-compile-remove(mention) */
    mentionLookupOptions,
    children
  } = props;
  const inputBoxRef = useRef<HTMLDivElement>(null);

  /* @conditional-compile-remove(mention) */
  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<Mention[]>([]);
  /* @conditional-compile-remove(mention) */
  // Current suggestion list, provided by the callback
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | undefined>(undefined);

  /* @conditional-compile-remove(mention) */
  // Index of the current trigger character in the text field
  const [currentTriggerStartIndex, setCurrentTriggerStartIndex] = useState<number>(-1);
  /* @conditional-compile-remove(mention) */
  const [inputTextValue, setInputTextValue] = useState<string>('');
  /* @conditional-compile-remove(mention) */
  const [tagsValue, setTagsValue] = useState<TagData[]>([]);
  /* @conditional-compile-remove(mention) */
  // Index of the previous selection start in the text field
  const [selectionStartValue, setSelectionStartValue] = useState<number | null>(null);
  /* @conditional-compile-remove(mention) */
  // Index of the previous selection end in the text field
  const [selectionEndValue, setSelectionEndValue] = useState<number | null>(null);
  /* @conditional-compile-remove(mention) */
  // Boolean value to check if onMouseDown event should be handled during select as selection range for onMouseDown event is not updated yet and the selection range for mouse click/taps will be updated in onSelect event if needed.
  const [shouldHandleOnMouseDownDuringSelect, setShouldHandleOnMouseDownDuringSelect] = useState<boolean>(true);

  /* @conditional-compile-remove(mention) */
  // Caret position in the text field
  const [caretPosition, setCaretPosition] = useState<Caret.Position | undefined>(undefined);
  /* @conditional-compile-remove(mention) */
  // Index of where the caret is in the text field
  const [caretIndex, setCaretIndex] = useState<number | undefined>(undefined);
  /* @conditional-compile-remove(mention) */
  const localeStrings = useLocale().strings;

  /* @conditional-compile-remove(mention) */
  // Set mention suggestions
  const updateMentionSuggestions = useCallback(
    (suggestions: Mention[]) => {
      setMentionSuggestions(suggestions);
    },
    [setMentionSuggestions]
  );

  /* @conditional-compile-remove(mention) */
  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = mentionLookupOptions?.trigger || DEFAULT_MENTION_TRIGGER;
    const parsedHTMLData = textToTagParser(textValue, trigger);
    setInputTextValue(parsedHTMLData.plainText);
    setTagsValue(parsedHTMLData.tags);
    updateMentionSuggestions([]);
  }, [textValue, mentionLookupOptions?.trigger, updateMentionSuggestions]);

  const mergedRootStyle = mergeStyles(inputBoxWrapperStyle, styles?.root);
  const mergedTextFiledStyle = mergeStyles(
    inputBoxStyle,
    inputClassName,
    props.inlineChildren ? {} : inputBoxNewLineSpaceAffordance
  );

  /* @conditional-compile-remove(mention) */
  useEffect(() => {
    // effect for caret index update
    if (caretIndex === undefined || textFieldRef === undefined || textFieldRef?.current === undefined) {
      return;
    }
    // get validated caret index between 0 and inputTextValue.length otherwise caret will be set to incorrect index
    const updatedCaretIndex = getValidatedIndexInRange({
      min: 0,
      max: inputTextValue.length,
      currentValue: caretIndex
    });
    textFieldRef?.current?.setSelectionRange(updatedCaretIndex, updatedCaretIndex);
    setSelectionStartValue(updatedCaretIndex);
    setSelectionEndValue(updatedCaretIndex);
  }, [caretIndex, inputTextValue.length, textFieldRef, setSelectionStartValue, setSelectionEndValue]);

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
      const mention = htmlStringForMentionSuggestion(suggestion, localeStrings);

      // update plain text with the mention html text
      const newPlainText =
        inputTextValue.substring(0, currentTriggerStartIndex) + mention + inputTextValue.substring(selectionEnd);
      const triggerText = mentionLookupOptions?.trigger ?? DEFAULT_MENTION_TRIGGER;
      // update html text with updated plain text
      const updatedContent = updateHTML({
        htmlText: textValue,
        oldPlainText,
        newPlainText,
        tags: tagsValue,
        startIndex: currentTriggerStartIndex,
        oldPlainTextEndIndex: selectionEnd,
        change: mention,
        mentionTrigger: triggerText
      });
      const displayName = getDisplayNameForMentionSuggestion(suggestion, localeStrings);
      const newCaretIndex = currentTriggerStartIndex + displayName.length + triggerText.length;
      // move the caret in the text field to the end of the mention plain text
      setCaretIndex(newCaretIndex);
      setSelectionEndValue(newCaretIndex);
      setSelectionStartValue(newCaretIndex);
      setCurrentTriggerStartIndex(-1);
      updateMentionSuggestions([]);
      // set focus back to text field
      textFieldRef?.current?.focus();
      setActiveSuggestionIndex(undefined);
      onChange && onChange(undefined, updatedContent.updatedHTML);
    },
    [
      textFieldRef,
      inputTextValue,
      currentTriggerStartIndex,
      mentionLookupOptions?.trigger,
      onChange,
      textValue,
      tagsValue,
      /* @conditional-compile-remove(mention) */
      updateMentionSuggestions,
      /* @conditional-compile-remove(mention) */
      localeStrings
    ]
  );

  const onTextFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      /* @conditional-compile-remove(mention) */
      // caretIndex should be set to undefined when the user is typing
      setCaretIndex(undefined);
      // shouldHandleOnMouseDownDuringSelect should be set to false after the last mouse down event.
      // it shouldn't be updated in onMouseUp
      // as onMouseUp can be triggered before or after onSelect event
      // because its order depends on mouse events not selection.
      /* @conditional-compile-remove(mention) */
      setShouldHandleOnMouseDownDuringSelect(false);
      // Uses KeyCode 229 and which code 229 to determine if the press of the enter key is from a composition session or not (Safari only)
      if (ev.nativeEvent.isComposing || ev.nativeEvent.keyCode === 229 || ev.nativeEvent.which === 229) {
        return;
      }
      if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0) {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? mentionSuggestions.length - 1
              : Math.max(activeSuggestionIndex - 1, 0);
          setActiveSuggestionIndex(newActiveIndex);
        }
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0) {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? 0
              : Math.min(activeSuggestionIndex + 1, mentionSuggestions.length - 1);
          setActiveSuggestionIndex(newActiveIndex);
        }
      }
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();

        // If we are looking up a mention, select the focused suggestion
        /* @conditional-compile-remove(mention) */
        if (mentionSuggestions.length > 0 && activeSuggestionIndex !== undefined) {
          const selectedMention = mentionSuggestions[activeSuggestionIndex];
          if (selectedMention) {
            onSuggestionSelected(selectedMention);
            return;
          }
        }

        onEnterKeyDown && onEnterKeyDown();
      }
      onKeyDown && onKeyDown(ev);
    },
    [
      onEnterKeyDown,
      onKeyDown,
      supportNewline,
      /* @conditional-compile-remove(mention) */
      mentionSuggestions,
      /* @conditional-compile-remove(mention) */
      activeSuggestionIndex,
      /* @conditional-compile-remove(mention) */
      onSuggestionSelected
    ]
  );

  const onRenderChildren = (): JSX.Element => {
    return (
      <Stack horizontal className={mergedChildrenStyle}>
        {children}
      </Stack>
    );
  };

  /* @conditional-compile-remove(mention) */
  const debouncedQueryUpdate = useDebouncedCallback(async (query?: string) => {
    if (query === undefined) {
      updateMentionSuggestions([]);
      return;
    }
    const suggestions = (await mentionLookupOptions?.onQueryUpdated(query)) ?? [];
    if (suggestions.length === 0) {
      setActiveSuggestionIndex(undefined);
    } else if (activeSuggestionIndex === undefined) {
      setActiveSuggestionIndex(0);
    }
    updateMentionSuggestions(suggestions);
  }, 500);

  /* @conditional-compile-remove(mention) */
  useEffect(() => {
    return () => {
      debouncedQueryUpdate.cancel();
    };
  }, [debouncedQueryUpdate]);

  /* @conditional-compile-remove(mention) */
  // Update selections index in mention to navigate by words
  const updateSelectionIndexesWithMentionIfNeeded = useCallback(
    (
      event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      inputTextValue: string,
      selectionStartValue: number | null,
      selectionEndValue: number | null,
      tagsValue: TagData[]
    ): void => {
      let updatedStartIndex = event.currentTarget.selectionStart;
      let updatedEndIndex = event.currentTarget.selectionEnd;
      if (
        event.currentTarget.selectionStart === event.currentTarget.selectionEnd &&
        event.currentTarget.selectionStart !== null &&
        event.currentTarget.selectionStart !== -1
      ) {
        // just a caret movement/usual typing or deleting
        const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionStart);
        // don't include boundary cases to show correct selection, otherwise it will show selection at mention boundaries
        if (
          mentionTag !== undefined &&
          mentionTag.plainTextBeginIndex !== undefined &&
          event.currentTarget.selectionStart > mentionTag.plainTextBeginIndex &&
          event.currentTarget.selectionStart < (mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex)
        ) {
          // get updated selection index
          const newSelectionIndex = findNewSelectionIndexForMention({
            tag: mentionTag,
            textValue: inputTextValue,
            currentSelectionIndex: event.currentTarget.selectionStart,
            previousSelectionIndex: selectionStartValue ?? inputTextValue.length
          });
          updatedStartIndex = newSelectionIndex;
          updatedEndIndex = newSelectionIndex;
        }
      } else if (event.currentTarget.selectionStart !== event.currentTarget.selectionEnd) {
        // Both e.currentTarget.selectionStart !== selectionStartValue and e.currentTarget.selectionEnd !== selectionEndValue can be true when a user selects a text by double click
        if (event.currentTarget.selectionStart !== null && event.currentTarget.selectionStart !== selectionStartValue) {
          // the selection start is changed
          const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionStart);
          // don't include boundary cases to show correct selection, otherwise it will show selection at mention boundaries
          if (
            mentionTag !== undefined &&
            mentionTag.plainTextBeginIndex !== undefined &&
            event.currentTarget.selectionStart > mentionTag.plainTextBeginIndex &&
            event.currentTarget.selectionStart < (mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex)
          ) {
            updatedStartIndex = findNewSelectionIndexForMention({
              tag: mentionTag,
              textValue: inputTextValue,
              currentSelectionIndex: event.currentTarget.selectionStart,
              previousSelectionIndex: selectionStartValue ?? inputTextValue.length
            });
          }
        }
        if (event.currentTarget.selectionEnd !== null && event.currentTarget.selectionEnd !== selectionEndValue) {
          // the selection end is changed
          const mentionTag = findMentionTagForSelection(tagsValue, event.currentTarget.selectionEnd);
          // don't include boundary cases to show correct selection, otherwise it will show selection at mention boundaries
          if (
            mentionTag !== undefined &&
            mentionTag.plainTextBeginIndex !== undefined &&
            event.currentTarget.selectionEnd > mentionTag.plainTextBeginIndex &&
            event.currentTarget.selectionEnd < (mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex)
          ) {
            updatedEndIndex = findNewSelectionIndexForMention({
              tag: mentionTag,
              textValue: inputTextValue,
              currentSelectionIndex: event.currentTarget.selectionEnd,
              previousSelectionIndex: selectionEndValue ?? inputTextValue.length
            });
          }
        }
      }
      // e.currentTarget.selectionDirection should be set to handle shift + arrow keys
      if (event.currentTarget.selectionDirection === null) {
        event.currentTarget.setSelectionRange(updatedStartIndex, updatedEndIndex);
      } else {
        event.currentTarget.setSelectionRange(
          updatedStartIndex,
          updatedEndIndex,
          event.currentTarget.selectionDirection
        );
      }
      setSelectionStartValue(updatedStartIndex);
      setSelectionEndValue(updatedEndIndex);
    },
    [setSelectionStartValue, setSelectionEndValue]
  );

  /* @conditional-compile-remove(mention) */
  const handleOnSelect = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      inputTextValue: string,
      tags: TagData[],
      shouldHandleOnMouseDownDuringSelect: boolean,
      selectionStartValue: number | null,
      selectionEndValue: number | null
    ): void => {
      /* @conditional-compile-remove(mention) */
      if (shouldHandleOnMouseDownDuringSelect && event.currentTarget.selectionStart !== null) {
        // on select was triggered by mouse down
        const mentionTag = findMentionTagForSelection(tags, event.currentTarget.selectionStart);
        if (mentionTag !== undefined && mentionTag.plainTextBeginIndex !== undefined) {
          // handle mention click
          if (event.currentTarget.selectionDirection === null) {
            event.currentTarget.setSelectionRange(
              mentionTag.plainTextBeginIndex,
              mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex
            );
          } else {
            event.currentTarget.setSelectionRange(
              mentionTag.plainTextBeginIndex,
              mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex,
              event.currentTarget.selectionDirection
            );
          }
          setSelectionStartValue(mentionTag.plainTextBeginIndex);
          setSelectionEndValue(mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex);
        } else {
          setSelectionStartValue(event.currentTarget.selectionStart);
          setSelectionEndValue(event.currentTarget.selectionEnd);
        }
      } else {
        // selection was changed by keyboard
        updateSelectionIndexesWithMentionIfNeeded(event, inputTextValue, selectionStartValue, selectionEndValue, tags);
      }
      // don't set setShouldHandleOnMouseDownDuringSelect(false) here as setSelectionRange could trigger additional calls of onSelect event and they may not be handled correctly (because of setSelectionRange calls or rerender)
    },
    [updateSelectionIndexesWithMentionIfNeeded]
  );

  /* @conditional-compile-remove(mention) */
  const handleOnChange = useCallback(
    async (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      tagsValue: TagData[],
      htmlTextValue: string,
      inputTextValue: string,
      currentTriggerStartIndex: number,
      previousSelectionStart?: number,
      previousSelectionEnd?: number,
      currentSelectionStart?: number,
      currentSelectionEnd?: number,
      updatedValue?: string
    ): Promise<void> => {
      if (event.currentTarget === null) {
        return;
      }
      // handle backspace change
      // onSelect is not called for backspace as selection is not changed and local caret index is outdated
      setCaretIndex(undefined);
      const newValue = updatedValue ?? '';
      const triggerText = mentionLookupOptions?.trigger ?? DEFAULT_MENTION_TRIGGER;

      const newTextLength = newValue.length;
      // updating indexes to set between 0 and text length, otherwise selectionRange won't be set correctly
      const currentSelectionEndValue = getValidatedIndexInRange({
        min: 0,
        max: newTextLength,
        currentValue: currentSelectionEnd
      });
      const currentSelectionStartValue = getValidatedIndexInRange({
        min: 0,
        max: newTextLength,
        currentValue: currentSelectionStart
      });
      const previousSelectionStartValue = getValidatedIndexInRange({
        min: 0,
        max: inputTextValue.length,
        currentValue: previousSelectionStart
      });
      const previousSelectionEndValue = getValidatedIndexInRange({
        min: 0,
        max: inputTextValue.length,
        currentValue: previousSelectionEnd
      });

      // If we are enabled for lookups,
      if (mentionLookupOptions !== undefined) {
        // Look at the range of the change for a trigger character
        const triggerPriorIndex = newValue.lastIndexOf(triggerText, currentSelectionEndValue - 1);
        // Update the caret position, if not doing a lookup
        setCaretPosition(Caret.getRelativePosition(event.currentTarget));

        if (triggerPriorIndex !== undefined) {
          // trigger is found
          const isSpaceBeforeTrigger = newValue.substring(triggerPriorIndex - 1, triggerPriorIndex) === ' ';
          const wordAtSelection = newValue.substring(triggerPriorIndex, currentSelectionEndValue);
          let tagIndex = currentTriggerStartIndex;
          if (!isSpaceBeforeTrigger && triggerPriorIndex !== 0) {
            //no space before the trigger <- continuation of the previous word
            tagIndex = -1;
            setCurrentTriggerStartIndex(tagIndex);
          } else if (wordAtSelection === triggerText) {
            // start of the mention
            tagIndex = currentSelectionEndValue - triggerText.length;
            if (tagIndex < 0) {
              tagIndex = 0;
            }
            setCurrentTriggerStartIndex(tagIndex);
          }
          if (tagIndex === -1) {
            await debouncedQueryUpdate(undefined);
          } else {
            // In the middle of a @mention lookup
            if (tagIndex > -1) {
              const query = wordAtSelection.substring(triggerText.length, wordAtSelection.length);
              if (query !== undefined) {
                await debouncedQueryUpdate(query);
              }
            }
          }
        }
      }
      let result = '';
      if (tagsValue.length === 0) {
        // no tags in the string and newValue should be used as a result string
        result = newValue;
      } else {
        // there are tags in the text value and htmlTextValue is html string
        // find diff between old and new text
        const { changeStart, oldChangeEnd, newChangeEnd } = findStringsDiffIndexes({
          oldText: inputTextValue,
          newText: newValue,
          previousSelectionStart: previousSelectionStartValue,
          previousSelectionEnd: previousSelectionEndValue,
          currentSelectionStart: currentSelectionStartValue,
          currentSelectionEnd: currentSelectionEndValue
        });
        const change = newValue.substring(changeStart, newChangeEnd);
        // get updated html string
        const updatedContent = updateHTML({
          htmlText: htmlTextValue,
          oldPlainText: inputTextValue,
          newPlainText: newValue,
          tags: tagsValue,
          startIndex: changeStart,
          oldPlainTextEndIndex: oldChangeEnd,
          change,
          mentionTrigger: triggerText
        });
        result = updatedContent.updatedHTML;
        // update caret index if needed
        if (updatedContent.updatedSelectionIndex !== null) {
          setCaretIndex(updatedContent.updatedSelectionIndex);
          setSelectionEndValue(updatedContent.updatedSelectionIndex);
          setSelectionStartValue(updatedContent.updatedSelectionIndex);
        }
      }

      onChange && onChange(event, result);
    },
    [onChange, mentionLookupOptions, setCaretIndex, setCaretPosition, debouncedQueryUpdate]
  );

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
            <_MentionPopover
              suggestions={mentionSuggestions}
              activeSuggestionIndex={activeSuggestionIndex}
              target={inputBoxRef}
              targetPositionOffset={caretPosition}
              onRenderSuggestionItem={mentionLookupOptions?.onRenderSuggestionItem}
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
            // Remove when switching to react 17+, currently needed because of https://legacy.reactjs.org/docs/legacy-event-pooling.html
            /* @conditional-compile-remove(mention) */
            // Prevents React from resetting event's properties
            e.persist();
            /* @conditional-compile-remove(mention) */
            setInputTextValue(newValue ?? '');
            /* @conditional-compile-remove(mention) */
            handleOnChange(
              e,
              tagsValue,
              textValue,
              inputTextValue,
              currentTriggerStartIndex,
              selectionStartValue === null ? undefined : selectionStartValue,
              selectionEndValue === null ? undefined : selectionEndValue,
              e.currentTarget.selectionStart === null ? undefined : e.currentTarget.selectionStart,
              e.currentTarget.selectionEnd === null ? undefined : e.currentTarget.selectionEnd,
              newValue
            );
            /* @conditional-compile-remove(mention) */
            return;
            onChange(e, newValue);
          }}
          /* @conditional-compile-remove(mention) */
          onSelect={(e) => {
            // update selection if needed
            if (caretIndex !== undefined) {
              setCaretIndex(undefined);
              // sometimes setting selectionRage in effect for updating caretIndex doesn't work as expected and onSelect should handle this case
              if (caretIndex !== e.currentTarget.selectionStart || caretIndex !== e.currentTarget.selectionEnd) {
                e.currentTarget.setSelectionRange(caretIndex, caretIndex);
              }
              return;
            }
            handleOnSelect(
              e,
              inputTextValue,
              tagsValue,
              shouldHandleOnMouseDownDuringSelect,
              selectionStartValue,
              selectionEndValue
            );
          }}
          /* @conditional-compile-remove(mention) */
          onMouseDown={() => {
            // as events order is onMouseDown -> onSelect -> onClick
            // onClick and onMouseDown can't handle clicking on mention event because
            // onMouseDown doesn't have correct selectionRange yet and
            // onClick already has wrong range as it's called after onSelect that updates the selection range
            // so we need to handle onMouseDown to prevent onSelect default behavior
            setShouldHandleOnMouseDownDuringSelect(true);
          }}
          /* @conditional-compile-remove(mention) */
          onTouchStart={() => {
            // see onMouseDown for more details
            setShouldHandleOnMouseDownDuringSelect(true);
          }}
          /* @conditional-compile-remove(mention) */
          onBlur={() => {
            // setup all flags to default values when text field loses focus
            setShouldHandleOnMouseDownDuringSelect(false);
            setCaretIndex(undefined);
            setSelectionStartValue(null);
            setSelectionEndValue(null);
          }}
          autoComplete="off"
          onKeyDown={onTextFieldKeyDown}
          styles={mergedTextFieldStyle}
          disabled={disabled}
          errorMessage={errorMessage}
          onRenderSuffix={onRenderChildren}
          elementRef={inputBoxRef}
        />
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
        // VoiceOver fix: Avoid icon from stealing focus when IconButton is double-tapped to send message by wrapping with Stack with pointerEvents style to none
        onRenderIcon={() => <Stack className={iconWrapperStyle}>{onRenderIcon(isHover)}</Stack>}
      />
    </TooltipHost>
  );
};

/* @conditional-compile-remove(mention) */
/**
 * Props for finding a valid index in range.
 *
 * @private
 */
type ValidatedIndexRangeProps = {
  min: number;
  max: number;
  currentValue?: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Get validated value for index between min and max values. If currentValue is not defined, -1 will be used instead.
 *
 * @private
 * @param props - Props for finding a valid index in range.
 * @returns Valid index in the range.
 */
const getValidatedIndexInRange = (props: ValidatedIndexRangeProps): number => {
  const { min, max, currentValue } = props;
  let updatedValue = currentValue ?? -1;
  updatedValue = Math.max(min, updatedValue);
  updatedValue = Math.min(updatedValue, max);
  return updatedValue;
};

/* @conditional-compile-remove(mention) */
/**
 * Find mention tag for selection if exists.
 *
 * @private
 * @param tags - Existing list of tags.
 * @param selection - Selection index.
 * @returns Mention tag if exists, otherwise undefined.
 */
const findMentionTagForSelection = (tags: TagData[], selection: number): TagData | undefined => {
  let mentionTag: TagData | undefined = undefined;
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    const closingTagInfo = getTagClosingTagInfo(tag);
    if (tag.plainTextBeginIndex !== undefined && tag.plainTextBeginIndex > selection) {
      // no need to check further as the selection is before the tag
      break;
    } else if (
      tag.plainTextBeginIndex !== undefined &&
      tag.plainTextBeginIndex <= selection &&
      selection <= closingTagInfo.plainTextEndIndex
    ) {
      // no need to check if tag doesn't contain selection
      if (tag.subTags !== undefined && tag.subTags.length !== 0) {
        const selectedTag = findMentionTagForSelection(tag.subTags, selection);
        if (selectedTag !== undefined) {
          mentionTag = selectedTag;
          break;
        }
      } else if (tag.tagType === MSFT_MENTION_TAG) {
        mentionTag = tag;
        break;
      }
    }
  }
  return mentionTag;
};

/* @conditional-compile-remove(mention) */
/**
 * Props for finding new selection index for mention
 *
 * @private
 */
type NewSelectionIndexForMentionProps = {
  tag: TagData;
  textValue: string;
  currentSelectionIndex: number;
  previousSelectionIndex: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Find a new the selection index.
 *
 * @private
 * @param props - Props for finding new selection index for mention.
 * @returns New selection index if it is inside of a mention tag, otherwise the current selection.
 */
const findNewSelectionIndexForMention = (props: NewSelectionIndexForMentionProps): number => {
  const { tag, textValue, currentSelectionIndex, previousSelectionIndex } = props;
  // check if this is a mention tag and selection should be updated
  if (
    tag.tagType !== MSFT_MENTION_TAG ||
    tag.plainTextBeginIndex === undefined ||
    currentSelectionIndex === previousSelectionIndex ||
    tag.plainTextEndIndex === undefined
  ) {
    return currentSelectionIndex;
  }
  let spaceIndex = 0;
  if (currentSelectionIndex <= previousSelectionIndex) {
    // the cursor is moved to the left, find the last index before the cursor
    spaceIndex = textValue.lastIndexOf(' ', currentSelectionIndex ?? 0);
    if (spaceIndex === -1) {
      // no space before the selection, use the beginning of the tag
      spaceIndex = tag.plainTextBeginIndex;
    }
  } else {
    // the cursor is moved to the right, find the fist index after the cursor
    spaceIndex = textValue.indexOf(' ', currentSelectionIndex ?? 0);
    if (spaceIndex === -1) {
      // no space after the selection, use the end of the tag
      spaceIndex = tag.plainTextEndIndex ?? tag.plainTextBeginIndex;
    }
  }
  spaceIndex = Math.max(tag.plainTextBeginIndex, spaceIndex);
  spaceIndex = Math.min(tag.plainTextEndIndex, spaceIndex);
  return spaceIndex;
};

/* @conditional-compile-remove(mention) */
/**
 * Props for mention update HTML function
 *
 * @private
 */
type MentionTagUpdateProps = {
  htmlText: string;
  oldPlainText: string;
  lastProcessedHTMLIndex: number;
  processedChange: string;
  change: string;
  tag: TagData;
  closeTagIdx: number;
  closeTagLength: number;
  plainTextEndIndex: number;
  startIndex: number;
  oldPlainTextEndIndex: number;
  mentionTagLength: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Result for mention update HTML function
 *
 * @private
 */
type MentionTagUpdateResult = {
  result: string;
  updatedChange: string;
  htmlIndex: number;
  plainTextSelectionEndIndex: number | null;
};

/* @conditional-compile-remove(mention) */
/**
 * Handle mention tag edit and by word deleting
 *
 * @private
 * @param props - Props for mention update HTML function.
 * @returns Updated texts and indexes.
 */
const handleMentionTagUpdate = (props: MentionTagUpdateProps): MentionTagUpdateResult => {
  const {
    htmlText,
    oldPlainText,
    change,
    tag,
    closeTagIdx,
    closeTagLength,
    plainTextEndIndex,
    startIndex,
    oldPlainTextEndIndex,
    mentionTagLength
  } = props;
  let processedChange = props.processedChange;
  let lastProcessedHTMLIndex = props.lastProcessedHTMLIndex;
  if (tag.tagType !== MSFT_MENTION_TAG || tag.plainTextBeginIndex === undefined) {
    // not a mention tag
    return {
      result: '',
      updatedChange: processedChange,
      htmlIndex: lastProcessedHTMLIndex,
      plainTextSelectionEndIndex: null
    };
  }
  let result = '';
  let plainTextSelectionEndIndex: number | null = null;
  let rangeStart: number;
  let rangeEnd: number;
  // check if space symbol is handled in case if string looks like '<1 2 3>'
  let isSpaceLengthHandled = false;
  rangeStart = oldPlainText.lastIndexOf(' ', startIndex);
  if (rangeStart !== -1 && rangeStart !== undefined && rangeStart > tag.plainTextBeginIndex) {
    isSpaceLengthHandled = true;
  }
  rangeEnd = oldPlainText.indexOf(' ', oldPlainTextEndIndex);
  if (rangeEnd === -1 || rangeEnd === undefined) {
    // check if space symbol is not found
    rangeEnd = plainTextEndIndex;
  } else if (!isSpaceLengthHandled) {
    // +1 to include the space symbol
    rangeEnd += 1;
  }
  isSpaceLengthHandled = true;

  if (rangeStart === -1 || rangeStart === undefined || rangeStart < tag.plainTextBeginIndex) {
    // rangeStart should be at least equal to tag.plainTextBeginIndex
    rangeStart = tag.plainTextBeginIndex;
  }
  if (rangeEnd > plainTextEndIndex) {
    // rangeEnd should be at most equal to plainTextEndIndex
    rangeEnd = plainTextEndIndex;
  }
  if (rangeStart === tag.plainTextBeginIndex && rangeEnd === plainTextEndIndex) {
    // the whole tag should be removed
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
    plainTextSelectionEndIndex = tag.plainTextBeginIndex + processedChange.length;
    processedChange = '';
    lastProcessedHTMLIndex = closeTagIdx + closeTagLength;
  } else {
    // only part of the tag should be removed
    let startChangeDiff = 0;
    let endChangeDiff = 0;
    // need to check only rangeStart > tag.plainTextBeginIndex as when rangeStart === tag.plainTextBeginIndex startChangeDiff = 0 and mentionTagLength shouldn't be subtracted
    if (rangeStart > tag.plainTextBeginIndex) {
      startChangeDiff = rangeStart - tag.plainTextBeginIndex - mentionTagLength;
    }
    endChangeDiff = rangeEnd - tag.plainTextBeginIndex - mentionTagLength;
    result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff);

    if (startIndex < tag.plainTextBeginIndex) {
      // if the change is before the tag, the selection should start from startIndex (rangeStart will be equal to tag.plainTextBeginIndex)
      plainTextSelectionEndIndex = startIndex + change.length;
    } else {
      // if the change is inside the tag, the selection should start with rangeStart
      plainTextSelectionEndIndex = rangeStart + processedChange.length;
    }
    lastProcessedHTMLIndex = tag.openTagIdx + tag.openTagBody.length + endChangeDiff;
    // processed change should not be changed as it should be added after the tag
  }
  return { result, updatedChange: processedChange, htmlIndex: lastProcessedHTMLIndex, plainTextSelectionEndIndex };
};

/* @conditional-compile-remove(mention) */
/**
 * Closing tag information
 *
 * @private
 */
type ClosingTagInfoResult = {
  plainTextEndIndex: number;
  closeTagIdx: number;
  closeTagLength: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Get closing tag information if exists otherwise return information as for self closing tag
 *
 * @private
 * @param tag - Tag data.
 * @returns Closing tag information for the provided tag.
 */
const getTagClosingTagInfo = (tag: TagData): ClosingTagInfoResult => {
  let plainTextEndIndex = 0;
  let closeTagIdx = 0;
  let closeTagLength = 0;
  if (tag.plainTextEndIndex !== undefined && tag.closeTagIdx !== undefined) {
    // close tag exists
    plainTextEndIndex = tag.plainTextEndIndex;
    closeTagIdx = tag.closeTagIdx;
    // tag.tagType.length + </>
    closeTagLength = tag.tagType.length + 3;
  } else if (tag.plainTextBeginIndex !== undefined) {
    // no close tag
    plainTextEndIndex = tag.plainTextBeginIndex;
    closeTagIdx = tag.openTagIdx + tag.openTagBody.length;
    closeTagLength = 0;
  }
  return { plainTextEndIndex, closeTagIdx, closeTagLength };
};

/* @conditional-compile-remove(mention) */
/**
 * Props for update HTML function
 *
 * @private
 */
type UpdateHTMLProps = {
  htmlText: string;
  oldPlainText: string;
  newPlainText: string;
  tags: TagData[];
  startIndex: number;
  oldPlainTextEndIndex: number;
  change: string;
  mentionTrigger: string;
};

/* @conditional-compile-remove(mention) */
/**
 * Go through the text and update it with the changed text
 *
 * @private
 * @param props - Props for update HTML function.
 * @returns Updated HTML and selection index if the selection index should be set.
 */
const updateHTML = (props: UpdateHTMLProps): { updatedHTML: string; updatedSelectionIndex: number | null } => {
  const { htmlText, oldPlainText, newPlainText, tags, startIndex, oldPlainTextEndIndex, change, mentionTrigger } =
    props;
  if (tags.length === 0 || (startIndex === 0 && oldPlainTextEndIndex === oldPlainText.length - 1)) {
    // no tags added yet or the whole text is changed
    return { updatedHTML: newPlainText, updatedSelectionIndex: null };
  }
  let result = '';
  let lastProcessedHTMLIndex = 0;
  // the value can be updated with empty string when the change covers more than 1 place (tag + before or after the tag)
  // in this case change won't be added as part of the tag
  // e.g.: change is before and partially in tag => change will be added before the tag and outdated text in the tag will be removed
  // e.g.: change is after and partially in tag => change will be added after the tag and outdated text in the tag will be removed
  // e.g.: change is on the beginning of the tag => change will be added before the tag
  // e.g.: change is on the end of the tag => change will be added to the tag if it's not mention and after the tag if it's mention
  let processedChange = change;
  // end tag plain text index of the last processed tag
  let lastProcessedPlainTextTagEndIndex = 0;
  // as some tags/text can be removed fully, selection should be updated correctly
  let changeNewEndIndex: number | null = null;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.plainTextBeginIndex === undefined) {
      continue;
    }
    // all plain text indexes includes trigger length for the mention that shouldn't be included in
    // htmlText.substring because html strings don't include the trigger
    // mentionTagLength will be set only for mention tag, otherwise should be 0
    let mentionTagLength = 0;
    let isMentionTag = false;
    if (tag.tagType === MSFT_MENTION_TAG) {
      mentionTagLength = mentionTrigger.length;
      isMentionTag = true;
    }
    if (startIndex <= tag.plainTextBeginIndex) {
      // change start is before the open tag
      // Math.max(lastProcessedPlainTextTagEndIndex, startIndex) is used as startIndex may not be in [[previous tag].plainTextEndIndex - tag.plainTextBeginIndex] range
      const startChangeDiff = tag.plainTextBeginIndex - Math.max(lastProcessedPlainTextTagEndIndex, startIndex);
      result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx - startChangeDiff) + processedChange;
      processedChange = '';
      if (oldPlainTextEndIndex <= tag.plainTextBeginIndex) {
        // the whole change is before tag start
        // mentionTag length can be ignored here as the change is before the tag
        const endChangeDiff = tag.plainTextBeginIndex - oldPlainTextEndIndex;
        lastProcessedHTMLIndex = tag.openTagIdx - endChangeDiff;
        // the change is handled; exit
        break;
      } else {
        // change continues in the tag
        lastProcessedHTMLIndex = tag.openTagIdx;
        // proceed to the next check
      }
    }
    const closingTagInfo = getTagClosingTagInfo(tag);
    if (startIndex <= closingTagInfo.plainTextEndIndex) {
      // change started before the end tag
      if (startIndex <= tag.plainTextBeginIndex && oldPlainTextEndIndex === closingTagInfo.plainTextEndIndex) {
        // the change is a tag or starts before the tag
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
        processedChange = '';
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // the change is handled; exit
        break;
      } else if (startIndex >= tag.plainTextBeginIndex && oldPlainTextEndIndex <= closingTagInfo.plainTextEndIndex) {
        // the change is between the tag
        if (isMentionTag) {
          if (change !== '') {
            if (startIndex !== tag.plainTextBeginIndex && startIndex !== closingTagInfo.plainTextEndIndex) {
              // mention tag should be deleted when user tries to edit it in the middle
              result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
              changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
              lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
            } else if (startIndex === tag.plainTextBeginIndex) {
              // non empty change at the beginning of the mention tag to be added before the mention tag
              result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx) + processedChange;
              changeNewEndIndex = tag.plainTextBeginIndex + processedChange.length;
              lastProcessedHTMLIndex = tag.openTagIdx;
            } else if (startIndex === closingTagInfo.plainTextEndIndex) {
              // non empty change at the end of the mention tag to be added after the mention tag
              result +=
                htmlText.substring(lastProcessedHTMLIndex, closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength) +
                processedChange;
              changeNewEndIndex = closingTagInfo.plainTextEndIndex + processedChange.length;
              lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
            }
            processedChange = '';
          } else {
            const updateMentionTagResult = handleMentionTagUpdate({
              htmlText,
              oldPlainText,
              lastProcessedHTMLIndex,
              processedChange,
              change,
              tag,
              closeTagIdx: closingTagInfo.closeTagIdx,
              closeTagLength: closingTagInfo.closeTagLength,
              plainTextEndIndex: closingTagInfo.plainTextEndIndex,
              startIndex,
              oldPlainTextEndIndex,
              mentionTagLength
            });
            result += updateMentionTagResult.result;
            changeNewEndIndex = updateMentionTagResult.plainTextSelectionEndIndex;
            processedChange = updateMentionTagResult.updatedChange;
            lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
          }
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: processedChange,
            mentionTrigger
          });
          result += stringBefore + updatedContent.updatedHTML;
          changeNewEndIndex = updatedContent.updatedSelectionIndex;
        } else {
          // no subtags
          const startChangeDiff = startIndex - tag.plainTextBeginIndex;
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length + startChangeDiff) +
            processedChange;
          processedChange = '';
          if (oldPlainTextEndIndex < closingTagInfo.plainTextEndIndex) {
            const endChangeDiff = oldPlainTextEndIndex - tag.plainTextBeginIndex;
            lastProcessedHTMLIndex = tag.openTagIdx + tag.openTagBody.length + endChangeDiff;
          } else if (oldPlainTextEndIndex === closingTagInfo.plainTextEndIndex) {
            lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          }
        }
        // the change is handled; exit
        break;
      } else if (startIndex > tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change started in the tag but finishes somewhere further
        const startChangeDiff = startIndex - tag.plainTextBeginIndex - mentionTagLength;
        if (isMentionTag) {
          const updateMentionTagResult = handleMentionTagUpdate({
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            processedChange: '',
            change,
            tag,
            closeTagIdx: closingTagInfo.closeTagIdx,
            closeTagLength: closingTagInfo.closeTagLength,
            plainTextEndIndex: closingTagInfo.plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          });
          result += updateMentionTagResult.result;
          lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
          // no need to handle plainTextSelectionEndIndex as the change will be added later
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: '', // the part of the tag should be just deleted without processedChange update and change will be added after this tag
            mentionTrigger
          });
          result += stringBefore + updatedContent.updatedHTML;
        } else {
          // no subtags
          result += htmlText.substring(
            lastProcessedHTMLIndex,
            tag.openTagIdx + tag.openTagBody.length + startChangeDiff
          );
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
        }
        // proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change starts before  the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        // no need to save anything between lastProcessedHTMLIndex and closeTagIdx + closeTagLength
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // proceed with the next calculations
      } else if (startIndex === tag.plainTextBeginIndex && oldPlainTextEndIndex > closingTagInfo.plainTextEndIndex) {
        // the change starts in the tag and finishes after it
        // tag should be removed, no matter if there are subtags
        result += htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx);
        // processedChange shouldn't be updated as it will be added after the tag
        lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength;
        // proceed with the next calculations
      } else if (startIndex < tag.plainTextBeginIndex && oldPlainTextEndIndex < closingTagInfo.plainTextEndIndex) {
        // the change  starts before the tag and ends in a tag
        if (isMentionTag) {
          // mention tag
          const updateMentionTagResult = handleMentionTagUpdate({
            htmlText,
            oldPlainText,
            lastProcessedHTMLIndex,
            processedChange: '', // the part of mention should be just deleted without processedChange update
            change,
            tag,
            closeTagIdx: closingTagInfo.closeTagIdx,
            closeTagLength: closingTagInfo.closeTagLength,
            plainTextEndIndex: closingTagInfo.plainTextEndIndex,
            startIndex,
            oldPlainTextEndIndex,
            mentionTagLength
          });
          changeNewEndIndex = updateMentionTagResult.plainTextSelectionEndIndex;
          result += updateMentionTagResult.result;
          lastProcessedHTMLIndex = updateMentionTagResult.htmlIndex;
        } else if (tag.subTags !== undefined && tag.subTags.length !== 0 && tag.content !== undefined) {
          // with subtags
          const stringBefore = htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length);
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx;
          const updatedContent = updateHTML({
            htmlText: tag.content,
            oldPlainText,
            newPlainText,
            tags: tag.subTags,
            startIndex,
            oldPlainTextEndIndex,
            change: processedChange, // processedChange should be equal '' and the part of the tag should be deleted as the change was handled before this tag
            mentionTrigger
          });
          processedChange = '';
          result += stringBefore + updatedContent.updatedHTML;
        } else {
          // no subtags
          result +=
            htmlText.substring(lastProcessedHTMLIndex, tag.openTagIdx + tag.openTagBody.length) + processedChange;
          processedChange = '';
          // oldPlainTextEndIndex already includes mentionTag length
          const endChangeDiff = closingTagInfo.plainTextEndIndex - oldPlainTextEndIndex;
          // as change may be before the end of the tag, we need to add the rest of the tag
          lastProcessedHTMLIndex = closingTagInfo.closeTagIdx - endChangeDiff;
        }
        // the change is handled; exit
        break;
      }
      lastProcessedPlainTextTagEndIndex = closingTagInfo.plainTextEndIndex;
    }

    if (i === tags.length - 1 && oldPlainTextEndIndex >= closingTagInfo.plainTextEndIndex) {
      // the last tag should handle the end of the change if needed
      // oldPlainTextEndIndex already includes mentionTag length
      const endChangeDiff = oldPlainTextEndIndex - closingTagInfo.plainTextEndIndex;
      if (startIndex >= closingTagInfo.plainTextEndIndex) {
        const startChangeDiff = startIndex - closingTagInfo.plainTextEndIndex;
        result +=
          htmlText.substring(
            lastProcessedHTMLIndex,
            closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength + startChangeDiff
          ) + processedChange;
      } else {
        result +=
          htmlText.substring(lastProcessedHTMLIndex, closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength) +
          processedChange;
      }
      processedChange = '';
      lastProcessedHTMLIndex = closingTagInfo.closeTagIdx + closingTagInfo.closeTagLength + endChangeDiff;
      // the change is handled; exit
      // break is not required here as this is the last element but added for consistency
      break;
    }
  }
  if (lastProcessedHTMLIndex < htmlText.length) {
    // add the rest of the html string
    result += htmlText.substring(lastProcessedHTMLIndex);
  }
  return { updatedHTML: result, updatedSelectionIndex: changeNewEndIndex };
};

/* @conditional-compile-remove(mention) */
/**
 * Props for finding strings diff indexes
 *
 * @private
 */
type DiffIndexesProps = {
  // the old text
  oldText: string;
  // the new text
  newText: string;
  // the start of previous selection, should be a valid position in the input field
  previousSelectionStart: number;
  // the end of previous selection, should be a valid position in the input field
  previousSelectionEnd: number;
  // the start of current selection, should be a valid position in the input field
  currentSelectionStart: number;
  // the end of current selection, should be a valid position in the input field
  currentSelectionEnd: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Result of finding strings diff indexes function
 *
 * @private
 */
type DiffIndexesResult = {
  changeStart: number;
  oldChangeEnd: number;
  newChangeEnd: number;
};

/* @conditional-compile-remove(mention) */
/**
 * Given the oldText and newText, find the start index, old end index and new end index for the changes
 *
 * @private
 * @param props - Props for finding stings diff indexes function.
 * @returns Indexes for change start and ends in new and old texts. The old and new end indexes are exclusive.
 */
const findStringsDiffIndexes = (props: DiffIndexesProps): DiffIndexesResult => {
  const { oldText, newText, previousSelectionStart, previousSelectionEnd, currentSelectionStart, currentSelectionEnd } =
    props;
  const newTextLength = newText.length;
  const oldTextLength = oldText.length;
  // let changeStart = 0;
  let newChangeEnd = newTextLength;
  let oldChangeEnd = oldTextLength;
  const previousSelectionStartValue = previousSelectionStart > -1 ? previousSelectionStart : oldTextLength;
  const previousSelectionEndValue = previousSelectionEnd > -1 ? previousSelectionEnd : oldTextLength;
  const currentSelectionStartValue = currentSelectionStart > -1 ? currentSelectionStart : newTextLength;
  const currentSelectionEndValue = currentSelectionEnd > -1 ? currentSelectionEnd : newTextLength;
  const changeStart = Math.min(
    previousSelectionStartValue,
    previousSelectionEndValue,
    currentSelectionStartValue,
    currentSelectionEndValue,
    newTextLength,
    oldTextLength
  );

  if (oldTextLength < newTextLength) {
    //insert or replacement
    if (oldTextLength === changeStart) {
      // when change was at the end of string
      // change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < newTextLength && oldTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;

        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // change is found
          break;
        }
      }
      // make indexes exclusive
      newChangeEnd += 1;
      oldChangeEnd += 1;
    }
  } else if (oldTextLength > newTextLength) {
    //deletion or replacement
    if (newTextLength === changeStart) {
      // when change was at the end of string
      // change is found
      newChangeEnd = newTextLength;
      oldChangeEnd = oldTextLength;
    } else {
      for (let i = 1; i < oldTextLength && newTextLength - i >= changeStart; i++) {
        newChangeEnd = newTextLength - i - 1;
        oldChangeEnd = oldTextLength - i - 1;
        if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
          // change is found
          break;
        }
      }
      // make indexes exclusive
      newChangeEnd += 1;
      oldChangeEnd += 1;
    }
  } else {
    // replacement
    for (let i = 1; i < oldTextLength && oldTextLength - i >= changeStart; i++) {
      newChangeEnd = newTextLength - i - 1;
      oldChangeEnd = oldTextLength - i - 1;

      if (newText[newChangeEnd] !== oldText[oldChangeEnd]) {
        // change is found
        break;
      }
    }
    // make indexes exclusive if they aren't equal to the length of the string
    if (newChangeEnd !== newText.length) {
      newChangeEnd += 1;
    }
    if (oldChangeEnd !== oldText.length) {
      oldChangeEnd += 1;
    }
  }
  return { changeStart, oldChangeEnd, newChangeEnd };
};

/* @conditional-compile-remove(mention) */
/**
 * Get the html string for the mention suggestion.
 *
 * @private
 * @param suggestion - The mention suggestion.
 * @param localeStrings - The locale strings.
 * @returns The html string for the mention suggestion.
 */
const htmlStringForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const idHTML = ' id ="' + suggestion.id + '"';
  const displayTextHTML = ' displayText ="' + suggestion.displayText + '"';
  const displayText = getDisplayNameForMentionSuggestion(suggestion, localeStrings);
  return '<' + MSFT_MENTION_TAG + idHTML + displayTextHTML + '>' + displayText + '</' + MSFT_MENTION_TAG + '>';
};

/* @conditional-compile-remove(mention) */
/**
 * Get display name for the mention suggestion.
 *
 * @private
 *
 * @param suggestion - The mention suggestion.
 * @param localeStrings - The locale strings.
 * @returns The display name for the mention suggestion or display name placeholder if display name is empty.
 */
const getDisplayNameForMentionSuggestion = (suggestion: Mention, localeStrings: ComponentStrings): string => {
  const displayNamePlaceholder = localeStrings.participantItem.displayNamePlaceholder;
  return suggestion.displayText !== '' ? suggestion.displayText : displayNamePlaceholder ?? '';
};

/* @conditional-compile-remove(mention) */
type TagData = {
  tagType: string; // The type of tag (e.g. msft-mention)
  openTagIdx: number; // Start of the tag relative to the parent content
  openTagBody: string; // Complete open tag body
  content?: string; // All content between the open and close tags
  closeTagIdx?: number; // Start of the close tag relative to the parent content
  subTags?: TagData[]; // Any child tags
  plainTextBeginIndex?: number; // Absolute index of the open tag start should be in plain text
  plainTextEndIndex?: number; // Absolute index of the close tag start should be in plain text
};

/* @conditional-compile-remove(mention) */
type HtmlTagType = 'open' | 'close' | 'self-closing';
/* @conditional-compile-remove(mention) */
type HtmlTag = {
  content: string;
  startIdx: number;
  type: HtmlTagType;
};

/* @conditional-compile-remove(mention) */
/**
 * Parse the text and return the tags and the plain text in one go
 * @private
 * @param text - The text to parse for HTML tags
 * @param trigger The trigger to show for the mention tag in plain text
 *
 * @returns An array of tags and the plain text representation
 */
const textToTagParser = (text: string, trigger: string): { tags: TagData[]; plainText: string } => {
  const tags: TagData[] = []; // Tags passed back to the caller
  const tagParseStack: TagData[] = []; // Local stack to use while parsing

  let plainTextRepresentation = '';

  let parseIndex = 0;
  while (parseIndex < text.length) {
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
        nextTag.content = '';
        nextTag.plainTextBeginIndex = plainTextRepresentation.length;
        nextTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(nextTag, tagParseStack, tags);
      }
    }

    if (foundHtmlTag.type === 'close') {
      const currentOpenTag = tagParseStack.pop();
      const closeTagType = foundHtmlTag.content.substring(2, foundHtmlTag.content.length - 1).toLowerCase();

      if (currentOpenTag && currentOpenTag.tagType === closeTagType) {
        // Tag startIdx is absolute to the text. This is updated later to be relative to the parent tag
        currentOpenTag.content = text.substring(
          currentOpenTag.openTagIdx + currentOpenTag.openTagBody.length,
          foundHtmlTag.startIdx
        );

        // Insert the plain text pieces for the sub tags
        if (currentOpenTag.tagType === MSFT_MENTION_TAG) {
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
          const startOfRemainingText =
            (lastSubTag.closeTagIdx ?? lastSubTag.openTagIdx) + lastSubTag.tagType.length + 3;
          const trailingText = currentOpenTag.content.substring(startOfRemainingText);
          plainTextRepresentation += trailingText;
        }

        currentOpenTag.plainTextEndIndex = plainTextRepresentation.length;
        addTag(currentOpenTag, tagParseStack, tags);
      } else {
        console.error(
          'Unexpected close tag found. Got "' +
            closeTagType +
            '" but expected "' +
            tagParseStack[tagParseStack.length - 1]?.tagType +
            '"'
        );
      }
    }

    // Update parsing index; move past the end of the close tag
    parseIndex = foundHtmlTag.startIdx + foundHtmlTag.content.length;
  } // While parseIndex < text.length loop

  return { tags, plainText: plainTextRepresentation };
};

/* @conditional-compile-remove(mention) */
const parseOpenTag = (tag: string, startIdx: number): TagData => {
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

/* @conditional-compile-remove(mention) */
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

/* @conditional-compile-remove(mention) */
const addTag = (tag: TagData, parseStack: TagData[], tags: TagData[]): void => {
  // Add as sub-tag to the parent stack tag, if there is one
  const parentTag = parseStack[parseStack.length - 1];

  if (parentTag) {
    // Adjust the open tag index to be relative to the parent tag
    const parentContentStartIdx = parentTag.openTagIdx + parentTag.openTagBody.length;
    const relativeIdx = tag.openTagIdx - parentContentStartIdx;
    tag.openTagIdx = relativeIdx;
  }

  if (!tag.closeTagIdx) {
    // If the tag is self-closing, the close tag is the same as the open tag
    if (tag.openTagBody[tag.openTagBody.length - 2] === '/') {
      tag.closeTagIdx = tag.openTagIdx;
    } else {
      // Otherwise, the close tag index is the open tag index + the open tag body + the content length
      tag.closeTagIdx = tag.openTagIdx + tag.openTagBody.length + (tag.content ?? []).length;
    }
  }

  // Put the tag where it belongs
  if (!parentTag) {
    tags.push(tag);
  } else {
    if (!parentTag.subTags) {
      parentTag.subTags = [tag];
    } else {
      parentTag.subTags.push(tag);
    }
  }
};
