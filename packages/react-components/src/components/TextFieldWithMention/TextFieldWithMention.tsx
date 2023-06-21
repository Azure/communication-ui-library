// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, FormEvent, useCallback, useRef } from 'react';
import { useEffect, useMemo } from 'react';
import { useLocale } from '../../localization';
import { Announcer } from '../Announcer';
import {
  Stack,
  TextField,
  mergeStyles,
  ITextField,
  IconButton,
  TooltipHost,
  ICalloutContentStyles,
  ITextFieldProps
} from '@fluentui/react';

import { isEnterKeyEventFromCompositionSession, nullToUndefined } from '../utils';
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
} from './mentionTagUtils';
import { inputButtonStyle, inputButtonTooltipStyle, iconWrapperStyle } from '../styles/InputBoxComponent.style';

import { Caret } from 'textarea-caret-ts';
import { isDarkThemed } from '../../theming/themeUtils';
import { useTheme } from '../../theming';

import { MentionLookupOptions, _MentionPopover, Mention } from '../MentionPopover';

import { useDebouncedCallback } from 'use-debounce';

const DEFAULT_MENTION_TRIGGER = '@';

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
  const [selectionStartValue, setSelectionStartValue] = useState<number | undefined>();

  // Index of the previous selection end in the text field
  const [selectionEndValue, setSelectionEndValue] = useState<number | undefined>();

  // Boolean value to check if onMouseDown event should be handled during select as selection range
  // for onMouseDown event is not updated yet and the selection range for mouse click/taps will be
  // updated in onSelect event if needed.
  const [shouldHandleOnMouseDownDuringSelect, setShouldHandleOnMouseDownDuringSelect] = useState<boolean>(true);

  // Boolean flag to check if mouse/touch move event should be handled
  const [shouldHandleMoveEvent, setShouldHandleMoveEvent] = useState<boolean>(false);

  // Indexes of start of touch/mouse selection
  const [interactionStartSelection, setInteractionStartSelection] = useState<
    { start: number | undefined; end: number | undefined } | undefined
  >();

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
      const triggerText = mentionLookupOptions?.trigger ?? DEFAULT_MENTION_TRIGGER;
      // update html text with updated plain text
      const updatedContent = updateHTML({
        htmlText: textValue,
        oldPlainText,
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
        if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? mentionSuggestions.length - 1
              : Math.max(activeSuggestionIndex - 1, 0);
          setActiveSuggestionIndex(newActiveIndex);
        } else if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          const newActiveIndex =
            activeSuggestionIndex === undefined
              ? 0
              : Math.min(activeSuggestionIndex + 1, mentionSuggestions.length - 1);
          setActiveSuggestionIndex(newActiveIndex);
        } else if (ev.key === 'Escape') {
          updateMentionSuggestions([]);
        }
      }
      if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline)) {
        ev.preventDefault();

        // If we are looking up a mention, select the focused suggestion
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
      mentionSuggestions,
      activeSuggestionIndex,
      onSuggestionSelected,
      updateMentionSuggestions
    ]
  );

  const debouncedQueryUpdate = useDebouncedCallback(async (query: string) => {
    const suggestions = (await mentionLookupOptions?.onQueryUpdated(query)) ?? [];
    if (suggestions.length === 0) {
      setActiveSuggestionIndex(undefined);
    } else if (activeSuggestionIndex === undefined) {
      // Set the active to the first, if it's not already set
      setActiveSuggestionIndex(0);
    }
    updateMentionSuggestions(suggestions);
  }, 500);

  // Update selections index in mention to navigate by words
  const updateSelectionIndexesWithMentionIfNeeded = useCallback(
    ({
      event,
      inputTextValue,
      selectionEndValue,
      selectionStartValue,
      tagsValue
    }: {
      event: FormEvent<HTMLInputElement | HTMLTextAreaElement>;
      inputTextValue: string;
      selectionEndValue?: number;
      selectionStartValue?: number;
      tagsValue: TagData[];
    }): void => {
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
      setSelectionStartValue(nullToUndefined(updatedStartIndex));
      setSelectionEndValue(nullToUndefined(updatedEndIndex));
    },
    [setSelectionStartValue, setSelectionEndValue]
  );

  const handleOnSelect = useCallback(
    ({
      event,
      inputTextValue,
      tags,
      shouldHandleOnMouseDownDuringSelect,
      selectionStartValue,
      selectionEndValue,
      interactionStartSelection
    }: {
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>;
      inputTextValue: string;
      tags: TagData[];
      shouldHandleOnMouseDownDuringSelect: boolean;
      selectionStartValue?: number;
      selectionEndValue?: number;
      interactionStartSelection?: { start: number | undefined; end: number | undefined };
    }): void => {
      if (shouldHandleOnMouseDownDuringSelect) {
        if (
          interactionStartSelection !== undefined &&
          (interactionStartSelection.start !== event.currentTarget.selectionStart ||
            interactionStartSelection.end !== event.currentTarget.selectionEnd)
        ) {
          // selection was changed by mouse
          // for mouse selection only, it's possible to start selection in the middle of a word in a mention
          // because of this when event.currentTarget.selectionStart === mouseMoveStartPoint.start
          // selectionStartValue for updateSelectionIndexesWithMentionIfNeeded should be set
          // to the end of the input to mimic selection from right to left for the left selection index
          const updatedSelectionStartValue =
            event.currentTarget.selectionStart === interactionStartSelection.start
              ? inputTextValue.length
              : interactionStartSelection.start;
          // selectionStart is always less than selectionEnd so sometimes selectionEnd is user's start of the selection
          // so when event.currentTarget.selectionEnd === mouseMoveStartPoint.end
          // selectionEndValue for updateSelectionIndexesWithMentionIfNeeded should be set
          // to the beginning of the input to mimic selection from left to right for the right selection index
          const updatedSelectionEndValue =
            event.currentTarget.selectionEnd === interactionStartSelection.end ? 0 : interactionStartSelection.end;
          updateSelectionIndexesWithMentionIfNeeded({
            event,
            inputTextValue,
            selectionStartValue: updatedSelectionStartValue,
            selectionEndValue: updatedSelectionEndValue,
            tagsValue: tags
          });
          setInteractionStartSelection(undefined);
          setShouldHandleOnMouseDownDuringSelect(false);
        } else if (event.currentTarget.selectionStart !== null) {
          // on select was triggered by mouse down/up with no movement
          const mentionTag = findMentionTagForSelection(tags, event.currentTarget.selectionStart);
          if (mentionTag !== undefined && mentionTag.plainTextBeginIndex !== undefined) {
            // handle mention click by selecting the whole mention
            // if the selection is not on the bounds of the mention
            const mentionEndIndex = mentionTag.plainTextEndIndex ?? mentionTag.plainTextBeginIndex;
            // disable selection for clicks on mention bounds
            if (
              event.currentTarget.selectionStart !== event.currentTarget.selectionEnd ||
              (event.currentTarget.selectionStart !== mentionTag.plainTextBeginIndex &&
                event.currentTarget.selectionStart !== mentionEndIndex)
            ) {
              if (event.currentTarget.selectionDirection === null) {
                event.currentTarget.setSelectionRange(mentionTag.plainTextBeginIndex, mentionEndIndex);
              } else {
                event.currentTarget.setSelectionRange(
                  mentionTag.plainTextBeginIndex,
                  mentionEndIndex,
                  event.currentTarget.selectionDirection
                );
              }
              setSelectionStartValue(mentionTag.plainTextBeginIndex);
              setSelectionEndValue(mentionEndIndex);
            } else {
              // bounds of the mention were selected
              setSelectionStartValue(event.currentTarget.selectionStart);
              setSelectionEndValue(event.currentTarget.selectionEnd);
            }
          } else {
            // not a mention tag
            setSelectionStartValue(event.currentTarget.selectionStart);
            setSelectionEndValue(nullToUndefined(event.currentTarget.selectionEnd));
          }
          setInteractionStartSelection(undefined);
          setShouldHandleOnMouseDownDuringSelect(false);
        }
      } else {
        // selection was changed by keyboard
        updateSelectionIndexesWithMentionIfNeeded({
          event,
          inputTextValue,
          selectionStartValue,
          selectionEndValue,
          tagsValue: tags
        });
      }
    },
    [updateSelectionIndexesWithMentionIfNeeded, setSelectionStartValue, setSelectionEndValue]
  );

  type HandleOnChangeProps = {
    currentSelectionEnd?: number;
    currentSelectionStart?: number;
    currentTriggerStartIndex: number;
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>;
    htmlTextValue: string;
    inputTextValue: string;
    previousSelectionEnd?: number;
    previousSelectionStart?: number;
    tagsValue: TagData[];
    updatedValue?: string;
  };

  const handleOnChange = useCallback(
    async ({
      currentSelectionEnd,
      currentSelectionStart,
      currentTriggerStartIndex,
      event,
      htmlTextValue,
      inputTextValue,
      previousSelectionEnd,
      previousSelectionStart,
      tagsValue,
      updatedValue
    }: HandleOnChangeProps): Promise<void> => {
      debouncedQueryUpdate.cancel();
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
        // Update the caret position, used for positioning the suggestions popover
        const textField = event.currentTarget;
        const relativePosition = Caret.getRelativePosition(textField);
        const adjustOffset = Math.max(0, textField.scrollHeight - textField.clientHeight);
        relativePosition.top -= adjustOffset;
        setCaretPosition(relativePosition);

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
            updateMentionSuggestions([]);
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

      const { changeStart, oldChangeEnd, newChangeEnd } = findStringsDiffIndexes({
        oldText: inputTextValue,
        newText: newValue,
        previousSelectionStart: previousSelectionStartValue,
        previousSelectionEnd: previousSelectionEndValue,
        currentSelectionStart: currentSelectionStartValue,
        currentSelectionEnd: currentSelectionEndValue
      });

      const change = newValue.substring(changeStart, newChangeEnd);
      const updatedContent = updateHTML({
        htmlText: htmlTextValue,
        oldPlainText: inputTextValue,
        tags: tagsValue,
        startIndex: changeStart,
        oldPlainTextEndIndex: oldChangeEnd,
        change,
        mentionTrigger: triggerText
      });

      // update caret index if needed
      if (updatedContent.updatedSelectionIndex !== undefined) {
        setCaretIndex(updatedContent.updatedSelectionIndex);
        setSelectionEndValue(updatedContent.updatedSelectionIndex);
        setSelectionStartValue(updatedContent.updatedSelectionIndex);
      }

      onChange && onChange(event, updatedContent.updatedHTML);
    },
    [debouncedQueryUpdate, mentionLookupOptions, onChange, updateMentionSuggestions]
  );

  // Adjust the selection range based on a mouse / touch interaction
  const handleOnMove = useCallback(
    ({
      event,
      selectionStartValue,
      selectionEndValue,
      interactionStartSelection,
      shouldHandleMoveEvent
    }: {
      event: React.UIEvent<HTMLInputElement | HTMLTextAreaElement>;
      selectionStartValue: number | undefined;
      selectionEndValue: number | undefined;
      interactionStartSelection: { start: number | undefined; end: number | undefined } | undefined;
      shouldHandleMoveEvent: boolean;
    }) => {
      if (
        shouldHandleMoveEvent &&
        interactionStartSelection === undefined &&
        (event.currentTarget.selectionStart !== selectionStartValue ||
          event.currentTarget.selectionEnd !== selectionEndValue)
      ) {
        setInteractionStartSelection({
          start: nullToUndefined(event.currentTarget.selectionStart),
          end: nullToUndefined(event.currentTarget.selectionEnd)
        });
      }
    },
    []
  );

  // Adjust the selection range based on a mouse / touch interaction
  const handleOnInteractionStarted = useCallback(() => {
    setInteractionStartSelection(undefined);
    setShouldHandleMoveEvent(true);
    setShouldHandleOnMouseDownDuringSelect(true);
  }, []);

  // Adjust the selection range based on a mouse / touch interaction
  const handleOnInteractionCompleted = useCallback(() => {
    setShouldHandleMoveEvent(false);
  }, []);

  const announcerText = useMemo(() => {
    if (activeSuggestionIndex === undefined) {
      return undefined;
    }
    const currentMention = mentionSuggestions[activeSuggestionIndex ?? 0];
    return currentMention?.displayText.length > 0
      ? currentMention?.displayText
      : localeStrings.participantItem.displayNamePlaceholder;
  }, [activeSuggestionIndex, mentionSuggestions, localeStrings.participantItem.displayNamePlaceholder]);

  return (
    <>
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
      {announcerText !== undefined && <Announcer announcementString={announcerText} ariaLive={'polite'} />}
      <TextField
        {...textFieldProps}
        data-ui-id={dataUiId}
        value={inputTextValue}
        onChange={(e, newValue) => {
          // Remove when switching to react 17+, currently needed because of https://legacy.reactjs.org/docs/legacy-event-pooling.html
          // Prevents React from resetting event's properties
          e.persist();
          setInputTextValue(newValue ?? '');
          handleOnChange({
            event: e,
            tagsValue,
            htmlTextValue: textValue,
            inputTextValue,
            currentTriggerStartIndex,
            previousSelectionStart: nullToUndefined(selectionStartValue),
            previousSelectionEnd: nullToUndefined(selectionEndValue),
            currentSelectionStart: nullToUndefined(e.currentTarget.selectionStart),
            currentSelectionEnd: nullToUndefined(e.currentTarget.selectionEnd),
            updatedValue: newValue
          });
        }}
        onSelect={(e) => {
          // update selection if needed
          if (caretIndex !== undefined) {
            // sometimes setting selectionRage in effect for updating caretIndex doesn't work as expected and
            // onSelect still returns outdated value for cursor position
            // e.g. when user select some text and a first name in a mention then delete or type something else
            if (caretIndex !== e.currentTarget.selectionStart || caretIndex !== e.currentTarget.selectionEnd) {
              e.currentTarget.setSelectionRange(caretIndex, caretIndex);
            }
            setCaretIndex(undefined);
            return;
          }
          handleOnSelect({
            event: e,
            inputTextValue,
            shouldHandleOnMouseDownDuringSelect,
            selectionEndValue,
            selectionStartValue,
            tags: tagsValue,
            interactionStartSelection
          });
        }}
        onMouseDown={() => {
          // as events order is onMouseDown -> onMouseMove -> onMouseUp -> onSelect -> onClick
          // onClick and onMouseDown can't handle clicking on mention event because
          // onMouseDown doesn't have correct selectionRange yet and
          // onClick already has wrong range as it's called after onSelect that updates the selection range
          // so we need to handle onMouseDown to prevent onSelect default behavior
          handleOnInteractionStarted();
        }}
        onMouseMove={(event) => {
          handleOnMove({
            event,
            selectionStartValue,
            selectionEndValue,
            interactionStartSelection,
            shouldHandleMoveEvent
          });
        }}
        onMouseUp={() => {
          handleOnInteractionCompleted();
        }}
        onTouchStart={() => {
          handleOnInteractionStarted();
        }}
        onTouchMove={(event) => {
          handleOnMove({
            event,
            selectionStartValue,
            selectionEndValue,
            interactionStartSelection,
            shouldHandleMoveEvent
          });
        }}
        onTouchEnd={() => {
          handleOnInteractionCompleted;
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
    </>
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
