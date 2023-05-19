// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, ReactNode, FormEvent, useCallback, useRef } from 'react';
/* @conditional-compile-remove(mention) */
import { useEffect } from 'react';
/* @conditional-compile-remove(mention) */
import { useLocale } from '../localization';

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
import {
  TagData,
  findMentionTagForSelection,
  findNewSelectionIndexForMention,
  findStringsDiffIndexes,
  getDisplayNameForMentionSuggestion,
  getValidatedIndexInRange,
  htmlStringForMentionSuggestion,
  textToTagParser,
  updateHTML
} from './TextFieldWithMention/mentionTagHelpers';
/* @conditional-compile-remove(mention) */
const DEFAULT_MENTION_TRIGGER = '@';

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
