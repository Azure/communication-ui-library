// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, FormEvent, useCallback, useRef } from 'react';
import { useEffect } from 'react';
import { useLocale } from '../../localization';
import { TextField, ITextField, ITextFieldProps } from '@fluentui/react';
import { Caret } from 'textarea-caret-ts';
import { MentionLookupOptions, _MentionPopover, Mention } from './../MentionPopover';
import { useDebouncedCallback } from 'use-debounce';
import {
  TagData,
  getDisplayNameForMentionSuggestion,
  getUpdatedNewValueForOnChange,
  getValidatedIndexInRange,
  htmlStringForMentionSuggestion,
  textToTagParser,
  updateHTML,
  updateSelectionIndicesWithMentionIfNeeded
} from './mentionTagUtils';
import { isEnterKeyEventFromCompositionSession } from '../utils/keyboardNavigation';

const DEFAULT_MENTION_TRIGGER = '@';
const DEBOUNCE_TIME_INTERVAL = 500;

/**
 * Props for the TextFieldWithMention component.
 *
 * @private
 */
export interface TextFieldWithMentionProps {
  textFieldProps: ITextFieldProps;
  dataUiId?: string;
  textValue: string; // This could be plain text or HTML.
  onChange: (event?: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEnterKeyDown?: () => void;
  textFieldRef?: React.RefObject<ITextField>;
  supportNewline?: boolean;
  mentionLookupOptions?: MentionLookupOptions;
}

/**
 * @private
 */
export const TextFieldWithMention = (props: TextFieldWithMentionProps): JSX.Element => {
  const {
    textFieldProps,
    dataUiId,
    textValue,
    onChange,
    textFieldRef,
    onKeyDown,
    onEnterKeyDown,
    supportNewline,
    mentionLookupOptions
  } = props;
  const inputBoxRef = useRef<HTMLDivElement>(null);

  // Current suggestion list, provided by the callback
  const [mentionSuggestions, setMentionSuggestions] = useState<Mention[]>([]);
  // Current suggestion list, provided by the callback
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | undefined>(undefined);
  // Index of the current trigger character in the text field
  const [currentTriggerStartIndex, setCurrentTriggerStartIndex] = useState<number>(-1);
  const [inputTextValue, setInputTextValue] = useState<string>('');
  const [tagsValue, setTagsValue] = useState<TagData[]>([]);
  // Index of the previous selection start in the text field
  const [selectionStartValue, setSelectionStartValue] = useState<number | undefined>(undefined);
  // Index of the previous selection end in the text field
  const [selectionEndValue, setSelectionEndValue] = useState<number | undefined>(undefined);
  // Boolean value to check if onMouseDown event should be handled during select as selection range for onMouseDown event is not updated yet
  // and the selection range for mouse click/taps will be updated in onSelect event if needed.
  const [shouldHandleOnMouseDownDuringSelect, setShouldHandleOnMouseDownDuringSelect] = useState<boolean>(true);
  // Caret position in the text field
  const [caretPosition, setCaretPosition] = useState<Caret.Position | undefined>(undefined);
  // Index of where the caret is in the text field
  const [caretIndex, setCaretIndex] = useState<number | undefined>(undefined);
  const localeStrings = useLocale().strings;

  // Set mention suggestions
  const updateMentionSuggestions = useCallback(
    (suggestions: Mention[]) => {
      setMentionSuggestions(suggestions);
    },
    [setMentionSuggestions]
  );

  // Parse the text and get the plain text version to display in the input box
  useEffect(() => {
    const trigger = mentionLookupOptions?.trigger || DEFAULT_MENTION_TRIGGER;
    const parsedHTMLData = textToTagParser(textValue, trigger);
    setInputTextValue(parsedHTMLData.plainText);
    setTagsValue(parsedHTMLData.tags);
    updateMentionSuggestions([]);
  }, [textValue, mentionLookupOptions?.trigger, updateMentionSuggestions]);

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
      updateMentionSuggestions,
      localeStrings
    ]
  );

  const onTextFieldKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // caretIndex should be set to undefined when the user is typing
      setCaretIndex(undefined);
      // shouldHandleOnMouseDownDuringSelect should be set to false after the last mouse down event.
      // it shouldn't be updated in onMouseUp
      // as onMouseUp can be triggered before or after onSelect event
      // because its order depends on mouse events not selection.
      setShouldHandleOnMouseDownDuringSelect(false);
      if (isEnterKeyEventFromCompositionSession(ev)) {
        return;
      }
      if (mentionSuggestions.length > 0) {
        ev.preventDefault();

        if (ev.key === 'ArrowUp') {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? mentionSuggestions.length - 1
              : Math.max(activeSuggestionIndex - 1, 0);
          setActiveSuggestionIndex(newActiveIndex);
        } else if (ev.key === 'ArrowDown') {
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? 0
              : Math.min(activeSuggestionIndex + 1, mentionSuggestions.length - 1);
          setActiveSuggestionIndex(newActiveIndex);
        }
        if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
          // If we are looking up a mention, select the focused suggestion
          if (activeSuggestionIndex !== undefined) {
            const selectedMention = mentionSuggestions[activeSuggestionIndex];
            if (selectedMention) {
              onSuggestionSelected(selectedMention);
              return;
            }
          }
          onEnterKeyDown && onEnterKeyDown();
        }
      }
      onKeyDown && onKeyDown(ev);
    },
    [onEnterKeyDown, onKeyDown, supportNewline, mentionSuggestions, activeSuggestionIndex, onSuggestionSelected]
  );

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
  }, DEBOUNCE_TIME_INTERVAL);

  useEffect(() => {
    return () => {
      debouncedQueryUpdate.cancel();
    };
  }, [debouncedQueryUpdate]);

  const handleOnSelect = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      inputTextValue: string,
      tags: TagData[],
      shouldHandleOnMouseDownDuringSelect: boolean,
      selectionStartValue?: number,
      selectionEndValue?: number
    ): void => {
      // update selection if needed
      if (caretIndex !== undefined) {
        setCaretIndex(undefined);
        // sometimes setting selectionRage in effect for updating caretIndex doesn't work as expected and onSelect should handle this case
        if (caretIndex !== event.currentTarget.selectionStart || caretIndex !== event.currentTarget.selectionEnd) {
          event.currentTarget.setSelectionRange(caretIndex, caretIndex);
        }
        return;
      }
      const { updatedStartIndex, updatedEndIndex } = updateSelectionIndicesWithMentionIfNeeded(
        event,
        inputTextValue,
        tags,
        shouldHandleOnMouseDownDuringSelect,
        selectionStartValue,
        selectionEndValue
      );
      setSelectionStartValue(updatedStartIndex);
      setSelectionEndValue(updatedEndIndex);
      // don't set setShouldHandleOnMouseDownDuringSelect(false) here as setSelectionRange could trigger additional calls of onSelect event
      // and they may not be handled correctly (because of setSelectionRange calls or rerender)
    },
    [caretIndex]
  );

  const updateCurrentTriggerStartIndexAndQuery = useCallback(
    async (
      newValue: string,
      triggerText: string,
      currentSelectionEndValue: number,
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      currentTriggerStartIndex: number
    ) => {
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
    },
    [debouncedQueryUpdate, mentionLookupOptions]
  );

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

      await updateCurrentTriggerStartIndexAndQuery(
        newValue,
        triggerText,
        currentSelectionEndValue,
        event,
        currentTriggerStartIndex
      );

      const { updatedNewValue, updatedSelectionIndex } = getUpdatedNewValueForOnChange(
        newValue,
        triggerText,
        currentSelectionEndValue,
        tagsValue,
        htmlTextValue,
        inputTextValue,
        previousSelectionStart,
        previousSelectionEnd,
        currentSelectionStart
      );

      if (updatedSelectionIndex !== undefined) {
        setCaretIndex(updatedSelectionIndex);
        setSelectionEndValue(updatedSelectionIndex);
        setSelectionStartValue(updatedSelectionIndex);
      }
      onChange && onChange(event, updatedNewValue);
    },
    [mentionLookupOptions?.trigger, updateCurrentTriggerStartIndexAndQuery, onChange]
  );

  return (
    <div>
      {mentionSuggestions.length > 0 && (
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
      )}
      <TextField
        {...textFieldProps}
        data-ui-id={dataUiId}
        value={inputTextValue}
        onChange={(e, newValue) => {
          // Remove when switching to react 17+, currently needed because of https://legacy.reactjs.org/docs/legacy-event-pooling.html
          // Prevents React from resetting event's properties
          e.persist();
          setInputTextValue(newValue ?? '');
          handleOnChange(
            e,
            tagsValue,
            textValue,
            inputTextValue,
            currentTriggerStartIndex,
            selectionStartValue === undefined ? undefined : selectionStartValue,
            selectionEndValue === undefined ? undefined : selectionEndValue,
            e.currentTarget.selectionStart === null ? undefined : e.currentTarget.selectionStart,
            e.currentTarget.selectionEnd === null ? undefined : e.currentTarget.selectionEnd,
            newValue
          );
        }}
        onSelect={(e) => {
          handleOnSelect(
            e,
            inputTextValue,
            tagsValue,
            shouldHandleOnMouseDownDuringSelect,
            selectionStartValue,
            selectionEndValue
          );
        }}
        onMouseDown={() => {
          // as events order is onMouseDown -> onSelect -> onClick
          // onClick and onMouseDown can't handle clicking on mention event because
          // onMouseDown doesn't have correct selectionRange yet and
          // onClick already has wrong range as it's called after onSelect that updates the selection range
          // so we need to handle onMouseDown to prevent onSelect default behavior
          setShouldHandleOnMouseDownDuringSelect(true);
        }}
        onTouchStart={() => {
          // see onMouseDown for more details
          setShouldHandleOnMouseDownDuringSelect(true);
        }}
        onBlur={() => {
          // setup all flags to default values when text field loses focus
          setShouldHandleOnMouseDownDuringSelect(false);
          setCaretIndex(undefined);
          setSelectionStartValue(undefined);
          setSelectionEndValue(undefined);
        }}
        onKeyDown={onTextFieldKeyDown}
        elementRef={inputBoxRef}
      />
    </div>
  );
};
